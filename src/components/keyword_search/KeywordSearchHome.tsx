import { useCallback, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchResults from "./SearchResults";
import SearchForm, { type SearchFormData } from "./SearchForm";
import InsightsPanel from "./InsightsPanel";
import api from "@/services/api";
import type { SearchParams } from "@/services/types";
import { useSearchStore } from "@/stores/searchStore";
import { Badge } from "@/components/ui/badge";

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
        return data.street?.trim() ?? "";
      case "business":
        return data.businessName?.trim() ?? data.query.trim();
      case "person":
      case "multi":
      default:
        return data.query.trim();
    }
  }, []);

  const deriveSearchType = useCallback((searchType: SearchFormData["searchType"]): SearchParams["search_type"] => {
    if (searchType === "business" || searchType === "address") {
      return "organizations";
    }

    if (searchType === "person" || searchType === "phone" || searchType === "email") {
      return "affiliates";
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
          search_type: deriveSearchType(data.searchType),
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

  // Handler for related search clicks from insights panel
  const handleRelatedSearch = useCallback((term: string) => {
    runSearch({
      searchType: "multi",
      query: term,
      stateFilter: lastQuery?.stateFilter ?? "All States",
    });
  }, [runSearch, lastQuery]);

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
    <div className="flex-1 flex flex-col text-foreground relative">
      
      {/* Main Content */}
      <div className={`flex-1 px-6 md:px-12 py-8 ${!results ? 'flex flex-col items-center justify-center' : ''}`}>
        {/* Hero Search Section - centered when no results */}
        <div className={`transition-all duration-500 w-full ${results ? 'mb-8' : 'text-center'}`}>
          {/* Page Header */}
          {!results && (
          <div className={`mb-6 transition-all duration-300 ${results ? '' : 'mb-10'}`}>
            
              <Badge className="bg-experimental-green/20 text-experimental-green-foreground mb-3 hover:bg-experimental-green/20">
                Intelligence workspace
              </Badge>
            
            <h1 className={`font-semibold mb-2 transition-all duration-300 ${results ? 'text-xl text-center' : 'text-4xl'}`}>
              Background Intelligence Search
            </h1>

            <p className={`text-foreground/50 mx-auto transition-all duration-300 ${results ? 'text-sm max-w-lg text-center' : 'text-lg max-w-lg'}`}>
              Search across public records and databases, build comprehensive profiles
            </p>

          </div>
          )}

          {/* Search Form - centered and prominent */}
          <div className={`mx-auto w-full transition-all duration-300 ${results ? 'max-w-3xl' : 'max-w-2xl'}`}>
            <SearchForm
              status={status}
              errorMessage={errorMessage ?? undefined}
              onSubmit={handleSubmit}
              initialData={initialData}
              lastQuery={lastQuery}
            />
          </div>
        </div>

        {/* Results Section - appears below search */}
        {results && (
          <div className="max-w-6xl mx-auto w-full lg:pr-16">
            <SearchResults status={status} lastQuery={lastQuery} results={results} />
          </div>
        )}
      </div>

      {/* Insights Panel - collapsible side panel */}
      {results && (
        <InsightsPanel
          results={results}
          query={lastQuery?.query ?? ""}
          onRelatedSearchClick={handleRelatedSearch}
        />
      )}

    </div>
  );
};

export default KeywordSearchHome;
