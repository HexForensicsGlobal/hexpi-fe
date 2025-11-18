import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SearchResults, { SearchResult, filterCandidateRecords } from "./SearchResults";
import SearchForm from "./SearchForm";
import PageHighlights from "./PageHighlights";

interface PrefillState {
  prefill?: {
    firstName?: string;
    lastName?: string;
    stateFilter?: string;
  };
}

const KeywordSearchHome = () => {
  const { state } = useLocation();
  const prefill = (state as PrefillState | null)?.prefill;

  const [status, setStatus] = useState<"idle" | "searching" | "success">("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState<{ firstName: string; lastName: string; stateFilter: string } | null>(null);
  const timeoutId = useRef<number>();

  const initialData = prefill ? {
    searchType: "name" as const,
    firstName: prefill.firstName ?? "",
    lastName: prefill.lastName ?? "",
    stateFilter: prefill.stateFilter ?? "All States",
  } : undefined;

  const runSearch = useCallback(
    (data: { searchType: string; firstName: string; lastName: string; stateFilter: string }) => {
      const trimmed = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        stateFilter: data.stateFilter,
      };

      setStatus("searching");

      timeoutId.current = window.setTimeout(() => {
        const filtered = filterCandidateRecords(
          trimmed.firstName,
          trimmed.lastName,
          trimmed.stateFilter
        );

        setResults(filtered);
        setLastQuery(trimmed);
        setStatus("success");
      }, 800);
    },
    [],
  );

  const handleSubmit = (data: { searchType: string; firstName: string; lastName: string; stateFilter: string }) => {
    runSearch(data);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col text-foreground">
      
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* Main Content Area */}
          <div>
            {/* Page Header */}
            <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-experimental-green/40 text-experimental-green-foreground hover:bg-experimental-green/40">
                  Keyword Search
                </Badge>
                {prefill?.firstName || prefill?.lastName ? (
                  <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                    Prefilled
                  </Badge>
                ) : null}
              </div>
              <h1 className="text-3xl font-semibold mb-2">Run Proactive Background Intelligence</h1>
              <p className="text-sm text-foreground/70 max-w-2xl">
                Activate a national sweep of public records, device signals, and specialty datasets to assemble an always-current profile on the person or business you&#39;re vetting.
              </p>
            </div>

            {/* Search Form Card */}
            <SearchForm
              status={status}
              onSubmit={handleSubmit}
              initialData={initialData}
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
