import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Trophy, Target, Zap, Clock, Brain, ArrowRight, X, Code, CheckCircle, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";
import { practiceService } from "@/services/practiceService.ts";
import CodeEditor from "@/components/practice/CodeEditor.jsx";
import { useTheme } from "@/providers/ThemeProvider.jsx";

// --- Sub-Component: Quiz Player (For MCQ/Aptitude) ---
const QuizPlayer = ({ question, onComplete, onBack }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        if (!selectedOption) return;
        setIsSubmitting(true);
        try {
            const response = await practiceService.submitAttempt(question._id, {
                answer: selectedOption,
                timeTaken: 30, // Mock timer
            });
            if (response.success) {
                setResult(response.data);
                if (response.data.isCorrect) {
                    toast.success(`Correct! Earned ${response.data.xpEarned} XP`);
                } else {
                    toast.error("Incorrect answer. See explanation.");
                }
            }
        } catch (error) {
            toast.error("Failed to submit answer");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <Card className="max-w-xl mx-auto mt-10 p-10 text-center shadow-2xl border-primary/20">
                {result.isCorrect ? (
                    <Trophy className="w-20 h-20 mx-auto mb-4 text-success" strokeWidth={1.5} />
                ) : (
                    <X className="w-20 h-20 mx-auto mb-4 text-destructive" strokeWidth={1.5} />
                )}
                <CardTitle className="text-3xl font-extrabold mb-4">
                    {result.isCorrect ? "Correct!" : "Incorrect"}
                </CardTitle>
                <div className="space-y-4 mb-8 text-left">
                    <p className="font-bold text-lg">{question.text}</p>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                        <p className="font-semibold text-primary mb-2">Explanation:</p>
                        <p className="text-muted-foreground">{result.explanation || "No explanation provided."}</p>
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => { onComplete(result); onBack(); }} className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
                        Continue Practice
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto mt-10 p-8 shadow-2xl border-accent/20">
            <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                <h3 className="text-xl font-bold text-accent">{question.title}</h3>
                <Badge variant="outline" className="text-lg px-4 py-1 bg-muted/50">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Limit: 2:00
                </Badge>
            </div>

            <CardTitle className="text-2xl mb-8 leading-relaxed font-normal">
                <div dangerouslySetInnerHTML={{ __html: question.text || question.description }} />
            </CardTitle>

            <div className="space-y-4 mb-8">
                {question.options?.map((option, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        onClick={() => setSelectedOption(option)}
                        className={`w-full h-auto justify-start p-4 text-left font-medium text-base transition-all duration-300 ${
                            selectedOption === option ? "bg-primary text-white border-primary shadow-lg shadow-primary/30" : "bg-muted/50 hover:bg-primary/5 hover:border-primary/30"
                        }`}
                    >
                        <span className="mr-4 font-bold opacity-70">{String.fromCharCode(65 + index)}.</span>
                        {option}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <Button variant="outline" onClick={onBack}>
                    <X className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={!selectedOption || isSubmitting}
                    className="bg-gradient-to-r from-accent to-primary hover:shadow-lg hover:shadow-primary/30"
                >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    );
};

// --- Main Component: PracticeHub ---
export default function PracticeHub() {
    const [activeView, setActiveView] = useState("list");
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState('coding'); // 'coding' or 'mcq'
    
    const { palette } = useTheme();
    const paletteColors = {
        somaiya: { primary: "#800000", accent: "#990000" }
    };
    const currentColors = paletteColors[palette] || paletteColors.somaiya;

    useEffect(() => {
        fetchQuestions();
        fetchStats();
    }, [activeType]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await practiceService.getQuestions({ type: activeType, limit: 50 });
            if (response.success) {
                setQuestions(response.data || []);
            }
        } catch (error) {
            toast.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await practiceService.getAttempts();
            if (response.success && response.data?.stats) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartQuestion = async (qId) => {
        try {
            const response = await practiceService.getQuestionById(qId);
            if (response.success) {
                setActiveQuestion(response.data.question);
                setActiveView(response.data.question.type === 'coding' ? 'code-editor' : 'quiz');
            }
        } catch (error) {
            toast.error("Failed to load question details");
        }
    };

    const handleComplete = (result) => {
        fetchStats();
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: "bg-success/10 text-success border-success/20",
            medium: "bg-warning/10 text-warning border-warning/20",
            hard: "bg-destructive/10 text-destructive border-destructive/20",
        };
        return colors[difficulty] || "";
    };

    if (loading && activeView === "list") {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (activeView === "code-editor" && activeQuestion) {
        return (
            <div className="p-4 h-[calc(100vh-80px)]">
                <CodeEditor 
                    question={activeQuestion} 
                    onBack={() => setActiveView("list")}
                    onComplete={handleComplete}
                />
            </div>
        );
    }

    if (activeView === "quiz" && activeQuestion) {
        return (
            <div className="p-6">
                <QuizPlayer 
                    question={activeQuestion} 
                    onBack={() => setActiveView("list")}
                    onComplete={handleComplete}
                />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header section */}
            <div className="relative overflow-hidden rounded-3xl p-10 text-white shadow-2xl" style={{ background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.accent})` }}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
                
                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl">
                            <Code className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Practice Hub</h1>
                            <p className="text-lg text-white/90 mt-1">
                                Sharpen your skills with real interview questions.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button 
                            variant={activeType === 'coding' ? 'secondary' : 'outline'}
                            onClick={() => setActiveType('coding')}
                            size="lg"
                            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Code className="w-5 h-5 mr-2" />
                            Coding Challenges
                        </Button>
                        <Button 
                            variant={activeType === 'mcq' ? 'secondary' : 'outline'}
                            onClick={() => setActiveType('mcq')}
                            size="lg"
                            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Brain className="w-5 h-5 mr-2" />
                            MCQ Quizzes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: Target, value: stats?.total || 0, label: "Problems Attempted", gradient: "from-primary to-primary/80" },
                    { icon: CheckCircle, value: stats?.correct || 0, label: "Problems Solved", gradient: "from-success to-success/80" },
                    { icon: Zap, value: `${stats?.passRate || 0}%`, label: "Pass Rate", gradient: "from-warning to-warning/80" },
                ].map((stat, index) => (
                <Card 
                    key={index}
                    className="group bg-gradient-glass border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
                >
                    <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                        <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {/* Questions List */}
            <Card className="bg-gradient-glass border-primary/20 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        Available Challenges
                    </CardTitle>
                    <CardDescription>
                        Select a challenge to begin testing your knowledge.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions.map((q, index) => (
                            <div 
                                key={q._id} 
                                className="p-5 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between"
                                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                            >
                                <div className="space-y-4 mb-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-lg leading-tight">{q.title}</h4>
                                        <Badge variant="outline" className={`${getDifficultyColor(q.difficulty)} capitalize`}>
                                            {q.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {q.tags?.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-muted/30 text-xs px-2 py-0.5">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {q.totalAttempts || 0} attempts
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            {q.correctRate || 0}% success rate
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => handleStartQuestion(q._id)}
                                    className="w-full text-white hover:shadow-lg"
                                    style={{ background: currentColors.primary }}
                                >
                                    {activeType === 'coding' ? 'Solve Challenge' : 'Attempt Question'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        ))}
                        {questions.length === 0 && (
                            <div className="col-span-2 text-center py-12 text-muted-foreground">
                                No questions found for the selected category.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}