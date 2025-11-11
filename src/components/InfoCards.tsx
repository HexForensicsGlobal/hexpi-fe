import { FileText, AppWindow, MessageSquare, MoreVertical, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function InfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-6xl mx-auto px-4">
      <Card className="bg-card/40 backdrop-blur-xl border border-border/30 p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FileText className="w-4 h-4" />
            <span>Jump back in to your files</span>
          </div>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[
            { name: "Screenshot 2025-11-10 131803.p...", time: "22h ago" },
            { name: "Screenshot_10-11-2025_122452...", time: "22h ago" },
            { name: "Mile2-Hex-Cert.png", time: "Wednesday" },
          ].map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 bg-muted/40 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.time}</div>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card/40 backdrop-blur-xl border border-border/30 p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <AppWindow className="w-4 h-4" />
            <span>Get guided help with your apps</span>
          </div>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "VS Code", color: "bg-blue-500" },
            { name: "Edge", color: "bg-cyan-500" },
            { name: "Git", color: "bg-red-500" },
            { name: "GitHub", color: "bg-gray-700" },
            { name: "Chrome", color: "bg-yellow-500" },
            { name: "Spotify", color: "bg-green-500" },
          ].map((app, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 ${app.color} rounded-lg`} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card/40 backdrop-blur-xl border border-border/30 p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Keep talking to PIP</span>
          </div>
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-muted/40 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-foreground font-medium">How can PIP help me?</div>
            <div className="text-xs text-muted-foreground">Just now</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
