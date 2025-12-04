import { useCallback, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SearchResults from "./SearchResults";
import SearchForm, { type SearchFormData } from "./SearchForm";
import PageHighlights from "./PageHighlights";
import api from "@/services/api";
import type { SearchParams } from "@/services/types";
import { useSearchStore } from "@/stores/searchStore";

interface PrefillState {
  prefill?: {
    query?: string;
    stateFilter?: string;
  };
}

const KeywordSearchHome = () => {
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefill = (state as PrefillState | null)?.prefill;

  // Global state from Zustand
  const { status, results, lastQuery, errorMessage, setStatus, setError, setResults } = useSearchStore();
  
  const inflightRequest = useRef<AbortController | null>(null);
  const hasInitialized = useRef(false);

  // Get query from URL or prefill
  const urlQuery = searchParams.get("q") ?? "";
  const urlState = searchParams.get("state") ?? "All States";

  const initialData = prefill ? {
    searchType: "multi" as const,
    query: prefill.query ?? "",
    stateFilter: prefill.stateFilter ?? "All States",
  } : urlQuery ? {
    searchType: "multi" as const,
    query: urlQuery,
    stateFilter: urlState,
  } : undefined;

  const resolveQueryValue = useCallback((data: SearchFormData): string => {
    switch (data.searchType) {
      case "phone":
        return data.phone?.trim() ?? "";
      case "email":
        return data.email?.trim() ?? "";
      case "address":
        return [data.street, data.city].filter(Boolean).join(" ").trim();
      case "business":
        return data.businessName?.trim() ?? data.query.trim();
      case "person":
      case "multi":
      default:
        return data.query.trim();
    }
  }, []);

  const deriveSearchType = useCallback((searchType: SearchFormData["searchType"], selectedEntities?: string[]): SearchParams["search_type"] => {
    if (searchType === "business" || searchType === "address") {
      return "organizations";
    }

    if (searchType === "person" || searchType === "phone" || searchType === "email") {
      return "affiliates";
    }

    if (searchType === "multi" && selectedEntities && selectedEntities.length === 1) {
      return selectedEntities[0] === "business" ? "organizations" : "affiliates";
    }

    return "both";
  }, []);

  const runSearch = useCallback(
    async (data: SearchFormData) => {
      const resolvedQuery = resolveQueryValue(data);
      const trimmedState = data.stateFilter;

      if (!resolvedQuery) {
        return;
      }

      inflightRequest.current?.abort();
      const controller = new AbortController();
      inflightRequest.current = controller;

      setStatus("searching");

      // Update URL with search params
      setSearchParams({ q: resolvedQuery, state: trimmedState }, { replace: true });

      try {
        const params: SearchParams = {
          q: resolvedQuery,
          search_type: deriveSearchType(data.searchType, data.selectedEntities),
        };

        const response = await api.keywordSearch(params, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setResults(response, { query: resolvedQuery, stateFilter: trimmedState });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Search request failed", error);
        setError(error instanceof Error ? error.message : "Unable to complete search");
      } finally {
        if (inflightRequest.current === controller) {
          inflightRequest.current = null;
        }
      }
    },
    [deriveSearchType, resolveQueryValue, setStatus, setResults, setError, setSearchParams],
  );

  const handleSubmit = (data: SearchFormData) => {
    runSearch(data);
  };

  // Restore search from URL on mount if we have a query but no results yet
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // If we have URL params but no cached results, trigger a search
    if (urlQuery && !results) {
      runSearch({
        searchType: "multi",
        query: urlQuery,
        stateFilter: urlState,
      });
    }
  }, [urlQuery, urlState, results, runSearch]);

  useEffect(() => () => {
    inflightRequest.current?.abort();
  }, []);

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
              errorMessage={errorMessage ?? undefined}
              onSubmit={handleSubmit}
              initialData={initialData}
              lastQuery={lastQuery}
            />

            {/* Results Section */}
            <SearchResults status={status} lastQuery={lastQuery} results={results} />
          </div>
        
          {/* Highlights - Right panel */}
          {/* <PageHighlights /> */}

        </div>
      </div>

    </div>
  );
};

export default KeywordSearchHome;
