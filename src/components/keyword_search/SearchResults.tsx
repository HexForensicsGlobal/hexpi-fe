import { useEffect, useMemo, useState, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  ChevronRight,
  Grid3X3,
  List,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import type { AffiliateResult, OrganizationResult, SearchResponse } from "@/services/types";
import { OrganizationDetail, AffiliateDetail } from "./SearchResultDetail";
import SummaryStatsBar from "./SummaryStatsBar";

/**
 * Highlights occurrences of search terms within text.
 * Splits query into words and highlights each match with a styled span.
 */
const highlightText = (text: string | null | undefined, query: string | null | undefined): ReactNode => {
  if (!text) return text ?? "";
  if (!query || !query.trim()) return text;

  // Split query into individual words and escape regex special chars
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return text;

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-primary/30 text-foreground rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

interface SearchResultsProps {
  status: "idle" | "searching" | "success" | "error";
  lastQuery: { query: string; stateFilter: string } | null;
  results: SearchResponse | null;
}

type PrimaryTab = "organizations" | "affiliates";
type RelatedTab = "related_organizations" | "related_affiliates";

const formatLocation = (city?: string | null, state?: string | null, fallback?: string | null) => {
  const parts = [city, state].filter(Boolean) as string[];
  if (parts.length) {
    return parts.join(", ");
  }
  return fallback ?? "Location unavailable";
};

const formatDateLabel = (value?: string | null) => {
  if (!value) {
    return "No registry date";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No registry date";
  }
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
};

const buildAffiliateName = (affiliate: AffiliateResult) => {
  const name = [affiliate.firstname, affiliate.otherName, affiliate.surname].filter(Boolean).join(" ").trim();
  if (name) {
    return name;
  }
  return affiliate.email || affiliate.phoneNumber || affiliate.identity_number || "Unidentified affiliate";
};

const buildOrganizationName = (organization: OrganizationResult) =>
  organization.approvedName?.trim() || organization.rcNumber || "Unregistered organization";

const SearchResults = ({ status, lastQuery, results }: SearchResultsProps) => {
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("organizations");
  const [relatedTab, setRelatedTab] = useState<RelatedTab>("related_organizations");
  const [primaryPage, setPrimaryPage] = useState(1);
  const [relatedPage, setRelatedPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const pageSize = 8;

  // Detail panel state
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationResult | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateResult | null>(null);

  useEffect(() => {
    if (!results) {
      setPrimaryPage(1);
      setRelatedPage(1);
      return;
    }
    const nextPrimary: PrimaryTab = results.organizations.length
      ? "organizations"
      : results.affiliates.length
        ? "affiliates"
        : "organizations";
    const nextRelated: RelatedTab = results.related_organizations.length
      ? "related_organizations"
      : results.related_affiliates.length
        ? "related_affiliates"
        : "related_organizations";
    setPrimaryTab(nextPrimary);
    setRelatedTab(nextRelated);
    setPrimaryPage(1);
    setRelatedPage(1);
  }, [results]);

  useEffect(() => {
    setPrimaryPage(1);
  }, [primaryTab]);

  useEffect(() => {
    setRelatedPage(1);
  }, [relatedTab]);

  const primaryList = useMemo(() => {
    if (!results) {
      return [];
    }
    return primaryTab === "organizations" ? results.organizations : results.affiliates;
  }, [primaryTab, results]);

  const relatedList = useMemo(() => {
    if (!results) {
      return [];
    }
    return relatedTab === "related_organizations" ? results.related_organizations : results.related_affiliates;
  }, [relatedTab, results]);

  const totalPrimaryPages = Math.max(1, Math.ceil(primaryList.length / pageSize));
  const totalRelatedPages = Math.max(1, Math.ceil(relatedList.length / pageSize));
  const primaryPageItems = primaryList.slice((primaryPage - 1) * pageSize, primaryPage * pageSize);
  const relatedPageItems = relatedList.slice((relatedPage - 1) * pageSize, relatedPage * pageSize);

  // Show loading skeleton when searching
  if (status === "searching") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Skeleton Summary Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-48 bg-white/10" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>
        </div>

        {/* Skeleton Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-6 w-40 bg-white/10 mb-2" />
              <Skeleton className="h-4 w-56 bg-white/10" />
            </div>
            <Skeleton className="h-8 w-48 rounded-full bg-white/10" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 bg-white/10 mb-2" />
                    <Skeleton className="h-6 w-64 bg-white/10" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                </div>
                <div className="flex gap-4 mt-3">
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="h-4 w-28 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status !== "success" || !lastQuery || !results) {
    return null;
  }

  const summaryHighlights = [
    { label: "Primary organizations", value: results.total_matched_organizations },
    { label: "Primary affiliates", value: results.total_matched_affiliates },
    { label: "Related organizations", value: results.total_related_organizations },
    { label: "Related affiliates", value: results.total_related_affiliates },
  ];

  const queryLatency = `${Math.round(results.query_time_ms)}ms`;

  const totalResults = results.total_matched_organizations + results.total_matched_affiliates;

  return (
    <div className="space-y-6">
      {/* Compact Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground/50">Results for</span>
            <span className="font-medium text-foreground">"{lastQuery.query || "Wildcard"}"</span>
            {lastQuery.stateFilter !== "All States" && (
              <Badge variant="outline" className="border-white/20 text-xs">
                {lastQuery.stateFilter}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-foreground/50">
          <span>{totalResults} primary matches</span>
          <span>•</span>
          <span>{results.total_related_organizations + results.total_related_affiliates} related matches</span>
          <span>•</span>
          <span className="text-foreground/40">{queryLatency}</span>
          <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 ${viewMode === "list" ? "bg-white/10" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 ${viewMode === "grid" ? "bg-white/10" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <SummaryStatsBar results={results} />

      {/* Primary Entities Section */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Primary Matches</h3>
            <p className="text-xs text-foreground/50">Direct matches for your search terms</p>
          </div>
          <ToggleGroup
            type="single"
            value={primaryTab}
            onValueChange={(value) => value && setPrimaryTab(value as PrimaryTab)}
            className="rounded-full border border-white/10 bg-white/5 p-1"
          >
            <ToggleGroupItem value="organizations" className="rounded-full px-3 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Organizations ({results.organizations.length})
            </ToggleGroupItem>
            <ToggleGroupItem value="affiliates" className="rounded-full px-3 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Affiliates ({results.affiliates.length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className={viewMode === "grid" ? "grid gap-3 md:grid-cols-2" : "space-y-3"}>
          {primaryPageItems.length ? (
            primaryPageItems.map((record, index) => (
              primaryTab === "organizations" ? (
                <OrganizationCard
                  key={`org-${index}-${record.organization_id ?? index}`}
                  organization={record as OrganizationResult}
                  onClick={() => setSelectedOrganization(record as OrganizationResult)}
                  compact={viewMode === "grid"}
                  searchQuery={lastQuery?.query}
                />
              ) : (
                <AffiliateCard
                  key={`aff-${index}-${(record as AffiliateResult).affiliate_id ?? index}`}
                  affiliate={record as AffiliateResult}
                  onClick={() => setSelectedAffiliate(record as AffiliateResult)}
                  compact={viewMode === "grid"}
                  searchQuery={lastQuery?.query}
                />
              )
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-foreground/60">No {primaryTab === "organizations" ? "organizations" : "affiliates"} matched your search.</p>
              <p className="text-xs text-foreground/40 mt-1">Try adjusting your query or switching entity type.</p>
            </div>
          )}
        </div>
        {primaryList.length > pageSize && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-xs text-foreground/50">
              Showing {primaryPageItems.length} of {primaryList.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={primaryPage === 1}
                onClick={() => setPrimaryPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-foreground/50 px-2">
                {primaryPage} / {totalPrimaryPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={primaryPage === totalPrimaryPages}
                onClick={() => setPrimaryPage((prev) => Math.min(totalPrimaryPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Related Entities Section */}
      <section className="mt-8 pt-8 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Related Matches</h3>
            <p className="text-xs text-foreground/50">Partial matches worth reviewing</p>
          </div>
          <ToggleGroup
            type="single"
            value={relatedTab}
            onValueChange={(value) => value && setRelatedTab(value as RelatedTab)}
            className="rounded-full border border-white/10 bg-white/5 p-1"
          >
            <ToggleGroupItem value="related_organizations" className="rounded-full px-3 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Organizations ({results.related_organizations.length})
            </ToggleGroupItem>
            <ToggleGroupItem value="related_affiliates" className="rounded-full px-3 py-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              Affiliates ({results.related_affiliates.length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {relatedPageItems.length ? (
            relatedPageItems.map((record, index) => (
              relatedTab === "related_organizations" ? (
                <OrganizationCard
                  key={`rel-org-${index}-${record.organization_id ?? index}`}
                  organization={record as OrganizationResult}
                  variant="related"
                  onClick={() => setSelectedOrganization(record as OrganizationResult)}
                  searchQuery={lastQuery?.query}
                />
              ) : (
                <AffiliateCard
                  key={`rel-aff-${index}-${(record as AffiliateResult).affiliate_id ?? index}`}
                  affiliate={record as AffiliateResult}
                  variant="related"
                  onClick={() => setSelectedAffiliate(record as AffiliateResult)}
                  searchQuery={lastQuery?.query}
                />
              )
            ))
          ) : (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-foreground/60">No related {relatedTab === "related_organizations" ? "organizations" : "affiliates"} found.</p>
            </div>
          )}
        </div>

        {relatedList.length > pageSize && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-xs text-foreground/50">
              Showing {relatedPageItems.length} of {relatedList.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={relatedPage === 1}
                onClick={() => setRelatedPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-foreground/50 px-2">
                {relatedPage} / {totalRelatedPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs"
                disabled={relatedPage === totalRelatedPages}
                onClick={() => setRelatedPage((prev) => Math.min(totalRelatedPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Detail Panels */}
      <OrganizationDetail
        organization={selectedOrganization}
        open={selectedOrganization !== null}
        onOpenChange={(open) => !open && setSelectedOrganization(null)}
      />
      <AffiliateDetail
        affiliate={selectedAffiliate}
        open={selectedAffiliate !== null}
        onOpenChange={(open) => !open && setSelectedAffiliate(null)}
      />
    </div>
  );
};

interface OrganizationCardProps {
  organization: OrganizationResult;
  variant?: "primary" | "related";
  compact?: boolean;
  searchQuery?: string;
  onClick?: () => void;
}

const OrganizationCard = ({ organization, variant = "primary", compact = false, searchQuery, onClick }: OrganizationCardProps) => {
  const name = buildOrganizationName(organization);
  const location = formatLocation(organization.city, organization.state, organization.address);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer group
        ${compact ? "p-4" : "p-5"}
        ${variant === "primary" 
          ? "border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20" 
          : "border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30"
        }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>{organization.rcNumber ? <>RC {highlightText(organization.rcNumber, searchQuery)}</> : "No RC"}</span>
          </div>
          <h3 className={`mt-1 font-semibold text-foreground truncate ${compact ? "text-base" : "text-lg"}`}>{highlightText(name, searchQuery)}</h3>
        </div>
        {!compact && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="border-white/20 bg-white/5 text-foreground/70 text-xs">
              {organization.status || "UNSPECIFIED"}
            </Badge>
            <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        )}
      </div>
      <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/50 ${compact ? "mt-2" : "mt-3"}`}>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3" /> {highlightText(location, searchQuery)}
        </span>
        {!compact && (
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> {formatDateLabel(organization.registrationDate)}
          </span>
        )}
      </div>
      {variant === "related" && typeof organization.match_score === "number" && (
        <div className={`inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary ${compact ? "mt-2" : "mt-3"}`}>
          <Sparkles className="h-3 w-3" /> Score: {organization.match_score}
        </div>
      )}
    </button>
  );
};

interface AffiliateCardProps {
  affiliate: AffiliateResult;
  variant?: "primary" | "related";
  compact?: boolean;
  searchQuery?: string;
  onClick?: () => void;
}

const AffiliateCard = ({ affiliate, variant = "primary", compact = false, searchQuery, onClick }: AffiliateCardProps) => {
  const name = buildAffiliateName(affiliate);
  const location = formatLocation(affiliate.city, affiliate.state, affiliate.nationality);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer group
        ${compact ? "p-4" : "p-5"}
        ${variant === "primary" 
          ? "border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20" 
          : "border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30"
        }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>{highlightText(affiliate.occupation, searchQuery) || "Role unavailable"}</span>
          </div>
          <h3 className={`mt-1 font-semibold text-foreground truncate ${compact ? "text-base" : "text-lg"}`}>{highlightText(name, searchQuery)}</h3>
        </div>
        {!compact && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {affiliate.identity_number && (
              <Badge variant="outline" className="border-white/20 bg-white/5 text-foreground/70 text-xs">
                {highlightText(affiliate.identity_number, searchQuery)}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        )}
      </div>
      <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground/50 ${compact ? "mt-2" : "mt-3"}`}>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3" /> {highlightText(location, searchQuery)}
        </span>
        {!compact && affiliate.email && <span className="truncate max-w-[200px]">{highlightText(affiliate.email, searchQuery)}</span>}
        {!compact && affiliate.phoneNumber && <span>{highlightText(affiliate.phoneNumber, searchQuery)}</span>}
      </div>
      {variant === "related" && typeof affiliate.match_score === "number" && (
        <div className={`inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary ${compact ? "mt-2" : "mt-3"}`}>
          <Sparkles className="h-3 w-3" /> Score: {affiliate.match_score}
        </div>
      )}
    </button>
  );
};

export default SearchResults;