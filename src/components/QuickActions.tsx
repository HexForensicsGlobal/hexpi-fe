import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    "Write a first draft",
    "Get advice",
    "Learn something new",
    // "Create an image",
    "Make a plan",
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {actions.map((action) => (
        <Button
          key={action}
          variant="secondary"
          className="rounded-full bg-secondary/60 hover:bg-secondary/80 backdrop-blur-sm border border-border/30 text-foreground text-sm px-5 py-2"
        >
          {action}
        </Button>
      ))}
    </div>
  );
}
