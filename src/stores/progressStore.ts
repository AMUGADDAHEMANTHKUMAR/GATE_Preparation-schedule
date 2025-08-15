import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, GateBranchCode } from '@/types';

interface ProgressState {
  // Current branch and progress
  currentBranch: GateBranchCode | null;
  userProgress: Record<string, UserProgress>;
  
  // Study session tracking
  currentSession: {
    topicId: string | null;
    startTime: Date | null;
    isActive: boolean;
  };
  
  // Statistics
  totalTimeSpent: number; // minutes
  totalTopicsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date | null;
  
  // Additional statistics for components
  studyStats: {
    totalProgress: number;
    completedTopics: number;
    totalTopics: number;
    totalTimeStudied: number;
    weeklyTimeStudied: number;
    currentStreak: number;
    weeklyGoal: number;
    recentSessions: Array<{
      id: string;
      topic: string;
      date: Date;
      duration: number;
      progress: number;
    }>;
  };
  weeklyProgress: Array<{
    date: string;
    hoursStudied: number;
  }>;
  subjectProgress: Array<{
    name: string;
    progress: number;
  }>;
}

interface ProgressActions {
  // Branch management
  setCurrentBranch: (branch: GateBranchCode) => void;
  
  // Progress tracking
  updateTopicProgress: (topicId: string, progress: Partial<UserProgress>) => void;
  markTopicCompleted: (topicId: string) => void;
  markTopicInProgress: (topicId: string) => void;
  markTopicRevised: (topicId: string) => void;
  resetTopicProgress: (topicId: string) => void;
  
  // Study session management
  startStudySession: (session: {
    id: string;
    topic: string;
    startTime: Date;
    duration: number;
    progress: number;
  }) => void;
  endStudySession: (topicId: string, duration: number) => void;
  pauseStudySession: () => void;
  resumeStudySession: () => void;
  
  // Statistics
  updateStreak: () => void;
  calculateStatistics: () => void;
  
