import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Play, CheckCircle, XCircle, Terminal } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider.jsx";
import { toast } from "sonner";
import { practiceService } from "@/services/practiceService.ts";

export default function CodeEditor({ question, onBack, onComplete }) {
  const [code, setCode] = useState(
    question.starterCode || "// Write your solution here...\n"
  );
  const [language, setLanguage] = useState(question.language || "javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const { palette } = useTheme();

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await practiceService.submitAttempt(question._id, {
        code,
        language,
        timeTaken: 120, // Mock time taken
      });
      if (response.success) {
        setResult(response.data);
        if (response.data.isCorrect) {
          toast.success(`Correct! Earned ${response.data.xpEarned} XP`);
          if (onComplete) onComplete(response.data);
        } else {
          toast.error("Incorrect or compilation error. Check the output.");
        }
      }
    } catch (error) {
      toast.error("Failed to submit code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[80vh]">
      {/* Problem Description */}
      <Card className="bg-gradient-glass border-primary/20 flex flex-col h-full">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">{question.title}</CardTitle>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className={
                  question.difficulty === 'easy' ? "bg-success/10 text-success border-success/20" :
                  question.difficulty === 'medium' ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-destructive/10 text-destructive border-destructive/20"
                }>{question.difficulty}</Badge>
                {question.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-muted/30">{tag}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onBack}>Back</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 overflow-y-auto flex-1 prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: question.description || question.text }} />
          
          {question.type === 'coding' && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Examples</h3>
              {question.testCases?.filter(tc => !tc.isHidden).map((tc, idx) => (
                <div key={idx} className="mb-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <p className="mb-2"><span className="font-semibold text-primary">Input:</span> <code className="bg-black/30 px-2 py-1 rounded">{tc.input}</code></p>
                  <p><span className="font-semibold text-success">Output:</span> <code className="bg-black/30 px-2 py-1 rounded">{tc.expectedOutput}</code></p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor & Console */}
      <div className="flex flex-col gap-4 h-full">
        <Card className="bg-gradient-glass border-primary/20 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b border-border/50 bg-muted/20">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              size="sm"
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSubmitting ? "Running..." : "Run Code"}
            </Button>
          </div>
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.5,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>
        </Card>

        {/* Output Console */}
        <Card className="bg-[#1e1e1e] border-primary/20 h-48 flex flex-col overflow-hidden text-sm font-mono text-gray-300">
          <div className="flex items-center gap-2 p-2 bg-black/40 border-b border-border/20 text-xs text-muted-foreground uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            Execution Output
          </div>
          <div className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap">
            {!result ? (
              <span className="text-gray-500">Run your code to see the output...</span>
            ) : (
              <div className="space-y-2">
                {result.isCorrect ? (
                  <div className="flex items-center gap-2 text-success font-bold mb-2">
                    <CheckCircle className="w-5 h-5" />
                    All test cases passed! ({result.testCasesPassed}/{result.totalTestCases})
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive font-bold mb-2">
                    <XCircle className="w-5 h-5" />
                    Failed {result.testCasesPassed !== undefined ? `(${result.testCasesPassed}/${result.totalTestCases} passed)` : ''}
                  </div>
                )}
                {result.output && (
                  <div>
                    <span className="text-gray-500 block mb-1">STDOUT:</span>
                    <div className="text-gray-300 bg-black/20 p-2 rounded">{result.output}</div>
                  </div>
                )}
                {result.error && (
                  <div className="text-destructive mt-2 bg-destructive/10 p-2 rounded">
                    {result.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
