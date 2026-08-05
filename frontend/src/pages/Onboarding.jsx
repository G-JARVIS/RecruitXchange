import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, User, BookOpen, Code, FileText, CheckCircle, ChevronRight, ChevronLeft, Upload, Sparkles, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { studentService } from '@/services/studentService.ts';
import { toast } from 'sonner';

// ─── Step Config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
  { id: 2, title: 'Academic Details', icon: BookOpen, description: 'Your educational background' },
  { id: 3, title: 'Skills & Interests', icon: Code, description: 'What you know and love' },
  { id: 4, title: 'Resume Upload', icon: FileText, description: 'Upload your resume for ATS analysis' },
  { id: 5, title: 'Complete!', icon: CheckCircle, description: 'You\'re all set' },
];

const DEPARTMENTS = [
  'Computer Engineering', 'Information Technology', 'Data Science & Algorithms',
  'Electronics & Telecommunication', 'Mechanical Engineering', 'Civil Engineering',
  'Electrical Engineering', 'AI & Machine Learning', 'Other',
];

const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
  'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'Machine Learning', 'Data Structures',
  'Algorithms', 'System Design', 'React Native', 'Flutter', 'Django', 'Spring Boot',
];

// ─── Onboarding Page ─────────────────────────────────────────────────────────
export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [atsResult, setAtsResult] = useState<{ atsScore: number; atsKeywords: string[] } | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const [formData, setFormData] = useState({
    // Step 1
    phone: '',
    rollNumber: '',
    college: 'K.J. Somaiya College of Engineering',
    // Step 2
    department: 'Computer Engineering',
    yearOfStudy: '3rd Year',
    cgpa: '',
    activeBacklogs: '0',
    // Step 3
    skills: [] as string[],
    interests: [] as string[],
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const update = (field: string, value: string | string[]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !formData.skills.includes(s)) {
      update('skills', [...formData.skills, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    update('skills', formData.skills.filter((s) => s !== skill));

  const addInterest = (interest: string) => {
    const i = interest.trim();
    if (i && !formData.interests.includes(i)) {
      update('interests', [...formData.interests, i]);
    }
    setInterestInput('');
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setSaving(true);
    try {
      const result = await studentService.uploadResume(file);
      setAtsResult({
        atsScore: result.data.atsScore,
        atsKeywords: result.data.atsKeywords,
      });
      toast.success(`Resume uploaded! ATS Score: ${result.data.atsScore}/100`);
    } catch {
      toast.error('Upload failed. You can try again later.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStep = async () => {
    if (step === STEPS.length) return;
    setSaving(true);
    try {
      const profileUpdate: Record<string, unknown> = {};
      if (step === 1) {
        profileUpdate.phone = formData.phone;
        profileUpdate.rollNumber = formData.rollNumber;
        profileUpdate.college = formData.college;
      } else if (step === 2) {
        profileUpdate.department = formData.department;
        profileUpdate.yearOfStudy = formData.yearOfStudy;
        profileUpdate.cgpa = parseFloat(formData.cgpa) || 0;
        profileUpdate.activeBacklogs = parseInt(formData.activeBacklogs) || 0;
      } else if (step === 3) {
        profileUpdate.skills = formData.skills;
        profileUpdate.interests = formData.interests;
        profileUpdate.socialLinks = {
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
        };
      }
      if (Object.keys(profileUpdate).length > 0) {
        await studentService.updateProfile(profileUpdate as any);
      }
      setStep((s) => s + 1);
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile({ onboardingComplete: true } as any);
      toast.success('Welcome to RecruitXchange! 🎉');
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/30">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-2">Let's set up your profile to get personalized recommendations</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          {/* Step indicators */}
          <div className="flex justify-between items-center mb-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                      ${isCompleted ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                        : isCurrent ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-muted border-muted-foreground/20 text-muted-foreground'}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {step} of {STEPS.length} — {STEPS[step - 1].description}
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl"
          >
            {/* ─── Step 1: Personal Info ────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Basic details to identify you in the system</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={user?.name || ''} disabled className="bg-muted/50" />
                    <p className="text-xs text-muted-foreground">From your account</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ''} disabled className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input
                      id="rollNumber"
                      placeholder="CE2021001"
                      value={formData.rollNumber}
                      onChange={(e) => update('rollNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="college">College / University</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => update('college', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2: Academic ─────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Academic Details</h2>
                  <p className="text-sm text-muted-foreground">Used to match you with eligible drives</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Department / Branch</Label>
                    <Select value={formData.department} onValueChange={(v) => update('department', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year of Study</Label>
                    <Select value={formData.yearOfStudy} onValueChange={(v) => update('yearOfStudy', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'].map((y) => (
                          <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA (out of 10)</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      placeholder="8.5"
                      value={formData.cgpa}
                      onChange={(e) => update('cgpa', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backlogs">Active Backlogs</Label>
                    <Input
                      id="backlogs"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.activeBacklogs}
                      onChange={(e) => update('activeBacklogs', e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Your CGPA and backlogs determine which company drives you're eligible for.
                  </p>
                </div>
              </div>
            )}

            {/* ─── Step 3: Skills ───────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Skills & Interests</h2>
                  <p className="text-sm text-muted-foreground">This powers your role matching and learning recommendations</p>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <Label>Technical Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill (e.g. React)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                    />
                    <Button type="button" size="sm" onClick={() => addSkill(skillInput)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Popular skills quick-add */}
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SKILLS.filter((s) => !formData.skills.includes(s)).slice(0, 10).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="text-xs px-3 py-1 rounded-full bg-muted border border-border hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="default" className="gap-1 pr-1">
                          {skill}
                          <button onClick={() => removeSkill(skill)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <Label>Online Profiles (optional)</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={(e) => update('linkedin', e.target.value)}
                    />
                    <Input
                      placeholder="GitHub URL"
                      value={formData.github}
                      onChange={(e) => update('github', e.target.value)}
                    />
                    <Input
                      placeholder="Portfolio URL"
                      value={formData.portfolio}
                      onChange={(e) => update('portfolio', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 4: Resume Upload ────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-1">Upload Your Resume</h2>
                  <p className="text-sm text-muted-foreground">PDF only. We'll analyze it for ATS keywords.</p>
                </div>

                {!uploadedFile ? (
                  <label
                    htmlFor="resume-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                  >
                    <Upload className="w-10 h-10 text-primary/50 group-hover:text-primary transition-colors mb-3" />
                    <p className="text-sm font-medium text-foreground">Click to upload resume</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF format, max 10MB</p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <div className="p-5 rounded-2xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    </div>

                    {atsResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ATS Score</span>
                          <span className={`text-2xl font-bold ${atsResult.atsScore >= 70 ? 'text-green-500' : atsResult.atsScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {atsResult.atsScore}/100
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${atsResult.atsScore >= 70 ? 'bg-green-500' : atsResult.atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${atsResult.atsScore}%` }}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Detected keywords:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {atsResult.atsKeywords.map((kw) => (
                              <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setUploadedFile(null); setAtsResult(null); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Skip for now — I'll upload later
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 5: Complete ─────────────────────────────── */}
            {step === 5 && (
              <div className="text-center space-y-6 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl shadow-primary/30"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">You're all set! 🎉</h2>
                  <p className="text-muted-foreground mt-2">
                    Your profile is ready. Explore placement drives, check your readiness score, and start learning!
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Drives Available', value: '12+', color: 'text-primary' },
                    { label: 'Learning Paths', value: '5', color: 'text-accent' },
                    { label: 'Practice Sets', value: '50+', color: 'text-green-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-muted/50">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Navigation Buttons ───────────────────────────── */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
              {step > 1 && step < 5 ? (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={saving}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              ) : <div />}

              {step < 4 ? (
                <Button onClick={handleSaveStep} disabled={saving} className="ml-auto">
                  {saving ? 'Saving...' : 'Continue'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : step === 4 ? (
                <Button onClick={handleSaveStep} disabled={saving} className="ml-auto">
                  {saving ? 'Saving...' : uploadedFile ? 'Continue' : 'Skip & Continue'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={saving} size="lg" className="ml-auto bg-gradient-to-r from-primary to-accent border-0">
                  {saving ? 'Getting ready...' : 'Go to Dashboard'}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
