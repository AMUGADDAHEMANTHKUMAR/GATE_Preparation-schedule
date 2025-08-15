import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '@/types';

interface SettingsState extends AppSettings {
  // Additional UI state
  sidebarCollapsed: boolean;
  showWelcomeModal: boolean;
  lastUpdateCheck: Date | null;
}

interface SettingsActions {
  // Theme management
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Notification settings
  toggleNotifications: () => void;
  updateNotificationSettings: (settings: Partial<AppSettings['notifications']>) => void;
  
  // Study preferences
  updateStudyPreferences: (preferences: Partial<AppSettings['studyPreferences']>) => void;
  
  // PYQ settings
  updatePyqSettings: (settings: Partial<AppSettings['pyqSettings']>) => void;
  addAllowedSource: (source: string) => void;
  removeAllowedSource: (source: string) => void;
  
  // UI state
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setShowWelcomeModal: (show: boolean) => void;
  
  // Update management
  setLastUpdateCheck: (date: Date) => void;
  
  // Reset settings
  resetToDefaults: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  notifications: {
    enabled: true,
    studyReminders: true,
    revisionAlerts: true,
    mockTestReminders: true,
    breakTimeNotifications: true,
    weeklyReports: true,
    progressUpdates: true,
  },
  studyPreferences: {
    defaultStudyHours: 6,
    breakDuration: 15, // minutes
    revisionInterval: 7, // days
    dailyGoal: 4, // hours
    showAnimations: true,
  },
  pyqSettings: {
    autoUpdate: true,
    allowedSources: [
      'https://gate.iitk.ac.in',
      'https://gate.iitm.ac.in',
      'https://gate.iitb.ac.in',
    ],
    yearlyRefreshMonth: 3, // March
    cacheEnabled: true,
  },
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => {
      console.log('Initializing settings store with defaults:', defaultSettings);
      return {
      // Initial state with defaults
      ...defaultSettings,
      sidebarCollapsed: false,
      showWelcomeModal: true,
      lastUpdateCheck: null,

      // Actions
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.toggle('dark', systemTheme === 'dark');
        } else {
          root.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleNotifications: () => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            enabled: !state.notifications.enabled,
          },
        }));
      },

      updateNotificationSettings: (settings) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...settings,
          },
        }));
      },

      updateStudyPreferences: (preferences) => {
        set((state) => ({
          studyPreferences: {
            ...state.studyPreferences,
            ...preferences,
          },
        }));
      },

      updatePyqSettings: (settings) => {
        set((state) => ({
          pyqSettings: {
            ...state.pyqSettings,
            ...settings,
          },
        }));
      },

      addAllowedSource: (source) => {
        set((state) => ({
          pyqSettings: {
            ...state.pyqSettings,
            allowedSources: [...state.pyqSettings.allowedSources, source],
          },
        }));
      },

      removeAllowedSource: (source) => {
        set((state) => ({
          pyqSettings: {
            ...state.pyqSettings,
            allowedSources: state.pyqSettings.allowedSources.filter(s => s !== source),
          },
        }));
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setShowWelcomeModal: (show) => {
        set({ showWelcomeModal: show });
      },

      setLastUpdateCheck: (date) => {
        set({ lastUpdateCheck: date });
      },

              resetToDefaults: () => {
          set({
            ...defaultSettings,
            sidebarCollapsed: false,
            showWelcomeModal: false,
            lastUpdateCheck: null,
          });
        },
      };
    },
    {
      name: 'gate-settings-storage',
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
        studyPreferences: state.studyPreferences,
        pyqSettings: state.pyqSettings,
        sidebarCollapsed: state.sidebarCollapsed,
        showWelcomeModal: state.showWelcomeModal,
        lastUpdateCheck: state.lastUpdateCheck,
      }),
    }
  )
);
