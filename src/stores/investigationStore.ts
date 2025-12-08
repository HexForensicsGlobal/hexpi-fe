import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  Investigation,
  InvestigationDetail,
  InvestigationListParams,
  InvestigationStats,
  InvestigationStatus,
  InvestigationPriority,
  InvestigationNote,
  InvestigationEntity,
  InvestigationTimelineEvent,
  CreateInvestigationPayload,
  UpdateInvestigationPayload,
  CreateInvestigationNotePayload,
  UpdateInvestigationNotePayload,
  LinkEntityPayload,
  CaseGroup,
} from "@/services/types";

// =============================================================================
// STATE INTERFACE
// =============================================================================

export interface InvestigationState {
  // List state
  investigations: Investigation[];
  stats: InvestigationStats;
  listParams: InvestigationListParams;
  listTotal: number;
  listStatus: "idle" | "loading" | "success" | "error";
  listError: string | null;

  // Groups state
  groups: CaseGroup[];
  groupsStatus: "idle" | "loading" | "success" | "error";
  selectedGroupFilter: string | "all";

  // Detail state (active investigation)
  activeInvestigation: InvestigationDetail | null;
  detailStatus: "idle" | "loading" | "success" | "error";
  detailError: string | null;

  // UI state
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isAddEntityDialogOpen: boolean;
  isAddNoteDialogOpen: boolean;
  selectedEntityForLinking: {
    type: "organization" | "affiliate";
    id: number | string;
    snapshot: unknown;
  } | null;

  // Actions - List
  setInvestigations: (investigations: Investigation[], total: number, stats: InvestigationStats) => void;
  setListParams: (params: Partial<InvestigationListParams>) => void;
  resetListParams: () => void;
  setListStatus: (status: InvestigationState["listStatus"]) => void;
  setListError: (error: string | null) => void;

  // Actions - Detail
  setActiveInvestigation: (investigation: InvestigationDetail | null) => void;
  setDetailStatus: (status: InvestigationState["detailStatus"]) => void;
  setDetailError: (error: string | null) => void;
  clearActiveInvestigation: () => void;

  // Actions - Local state updates (optimistic updates)
  addInvestigationToList: (investigation: Investigation) => void;
  updateInvestigationInList: (id: string, updates: Partial<Investigation>) => void;
  removeInvestigationFromList: (id: string) => void;

  // Actions - Active investigation mutations
  addNoteToActive: (note: InvestigationNote) => void;
  updateNoteInActive: (noteId: string, updates: Partial<InvestigationNote>) => void;
  removeNoteFromActive: (noteId: string) => void;
  addEntityToActive: (entity: InvestigationEntity) => void;
  removeEntityFromActive: (entityId: string) => void;
  addTimelineEventToActive: (event: InvestigationTimelineEvent) => void;
  updateActiveInvestigation: (updates: Partial<Investigation>) => void;

  // Actions - UI
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openEditDialog: () => void;
  closeEditDialog: () => void;
  openAddEntityDialog: (entity?: InvestigationState["selectedEntityForLinking"]) => void;
  closeAddEntityDialog: () => void;
  openAddNoteDialog: () => void;
  closeAddNoteDialog: () => void;

  // Actions - Groups
  setGroups: (groups: CaseGroup[]) => void;
  setGroupsStatus: (status: InvestigationState["groupsStatus"]) => void;
  addGroup: (group: CaseGroup) => void;
  updateGroup: (id: string, updates: Partial<CaseGroup>) => void;
  removeGroup: (id: string) => void;
  setSelectedGroupFilter: (groupId: string | "all") => void;
  updateInvestigationGroup: (investigationId: string, groupId: string | null) => void;

  // Actions - Reset
  reset: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const defaultListParams: InvestigationListParams = {
  sortBy: "updatedAt",
  sortOrder: "desc",
  offset: 0,
  limit: 20,
};

const defaultStats: InvestigationStats = {
  total: 0,
  byStatus: { draft: 0, active: 0, "on-hold": 0, closed: 0 },
  byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
  byGroup: { ungrouped: 0 },
};

const initialState = {
  // List
  investigations: [],
  stats: defaultStats,
  listParams: defaultListParams,
  listTotal: 0,
  listStatus: "idle" as const,
  listError: null,

  // Groups
  groups: [] as CaseGroup[],
  groupsStatus: "idle" as const,
  selectedGroupFilter: "all" as string | "all",

  // Detail
  activeInvestigation: null,
  detailStatus: "idle" as const,
  detailError: null,

  // UI
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isAddEntityDialogOpen: false,
  isAddNoteDialogOpen: false,
  selectedEntityForLinking: null,
};

// =============================================================================
// STORE
// =============================================================================

export const useInvestigationStore = create<InvestigationState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // =========================================================================
      // LIST ACTIONS
      // =========================================================================

