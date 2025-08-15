import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PyqItem, PyqUserState, GateBranchCode, SearchFilters } from '@/types';

interface PyqState {
  // PYQ data
  items: Record<string, PyqItem>;
  userStates: Record<string, PyqUserState>;
  
  // UI state
  filters: SearchFilters;
  selectedItems: string[];
  viewMode: 'grid' | 'list';
  
  // Download/cache state
  downloadQueue: string[];
  downloadProgress: Record<string, number>;
  cachedItems: string[];
  
  // Metadata
  lastRefreshAt?: string;
  lastUpdateCheck: Date | null;
}

interface PyqActions {
  // Data management
  upsertMany: (items: PyqItem[]) => void;
  upsertOne: (item: PyqItem) => void;
  removeItem: (id: string) => void;
  
  // User state management
  updateUserState: (pyqId: string, state: Partial<PyqUserState>) => void;
  markAsSolved: (pyqId: string, correct: boolean) => void;
  toggleBookmark: (pyqId: string) => void;
  toggleFlagForRevision: (pyqId: string) => void;
  
  // Filtering and search
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  
  // Selection
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // View mode
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Download and caching
  addToDownloadQueue: (ids: string[]) => void;
  removeFromDownloadQueue: (id: string) => void;
  updateDownloadProgress: (id: string, progress: number) => void;
  markAsCached: (id: string) => void;
  removeFromCache: (id: string) => void;
  
  // Refresh and updates
  setLastRefreshAt: (date: string) => void;
  setLastUpdateCheck: (date: Date) => void;
  
  // Bulk operations
  bulkUpdateUserStates: (updates: Array<{ pyqId: string; state: Partial<PyqUserState> }>) => void;
  bulkDownload: (ids: string[]) => void;
  bulkDelete: (ids: string[]) => void;
  
  // Export/Import
  exportData: () => string;
  importData: (data: string) => void;
  
  // Statistics
  getStatistics: () => {
    total: number;
    solved: number;
    bookmarked: number;
    flagged: number;
    cached: number;
    accuracy: number;
  };
}