  // Bulk operations
  resetAllProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => void;
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => {
      console.log('Initializing progress store');
      return {
      // Initial state
      currentBranch: null,
      userProgress: {},
      currentSession: {
        topicId: null,
        startTime: null,
        isActive: false,
      },
      totalTimeSpent: 0,
      totalTopicsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      studyStats: {
        totalProgress: 0,
        completedTopics: 0,
        totalTopics: 0,
        totalTimeStudied: 0,
        weeklyTimeStudied: 0,
        currentStreak: 0,
        weeklyGoal: 20,
        recentSessions: [],
      },
      weeklyProgress: [
        { date: 'Mon', hoursStudied: 2 },
        { date: 'Tue', hoursStudied: 3 },
        { date: 'Wed', hoursStudied: 1 },
        { date: 'Thu', hoursStudied: 4 },
        { date: 'Fri', hoursStudied: 2 },
        { date: 'Sat', hoursStudied: 5 },
        { date: 'Sun', hoursStudied: 1 },
      ],
      subjectProgress: [
        { name: 'Engineering Mathematics', progress: 65 },
        { name: 'Digital Logic', progress: 80 },
        { name: 'Computer Organization', progress: 45 },
        { name: 'Programming', progress: 90 },
        { name: 'Data Structures', progress: 70 },
      ],

      // Actions
      setCurrentBranch: (branch) => {
        set({ currentBranch: branch });
      },

      updateTopicProgress: (topicId, progress) => {
        set((state) => {
          const existing = state.userProgress[topicId] || {
            topicId,
            status: 'not-started',
            timeSpent: 0,
            lastStudied: new Date(),
            revisionCount: 0,
            confidence: 1,
            completionPercentage: 0,
          };

          const updated = {
            ...existing,
            ...progress,
            lastStudied: new Date(),
          };

          return {
            userProgress: {
              ...state.userProgress,
              [topicId]: updated,
            },
          };
        });

        // Recalculate statistics
        get().calculateStatistics();
      },

      markTopicCompleted: (topicId) => {
        get().updateTopicProgress(topicId, {
          status: 'completed',
          confidence: 5,
        });
      },

      markTopicInProgress: (topicId) => {
        get().updateTopicProgress(topicId, {
          status: 'in-progress',
        });
      },

      markTopicRevised: (topicId) => {
        set((state) => {
          const existing = state.userProgress[topicId];
          if (!existing) return state;

          return {
            userProgress: {
              ...state.userProgress,
              [topicId]: {
                ...existing,
                status: 'revised',
                revisionCount: existing.revisionCount + 1,
                lastStudied: new Date(),
              },
            },
          };
        });
      },

      resetTopicProgress: (topicId) => {
        set((state) => {
          const { [topicId]: removed, ...rest } = state.userProgress;
          return { userProgress: rest };
        });
        get().calculateStatistics();
      },

             startStudySession: (session) => {
         set((state) => ({
           currentSession: {
             topicId: session.id,
             startTime: session.startTime,
             isActive: true,
           },
           studyStats: {
             ...state.studyStats,
             recentSessions: [
               {
                 id: session.id,
                 topic: session.topic,
                 date: session.startTime,
                 duration: session.duration,
                 progress: session.progress,
               },
               ...state.studyStats.recentSessions.slice(0, 4), // Keep only last 5 sessions
             ],
           },
         }));
       },

      endStudySession: (topicId, duration) => {
        const { currentSession } = get();
        if (!currentSession.isActive || !currentSession.startTime || !currentSession.topicId) {
          return;
        }

        // Update topic progress with time spent
        get().updateTopicProgress(currentSession.topicId, {
          timeSpent: (get().userProgress[currentSession.topicId]?.timeSpent || 0) + duration,
        });

        // Update total time spent
        set((state) => ({
          totalTimeSpent: state.totalTimeSpent + duration,
          studyStats: {
            ...state.studyStats,
            totalTimeStudied: state.studyStats.totalTimeStudied + duration,
            weeklyTimeStudied: state.studyStats.weeklyTimeStudied + duration,
          },
          currentSession: {
            topicId: null,
            startTime: null,
            isActive: false,
          },
        }));

        // Update streak
        get().updateStreak();
      },

      pauseStudySession: () => {
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: false,
          },
        }));
      },

      resumeStudySession: () => {
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: true,
          },
        }));
      },

      updateStreak: () => {
        const today = new Date();
        const lastStudy = get().lastStudyDate;

        if (!lastStudy) {
          set({
            currentStreak: 1,
            lastStudyDate: today,
          });
          return;
        }

        const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day
          set((state) => ({
            currentStreak: state.currentStreak + 1,
            lastStudyDate: today,
            longestStreak: Math.max(state.currentStreak + 1, state.longestStreak),
          }));
        } else if (daysDiff === 0) {
          // Same day, don't update streak
          return;
        } else {
          // Break in streak
          set({
            currentStreak: 1,
            lastStudyDate: today,
          });
        }
      },

      calculateStatistics: () => {
        const { userProgress } = get();
        const progressArray = Object.values(userProgress);

        const totalTimeSpent = progressArray.reduce((sum, p) => sum + p.timeSpent, 0);
        const totalTopicsCompleted = progressArray.filter((p) => p.status === 'completed').length;

        set({
          totalTimeSpent,
          totalTopicsCompleted,
        });
      },

      resetAllProgress: () => {
        set({
          userProgress: {},
          totalTimeSpent: 0,
          totalTopicsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
          currentSession: {
            topicId: null,
            startTime: null,
            isActive: false,
          },
        });
      },

      exportProgress: () => {
        const state = get();
        return JSON.stringify({
          userProgress: state.userProgress,
          totalTimeSpent: state.totalTimeSpent,
          totalTopicsCompleted: state.totalTopicsCompleted,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastStudyDate: state.lastStudyDate,
          exportDate: new Date().toISOString(),
        });
      },

      importProgress: (data) => {
        try {
          const imported = JSON.parse(data);
          set({
            userProgress: imported.userProgress || {},
            totalTimeSpent: imported.totalTimeSpent || 0,
            totalTopicsCompleted: imported.totalTopicsCompleted || 0,
            currentStreak: imported.currentStreak || 0,
            longestStreak: imported.longestStreak || 0,
            lastStudyDate: imported.lastStudyDate ? new Date(imported.lastStudyDate) : null,
          });
        } catch (error) {
          console.error('Failed to import progress data:', error);
        }
      },
    };
    },
    {
      name: 'gate-progress-storage',
      partialize: (state) => ({
        currentBranch: state.currentBranch,
        userProgress: state.userProgress,
        totalTimeSpent: state.totalTimeSpent,
        totalTopicsCompleted: state.totalTopicsCompleted,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastStudyDate: state.lastStudyDate,
      }),
    }
  )
);