      setInvestigations: (investigations, total, stats) =>
        set(
          { investigations, listTotal: total, stats, listStatus: "success", listError: null },
          false,
          "setInvestigations"
        ),

      setListParams: (params) =>
        set(
          (state) => ({ listParams: { ...state.listParams, ...params } }),
          false,
          "setListParams"
        ),

      resetListParams: () =>
        set({ listParams: defaultListParams }, false, "resetListParams"),

      setListStatus: (status) =>
        set({ listStatus: status }, false, "setListStatus"),

      setListError: (error) =>
        set({ listError: error, listStatus: "error" }, false, "setListError"),

      // =========================================================================
      // DETAIL ACTIONS
      // =========================================================================

      setActiveInvestigation: (investigation) =>
        set(
          { activeInvestigation: investigation, detailStatus: "success", detailError: null },
          false,
          "setActiveInvestigation"
        ),

      setDetailStatus: (status) =>
        set({ detailStatus: status }, false, "setDetailStatus"),

      setDetailError: (error) =>
        set({ detailError: error, detailStatus: "error" }, false, "setDetailError"),

      clearActiveInvestigation: () =>
        set(
          { activeInvestigation: null, detailStatus: "idle", detailError: null },
          false,
          "clearActiveInvestigation"
        ),

      // =========================================================================
      // LOCAL STATE UPDATES (for optimistic updates)
      // =========================================================================

      addInvestigationToList: (investigation) =>
        set(
          (state) => ({
            investigations: [investigation, ...state.investigations],
            listTotal: state.listTotal + 1,
            stats: {
              ...state.stats,
              total: state.stats.total + 1,
              byStatus: {
                ...state.stats.byStatus,
                [investigation.status]: state.stats.byStatus[investigation.status] + 1,
              },
              byPriority: {
                ...state.stats.byPriority,
                [investigation.priority]: state.stats.byPriority[investigation.priority] + 1,
              },
            },
          }),
          false,
          "addInvestigationToList"
        ),

      updateInvestigationInList: (id, updates) =>
        set(
          (state) => ({
            investigations: state.investigations.map((inv) =>
              inv.id === id ? { ...inv, ...updates } : inv
            ),
          }),
          false,
          "updateInvestigationInList"
        ),

      removeInvestigationFromList: (id) =>
        set(
          (state) => {
            const investigation = state.investigations.find((inv) => inv.id === id);
            if (!investigation) return state;

            return {
              investigations: state.investigations.filter((inv) => inv.id !== id),
              listTotal: state.listTotal - 1,
              stats: {
                ...state.stats,
                total: state.stats.total - 1,
                byStatus: {
                  ...state.stats.byStatus,
                  [investigation.status]: Math.max(0, state.stats.byStatus[investigation.status] - 1),
                },
                byPriority: {
                  ...state.stats.byPriority,
                  [investigation.priority]: Math.max(0, state.stats.byPriority[investigation.priority] - 1),
                },
              },
            };
          },
          false,
          "removeInvestigationFromList"
        ),

      // =========================================================================
      // ACTIVE INVESTIGATION MUTATIONS
      // =========================================================================

