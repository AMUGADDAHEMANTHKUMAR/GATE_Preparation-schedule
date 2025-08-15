import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  Target,
  BookOpen,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CalendarDays,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatTime, formatDate } from '@/lib/utils';
import { StudyPlan, CustomSchedule } from '@/types';

const StudyPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch, studyStats, startStudySession } = useProgressStore();
  const { studyPreferences } = useSettingsStore();
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [showCustomSchedule, setShowCustomSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<CustomSchedule | null>(null);
  
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
            Please select a GATE branch to view study plans.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

  const predefinedPlans: StudyPlan[] = [
    {
      id: '1',
      name: 'Intensive (3 Months)',
      duration: 90,
      description: 'Fast-paced preparation for experienced candidates',
      dailyHours: 6,
      weeklyDays: 7,
      totalHours: 1260,
      difficulty: 'Hard',
      features: [
        'Comprehensive coverage of all topics',
        'Daily practice tests',
        'Weekend mock exams',
        'Priority on weak areas'
      ]
    },
    {
      id: '2',
      name: 'Standard (6 Months)',
      duration: 180,
      description: 'Balanced preparation for most candidates',
      dailyHours: 4,
      weeklyDays: 6,
      totalHours: 1440,
      difficulty: 'Medium',
      features: [
        'Structured topic progression',
        'Weekly assessments',
        'Regular revision cycles',
        'Flexible study schedule'
      ]
    },
    {
      id: '3',
      name: 'Relaxed (9 Months)',
      duration: 270,
      description: 'Gradual preparation for beginners',
      dailyHours: 3,
      weeklyDays: 5,
      totalHours: 1350,
      difficulty: 'Easy',
      features: [
        'Gentle learning curve',
        'Extra practice time',
        'Comprehensive explanations',
        'Stress-free preparation'
      ]
    },
    {
      id: '4',
      name: 'Crash Course (1 Month)',
      duration: 30,
      description: 'Last-minute preparation for experienced candidates',
      dailyHours: 8,
      weeklyDays: 7,
      totalHours: 480,
      difficulty: 'Very Hard',
      features: [
        'Focus on high-weightage topics',
        'Intensive practice sessions',
        'Quick revision strategies',
        'Exam-focused approach'
      ]
    }
  ];

  const handlePlanSelect = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setShowCustomSchedule(false);
  };

  const handleStartStudy = () => {
    if (selectedPlan) {
      startStudySession({
        id: Date.now().toString(),
        topic: 'Study Plan: ' + selectedPlan.name,
        startTime: new Date(),
        duration: 0,
        progress: 0
      });
      navigate('/progress');
    }
  };

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
            Study Plans
          </h1>
          <p className="text-muted-foreground">
            Choose your {branch.name} preparation timeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCustomSchedule(!showCustomSchedule)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom Schedule
          </Button>
          <Button onClick={() => navigate('/dashboard')} className="gradient">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </motion.div>

      {/* Current Progress Summary */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {studyStats.totalProgress}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {studyStats.completedTopics}
                </div>
                <div className="text-sm text-muted-foreground">Topics Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {formatTime(studyStats.totalTimeStudied)}
                </div>
                <div className="text-sm text-muted-foreground">Time Studied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {studyStats.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>

      {/* Custom Schedule Section */}
      <AnimatePresence>
        {showCustomSchedule && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Custom Study Schedule
                </CardTitle>
                <CardDescription>
                  Create your personalized study timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Duration (days)</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      placeholder="180"
                      min="1"
                      max="365"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Daily Hours</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      placeholder="4"
                      min="1"
                      max="12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Study Days/Week</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded-md bg-background"
                      placeholder="6"
                      min="1"
                      max="7"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full gradient">
                      <Save className="w-4 h-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Predefined Plans */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {predefinedPlans.map((plan) => (
          <motion.div key={plan.id} variants={itemVariants}>
            <GlassCard 
              className={cn(
                "h-full cursor-pointer transition-all duration-300 hover:scale-105",
                selectedPlan?.id === plan.id && "ring-2 ring-primary"
              )}
              onClick={() => handlePlanSelect(plan)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    plan.difficulty === 'Easy' && "bg-green-100 text-green-800",
                    plan.difficulty === 'Medium' && "bg-yellow-100 text-yellow-800",
                    plan.difficulty === 'Hard' && "bg-orange-100 text-orange-800",
                    plan.difficulty === 'Very Hard' && "bg-red-100 text-red-800"
                  )}>
                    {plan.difficulty}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-lg font-bold">{plan.duration}</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/50">
                    <div className="text-lg font-bold">{plan.totalHours}</div>
                    <div className="text-xs text-muted-foreground">Total Hours</div>
                  </div>
                </div>

                {/* Daily Schedule */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Daily Study Time
                    </span>
                    <span className="font-medium">{plan.dailyHours} hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      Study Days/Week
                    </span>
                    <span className="font-medium">{plan.weeklyDays} days</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  className={cn(
                    "w-full",
                    selectedPlan?.id === plan.id ? "gradient" : "variant-outline"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan);
                  }}
                >
                  {selectedPlan?.id === plan.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Select Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Plan Actions */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <GlassCard className="p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">{selectedPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPlan.duration} days • {selectedPlan.totalHours} hours
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPlan(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleStartStudy} className="gradient">
                    <Play className="w-4 h-4 mr-2" />
                    Start Studying
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Study Tips */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Study Tips
            </CardTitle>
            <CardDescription>
              Maximize your preparation effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-2">Consistent Schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Study at the same time daily to build a habit and improve retention.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-2">Active Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Practice problems regularly and review previous topics weekly.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium mb-2">Mock Tests</h4>
                <p className="text-sm text-muted-foreground">
                  Take full-length mock tests monthly to assess your progress.
                </p>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default StudyPlanPage;
