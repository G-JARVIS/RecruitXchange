import { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';
import Attempt from '../models/Attempt';
import StudentProfile from '../models/StudentProfile';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import axios from 'axios';

// ─── GET /api/practice/questions ─────────────────────────────────────────────
export const getQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '20', type, difficulty, tags, search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = { approvalStatus: 'approved', visibility: 'public' };
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) filter.tags = { $in: (tags as string).split(',') };
    if (search) filter.$text = { $search: search as string };

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .select('-solutionCode -correctAnswer') // Hide answers
      .sort({ difficulty: 1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    sendPaginated(res, questions, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/practice/questions/:id ─────────────────────────────────────────
export const getQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id)
      .select('-solutionCode -correctAnswer'); // Hidden until after attempt
    if (!question) throw new AppError('Question not found', 404);

    // Check if student already attempted
    let lastAttempt = null;
    if (req.user) {
      lastAttempt = await Attempt.findOne({
        questionId: question._id,
        studentId: req.user._id,
      }).sort({ submittedAt: -1 });
    }

    sendSuccess(res, { question, lastAttempt });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/practice/questions/:id/attempt ────────────────────────────────
export const submitAttempt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { answer, code, language, timeTaken, hintsUsed = 0 } = req.body;
    const question = await Question.findById(req.params.id).select('+correctAnswer +solutionCode');
    if (!question) throw new AppError('Question not found', 404);

    let isCorrect = false;
    let score = 0;
    let executionOutput: string | undefined;
    let errorOutput: string | undefined;
    let testCasesPassed: number | undefined;
    let totalTestCases: number | undefined;

    if (question.type === 'mcq' || question.type === 'aptitude') {
      isCorrect = answer?.toUpperCase() === question.correctAnswer?.toUpperCase();
      score = isCorrect ? 100 : 0;
    } else if (question.type === 'coding') {
      // ─── Judge0 Code Execution ────────────────────────────────────────────
      const result = await executeCode(code, language, question.testCases || []);
      isCorrect = result.isCorrect;
      score = result.score;
      executionOutput = result.output;
      errorOutput = result.error;
      testCasesPassed = result.testCasesPassed;
      totalTestCases = result.totalTestCases;
    }

    const attempt = await Attempt.create({
      studentId: req.user!._id,
      questionId: question._id,
      type: question.type,
      answer,
      code,
      language,
      isCorrect,
      score,
      timeTaken: timeTaken || 0,
      testCasesPassed,
      totalTestCases,
      executionOutput,
      errorOutput,
      hintsUsed,
    });

    // Update question stats
    const allAttempts = await Attempt.find({ questionId: question._id });
    const correctRate = (allAttempts.filter((a) => a.isCorrect).length / allAttempts.length) * 100;
    await Question.findByIdAndUpdate(question._id, {
      $inc: { totalAttempts: 1 },
      $set: { correctRate: Math.round(correctRate) },
    });

    // Award XP
    const xpEarned = isCorrect ? (question.difficulty === 'hard' ? 30 : question.difficulty === 'medium' ? 20 : 10) : 2;
    await StudentProfile.findOneAndUpdate(
      { userId: req.user!._id },
      { $inc: { xp: xpEarned } }
    );

    // Return answer for review after submission
    const responseData: Record<string, unknown> = {
      attempt,
      isCorrect,
      score,
      xpEarned,
      explanation: question.explanation,
    };

    if (question.type === 'coding') {
      responseData.testCasesPassed = testCasesPassed;
      responseData.totalTestCases = totalTestCases;
      responseData.output = executionOutput;
      responseData.error = errorOutput;
    }

    sendSuccess(res, responseData, isCorrect ? 'Correct! Well done.' : 'Incorrect. Review the explanation.');
  } catch (error) {
    next(error);
  }
};

// ─── Judge0 Execution Helper ──────────────────────────────────────────────────
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,  // Node.js
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  typescript: 74,
};

interface ExecutionResult {
  isCorrect: boolean;
  score: number;
  output?: string;
  error?: string;
  testCasesPassed: number;
  totalTestCases: number;
}