      addNoteToActive: (note) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                notes: [note, ...state.activeInvestigation.notes],
              },
            };
          },
          false,
          "addNoteToActive"
        ),

      updateNoteInActive: (noteId, updates) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                notes: state.activeInvestigation.notes.map((note) =>
                  note.id === noteId ? { ...note, ...updates } : note
                ),
              },
            };
          },
          false,
          "updateNoteInActive"
        ),

      removeNoteFromActive: (noteId) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                notes: state.activeInvestigation.notes.filter((note) => note.id !== noteId),
              },
            };
          },
          false,
          "removeNoteFromActive"
        ),

      addEntityToActive: (entity) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                entities: [...state.activeInvestigation.entities, entity],
              },
            };
          },
          false,
          "addEntityToActive"
        ),

      removeEntityFromActive: (entityId) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                entities: state.activeInvestigation.entities.filter((e) => e.id !== entityId),
              },
            };
          },
          false,
          "removeEntityFromActive"
        ),

      addTimelineEventToActive: (event) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                timeline: [event, ...state.activeInvestigation.timeline],
              },
            };
          },
          false,
          "addTimelineEventToActive"
        ),

      updateActiveInvestigation: (updates) =>
        set(
          (state) => {
            if (!state.activeInvestigation) return state;
            return {
              activeInvestigation: {
                ...state.activeInvestigation,
                ...updates,
              },
            };
          },
          false,
          "updateActiveInvestigation"
        ),

      // =========================================================================
      // UI ACTIONS
      // =========================================================================

      openCreateDialog: () =>
        set({ isCreateDialogOpen: true }, false, "openCreateDialog"),

      closeCreateDialog: () =>
        set({ isCreateDialogOpen: false }, false, "closeCreateDialog"),

      openEditDialog: () =>
        set({ isEditDialogOpen: true }, false, "openEditDialog"),

      closeEditDialog: () =>
        set({ isEditDialogOpen: false }, false, "closeEditDialog"),

      openAddEntityDialog: (entity = null) =>
        set(
          { isAddEntityDialogOpen: true, selectedEntityForLinking: entity },
          false,
          "openAddEntityDialog"
        ),

      closeAddEntityDialog: () =>
        set(
          { isAddEntityDialogOpen: false, selectedEntityForLinking: null },
          false,
          "closeAddEntityDialog"
        ),

      openAddNoteDialog: () =>
        set({ isAddNoteDialogOpen: true }, false, "openAddNoteDialog"),

      closeAddNoteDialog: () =>
        set({ isAddNoteDialogOpen: false }, false, "closeAddNoteDialog"),

      // =========================================================================
      // GROUP ACTIONS
      // =========================================================================

      setGroups: (groups) =>
        set({ groups, groupsStatus: "success" }, false, "setGroups"),

      setGroupsStatus: (status) =>
        set({ groupsStatus: status }, false, "setGroupsStatus"),

      addGroup: (group) =>
        set(
          (state) => ({ groups: [...state.groups, group] }),
          false,
          "addGroup"
        ),

      updateGroup: (id, updates) =>
        set(
          (state) => ({
            groups: state.groups.map((g) =>
              g.id === id ? { ...g, ...updates } : g
            ),
          }),
          false,
          "updateGroup"
        ),

      removeGroup: (id) =>
        set(
          (state) => ({
            groups: state.groups.filter((g) => g.id !== id),
            // Also clear filter if the removed group was selected
            selectedGroupFilter:
              state.selectedGroupFilter === id ? "all" : state.selectedGroupFilter,
          }),
          false,
          "removeGroup"
        ),

      setSelectedGroupFilter: (groupId) =>
        set({ selectedGroupFilter: groupId }, false, "setSelectedGroupFilter"),

      updateInvestigationGroup: (investigationId, groupId) =>
        set(
          (state) => ({
            investigations: state.investigations.map((inv) =>
              inv.id === investigationId
                ? { ...inv, groupId, updatedAt: new Date().toISOString() }
                : inv
            ),
            // Also update active investigation if it matches
            activeInvestigation:
              state.activeInvestigation?.id === investigationId
                ? { ...state.activeInvestigation, groupId, updatedAt: new Date().toISOString() }
                : state.activeInvestigation,
          }),
          false,
          "updateInvestigationGroup"
        ),

      // =========================================================================
      // RESET
      // =========================================================================

      reset: () => set(initialState, false, "reset"),
    }),
    { name: "investigation-store" }
  )
);

// =============================================================================
// SELECTORS (for optimized re-renders)
// =============================================================================

export const selectInvestigationsByStatus = (status: InvestigationStatus) => (state: InvestigationState) =>
  state.investigations.filter((inv) => inv.status === status);

export const selectInvestigationsByPriority = (priority: InvestigationPriority) => (state: InvestigationState) =>
  state.investigations.filter((inv) => inv.priority === priority);

export const selectInvestigationsByGroup = (groupId: string | null) => (state: InvestigationState) =>
  state.investigations.filter((inv) => inv.groupId === groupId);

export const selectUngroupedInvestigations = (state: InvestigationState) =>
  state.investigations.filter((inv) => inv.groupId === null);

export const selectActiveNotesByType = (type: InvestigationNote["entryType"]) => (state: InvestigationState) =>
  state.activeInvestigation?.notes.filter((note) => note.entryType === type) ?? [];

export const selectPinnedNotes = (state: InvestigationState) =>
  state.activeInvestigation?.notes.filter((note) => note.isPinned) ?? [];

export const selectEntitiesByRole = (role: InvestigationEntity["role"]) => (state: InvestigationState) =>
  state.activeInvestigation?.entities.filter((entity) => entity.role === role) ?? [];

export const selectEntitiesByType = (type: InvestigationEntity["entityType"]) => (state: InvestigationState) =>
  state.activeInvestigation?.entities.filter((entity) => entity.entityType === type) ?? [];

