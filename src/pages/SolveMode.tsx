import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  Save,
  Bookmark,
  Flag,
  Eye,
  EyeOff,
  RotateCcw,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';

const SolveMode: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 3 hours in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Mock question data
  const questions = [
    {
      id: 1,
      question: "Consider the following C program:\n\n```c\n#include <stdio.h>\nint main() {\n    int x = 1;\n    printf(\"%d\", x++);\n    return 0;\n}\n```\nWhat will be the output?",
      options: ["A) 0", "B) 1", "C) 2", "D) Compilation error"],
      correctAnswer: "B",
      marks: 1,
      topic: "Programming"
    },
    {
      id: 2,
      question: "Which of the following sorting algorithms has the best average-case time complexity?",
      options: ["A) Bubble Sort", "B) Quick Sort", "C) Selection Sort", "D) Insertion Sort"],
      correctAnswer: "B",
      marks: 1,
      topic: "Algorithms"
    },
    {
      id: 3,
      question: "What is the time complexity of searching an element in a binary search tree?",
      options: ["A) O(1)", "B) O(log n)", "C) O(n)", "D) O(n²)"],
      correctAnswer: "B",
      marks: 1,
      topic: "Data Structures"
    }
  ];

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Handle submission logic
    console.log('Submitting answers:', answers);
    navigate('/pyq');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion - 1];

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/pyq')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </Button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">
              GATE CS 2023 Set 1
            </h1>
            <p className="text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-red-500">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-muted-foreground">Time Remaining</div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <GlassCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Question {currentQ.id}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({currentQ.marks} mark{currentQ.marks > 1 ? 's' : ''})
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bookmark */}}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle flag */}}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Topic: {currentQ.topic}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap bg-secondary/50 p-4 rounded-lg">
                  {currentQ.question}
                </pre>
              </div>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      answers[currentQ.id] === option.split(')')[0]
                        ? 'border-primary bg-primary/10'
                        : 'border-secondary hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option.split(')')[0]}
                      checked={answers[currentQ.id] === option.split(')')[0]}
                      onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === option.split(')')[0]
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === option.split(')')[0] && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showAnswers && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        option.split(')')[0] === currentQ.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}>
                        {option.split(')')[0] === currentQ.correctAnswer ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </label>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {/* Handle save */}}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  {currentQuestion < totalQuestions ? (
                    <Button onClick={handleNextQuestion}>
                      Next
                    </Button>
                  ) : (
                                         <Button onClick={handleSubmit} className="gradient">
                       <CheckCircle className="w-4 h-4 mr-2" />
                       Submit
                     </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Question Navigator */}
        <div className="space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle>Question Navigator</CardTitle>
              <CardDescription>
                {answeredQuestions} of {totalQuestions} answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question) => (
                  <Button
                    key={question.id}
                    variant={currentQuestion === question.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentQuestion(question.id)}
                    className={`h-10 w-10 p-0 ${
                      answers[question.id] ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    {question.id}
                  </Button>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Answered</span>
                <span>{answeredQuestions}/{totalQuestions}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining</span>
                <span>{totalQuestions - answeredQuestions}</span>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary border rounded" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded" />
                <span>Current</span>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SolveMode;
