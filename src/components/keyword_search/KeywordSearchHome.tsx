import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import SearchResults from "./SearchResults";
import SearchForm, { type SearchFormData } from "./SearchForm";
import PageHighlights from "./PageHighlights";
import api from "@/services/api";
import type { SearchParams, SearchResponse } from "@/services/types";

interface PrefillState {
  prefill?: {
    query?: string;
    stateFilter?: string;
  };
}

const KeywordSearchHome = () => {
  const { state } = useLocation();
  const prefill = (state as PrefillState | null)?.prefill;

  const [status, setStatus] = useState<"idle" | "searching" | "success" | "error">("idle");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [lastQuery, setLastQuery] = useState<{ query: string; stateFilter: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inflightRequest = useRef<AbortController | null>(null);

  const initialData = prefill ? {
    searchType: "multi" as const,
    query: prefill.query ?? "",
    stateFilter: prefill.stateFilter ?? "All States",
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
      setErrorMessage(null);

      try {
        const params: SearchParams = {
          q: resolvedQuery,
          search_type: deriveSearchType(data.searchType, data.selectedEntities),
        };

        const response = await api.keywordSearch(params, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setResults(response);
        setLastQuery({
          query: resolvedQuery,
          stateFilter: trimmedState,
        });
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Search request failed", error);
        setErrorMessage(error instanceof Error ? error.message : "Unable to complete search");
        setStatus("error");
      } finally {
        if (inflightRequest.current === controller) {
          inflightRequest.current = null;
        }
      }
    },
    [deriveSearchType, resolveQueryValue],
  );

  const handleSubmit = (data: SearchFormData) => {
    runSearch(data);
  };

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
          <PageHighlights />

        </div>
      </div>

    </div>
  );
};

export default KeywordSearchHome;
