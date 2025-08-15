// GATE Branch Codes
export type GateBranchCode =
  | 'AE' | 'AG' | 'AR' | 'BM' | 'BT' | 'CE' | 'CH' | 'CS' | 'CY' | 'DA'
  | 'EC' | 'EE' | 'ES' | 'EY' | 'GE' | 'GG' | 'IN' | 'MA' | 'ME' | 'MN'
  | 'MT' | 'NM' | 'PE' | 'PH' | 'PI' | 'ST' | 'TF' | 'XE' | 'XL' | 'XH';

// Branch Information
export interface Branch {
  code: GateBranchCode;
  name: string;
  fullName: string;
  icon: string;
  description: string;
  totalMarks: number;
  duration: number; // in minutes
}

// Syllabus Structure
export interface SyllabusItem {
  id: string;
  title: string;
  weightage: number; // marks
  children?: SyllabusItem[];
  resources?: Resource[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  topics?: SyllabusItem[];
}

// Study Resources
export interface Resource {
  id: string;
  type: 'book' | 'video' | 'article' | 'practice' | 'formula' | 'notes';
  title: string;
  url?: string;
  author?: string;
  rating?: number;
  description?: string;
  tags?: string[];
  duration?: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  isBookmarked?: boolean;
  isDownloaded?: boolean;
}

// User Progress Tracking
export interface UserProgress {
  topicId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'revised';
  timeSpent: number; // minutes
  lastStudied: Date;
  revisionCount: number;
  confidence: number; // 1-5
  completionPercentage: number; // 0-100
  notes?: string;
  bookmarked?: boolean;
}

// Study Plan Configuration
export interface StudyPlan {
  id: string;
  name: string;
  duration: number; // months
  dailyHours: number;
  startDate: Date;
  endDate: Date;
  branch: GateBranchCode;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'very-hard';
  totalHours?: number;
  weeklyDays?: number;
  features?: string[];
  customSchedule?: CustomSchedule[];
}

export interface CustomSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  hours: number;
  topics?: string[];
}

// PYQ (Previous Year Questions) Types
export interface PyqItem {
  id: string; // `${year}-${branch}-${paperCode}`
  year: number;
  branch: GateBranchCode;
  paperCode: string;
  session?: 'Shift1' | 'Shift2' | 'NA';
  officialPaperUrl: string;
  officialAnswerKeyUrl: string;
  mirrors: { paper?: string; key?: string }[];
  topics: string[];
  marks?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  source: 'official' | 'mirror' | 'community';
  lastCheckedAt: string; // ISO
  checksum?: string;
}

export interface PyqUserState {
  pyqId: string;
  solved: boolean;
  correct: boolean | null;
  attempts: number;
  notes?: string;
  flaggedForRevision?: boolean;
  timeSpentMin?: number;
  lastAttemptAt?: string;
  bookmarked?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// App Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    studyReminders: boolean;
    revisionAlerts: boolean;
    mockTestReminders: boolean;
    breakTimeNotifications: boolean;
    weeklyReports: boolean;
    progressUpdates: boolean;
  };
  studyPreferences: {
    defaultStudyHours: number;
    breakDuration: number; // minutes
    revisionInterval: number; // days
    dailyGoal: number; // hours
    showAnimations: boolean;
  };
  pyqSettings: {
    autoUpdate: boolean;
    allowedSources: string[];
    yearlyRefreshMonth: number; // 1-12
    cacheEnabled: boolean;
  };
}

// Analytics and Statistics
export interface StudyStats {
  totalProgress: number; // 0-100
  completedTopics: number;
  totalTopics: number;
  totalTimeStudied: number; // minutes
  weeklyTimeStudied: number; // minutes
  currentStreak: number;
  weeklyGoal: number; // hours
  recentSessions: Array<{
    id: string;
    topic: string;
    date: Date;
    duration: number;
    progress: number;
  }>;
}

export interface WeeklyProgress {
  date: string; // day name like 'Mon', 'Tue'
  hoursStudied: number;
}

export interface SubjectProgress {
  name: string;
  progress: number; // 0-100
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  branch: GateBranchCode;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and Filter Types
export interface SearchFilters {
  branch?: GateBranchCode;
  year?: number;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  status?: 'not-started' | 'in-progress' | 'completed' | 'revised';
  set?: string;
  q?: string; // search query
}

// Export/Import Types
export interface ExportData {
  version: string;
  timestamp: string;
  userProgress: UserProgress[];
  pyqUserStates: PyqUserState[];
  settings: AppSettings;
  studyPlan?: StudyPlan;
}
