import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";

const PageHighlights = () => {
  return (
    <div className="lg:sticky lg:top-8 lg:self-start lg:h-[calc(100vh-10rem)]">
      {/* Actions  */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" className="gap-2 border-b-2 border-primary mx-auto">
          <Clock className="h-4 w-4" />
          Recent cases
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 border-b-2 border-primary mx-auto">
          <BarChart3 className="h-4 w-4" />
          Source quality
        </Button>
        {/* <Button variant="ghost" size="sm" className="gap-2 border-b-2 border-primary">
          <BookmarkPlus className="h-4 w-4" />
          Save Search
        </Button> */}
      </div>

      {/* Right Show glass */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Workspace highlights</h3>

        <div className="space-y-6">
          {/* Recommended Section */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <Badge className="bg-primary/10 text-primary mb-4 hover:bg-primary/10">
              Recommended action
            </Badge>
            <h3 className="text-lg font-semibold mb-2">Enable phone monitoring</h3>
            <p className="text-sm text-foreground/70 mb-4">
              Link a verified investigator line to trigger alerts whenever new phone data is ingested for your watchlist subjects.
            </p>
            <Button variant="outline" className="w-full">
              Connect phone channel
            </Button>
          </div>

          {/* Account Status */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold mb-4 text-foreground/80">Data entitlements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Background briefs</span>
                <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Unlimited
                </Badge>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Phone intelligence</span>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  ENABLE
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Email telemetry</span>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  ENABLE
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Location intelligence</span>
                <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Unlimited
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHighlights;