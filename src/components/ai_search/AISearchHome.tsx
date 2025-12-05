import { useLocation } from "react-router-dom";
import { SearchBar } from "@/components/ai_search/SearchBar";
import { QuickActions } from "@/components/ai_search/QuickActions";
import { InfoCards } from "@/components/ai_search/InfoCards";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface AISearchHomeProps {
  className?: string;
}

export const AISearchHome = ({ className }: AISearchHomeProps) => {
  const location = useLocation();
  const locationState = (location.state as { query?: string } | null) ?? null;
  const initialQuery = locationState?.query ?? "";

  return (
    <section
      className={cn(
        "flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 py-8",
        className,
      )}>
      {/* Page Header */}
      <div className="mb-10">
        <Badge className="bg-experimental-green/20 text-experimental-green-foreground mb-3 hover:bg-experimental-green/20">
          AI workspace
        </Badge>
        <h1 className="text-4xl font-semibold text-foreground mb-2">
          Assisted Data Retrieval
        </h1>
        <p className="text-lg text-foreground/50 max-w-lg mx-auto">
          Ask questions in natural language, let AI analyze and retrieve relevant data
        </p>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-2xl space-y-6">
        <SearchBar initialQuery={initialQuery} />
        <QuickActions />
      </div>
    </section>
  );
};

export default AISearchHome;
