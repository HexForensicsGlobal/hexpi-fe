import { candidateRecords } from "@/lib/mock-data";

export interface SearchResult {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  insights: string[];
  status: "Live" | "Archived";
  updated: string;
}

// Current Search Engine - Filters candidate records based on query and state
export const filterCandidateRecords = (
  query: string,
  stateFilter: string
): SearchResult[] => {
  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  
  if (queryTerms.length === 0) {
    return candidateRecords;
  }

  const filtered = candidateRecords.filter((record) => {
    const name = record.name.toLowerCase();
    const matchesQuery = queryTerms.every((term) => name.includes(term));
    const matchesState =
      stateFilter === "All States" || record.location.includes(stateFilter);
    return matchesQuery && matchesState;
  });

  return filtered.length > 0 ? filtered : candidateRecords;
};
