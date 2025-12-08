import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Lightbulb,
  MoreHorizontal,
  MoreVertical,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
} from "lucide-react";

interface SearchTopNavProps {
  hasResults: boolean;
  isInsightsPanelOpen: boolean;
  onToggleInsightsPanel: () => void;
  onClearSearch?: () => void;
  totalResults?: number;
}

/**
 * Top navigation bar for the keyword search page.
 * Contains page title, result count, and action buttons.
 */
const SearchTopNav = ({
  hasResults,
  isInsightsPanelOpen,
  onToggleInsightsPanel,
  onClearSearch,
  totalResults = 0,
}: SearchTopNavProps) => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl px-6 md:px-12">
      <div className="flex items-center justify-between max-w-6xl mx-auto py-1.5">
        {/* Left side - Title and result count */}
        {/* <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Keyword Search</h1>
          {hasResults && (
            <Badge variant="secondary" className="bg-white/10 text-foreground/70 text-xs">
              {totalResults.toLocaleString()} results
            </Badge>
          )}
        </div> */}

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {hasResults && (
            <>
              {/* Clear/New Search button */}
              {onClearSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSearch}
                  className="h-8 px-3 text-xs text-foreground/60"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  New Search
                </Button>
              )}

              {/* Insights Panel Toggle */}
              <Button
                variant={isInsightsPanelOpen ? "secondary" : "ghost"}
                size="sm"
                onClick={onToggleInsightsPanel}
                className={`h-8 px-3 text-xs ${
                  isInsightsPanelOpen
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "text-foreground/60"
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5 mr-1" />
                Insights
              </Button>

              {/* Divider */}
              <div className="h-5 w-px bg-white/10 mx-1" />

              

            {/* More options button */}
            <Button
                variant="ghost"
                size="sm"
                disabled
                className="h-8 w-8 p-0 text-foreground/60"
            >
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTopNav;
