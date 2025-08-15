import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText,
  Download,
  Bookmark,
  Play,
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Target,
  Eye,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';

const PyqDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Mock PYQ data
  const pyqData = {
    id: 'pyq-1',
    branch: 'CS',
    year: 2023,
    set: 'Set 1',
    title: 'GATE CS 2023 Set 1',
    difficulty: 'Medium',
    totalMarks: 100,
    duration: 180,
    topics: ['Data Structures', 'Algorithms', 'Computer Networks', 'Operating Systems'],
    downloadUrl: 'https://example.com/pyq-1.pdf',
    answerKeyUrl: 'https://example.com/pyq-1-answers.pdf',
    rating: 4.5,
    solvedCount: 1250,
    isBookmarked: false,
    isSolved: false,
    isFlagged: false,
    lastAccessed: new Date('2024-01-15'),
    description: 'This paper contains questions from various topics in Computer Science and Engineering, designed to test fundamental concepts and problem-solving abilities.',
    instructions: [
      'Total time allowed: 3 hours',
      'Total marks: 100',
      'All questions are compulsory',
      'Use of calculators is not permitted',
      'Write your answers clearly and legibly'
    ]
  };

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
            Back to PYQs
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {pyqData.title}
            </h1>
            <p className="text-muted-foreground">
              Previous Year Question Paper
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(pyqData.downloadUrl, '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => navigate(`/solve/${pyqData.id}`)} className="gradient">
            <Play className="w-4 h-4 mr-2" />
            Start Solving
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paper Overview */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Paper Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {pyqData.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <div className="text-lg font-bold text-primary">{pyqData.year}</div>
                  <div className="text-xs text-muted-foreground">Year</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <div className="text-lg font-bold text-blue-500">{pyqData.totalMarks}</div>
                  <div className="text-xs text-muted-foreground">Marks</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <div className="text-lg font-bold text-green-500">{pyqData.duration}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <div className="text-lg font-bold text-orange-500">{pyqData.rating}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>
            </CardContent>
          </GlassCard>

          {/* Topics Covered */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Topics Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pyqData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          {/* Instructions */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pyqData.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => navigate(`/solve/${pyqData.id}`)}
                className="w-full gradient"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Solving
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(pyqData.downloadUrl, '_blank')}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Paper
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(pyqData.answerKeyUrl, '_blank')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View Answer Key
              </Button>
              <Button
                variant="outline"
                className="w-full"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmark
              </Button>
            </CardContent>
          </GlassCard>

          {/* Statistics */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  pyqData.difficulty === 'Easy' && "bg-green-100 text-green-800",
                  pyqData.difficulty === 'Medium' && "bg-yellow-100 text-yellow-800",
                  pyqData.difficulty === 'Hard' && "bg-red-100 text-red-800"
                )}>
                  {pyqData.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Students Solved</span>
                <span className="font-medium">{pyqData.solvedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{pyqData.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Accessed</span>
                <span className="text-sm">{formatDate(pyqData.lastAccessed)}</span>
              </div>
            </CardContent>
          </GlassCard>

          {/* Related Papers */}
          <GlassCard>
            <CardHeader>
              <CardTitle>Related Papers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="font-medium text-sm">GATE CS 2022 Set 1</div>
                <div className="text-xs text-muted-foreground">2022 • Medium</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="font-medium text-sm">GATE CS 2021 Set 1</div>
                <div className="text-xs text-muted-foreground">2021 • Easy</div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div className="font-medium text-sm">GATE CS 2020 Set 1</div>
                <div className="text-xs text-muted-foreground">2020 • Hard</div>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PyqDetail;
