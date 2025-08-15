import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  FileText,
  Play,
  Settings,
  BarChart3,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getBranchByCode } from '@/data/branches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from '@/components/ui/card';
import { cn, formatTime, formatDate, calculateProgress } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentBranch, studyStats, weeklyProgress, subjectProgress } = useProgressStore();
  const { theme } = useSettingsStore();
  
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
            Please select a GATE branch to start your preparation journey.
          </p>
          <Button onClick={() => navigate('/')} className="gradient">
            Select Branch
          </Button>
        </motion.div>
      </div>
    );
  }

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
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
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Continue your {branch.name} preparation journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => navigate('/study-plan')} className="gradient">
            <Play className="w-4 h-4 mr-2" />
            Start Studying
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Quick Stats Cards */}
        <motion.div variants={itemVariants}>
          <GlassCard className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Progress</p>
                  <p className="text-2xl font-bold">
                    {studyStats.totalProgress}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${studyStats.totalProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold">{studyStats.currentStreak} days</p>
                </div>
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {studyStats.currentStreak > 0 ? 'Keep it up!' : 'Start your streak today!'}
              </p>
            </CardContent>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Studied</p>
                  <p className="text-2xl font-bold">
                    {formatTime(studyStats.totalTimeStudied)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This week: {formatTime(studyStats.weeklyTimeStudied)}
              </p>
            </CardContent>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Topics Completed</p>
                  <p className="text-2xl font-bold">
                    {studyStats.completedTopics}/{studyStats.totalTopics}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {studyStats.totalTopics - studyStats.completedTopics} remaining
              </p>
            </CardContent>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity & Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 space-y-6"
        >
          {/* Recent Activity */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your study sessions and progress updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyStats.recentSessions.length > 0 ? (
                  studyStats.recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.topic}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(session.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatTime(session.duration)}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.progress}% completed
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-sm text-muted-foreground">
                      Start studying to see your activity here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump to your most important tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate('/progress')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>View Progress</span>
                </Button>
                <Button
                  onClick={() => navigate('/resources')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>Study Resources</span>
                </Button>
                <Button
                  onClick={() => navigate('/pyq')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  <span>PYQ Papers</span>
                </Button>
                <Button
                  onClick={() => navigate('/study-plan')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Calendar className="w-6 h-6" />
                  <span>Study Plan</span>
                </Button>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Subject Progress & Upcoming */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Subject Progress */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Subject Progress
              </CardTitle>
              <CardDescription>
                Progress by subject area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectProgress.map((subject, index) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-muted-foreground">
                        {subject.progress}%
                      </span>
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

          {/* Weekly Goal */}
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goal
              </CardTitle>
              <CardDescription>
                {studyStats.weeklyGoal} hours target
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-secondary"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-primary"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 251.2" }}
                      animate={{ 
                        strokeDasharray: `${(studyStats.weeklyTimeStudied / studyStats.weeklyGoal) * 251.2} 251.2` 
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {Math.round((studyStats.weeklyTimeStudied / studyStats.weeklyGoal) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatTime(studyStats.weeklyTimeStudied)} / {formatTime(studyStats.weeklyGoal)}
                </p>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