export const usePyqStore = create<PyqState & PyqActions>()(
  persist(
    (set, get) => ({
      // Initial state
      items: {},
      userStates: {},
      filters: { q: '' },
      selectedItems: [],
      viewMode: 'grid',
      downloadQueue: [],
      downloadProgress: {},
      cachedItems: [],
      lastUpdateCheck: null,

      // Actions
      upsertMany: (items) => {
        set((state) => {
          const newItems = { ...state.items };
          for (const item of items) {
            newItems[item.id] = item;
          }
          return { items: newItems };
        });
      },

      upsertOne: (item) => {
        set((state) => ({
          items: {
            ...state.items,
            [item.id]: item,
          },
        }));
      },

      removeItem: (id) => {
        set((state) => {
          const { [id]: removed, ...rest } = state.items;
          return { items: rest };
        });
      },

      updateUserState: (pyqId, state) => {
        set((pyqState) => {
          const existing = pyqState.userStates[pyqId] || {
            pyqId,
            solved: false,
            correct: null,
            attempts: 0,
            bookmarked: false,
            flaggedForRevision: false,
          };

          return {
            userStates: {
              ...pyqState.userStates,
              [pyqId]: {
                ...existing,
                ...state,
              },
            },
          };
        });
      },

      markAsSolved: (pyqId, correct) => {
        set((state) => {
          const existing = state.userStates[pyqId] || {
            pyqId,
            solved: false,
            correct: null,
            attempts: 0,
            bookmarked: false,
            flaggedForRevision: false,
          };

          return {
            userStates: {
              ...state.userStates,
              [pyqId]: {
                ...existing,
                solved: true,
                correct,
                attempts: existing.attempts + 1,
                lastAttemptAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      toggleBookmark: (pyqId) => {
        set((state) => {
          const existing = state.userStates[pyqId];
          if (!existing) {
            return {
              userStates: {
                ...state.userStates,
                [pyqId]: {
                  pyqId,
                  solved: false,
                  correct: null,
                  attempts: 0,
                  bookmarked: true,
                  flaggedForRevision: false,
                },
              },
            };
          }

          return {
            userStates: {
              ...state.userStates,
              [pyqId]: {
                ...existing,
                bookmarked: !existing.bookmarked,
              },
            },
          };
        });
      },

      toggleFlagForRevision: (pyqId) => {
        set((state) => {
          const existing = state.userStates[pyqId];
          if (!existing) {
            return {
              userStates: {
                ...state.userStates,
                [pyqId]: {
                  pyqId,
                  solved: false,
                  correct: null,
                  attempts: 0,
                  bookmarked: false,
                  flaggedForRevision: true,
                },
              },
            };
          }

          return {
            userStates: {
              ...state.userStates,
              [pyqId]: {
                ...existing,
                flaggedForRevision: !existing.flaggedForRevision,
              },
            },
          };
        });
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        }));
      },

      clearFilters: () => {
        set({ filters: { q: '' } });
      },

      toggleSelection: (id) => {
        set((state) => {
          const isSelected = state.selectedItems.includes(id);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter(item => item !== id)
              : [...state.selectedItems, id],
          };
        });
      },

      selectAll: () => {
        set((state) => ({
          selectedItems: Object.keys(state.items),
        }));
      },

      clearSelection: () => {
        set({ selectedItems: [] });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      addToDownloadQueue: (ids) => {
        set((state) => ({
          downloadQueue: [...new Set([...state.downloadQueue, ...ids])],
        }));
      },

      removeFromDownloadQueue: (id) => {
                 set((state) => {
           const newDownloadProgress = { ...state.downloadProgress };
           delete newDownloadProgress[id];
           return {
             downloadQueue: state.downloadQueue.filter(item => item !== id),
             downloadProgress: newDownloadProgress,
           };
         });
      },

      updateDownloadProgress: (id, progress) => {
        set((state) => ({
          downloadProgress: {
            ...state.downloadProgress,
            [id]: progress,
          },
        }));
      },

      markAsCached: (id) => {
        set((state) => ({
          cachedItems: [...new Set([...state.cachedItems, id])],
        }));
      },

      removeFromCache: (id) => {
        set((state) => ({
          cachedItems: state.cachedItems.filter(item => item !== id),
        }));
      },

      setLastRefreshAt: (date) => {
        set({ lastRefreshAt: date });
      },

      setLastUpdateCheck: (date) => {
        set({ lastUpdateCheck: date });
      },

      bulkUpdateUserStates: (updates) => {
        set((state) => {
          const newUserStates = { ...state.userStates };
          for (const { pyqId, state: updateState } of updates) {
            const existing = newUserStates[pyqId] || {
              pyqId,
              solved: false,
              correct: null,
              attempts: 0,
              bookmarked: false,
              flaggedForRevision: false,
            };
            newUserStates[pyqId] = { ...existing, ...updateState };
          }
          return { userStates: newUserStates };
        });
      },

      bulkDownload: (ids) => {
        get().addToDownloadQueue(ids);
      },

      bulkDelete: (ids) => {
        set((state) => {
          const newItems = { ...state.items };
          const newUserStates = { ...state.userStates };
          const newCachedItems = state.cachedItems.filter(id => !ids.includes(id));

          for (const id of ids) {
            delete newItems[id];
            delete newUserStates[id];
          }

          return {
            items: newItems,
            userStates: newUserStates,
            cachedItems: newCachedItems,
            selectedItems: state.selectedItems.filter(id => !ids.includes(id)),
          };
        });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          items: state.items,
          userStates: state.userStates,
          cachedItems: state.cachedItems,
          exportDate: new Date().toISOString(),
        });
      },

      importData: (data) => {
        try {
          const imported = JSON.parse(data);
          set({
            items: imported.items || {},
            userStates: imported.userStates || {},
            cachedItems: imported.cachedItems || [],
          });
        } catch (error) {
          console.error('Failed to import PYQ data:', error);
        }
      },

      getStatistics: () => {
        const state = get();
        const userStates = Object.values(state.userStates);
        
        const total = Object.keys(state.items).length;
        const solved = userStates.filter(s => s.solved).length;
        const bookmarked = userStates.filter(s => s.bookmarked).length;
        const flagged = userStates.filter(s => s.flaggedForRevision).length;
        const cached = state.cachedItems.length;
        
        const correctAnswers = userStates.filter(s => s.solved && s.correct).length;
        const accuracy = solved > 0 ? (correctAnswers / solved) * 100 : 0;

        return {
          total,
          solved,
          bookmarked,
          flagged,
          cached,
          accuracy: Math.round(accuracy * 100) / 100,
        };
      },
    }),
    {
      name: 'gate-pyq-storage',
      partialize: (state) => ({
        items: state.items,
        userStates: state.userStates,
        filters: state.filters,
        viewMode: state.viewMode,
        cachedItems: state.cachedItems,
        lastRefreshAt: state.lastRefreshAt,
        lastUpdateCheck: state.lastUpdateCheck,
      }),
    }
  )
);
