import { useEffect, useState } from "react";
import { Plus, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="p-0.5 border border-border/70 rounded-2xl shadow-2xl">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

            {/* Input field */}
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none"
                />
              </div>
            </div>

            {/* Search actions */}
            <div className="mt-3 flex items-center justify-between">
              {/* response style */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-muted/30 rounded-full text-xs text-foreground">
                  <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-green-500 via-pink-500 to-orange-500" />
                  <span>Lighting</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* action buttons */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                  <Plus className="w-5 h-5 text-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                  <Paperclip className="w-5 h-5 text-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                  <Mic className="w-5 h-5 text-foreground" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
