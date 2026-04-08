import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Entity, 
  Scholar, 
  Institution, 
  CorrectionTask, 
  ApprovalRequest, 
  OperationLog,
  ActivityItem,
  SearchFilters,
  ViewMode,
  Toast,
  User
} from '@/types';
import { 
  mockScholars, 
  mockInstitutions, 
  mockCorrectionTasks, 
  mockApprovalRequests,
  mockOperationLogs,
  mockActivities,
  mockDashboardKPI,
  mockTags
} from '@/data/mock';

interface AppState {
  // User
  currentUser: User;
  setCurrentUser: (user: User) => void;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Entities
  scholars: Scholar[];
  institutions: Institution[];
  allEntities: Entity[];
  getEntityById: (id: string) => Entity | undefined;
  
  // Search & Filters
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Corrections
  correctionTasks: CorrectionTask[];
  updateCorrectionTask: (task: CorrectionTask) => void;
  moveTaskToColumn: (taskId: string, column: 'pending' | 'in_progress' | 'submitted') => void;
  
  // Approvals
  approvalRequests: ApprovalRequest[];
  approveRequest: (requestId: string, comment?: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  requestMoreInfo: (requestId: string, questions: string) => void;
  
  // Logs
  operationLogs: OperationLog[];
  
  // Dashboard
  dashboardKPI: typeof mockDashboardKPI;
  activities: ActivityItem[];
  
  // Tags
  tags: typeof mockTags;
  
  // UI State
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Drawers/Modals
  selectedEntity: Entity | null;
  setSelectedEntity: (entity: Entity | null) => void;
  isEntityDrawerOpen: boolean;
  setEntityDrawerOpen: (open: boolean) => void;
  
  // Forms
  draftEntity: Partial<Scholar | Institution> | null;
  setDraftEntity: (draft: Partial<Scholar | Institution> | null) => void;
  saveDraft: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      currentUser: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@garc.org',
        avatar: 'JD',
        role: 'admin',
        language: 'en',
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Navigation
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Entities
      scholars: mockScholars,
      institutions: mockInstitutions,
      allEntities: [...mockScholars, ...mockInstitutions],
      getEntityById: (id) => {
        const state = get();
        return state.allEntities.find(e => e.id === id);
      },
      
      // Search & Filters
      searchFilters: {
        query: '',
        entityType: 'all',
        tags: [],
        countries: [],
        researchAreas: [],
      },
      setSearchFilters: (filters) => set((state) => ({
        searchFilters: { ...state.searchFilters, ...filters }
      })),
      clearSearchFilters: () => set({
        searchFilters: {
          query: '',
          entityType: 'all',
          tags: [],
          countries: [],
          researchAreas: [],
        }
      }),
      viewMode: 'table',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Corrections
      correctionTasks: mockCorrectionTasks,
      updateCorrectionTask: (task) => set((state) => ({
        correctionTasks: state.correctionTasks.map(t => 
          t.id === task.id ? task : t
        )
      })),
      moveTaskToColumn: (taskId, column) => set((state) => ({
        correctionTasks: state.correctionTasks.map(t => 
          t.id === taskId ? { ...t, status: column } : t
        )
      })),
      
      // Approvals
      approvalRequests: mockApprovalRequests,
      approveRequest: (requestId, _comment) => set((state) => ({
        approvalRequests: state.approvalRequests.map(r => 
          r.id === requestId ? { ...r, status: 'approved' } : r
        )
      })),
      rejectRequest: (requestId, _reason) => set((state) => ({
        approvalRequests: state.approvalRequests.map(r => 
          r.id === requestId ? { ...r, status: 'rejected' } : r
        )
      })),
      requestMoreInfo: (requestId, _questions) => set((state) => ({
        approvalRequests: state.approvalRequests.map(r => 
          r.id === requestId ? { ...r, status: 'needs_info' } : r
        )
      })),
      
      // Logs
      operationLogs: mockOperationLogs,
      
      // Dashboard
      dashboardKPI: mockDashboardKPI,
      activities: mockActivities,
      
      // Tags
      tags: mockTags,
      
      // UI State
      toasts: [],
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substr(2, 9) }]
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),
      
      // Drawers/Modals
      selectedEntity: null,
      setSelectedEntity: (entity) => set({ selectedEntity: entity }),
      isEntityDrawerOpen: false,
      setEntityDrawerOpen: (open) => set({ isEntityDrawerOpen: open }),
      
      // Forms
      draftEntity: null,
      setDraftEntity: (draft) => set({ draftEntity: draft }),
      saveDraft: () => {
        const state = get();
        if (state.draftEntity) {
          state.addToast({
            type: 'success',
            title: 'Draft Saved',
            message: `Draft saved at ${new Date().toLocaleTimeString()}`,
          });
        }
      },
    }),
    {
      name: 'garc-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        sidebarCollapsed: state.sidebarCollapsed,
        searchFilters: state.searchFilters,
        viewMode: state.viewMode,
        draftEntity: state.draftEntity,
      }),
    }
  )
);

// Computed selectors
export const selectFilteredEntities = (state: AppState): Entity[] => {
  const { query, entityType, tags, countries, researchAreas } = state.searchFilters;
  
  let entities = state.allEntities;
  
  // Filter by entity type
  if (entityType !== 'all') {
    entities = entities.filter(e => e.type === entityType);
  }
  
  // Filter by query
  if (query) {
    const lowerQuery = query.toLowerCase();
    entities = entities.filter(e => 
      e.name.toLowerCase().includes(lowerQuery) ||
      e.id.toLowerCase().includes(lowerQuery) ||
      e.tags.some(t => t.name.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Filter by tags
  if (tags.length > 0) {
    entities = entities.filter(e => 
      tags.some(tag => e.tags.some(t => t.id === tag))
    );
  }
  
  // Filter by countries (institutions only)
  if (countries.length > 0) {
    entities = entities.filter(e => 
      e.type === 'institution' && countries.includes((e as Institution).country)
    );
  }
  
  // Filter by research areas (scholars only)
  if (researchAreas.length > 0) {
    entities = entities.filter(e => 
      e.type === 'scholar' && 
      researchAreas.some(area => (e as Scholar).researchAreas.includes(area))
    );
  }
  
  return entities;
};

export const selectPendingCorrections = (state: AppState) => 
  state.correctionTasks.filter(t => t.status === 'pending');

export const selectInProgressCorrections = (state: AppState) => 
  state.correctionTasks.filter(t => t.status === 'in_progress');

export const selectSubmittedCorrections = (state: AppState) => 
  state.correctionTasks.filter(t => t.status === 'submitted');

export const selectPendingApprovals = (state: AppState) => 
  state.approvalRequests.filter(r => r.status === 'pending');

export const selectMySubmissions = (state: AppState) => 
  state.approvalRequests.filter(r => r.requester === state.currentUser.name);
