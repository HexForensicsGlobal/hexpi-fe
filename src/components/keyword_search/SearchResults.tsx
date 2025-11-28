import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpDown,
  CheckCircle2,
  Filter,
  History,
  Layers,
  MapPin,
  Sparkles,
  Target,
  UserSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankedSearchResult, SearchEngineResponse } from "@/services/resultFilter";

interface SearchResultsProps {
  status: "idle" | "searching" | "success";
  lastQuery: { query: string; stateFilter: string } | null;
  results: SearchEngineResponse | null;
}

type StatusFilter = "all" | "live" | "archived";
type SortOption = "relevance" | "freshness" | "matchScore" | "alphabetical" | "signal";

const SORTERS: Record<SortOption, (a: RankedSearchResult, b: RankedSearchResult) => number> = {
  relevance: (a, b) => b.relevanceScore - a.relevanceScore,
  freshness: (a, b) => a.freshnessMinutes - b.freshnessMinutes,
  matchScore: (a, b) => b.matchScore - a.matchScore,
  alphabetical: (a, b) => a.name.localeCompare(b.name),
  signal: (a, b) => b.insightFootprint - a.insightFootprint,
};

const formatRelativeMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.max(1, Math.round(minutes))}m ago`;
  }
  if (minutes < 60 * 24) {
    return `${Math.max(1, Math.round(minutes / 60))}h ago`;
  }
  return `${Math.max(1, Math.round(minutes / (60 * 24)))}d ago`;
};

const SearchResults = ({ status, lastQuery, results }: SearchResultsProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, selectedSignals, sortOption, pageSize, results]);

  const availableSignals = useMemo(() => {
    if (!results) {
      return [];
    }
    const signalSet = new Set<string>();
    [...results.primary, ...results.related].forEach((entry) => {
      entry.insights.forEach((insight) => signalSet.add(insight));
    });
    return Array.from(signalSet).sort();
  }, [results]);

  const filteredPrimary = useMemo(() => {
    if (!results) {
      return [];
    }
    return [...results.primary]
      .filter((entry) => {
        if (statusFilter !== "all" && entry.status.toLowerCase() !== statusFilter) {
          return false;
        }
        if (selectedSignals.length && !selectedSignals.every((signal) => entry.insights.includes(signal))) {
          return false;
        }
        return true;
      })
        .sort(SORTERS[sortOption]);
      }, [results, sortOption, selectedSignals, statusFilter]);

  const filteredRelated = useMemo(() => {
    if (!results) {
      return [];
    }
    return [...results.related]
      .filter((entry) => {
        if (statusFilter !== "all" && entry.status.toLowerCase() !== statusFilter) {
          return false;
        }
        if (selectedSignals.length && !selectedSignals.every((signal) => entry.insights.includes(signal))) {
          return false;
        }
        return true;
      })
        .sort(SORTERS[sortOption]);
      }, [results, sortOption, selectedSignals, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPrimary.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pageResults = filteredPrimary.slice(pageStart, pageEnd);

  const toggleSignal = (signal: string) => {
    setSelectedSignals((prev) =>
      prev.includes(signal) ? prev.filter((value) => value !== signal) : [...prev, signal],
    );
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSelectedSignals([]);
    setSortOption("relevance");
    setPageSize(10);
  };

  if (status !== "success" || !lastQuery || !results) {
    return null;
  }

  const summaryHighlights = [
    { label: "Direct matches", value: filteredPrimary.length },
    { label: "Signal-adjacent", value: filteredRelated.length },
    { label: "Live records", value: results.meta.liveCount },
    { label: "Signals tracked", value: availableSignals.length },
  ];

  const activeFilters = (statusFilter !== "all" ? 1 : 0) + selectedSignals.length;
  const othersPreview = filteredRelated.slice(0, 6);

  return (
    <div className="mb-10 mt-12 space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-primary/5 p-6 shadow-xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Identity Resolution Matches</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-foreground/70">
              <UserSearch className="h-4 w-4 text-primary" />
              <span>
                "{lastQuery.query || "Wildcard"}" • {lastQuery.stateFilter}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="border-white/20 bg-black/40 text-foreground/80">
            <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            Sorted by {sortOption}
          </Badge>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryHighlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-foreground/60">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/10">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4 text-primary" /> Filters
            {activeFilters ? (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {activeFilters}
              </Badge>
            ) : null}
          </div>
          <ToggleGroup
            type="single"
            value={statusFilter}
            onValueChange={(value) => value && setStatusFilter(value as StatusFilter)}
            className="rounded-full border border-white/10 bg-black/30 p-1"
          >
            <ToggleGroupItem value="all" className="rounded-full px-4 text-xs">All</ToggleGroupItem>
            <ToggleGroupItem value="live" className="rounded-full px-4 text-xs">Live</ToggleGroupItem>
            <ToggleGroupItem value="archived" className="rounded-full px-4 text-xs">Archived</ToggleGroupItem>
          </ToggleGroup>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[200px] bg-black/40 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="freshness">Freshness</SelectItem>
              <SelectItem value="matchScore">Match score</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="signal">Signal depth</SelectItem>
            </SelectContent>
          </Select>
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[140px] bg-black/40 text-sm">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="30">30 per page</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-foreground/70">
            Reset
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {availableSignals.slice(0, 10).map((signal) => {
            const isSelected = selectedSignals.includes(signal);
            return (
              <Button
                key={signal}
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "rounded-full border-white/15 text-xs",
                  isSelected
                    ? "bg-primary/80 text-primary-foreground hover:bg-primary"
                    : "bg-transparent text-foreground/70 hover:bg-white/5",
                )}
                onClick={() => toggleSignal(signal)}
              >
                {signal}
              </Button>
            );
          })}
          {availableSignals.length > 10 ? (
            <Badge variant="outline" className="border-dashed border-white/30 text-[10px] uppercase tracking-widest">
              +{availableSignals.length - 10} more sources
            </Badge>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        {pageResults.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-10 text-center">
            <p className="text-lg font-semibold">No direct matches with the current filters</p>
            <p className="mt-2 text-sm text-foreground/70">
              Relax the filters or review the signal-adjacent suggestions below.
            </p>
            <Button className="mt-4" variant="secondary" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          pageResults.map((result, index) => (
            <ResultCard key={result.id} result={result} position={pageStart + index + 1} />
          ))
        )}
      </section>

      {filteredPrimary.length > pageSize ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-4 text-sm">
          <p>
            Showing <span className="font-semibold">{pageResults.length}</span> of {filteredPrimary.length} direct
            matches
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <div className="rounded-full border border-white/10 px-4 py-1">
              Page {currentPage} / {totalPages}
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {othersPreview.length ? (
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Signal Adjacent</p>
              <h3 className="mt-1 text-xl font-semibold">Related candidates worth a second look</h3>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {filteredRelated.length} matches
            </Badge>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {othersPreview.map((result) => (
              <div key={result.id} className="rounded-2xl border border-white/20 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{result.name}</p>
                    <p className="text-xs text-foreground/70">{result.location}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-xs">
                    {Math.round(result.coverageRatio * 100)}% token match
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/70">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-primary" /> {result.insightFootprint} datasets
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-primary" /> {result.matchScore}% match
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> {formatRelativeMinutes(result.freshnessMinutes)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.insights.slice(0, 3).map((insight) => (
                    <Badge key={insight} variant="outline" className="border-white/20 text-[10px]">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-foreground/70">
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">
            Signal refresh completed {formatRelativeMinutes(results.meta.lastRefreshMinutes)}
          </span>
        </div>
        <p className="mt-1">
          Coverage spans state court dockets, property indexes, telecom, utilities, professional licensing, and social
          media overlays.
        </p>
      </div>
    </div>
  );
};

interface ResultCardProps {
  result: RankedSearchResult;
  position: number;
}

const ResultCard = ({ result, position }: ResultCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-primary/40">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-foreground/60">
          <Badge variant="outline" className="border-white/15 bg-black/40 text-[10px] uppercase tracking-widest">
            #{position}
          </Badge>
          <span>{result.matchCategory === "direct" ? "Direct" : "Adjacent"} • {result.status}</span>
          <span>•</span>
          <span>{formatRelativeMinutes(result.freshnessMinutes)}</span>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          Relevance {result.relevanceScore}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-[240px]">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{result.name}</h3>
            <Badge variant="outline" className="border-white/20 text-foreground/80">
              {result.matchScore}% match
            </Badge>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm text-foreground/70">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{result.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.insights.map((insight) => (
              <Badge key={insight} variant="outline" className="border-white/15 text-foreground/70">
                <CheckCircle2 className="mr-1 h-3 w-3 text-primary" /> {insight}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Button>Open intelligence brief</Button>
          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{result.insightFootprint} datasets linked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;