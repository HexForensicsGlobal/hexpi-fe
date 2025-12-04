import { create } from "zustand";
import type { SearchResponse } from "@/services/types";

export interface SearchQuery {
  query: string;
  stateFilter: string;
}

export interface SearchState {
  // Search status
  status: "idle" | "searching" | "success" | "error";
  errorMessage: string | null;
  
  // Search query and results
  lastQuery: SearchQuery | null;
  results: SearchResponse | null;
  
  // Actions
  setStatus: (status: SearchState["status"]) => void;
  setError: (message: string | null) => void;
  setResults: (results: SearchResponse | null, query: SearchQuery) => void;
  clearResults: () => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as const,
  errorMessage: null,
  lastQuery: null,
  results: null,
};

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setError: (message) => set({ errorMessage: message, status: "error" }),

  setResults: (results, query) =>
    set({
      results,
      lastQuery: query,
      status: "success",
      errorMessage: null,
    }),

  clearResults: () =>
    set({
      results: null,
      lastQuery: null,
      status: "idle",
    }),

  reset: () => set(initialState),
}));
