import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpDown,
  Building2,
  History,
  MapPin,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import type { AffiliateResult, OrganizationResult, SearchResponse } from "@/services/types";

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
  const pageSize = 8;

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

  if (status !== "success" || !lastQuery || !results) {
    return null;
  }

  const summaryHighlights = [
    { label: "Primary organizations", value: results.total_matched_organizations },
    { label: "Primary affiliates", value: results.total_matched_affiliates },
    { label: "Related organizations", value: results.total_related_organizations },
    { label: "Related affiliates", value: results.total_related_affiliates },
  ];

  const queryLatency = `${Math.round(results.query_time_ms)}ms latency`;

  return (
    <div className="mb-10 mt-12 space-y-6">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-primary/5 p-6 shadow-xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Keyword Intelligence Snapshot</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-foreground/70">
              <Users className="h-4 w-4 text-primary" />
              <span>
                "{lastQuery.query || "Wildcard"}" • {lastQuery.stateFilter}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="border-white/20 bg-black/40 text-foreground/80">
            <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
            {queryLatency}
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

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Primary Entities</p>
            <h3 className="text-xl font-semibold text-white">Organizations & Affiliates with full token matches</h3>
          </div>
          <ToggleGroup
            type="single"
            value={primaryTab}
            onValueChange={(value) => value && setPrimaryTab(value as PrimaryTab)}
            className="rounded-full border border-white/10 bg-black/20 p-1"
          >
            <ToggleGroupItem value="organizations" className="rounded-full px-4 text-xs">
              Orgs ({results.organizations.length})
            </ToggleGroupItem>
            <ToggleGroupItem value="affiliates" className="rounded-full px-4 text-xs">
              Affiliates ({results.affiliates.length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="mt-4 space-y-4">
          {primaryPageItems.length ? (
            primaryPageItems.map((record, index) => (
              primaryTab === "organizations" ? (
                <OrganizationCard key={`org-${index}-${record.organization_id ?? index}`} organization={record as OrganizationResult} />
              ) : (
                <AffiliateCard key={`aff-${index}-${(record as AffiliateResult).affiliate_id ?? index}`} affiliate={record as AffiliateResult} />
              )
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center">
              <p className="text-sm text-foreground/70">No {primaryTab === "organizations" ? "organizations" : "affiliates"} matched all tokens.</p>
              <p className="text-xs text-foreground/50 mt-1">Try broadening your query or switch entity focus.</p>
            </div>
          )}
        </div>
        {primaryList.length > pageSize ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm">
            <span>
              Showing <strong>{primaryPageItems.length}</strong> of {primaryList.length} {primaryTab}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={primaryPage === 1}
                onClick={() => setPrimaryPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="rounded-full border border-white/10 px-4 py-1">
                Page {primaryPage} / {totalPrimaryPages}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={primaryPage === totalPrimaryPages}
                onClick={() => setPrimaryPage((prev) => Math.min(totalPrimaryPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Signal Adjacent</p>
            <h3 className="text-xl font-semibold">Partial matches worth reviewing</h3>
          </div>
          <ToggleGroup
            type="single"
            value={relatedTab}
            onValueChange={(value) => value && setRelatedTab(value as RelatedTab)}
            className="rounded-full border border-primary/30 bg-black/20 p-1"
          >
            <ToggleGroupItem value="related_organizations" className="rounded-full px-4 text-xs">
              Orgs ({results.related_organizations.length})
            </ToggleGroupItem>
            <ToggleGroupItem value="related_affiliates" className="rounded-full px-4 text-xs">
              Affiliates ({results.related_affiliates.length})
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {relatedPageItems.length ? (
            relatedPageItems.map((record, index) => (
              relatedTab === "related_organizations" ? (
                <OrganizationCard
                  key={`rel-org-${index}-${record.organization_id ?? index}`}
                  organization={record as OrganizationResult}
                  variant="related"
                />
              ) : (
                <AffiliateCard
                  key={`rel-aff-${index}-${(record as AffiliateResult).affiliate_id ?? index}`}
                  affiliate={record as AffiliateResult}
                  variant="related"
                />
              )
            ))
          ) : (
            <div className="md:col-span-2 rounded-2xl border border-dashed border-primary/30 bg-black/10 p-6 text-center">
              <p className="text-sm text-primary/80">No related {relatedTab === "related_organizations" ? "organizations" : "affiliates"} for this query.</p>
            </div>
          )}
        </div>

        {relatedList.length > pageSize ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-black/10 p-3 text-sm">
            <span>
              Showing <strong>{relatedPageItems.length}</strong> of {relatedList.length} related hits
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={relatedPage === 1}
                onClick={() => setRelatedPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="rounded-full border border-primary/40 px-4 py-1">
                Page {relatedPage} / {totalRelatedPages}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={relatedPage === totalRelatedPages}
                onClick={() => setRelatedPage((prev) => Math.min(totalRelatedPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-foreground/70">
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">API responded in {queryLatency}</span>
        </div>
        <p className="mt-1">
          Data served directly from the HexPi search service. Metrics reflect the live backend without local re-ranking.
        </p>
      </div>
    </div>
  );
};

interface OrganizationCardProps {
  organization: OrganizationResult;
  variant?: "primary" | "related";
}

const OrganizationCard = ({ organization, variant = "primary" }: OrganizationCardProps) => {
  const name = buildOrganizationName(organization);
  const location = formatLocation(organization.city, organization.state, organization.address);
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{organization.rcNumber ? `RC ${organization.rcNumber}` : "No RC on file"}</span>
          </div>
          <h3 className="mt-1 text-xl font-semibold text-white">{name}</h3>
        </div>
        <Badge variant={variant === "primary" ? "outline" : "secondary"} className="border-white/20 text-foreground/80">
          {organization.status || "UNSPECIFIED"}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/70">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {location}
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> {formatDateLabel(organization.registrationDate)}
        </span>
      </div>
      {variant === "related" && typeof organization.match_score === "number" ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" /> Match score {organization.match_score}
        </div>
      ) : null}
    </div>
  );
};

interface AffiliateCardProps {
  affiliate: AffiliateResult;
  variant?: "primary" | "related";
}

const AffiliateCard = ({ affiliate, variant = "primary" }: AffiliateCardProps) => {
  const name = buildAffiliateName(affiliate);
  const location = formatLocation(affiliate.city, affiliate.state, affiliate.nationality);
  return (
    <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <User className="h-4 w-4 text-primary" />
            <span>{affiliate.occupation || "Role unavailable"}</span>
          </div>
          <h3 className="mt-1 text-xl font-semibold text-white">{name}</h3>
        </div>
        {affiliate.identity_number ? (
          <Badge variant={variant === "primary" ? "outline" : "secondary"} className="border-white/20 text-foreground/80">
            {affiliate.identity_number}
          </Badge>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-foreground/70">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {location}
        </span>
        {affiliate.email ? <span>{affiliate.email}</span> : null}
        {affiliate.phoneNumber ? <span>{affiliate.phoneNumber}</span> : null}
      </div>
      {variant === "related" && typeof affiliate.match_score === "number" ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" /> Match score {affiliate.match_score}
        </div>
      ) : null}
    </div>
  );
};

export default SearchResults;