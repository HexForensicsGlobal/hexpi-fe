import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    "Analyze search results",
    "Generate investigation summary",
    "Cross-reference findings",
    "Identify key connections",
    "Create evidence timeline",
    "Predict investigation leads",
    "Summarize case details",
    "Research background information",
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {actions.map((action) => (
        <Button
          key={action}
          variant="secondary"
          className="rounded-full bg-secondary/80 hover:bg-secondary backdrop-blur-sm border border-border/30 text-muted-foreground text-xs px-5 py-2"
        >
          {action}
        </Button>
      ))}
    </div>
  );
}
