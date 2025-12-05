import { useMemo } from "react";
import { Building2, Clock, Globe, MapPin, User, Users, Zap } from "lucide-react";
import type { SearchResponse } from "@/services/types";

interface SummaryStatsBarProps {
  results: SearchResponse;
  queryTimeMs?: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

const StatItem = ({ icon, label, value, highlight = false }: StatItemProps) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${highlight ? 'bg-primary/10' : 'bg-white/5 hover:bg-white/10'}`}>
    <div className={`flex-shrink-0 ${highlight ? 'text-primary' : 'text-foreground/50'}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className={`text-sm font-semibold truncate ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </p>
      <p className="text-xs text-foreground/50 truncate">{label}</p>
    </div>
  </div>
);

/**
 * Compact horizontal stats bar showing aggregate search statistics.
 * Displays total results, entity breakdown, geographic distribution, and query time.
 */
const SummaryStatsBar = ({ results, queryTimeMs }: SummaryStatsBarProps) => {
  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const totalPrimary = results.organizations.length + results.affiliates.length;
    const totalRelated = results.related_organizations.length + results.related_affiliates.length;
    const totalAll = totalPrimary + totalRelated;

    // Extract unique states from all results
    const allStates = new Set<string>();
    [...results.organizations, ...results.related_organizations].forEach((org) => {
      if (org.state) allStates.add(org.state);
    });
    [...results.affiliates, ...results.related_affiliates].forEach((aff) => {
      if (aff.state) allStates.add(aff.state);
    });

    // Calculate average match score for related results
    const relatedScores = [
      ...results.related_organizations.map((r) => r.match_score),
      ...results.related_affiliates.map((r) => r.match_score),
    ].filter((s): s is number => typeof s === "number");
    
    const avgScore = relatedScores.length
      ? Math.round(relatedScores.reduce((a, b) => a + b, 0) / relatedScores.length * 10) / 10
      : null;

    // Count by status (for organizations)
    const activeOrgs = [...results.organizations, ...results.related_organizations].filter(
      (org) => org.status?.toUpperCase() === "ACTIVE"
    ).length;

    return {
      totalPrimary,
      totalRelated,
      totalAll,
      orgCount: results.organizations.length + results.related_organizations.length,
      affCount: results.affiliates.length + results.related_affiliates.length,
      statesCount: allStates.size,
      avgScore,
      activeOrgs,
      queryTime: queryTimeMs ?? results.query_time_ms,
    };
  }, [results, queryTimeMs]);

  // Don't render if no results
  if (stats.totalAll === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Total Results - Highlighted */}
        <StatItem
          icon={<Users className="h-4 w-4" />}
          label="Total Results"
          value={stats.totalAll.toLocaleString()}
          highlight
        />

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-white/10" />

        {/* Organizations */}
        <StatItem
          icon={<Building2 className="h-4 w-4" />}
          label="Organizations"
          value={stats.orgCount.toLocaleString()}
        />

        {/* Affiliates */}
        <StatItem
          icon={<User className="h-4 w-4" />}
          label="Affiliates"
          value={stats.affCount.toLocaleString()}
        />

        {/* Divider */}
        <div className="hidden md:block h-8 w-px bg-white/10" />

        {/* Geographic Spread */}
        {stats.statesCount > 0 && (
          <StatItem
            icon={<MapPin className="h-4 w-4" />}
            label="States"
            value={stats.statesCount}
          />
        )}

        {/* Primary vs Related */}
        <StatItem
          icon={<Zap className="h-4 w-4" />}
          label="Exact Matches"
          value={stats.totalPrimary.toLocaleString()}
        />

        {/* Spacer to push query time to right */}
        <div className="flex-1" />

        {/* Query Time */}
        {stats.queryTime > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-foreground/40 px-2">
            <Clock className="h-3 w-3" />
            <span>{stats.queryTime}ms</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryStatsBar;