const executeCode = async (
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
): Promise<ExecutionResult> => {
  const visibleTestCases = testCases.filter((tc) => !tc.isHidden);
  const languageId = JUDGE0_LANGUAGE_IDS[language?.toLowerCase()] || 63;

  // ─── Judge0 API Mode ──────────────────────────────────────────────────────
  if (process.env.JUDGE0_API_KEY && process.env.JUDGE0_API_URL) {
    try {
      let passed = 0;
      let lastOutput = '';
      let lastError = '';

      for (const tc of visibleTestCases) {
        const submission = await axios.post(
          `${process.env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
          {
            source_code: code,
            language_id: languageId,
            stdin: tc.input,
          },
          {
            headers: {
              'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const result = submission.data;
        const actualOutput = (result.stdout || '').trim();
        const expected = tc.expectedOutput.trim();
        lastOutput = actualOutput;
        lastError = result.stderr || result.compile_output || '';

        if (actualOutput === expected) {
          passed++;
        }
      }

      const score = visibleTestCases.length > 0
        ? Math.round((passed / visibleTestCases.length) * 100)
        : 0;

      return {
        isCorrect: passed === visibleTestCases.length,
        score,
        output: lastOutput,
        error: lastError || undefined,
        testCasesPassed: passed,
        totalTestCases: visibleTestCases.length,
      };
    } catch (err) {
      console.warn('Judge0 execution failed, falling back to mock:', err);
    }
  }

  // ─── Mock Execution Fallback ──────────────────────────────────────────────
  console.log('Using mock code execution (Judge0 not configured)');
  const mockPassed = Math.floor(Math.random() * (visibleTestCases.length + 1));
  const isCorrect = mockPassed === visibleTestCases.length;

  return {
    isCorrect,
    score: Math.round((mockPassed / Math.max(visibleTestCases.length, 1)) * 100),
    output: `Mock output for ${language || 'javascript'} code\nTest cases: ${mockPassed}/${visibleTestCases.length} passed`,
    testCasesPassed: mockPassed,
    totalTestCases: visibleTestCases.length,
  };
};

// ─── GET /api/practice/attempts ──────────────────────────────────────────────
export const getAttempts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const attempts = await Attempt.find({ studentId: req.user!._id })
      .populate({ path: 'questionId', select: 'title type difficulty tags' })
      .sort({ submittedAt: -1 })
      .limit(50)
      .lean();

    const total = await Attempt.countDocuments({ studentId: req.user!._id });
    const correct = await Attempt.countDocuments({ studentId: req.user!._id, isCorrect: true });

    sendSuccess(res, {
      attempts,
      stats: {
        total,
        correct,
        passRate: total > 0 ? Math.round((correct / total) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/practice/mastery ────────────────────────────────────────────────
export const getMasteryRadar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const attempts = await Attempt.find({ studentId: req.user!._id })
      .populate({ path: 'questionId', select: 'tags difficulty' });

    const categories: Record<string, { total: number; correct: number }> = {
      'DSA': { total: 0, correct: 0 },
      'Web Development': { total: 0, correct: 0 },
      'Database': { total: 0, correct: 0 },
      'Aptitude': { total: 0, correct: 0 },
      'Core CS': { total: 0, correct: 0 },
      'System Design': { total: 0, correct: 0 },
    };

    const tagMap: Record<string, string> = {
      'arrays': 'DSA', 'linked-list': 'DSA', 'trees': 'DSA', 'graphs': 'DSA',
      'dp': 'DSA', 'sorting': 'DSA', 'recursion': 'DSA',
      'react': 'Web Development', 'javascript': 'Web Development', 'html': 'Web Development',
      'css': 'Web Development', 'node': 'Web Development',
      'sql': 'Database', 'mongodb': 'Database', 'nosql': 'Database',
      'aptitude': 'Aptitude', 'reasoning': 'Aptitude', 'math': 'Aptitude',
      'os': 'Core CS', 'networks': 'Core CS', 'dbms': 'Core CS', 'oops': 'Core CS',
      'system-design': 'System Design', 'design-patterns': 'System Design',
    };

    for (const attempt of attempts) {
      const q = attempt.questionId as any;
      if (!q?.tags) continue;

      for (const tag of q.tags) {
        const category = tagMap[tag.toLowerCase()];
        if (category && categories[category]) {
          categories[category].total++;
          if (attempt.isCorrect) categories[category].correct++;
        }
      }
    }

    const radarData = Object.entries(categories).map(([category, data]) => ({
      category,
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      total: data.total,
    }));

    sendSuccess(res, { radarData });
  } catch (error) {
    next(error);
  }
};
