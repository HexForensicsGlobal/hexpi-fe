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
        "flex-1 flex flex-col items-center justify-center text-center space-y-12",
        className,
      )}>
      <div>
        <Badge className="bg-experimental-green/10 text-experimental-green-foreground mb-2">
          AI workspace
        </Badge>
        <h1 className="text-5xl font-bold  text-foreground mb-4">
          Assisted Data Search
        </h1>
        <p className="text-3xl text-foreground/90">What are we looking for today?</p>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        <SearchBar initialQuery={initialQuery} />
        <QuickActions />
        <InfoCards />
      </div>
    </section>
  );
};

export default AISearchHome;
