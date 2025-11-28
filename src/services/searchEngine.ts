/*
Search engine and re-ranking logic
*/

import { candidateRecords, type CandidateRecord } from "@/lib/mock-data";

export interface SearchResult extends CandidateRecord {}

export interface RankedSearchResult extends SearchResult {
  relevanceScore: number;
  coverageRatio: number;
  tokensMatched: number;
  freshnessMinutes: number;
  insightFootprint: number;
  stateAligned: boolean;
  matchCategory: "direct" | "adjacent";
  rank: number;
}

export interface SearchEngineResponse {
  primary: RankedSearchResult[];
  related: RankedSearchResult[];
  meta: {
    totalCandidates: number;
    queryTokens: string[];
    stateFilter: string;
    liveCount: number;
    archivedCount: number;
    lastRefreshMinutes: number;
    signalCoverage: Record<string, number>;
  };
}

const relativeLabelToMinutes = (value: string): number => {
  const sanitized = value.replace(/ago/i, "").trim();
  const match = sanitized.match(/(\d+)\s*(m|h|d)/i);
  if (!match) {
    return 60;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "m":
      return amount;
    case "h":
      return amount * 60;
    case "d":
      return amount * 60 * 24;
    default:
      return 60;
  }
};

type InternalRankedResult = Omit<RankedSearchResult, "matchCategory" | "rank"> & {
  allTokensMatched: boolean;
};

const buildRankedRecord = (
  record: CandidateRecord,
  queryTerms: string[],
  stateFilter: string,
): InternalRankedResult => {
  const normalizedName = record.name.toLowerCase();
  const normalizedLocation = record.location.toLowerCase();
  const tokensMatched = queryTerms.filter(
    (term) => normalizedName.includes(term) || normalizedLocation.includes(term),
  ).length;
  const coverageRatio = queryTerms.length ? tokensMatched / queryTerms.length : 1;
  const allTokensMatched = queryTerms.length ? tokensMatched === queryTerms.length : true;
  const stateAligned =
    stateFilter === "All States" || normalizedLocation.includes(stateFilter.toLowerCase());

  const freshnessMinutes = relativeLabelToMinutes(record.updated);
  const insightFootprint = record.insights.length;

  const signalWeight = insightFootprint * 2.5;
  const statusWeight = record.status === "Live" ? 4 : 0;
  const stateWeight = stateAligned ? 5 : 0;
  const coverageWeight = coverageRatio * 14;
  const freshnessWeight = Math.max(0, 12 - Math.min(freshnessMinutes / 30, 12));

  const relevanceScore = Math.round(
    record.matchScore + signalWeight + statusWeight + stateWeight + coverageWeight + freshnessWeight,
  );

  return {
    ...record,
    relevanceScore,
    coverageRatio,
    tokensMatched,
    freshnessMinutes,
    insightFootprint,
    stateAligned,
    allTokensMatched,
  };
};

// Mock search engine that returns ranked direct matches alongside adjacent ("others") results
export const filterCandidateRecords = (
  query: string,
  stateFilter: string,
): SearchEngineResponse => {
  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const ranked: InternalRankedResult[] = candidateRecords.map((candidate) =>
    buildRankedRecord(candidate, queryTerms, stateFilter),
  );

  const sorted = [...ranked].sort((a, b) => b.relevanceScore - a.relevanceScore);

  let directMatches = sorted.filter((entry) => (queryTerms.length ? entry.allTokensMatched : true));
  let adjacentMatches = sorted.filter((entry) =>
    queryTerms.length ? !entry.allTokensMatched && entry.tokensMatched > 0 : false,
  );

  if (!directMatches.length) {
    directMatches = sorted.slice(0, Math.min(30, sorted.length));
  }

  if (!adjacentMatches.length) {
    const directIds = new Set(directMatches.map((item) => item.id));
    adjacentMatches = sorted.filter((entry) => !directIds.has(entry.id)).slice(0, 25);
  }

  const primary = directMatches.map((entry, index) => {
    const { allTokensMatched, ...rest } = entry;
    return {
      ...rest,
      matchCategory: "direct" as const,
      rank: index + 1,
    };
  });

  const related = adjacentMatches.map((entry, index) => {
    const { allTokensMatched, ...rest } = entry;
    return {
      ...rest,
      matchCategory: "adjacent" as const,
      rank: index + 1,
    };
  });

  const liveCount = ranked.filter((entry) => entry.status === "Live").length;
  const archivedCount = ranked.length - liveCount;
  const lastRefreshMinutes = ranked.reduce(
    (acc, entry) => Math.min(acc, entry.freshnessMinutes),
    Number.POSITIVE_INFINITY,
  );

  const signalCoverage = ranked.reduce<Record<string, number>>((acc, entry) => {
    entry.insights.forEach((insight) => {
      acc[insight] = (acc[insight] ?? 0) + 1;
    });
    return acc;
  }, {});

  return {
    primary,
    related,
    meta: {
      totalCandidates: ranked.length,
      queryTokens: queryTerms,
      stateFilter,
      liveCount,
      archivedCount,
      lastRefreshMinutes: Number.isFinite(lastRefreshMinutes) ? lastRefreshMinutes : 60,
      signalCoverage,
    },
  };
};
