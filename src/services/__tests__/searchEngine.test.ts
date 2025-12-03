import { beforeAll, describe, expect, it, vi } from "vitest";
import type { CandidateRecord } from "@/lib/mock-data";

const mockRecords: CandidateRecord[] = [
  {
    id: "1",
    name: "John Smith",
    location: "Austin, TX USA",
    matchScore: 88,
    insights: ["Court docket", "Property filings"],
    status: "Live",
    updated: "15m ago",
  },
  {
    id: "2",
    name: "Johnathan Smith",
    location: "Dallas, TX USA",
    matchScore: 82,
    insights: ["Utilities account", "Alias detected"],
    status: "Live",
    updated: "1h ago",
  },
  {
    id: "3",
    name: "Joanna Smith",
    location: "Nairobi, Kenya",
    matchScore: 77,
    insights: ["Business registration"],
    status: "Archived",
    updated: "2h ago",
  },
  {
    id: "4",
    name: "Michael Johnson",
    location: "Houston, TX USA",
    matchScore: 70,
    insights: ["Social media", "Professional license"],
    status: "Live",
    updated: "5m ago",
  },
  {
    id: "5",
    name: "Emily Davis",
    location: "Chicago, IL USA",
    matchScore: 90,
    insights: ["Voter record", "Court docket"],
    status: "Live",
    updated: "3h ago",
  },
  {
    id: "6",
    name: "Robert Miles",
    location: "Phoenix, AZ USA",
    matchScore: 65,
    insights: ["Utilities account"],
    status: "Archived",
    updated: "1d ago",
  },
];

vi.mock("@/lib/mock-data", () => ({
  candidateRecords: mockRecords,
}));

let filterCandidateRecords: typeof import("../search/mockSearchEngine").filterCandidateRecords;

beforeAll(async () => {
  ({ filterCandidateRecords } = await import("../search/mockSearchEngine"));
});

describe("filterCandidateRecords", () => {
  it("prioritizes direct matches when all tokens are satisfied", () => {
    const response = filterCandidateRecords("John Smith", "All States");

    expect(response.primary).toHaveLength(2);
    expect(response.primary.map((entry) => entry.name)).toEqual(
      expect.arrayContaining(["John Smith", "Johnathan Smith"]),
    );
    expect(response.related.length).toBeGreaterThan(0);
    expect(response.related.every((entry) => entry.coverageRatio < 1)).toBe(true);
  });

  it("falls back to top-ranked candidates when there is no token match", () => {
    const response = filterCandidateRecords("nonexistent person", "All States");

    expect(response.primary).toHaveLength(mockRecords.length);
    expect(response.related).toHaveLength(0);

    const relevanceScores = response.primary.map((entry) => entry.relevanceScore);
    const sortedScores = [...relevanceScores].sort((a, b) => b - a);
    expect(relevanceScores).toEqual(sortedScores);
  });

  it("summarizes signal health and honors the state filter", () => {
    const response = filterCandidateRecords("", "TX");

    const alignedCount = response.primary.filter((entry) => entry.stateAligned).length;
    expect(alignedCount).toBe(3);

    expect(response.meta.totalCandidates).toBe(mockRecords.length);
    expect(response.meta.liveCount).toBe(4);
    expect(response.meta.archivedCount).toBe(2);
    expect(response.meta.lastRefreshMinutes).toBe(5);
    expect(response.meta.signalCoverage["Court docket"]).toBe(2);
  });
});
