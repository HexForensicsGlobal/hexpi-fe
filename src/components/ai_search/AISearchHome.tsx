import { SearchBar } from "@/components/ai_search/SearchBar";
import { QuickActions } from "@/components/ai_search/QuickActions";
import { InfoCards } from "@/components/ai_search/InfoCards";
import { cn } from "@/lib/utils";

interface AISearchHomeProps {
  className?: string;
}

export const AISearchHome = ({ className }: AISearchHomeProps) => {
  return (
    <section
      className={cn(
        "flex-1 flex flex-col items-center justify-center text-center space-y-12",
        className,
      )}
    >
      <div>
        <h1 className="text-5xl font-semibold font-serif text-muted-foreground mb-4">
          AI Assisted Data Search
        </h1>
        <p className="text-3xl text-foreground/90">What are we looking for today?</p>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        <SearchBar />
        <QuickActions />
        <InfoCards />
      </div>
    </section>
  );
};

export default AISearchHome;
