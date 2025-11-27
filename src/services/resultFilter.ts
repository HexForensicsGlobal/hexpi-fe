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

// Current Search Engine - Filters candidate records based on name and state
export const filterCandidateRecords = (
  firstName: string,
  lastName: string,
  stateFilter: string
): SearchResult[] => {
  const filtered = candidateRecords.filter((record) => {
    const name = record.name.toLowerCase();
    const matchesFirst = name.includes(firstName.toLowerCase());
    const matchesLast = name.includes(lastName.toLowerCase());
    const matchesState =
      stateFilter === "All States" || record.location.includes(stateFilter);
    return matchesFirst && matchesLast && matchesState;
  });

  return filtered.length > 0 ? filtered : candidateRecords;
};
