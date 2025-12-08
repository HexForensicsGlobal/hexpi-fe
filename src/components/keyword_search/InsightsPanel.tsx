import { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookmarkPlus,
  Download,
  Filter,
  Lightbulb,
  Search,
  Shield,
  TrendingUp,
  X,
} from "lucide-react";
import type { SearchResponse } from "@/services/types";

interface CanvasBounds {
  top: number;
  right: number;
  height: number;
}

interface InsightsPanelProps {
  results: SearchResponse | null;
  query: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onFilterClick?: (filter: string) => void;
  onRelatedSearchClick?: (term: string) => void;
}

/**
 * Collapsible right-side panel showing search insights,
 * data quality indicators, related searches, and quick actions.
 */
const InsightsPanel = ({ results, query, isCollapsed, onToggle, onFilterClick, onRelatedSearchClick }: InsightsPanelProps) => {
  // Generate insights based on results
  const insights = useMemo(() => {
    if (!results) return null;

    const totalResults = results.organizations.length + results.affiliates.length;
    const totalRelated = results.related_organizations.length + results.related_affiliates.length;
    
    // Extract unique values for filters
    const states = new Set<string>();
    const statuses = new Set<string>();
    const occupations = new Set<string>();

    [...results.organizations, ...results.related_organizations].forEach((org) => {
      if (org.state) states.add(org.state);
      if (org.status) statuses.add(org.status);
    });

    [...results.affiliates, ...results.related_affiliates].forEach((aff) => {
      if (aff.state) states.add(aff.state);
      if (aff.occupation) occupations.add(aff.occupation);
    });

    // Data quality assessment
    const orgsWithEmail = [...results.organizations, ...results.related_organizations].filter((o) => o.email).length;
    const affsWithPhone = [...results.affiliates, ...results.related_affiliates].filter((a) => a.phoneNumber).length;
    const totalOrgs = results.organizations.length + results.related_organizations.length;
    const totalAffs = results.affiliates.length + results.related_affiliates.length;
    
    const emailCoverage = totalOrgs > 0 ? Math.round((orgsWithEmail / totalOrgs) * 100) : 0;
    const phoneCoverage = totalAffs > 0 ? Math.round((affsWithPhone / totalAffs) * 100) : 0;

    // Generate related search suggestions based on query
    const queryTerms = query.trim().split(/\s+/).filter(Boolean);
    const relatedSearches: string[] = [];
    
    // Suggest variations
    if (queryTerms.length === 1) {
      relatedSearches.push(`${query} Lagos`, `${query} Limited`, `${query} Nigeria`);
    } else if (queryTerms.length >= 2) {
      // Suggest individual terms
      queryTerms.slice(0, 2).forEach((term) => {
        if (term.length > 2) relatedSearches.push(term);
      });
    }

    // Add top states as search refinements
    const topStates = Array.from(states).slice(0, 3);
    topStates.forEach((state) => {
      if (!relatedSearches.includes(`${query} ${state}`)) {
        relatedSearches.push(`${query} ${state}`);
      }
    });

    return {
      totalResults,
      totalRelated,
      states: Array.from(states).slice(0, 8),
      statuses: Array.from(statuses),
      occupations: Array.from(occupations).slice(0, 6),
      emailCoverage,
      phoneCoverage,
      relatedSearches: relatedSearches.slice(0, 5),
      hasHighQuality: emailCoverage > 50 || phoneCoverage > 50,
    };
  }, [results, query]);

  // Don't render if no results
  if (!results || !insights) return null;

  // Track canvas bounds for positioning
  const [canvasBounds, setCanvasBounds] = useState<CanvasBounds>({ top: 0, right: 8, height: window.innerHeight });

  useLayoutEffect(() => {
    const updateBounds = () => {
      const canvas = document.getElementById("canvas");
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        
        setCanvasBounds({
          top: rect.top,
          right: 8, // Account for main's margin
          height: rect.height,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    
    // Also observe the canvas for size changes
    const canvas = document.getElementById("canvas");
    const resizeObserver = new ResizeObserver(updateBounds);
    if (canvas) resizeObserver.observe(canvas);

    return () => {
      window.removeEventListener("resize", updateBounds);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Panel - fixed positioned within the canvas area */}
      <div
        className={`fixed z-50 transition-transform duration-300 ease-in-out ${
          isCollapsed ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          top: canvasBounds.top,
          right: canvasBounds.right,
          height: canvasBounds.height,
        }}
      >
        <div className="h-full w-80 border-l border-white/10 overflow-y-auto backdrop-blur-sm bg-sidebar/90 rounded-r-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Insights</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8 text-foreground/50 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-foreground/50 mt-1">
              Analysis for "{query.length > 25 ? query.slice(0, 25) + "..." : query}"
            </p>
          </div>

          {/* Content */}
          <div className="p-4">
            <Accordion type="multiple" defaultValue={["quality", "filters", "related"]} className="space-y-2">
              
              {/* Data Quality Section */}
              <AccordionItem value="quality" className="border border-white/10 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Data Quality</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {/* Email Coverage */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/60">Email Coverage</span>
                        <span className="text-foreground">{insights.emailCoverage}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            insights.emailCoverage > 70 ? "bg-green-500" : 
                            insights.emailCoverage > 40 ? "bg-yellow-500" : "bg-red-500"
                          } ${
                            insights.emailCoverage <= 10 ? "w-[10%]" :
                            insights.emailCoverage <= 20 ? "w-[20%]" :
                            insights.emailCoverage <= 30 ? "w-[30%]" :
                            insights.emailCoverage <= 40 ? "w-[40%]" :
                            insights.emailCoverage <= 50 ? "w-[50%]" :
                            insights.emailCoverage <= 60 ? "w-[60%]" :
                            insights.emailCoverage <= 70 ? "w-[70%]" :
                            insights.emailCoverage <= 80 ? "w-[80%]" :
                            insights.emailCoverage <= 90 ? "w-[90%]" : "w-full"
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Phone Coverage */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/60">Phone Coverage</span>
                        <span className="text-foreground">{insights.phoneCoverage}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            insights.phoneCoverage > 70 ? "bg-green-500" : 
                            insights.phoneCoverage > 40 ? "bg-yellow-500" : "bg-red-500"
                          } ${
                            insights.phoneCoverage <= 10 ? "w-[10%]" :
                            insights.phoneCoverage <= 20 ? "w-[20%]" :
                            insights.phoneCoverage <= 30 ? "w-[30%]" :
                            insights.phoneCoverage <= 40 ? "w-[40%]" :
                            insights.phoneCoverage <= 50 ? "w-[50%]" :
                            insights.phoneCoverage <= 60 ? "w-[60%]" :
                            insights.phoneCoverage <= 70 ? "w-[70%]" :
                            insights.phoneCoverage <= 80 ? "w-[80%]" :
                            insights.phoneCoverage <= 90 ? "w-[90%]" : "w-full"
                          }`}
                        />
                      </div>
                    </div>

                    {insights.hasHighQuality && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs text-green-500">Good data quality</span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Quick Filters Section */}
              <AccordionItem value="filters" className="border border-white/10 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Quick Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {/* States */}
                    {insights.states.length > 0 && (
                      <div>
                        <p className="text-xs text-foreground/50 mb-2">By State</p>
                        <div className="flex flex-wrap gap-1.5">
                          {insights.states.map((state) => (
                            <Badge
                              key={state}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors"
                              onClick={() => onFilterClick?.(state)}
                            >
                              {state}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Statuses */}
                    {insights.statuses.length > 0 && (
                      <div>
                        <p className="text-xs text-foreground/50 mb-2">By Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {insights.statuses.map((status) => (
                            <Badge
                              key={status}
                              variant="outline"
                              className={`text-xs cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors ${
                                status.toUpperCase() === "ACTIVE" ? "border-green-500/30 text-green-500" : ""
                              }`}
                              onClick={() => onFilterClick?.(status)}
                            >
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Occupations */}
                    {insights.occupations.length > 0 && (
                      <div>
                        <p className="text-xs text-foreground/50 mb-2">By Occupation</p>
                        <div className="flex flex-wrap gap-1.5">
                          {insights.occupations.map((occ) => (
                            <Badge
                              key={occ}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors"
                              onClick={() => onFilterClick?.(occ)}
                            >
                              {occ.length > 15 ? occ.slice(0, 15) + "..." : occ}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Related Searches Section */}
              <AccordionItem value="related" className="border border-white/10 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Related Searches</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {insights.relatedSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => onRelatedSearchClick?.(term)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-foreground/80 hover:text-foreground"
                      >
                        {term}
                      </button>
                    ))}
                    {insights.relatedSearches.length === 0 && (
                      <p className="text-xs text-foreground/40 text-center py-2">
                        No suggestions available
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Actions Section */}
              <AccordionItem value="actions" className="border border-white/10 rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Quick Actions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-white/10 hover:bg-white/10"
                      disabled
                    >
                      <Download className="h-4 w-4" />
                      Export Results
                      <Badge variant="secondary" className="ml-auto text-[10px]">Soon</Badge>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-white/10 hover:bg-white/10"
                      disabled
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save Search
                      <Badge variant="secondary" className="ml-auto text-[10px]">Soon</Badge>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default InsightsPanel;
