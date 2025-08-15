import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Target,
  Calendar,
  BookOpen,
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Zap,
  Timer,
  CalendarDays,
  PieChart,
  Activity
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatTime, formatDate, calculateProgress, getDifficultyColor } from '@/lib/utils';
import { SyllabusItem, UserProgress } from '@/types';

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBranch, 
    userProgress, 
    studyStats, 
    weeklyProgress, 
    subjectProgress,
    updateTopicProgress,
    markTopicCompleted,
    startStudySession,
    endStudySession,
    pauseStudySession,
    resumeStudySession
  } = useProgressStore();
  const { theme } = useSettingsStore();
  
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  
  const branch = currentBranch ? getBranchByCode(currentBranch) : null;

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">No Branch Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a GATE branch to view progress.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  // Mock syllabus data - in real app, this would come from the syllabus store
  const syllabusData: SyllabusItem[] = [
    {
      id: 'cs-1',
      title: 'Engineering Mathematics',
      weightage: 15,
      difficulty: 'medium',
      estimatedHours: 40,
                topics: [
            {
              id: 'cs-1-1',
              title: 'Linear Algebra',
              weightage: 5,
              difficulty: 'medium',
              estimatedHours: 12,
              topics: [
            { id: 'cs-1-1-1', title: 'Matrices', weightage: 2, difficulty: 'easy', estimatedHours: 4 },
            { id: 'cs-1-1-2', title: 'Determinants', weightage: 2, difficulty: 'medium', estimatedHours: 4 },
            { id: 'cs-1-1-3', title: 'Eigenvalues', weightage: 1, difficulty: 'hard', estimatedHours: 4 }
          ]
        },
        {
          id: 'cs-1-2',
          title: 'Calculus',
          weightage: 5,
          difficulty: 'medium',
          estimatedHours: 15,
          topics: [
            { id: 'cs-1-2-1', title: 'Differentiation', weightage: 2, difficulty: 'medium', estimatedHours: 5 },
            { id: 'cs-1-2-2', title: 'Integration', weightage: 2, difficulty: 'medium', estimatedHours: 5 },
            { id: 'cs-1-2-3', title: 'Series', weightage: 1, difficulty: 'hard', estimatedHours: 5 }
          ]
        }
      ]
    },
    {
      id: 'cs-2',
      title: 'Digital Logic',
      weightage: 8,
      difficulty: 'easy',
      estimatedHours: 25,
      topics: [
        {
          id: 'cs-2-1',
          title: 'Boolean Algebra',
          weightage: 3,
          difficulty: 'easy',
          estimatedHours: 8,
          topics: [
            { id: 'cs-2-1-1', title: 'Logic Gates', weightage: 1, difficulty: 'easy', estimatedHours: 3 },
            { id: 'cs-2-1-2', title: 'Karnaugh Maps', weightage: 2, difficulty: 'medium', estimatedHours: 5 }
          ]
        }
      ]
    }
  ];

  const toggleTopicExpansion = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const getTopicProgress = (topicId: string): number => {
    const progress = userProgress[topicId];
    return progress ? progress.completionPercentage || 0 : 0;
  };

  const getTopicStatus = (topicId: string): 'completed' | 'in-progress' | 'not-started' => {
    const progress = getTopicProgress(topicId);
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const handleTopicToggle = (topicId: string) => {
    const currentProgress = getTopicProgress(topicId);
    const newProgress = currentProgress >= 100 ? 0 : 100;
    updateTopicProgress(topicId, { completionPercentage: newProgress });
  };

  const handleStartSession = (topicId: string, topicTitle: string) => {
    setActiveSession(topicId);
    setSessionTimer(0);
    startStudySession({
      id: Date.now().toString(),
      topic: topicTitle,
      startTime: new Date(),
      duration: 0,
      progress: getTopicProgress(topicId)
    });
  };

  const handleEndSession = () => {
    if (activeSession) {
      endStudySession(activeSession, sessionTimer);
      setActiveSession(null);
      setSessionTimer(0);
    }
  };

  const filteredSyllabus = syllabusData.filter(item => {
    if (filterStatus !== 'all') {
      const status = getTopicStatus(item.id);
      if (status !== filterStatus) return false;
    }
    
    if (searchQuery) {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topics?.some(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.topics?.some(subtopic => 
            subtopic.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      if (!matchesSearch) return false;
    }
    
    if (!showCompleted && getTopicStatus(item.id) === 'completed') {
      return false;
    }
    
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderTopic = (topic: any, level: number = 0) => {
    const progress = getTopicProgress(topic.id);
    const status = getTopicStatus(topic.id);
    const isExpanded = expandedTopics.has(topic.id);
    const hasSubtopics = topic.topics && topic.topics.length > 0;
    const isActiveSession = activeSession === topic.id;

    return (
      <motion.div
        key={topic.id}
        variants={itemVariants}
        className={cn(
          "border-l-2 transition-all duration-200",
          level === 0 && "ml-0",
          level === 1 && "ml-4",
          level === 2 && "ml-8",
          status === 'completed' && "border-green-500",
          status === 'in-progress' && "border-yellow-500",
          status === 'not-started' && "border-gray-300"
        )}
      >
        <div className={cn(
          "p-4 rounded-lg transition-all duration-200 hover:bg-secondary/50",
          status === 'completed' && "bg-green-50 dark:bg-green-950/20",
          status === 'in-progress' && "bg-yellow-50 dark:bg-yellow-950/20",
          status === 'not-started' && "bg-gray-50 dark:bg-gray-950/20"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {hasSubtopics && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTopicExpansion(topic.id)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTopicToggle(topic.id)}
                  className="p-1 h-6 w-6"
                >
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                
                <div>
                  <h4 className="font-medium">{topic.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {topic.weightage}%
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      getDifficultyColor(topic.difficulty)
                    )}>
                      {topic.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {topic.estimatedHours}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">{progress}%</div>
                <div className="w-20 h-2 bg-secondary rounded-full">
                  <motion.div
                    className="h-2 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
                             {isActiveSession ? (
                 <div className="flex items-center gap-1">
                   <Timer className="w-4 h-4 text-red-500 animate-pulse" />
                   <span className="text-sm font-mono">{formatTime(sessionTimer)}</span>
                   <Button
                     size="sm"
                     variant="outline"
                     onClick={handleEndSession}
                   >
                     <Square className="w-4 h-4" />
                   </Button>
                 </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStartSession(topic.id, topic.title)}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {hasSubtopics && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {topic.topics.map((subtopic: any) => renderTopic(subtopic, level + 1))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Progress Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your {branch.name} preparation progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={() => navigate('/study-plan')} className="gradient">
            <Play className="w-4 h-4 mr-2" />
            Study Plan
          </Button>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {studyStats.totalProgress}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${studyStats.totalProgress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {studyStats.completedTopics}
                </div>
                <div className="text-sm text-muted-foreground">Topics Completed</div>
                <div className="text-xs text-muted-foreground mt-1">
                  of {studyStats.totalTopics} total
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {formatTime(studyStats.totalTimeStudied)}
                </div>
                <div className="text-sm text-muted-foreground">Time Studied</div>
                <div className="text-xs text-muted-foreground mt-1">
                  This week: {formatTime(studyStats.weeklyTimeStudied)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {studyStats.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {studyStats.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Topics</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
                
                <Button
                  variant="outline"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  {showCompleted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Subject Progress */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Subject Progress
            </CardTitle>
            <CardDescription>
              Progress breakdown by subject area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectProgress.map((subject, index) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{subject.name}</h4>
                    <span className="text-sm font-medium">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <motion.div
                      className={cn(
                        "h-2 rounded-full",
                        subject.progress >= 80 ? "bg-green-500" :
                        subject.progress >= 60 ? "bg-yellow-500" :
                        subject.progress >= 40 ? "bg-orange-500" :
                        "bg-red-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Topics List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredSyllabus.map((item) => renderTopic(item))}
      </motion.div>

      {/* Weekly Progress Chart */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>
              Your study activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.date}
                  </div>
                  <div className="h-20 bg-secondary rounded-lg relative overflow-hidden">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-primary"
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.hoursStudied / 8) * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="text-xs mt-1">
                    {formatTime(day.hoursStudied * 3600)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Progress;
