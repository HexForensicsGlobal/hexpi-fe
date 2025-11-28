import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SearchResults from "./SearchResults";
import SearchForm from "./SearchForm";
import PageHighlights from "./PageHighlights";
import { filterCandidateRecords, type SearchEngineResponse } from "@/services/searchEngine";

interface PrefillState {
  prefill?: {
    query?: string;
    stateFilter?: string;
  };
}

const KeywordSearchHome = () => {
  const { state } = useLocation();
  const prefill = (state as PrefillState | null)?.prefill;

  const [status, setStatus] = useState<"idle" | "searching" | "success">("idle");
  const [results, setResults] = useState<SearchEngineResponse | null>(null);
  const [lastQuery, setLastQuery] = useState<{ query: string; stateFilter: string } | null>(null);
  const timeoutId = useRef<number>();
  const [prefillApplied, setPrefillApplied] = useState(false);

  const initialData = prefill ? {
    searchType: "multi" as const,
    query: prefill.query ?? "",
    stateFilter: prefill.stateFilter ?? "All States",
  } : undefined;

  const runSearch = useCallback(
    (data: { searchType: string; query: string; stateFilter: string; selectedEntities?: string[] }) => {
      const trimmed = {
        query: data.query.trim(),
        stateFilter: data.stateFilter,
      };

      setStatus("searching");

      timeoutId.current = window.setTimeout(() => {
        const filtered = filterCandidateRecords(
          trimmed.query,
          trimmed.stateFilter
        );

        setResults(filtered);
        setLastQuery({
            query: trimmed.query,
            stateFilter: trimmed.stateFilter
        });
        setStatus("success");
      }, 800);
    },
    [],
  );

  const handleSubmit = (data: { searchType: string; query: string; stateFilter: string; selectedEntities?: string[] }) => {
    runSearch(data);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!prefillApplied || !prefill) {
      return;
    }
    if (prefill.query) {
      runSearch({
        searchType: "multi",
        query: prefill.query,
        stateFilter: prefill.stateFilter ?? "All States",
      });
    }
  }, [prefillApplied, prefill, runSearch]);

  return (
    <div className="flex-1 flex flex-col text-foreground">
      
      {/* Main Content */}
      <div className="flex-1 px-12 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* Main Content Area */}
          <div>
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-experimental-green/40 text-experimental-green-foreground hover:bg-experimental-green/40">
                  Keyword Search
                </Badge>
                {prefill?.query ? (
                  <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                    Prefilled
                  </Badge>
                ) : null}
              </div>
              <h1 className="text-3xl font-semibold mb-2">Run Proactive Background Intelligence</h1>
              <p className="text-sm text-foreground/70 max-w-2xl">
                Activate a national sweep of public records, device signals, and specialty datasets to assemble an always-current profile on the entity you&#39;re vetting.
              </p>
            </div>

            {/* Search Form Card */}
            <SearchForm
              status={status}
              onSubmit={handleSubmit}
              initialData={initialData}
              lastQuery={lastQuery}
            />

            {/* Results Section */}
            <SearchResults status={status} lastQuery={lastQuery} results={results} />
          </div>
        
          {/* Highlights - Right panel */}
          <PageHighlights />

        </div>
      </div>

    </div>
  );
};

export default KeywordSearchHome;
