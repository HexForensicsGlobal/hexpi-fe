import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowUpRight,
  Copy,
  FileText,
  History,
  Link2,
  Share2,
  Sparkles,
  UserPlus,
} from "lucide-react";

const reportStats = [
  { label: "Published reports", value: "128", delta: "+6 this week" },
  { label: "Drafts in progress", value: "14", delta: "3 awaiting review" },
  { label: "Shared with visitors", value: "37", delta: "12 active links" },
];

const generatedReports = [
  {
    id: "RPT-9281",
    subject: "Marisol Vega",
    type: "Political exposure + financial nexus",
    updated: "2h ago",
    riskLevel: "High",
    owner: "Dani Rivera",
    contributors: 4,
    findings: 18,
    source: "Keyword search • 12 matches",
  },
  {
    id: "RPT-9244",
    subject: "Morakinyo O.",
    type: "Cross-border influence",
    updated: "Yesterday",
    riskLevel: "Medium",
    owner: "Kwame Mensah",
    contributors: 3,
    findings: 11,
    source: "AI search • 5 signals",
  },
  {
    id: "RPT-9210",
    subject: "Tarek Idris",
    type: "Dual-citizen travel anomaly",
    updated: "2 days ago",
    riskLevel: "Elevated",
    owner: "Alex Chen",
    contributors: 2,
    findings: 9,
    source: "Watchlist alert",
  },
];

const draftReports = [
  {
    id: "DRFT-4410",
    subject: "Joanna Smith",
    progress: 62,
    owner: "Lila Okoro",
    lastTouched: "45m ago",
    blockers: "Awaiting telecom records",
  },
  {
    id: "DRFT-4332",
    subject: "J. Carter",
    progress: 38,
    owner: "Intel Ops",
    lastTouched: "2h ago",
    blockers: "Need travel manifest",
  },
];

const searchHistory = [
  {
    id: "SRCH-712",
    query: "Johnathan Smith • New York",
    matches: 12,
    lastRun: "Just now",
    confidence: 82,
  },
  {
    id: "SRCH-689",
    query: "Adewale E. • Dual citizenship",
    matches: 5,
    lastRun: "1h ago",
    confidence: 74,
  },
  {
    id: "SRCH-660",
    query: "Kara Patel • Austin, TX",
    matches: 9,
    lastRun: "3h ago",
    confidence: 68,
  },
];

const sharedLinks = [
  {
    id: "RPT-9180",
    subject: "Rural infrastructure kickbacks",
    viewers: 24,
    expiresIn: "7 days",
    audience: "Oversight Committee",
  },
  {
    id: "RPT-9123",
    subject: "Adewale E. political network",
    viewers: 18,
    expiresIn: "3 days",
    audience: "Visiting counsel",
  },
];

const riskStyles: Record<string, string> = {
  High: "bg-red-500/10 text-red-300 border-red-500/30",
  Medium: "bg-amber-500/10 text-amber-200 border-amber-500/30",
  Elevated: "bg-primary/10 text-primary border-primary/30",
};

const Reports = () => {
  const stableOrigin = useMemo(() => {
    if (typeof window === "undefined") {
      return "https://hexpi.app";
    }
    return window.location.origin;
  }, []);

  const handleShare = (reportId: string, subject: string) => {
    const shareLink = `${stableOrigin}/reports/share/${reportId}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareLink).catch(() => undefined);
    }
    toast({
      title: "Secure link copied",
      description: `${subject} is now available for external viewers.`,
    });
  };

  const handleStartFromSearch = (searchId: string, query: string) => {
    toast({
      title: "Report workspace created",
      description: `We'll prefill insights from ${query}.`,
    });
  };

  return (
    <div className="flex-1 px-6 py-8 text-foreground">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Badge className="bg-experimental-green/20 text-experimental-green-foreground mb-3 hover:bg-experimental-green/20">Reports workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold">Intelligence dossiers</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Review published briefs, pick up drafts, and launch new reports directly from prior searches or live signals.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/20 gap-2">
            <Link2 className="h-4 w-4" /> Share portal
          </Button>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" /> New report
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reportStats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stat.value}</div>
              <p className="text-xs text-foreground/60">{stat.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Published & ready</CardTitle>
                <p className="text-sm text-foreground/60">
                  Finalized dossiers available to internal teams and shared recipients
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View archive
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase text-foreground/60 tracking-wide">{report.id}</p>
                      <h3 className="text-xl font-semibold text-white">{report.subject}</h3>
                      <p className="text-sm text-foreground/70">{report.type}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                        <Badge variant="outline" className={riskStyles[report.riskLevel] ?? "border-white/20"}>
                          {report.riskLevel} risk
                        </Badge>
                        <span>Updated {report.updated}</span>
                        <span>{report.source}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="gap-2 border-white/30">
                        <FileText className="h-4 w-4" /> View report
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 text-primary"
                        onClick={() => handleShare(report.id, report.subject)}
                      >
                        <Share2 className="h-4 w-4" /> Share link
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4 bg-white/10" />
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                    <span>Owner: {report.owner}</span>
                    <span>{report.contributors} collaborators</span>
                    <span>{report.findings} key findings</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Drafts & in progress</CardTitle>
                <p className="text-sm text-foreground/60">Resume writing or assign reviewers</p>
              </div>
              <Badge variant="outline" className="border-white/20">
                Auto-saved
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {draftReports.map((draft) => (
                <div key={draft.id} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-foreground/60">{draft.id}</p>
                      <h3 className="text-lg font-semibold">{draft.subject}</h3>
                      <p className="text-xs text-foreground/60">Owner: {draft.owner}</p>
                    </div>
                    <div className="text-xs text-foreground/60 text-right">
                      <p>Last touched {draft.lastTouched}</p>
                      <p>{draft.blockers}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={draft.progress} className="flex-1" />
                    <span className="text-xs text-foreground/60">{draft.progress}%</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="gap-2">
                      Continue
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20">
                      Assign reviewer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent searches → Start report</CardTitle>
              <p className="text-sm text-foreground/60">
                Promote promising queries directly into a report workspace
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {searchHistory.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{entry.query}</p>
                      <p className="text-xs text-foreground/60">
                        {entry.matches} matches • Last run {entry.lastRun}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary text-xs">
                      {entry.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-2"
                      onClick={() => handleStartFromSearch(entry.id, entry.query)}
                    >
                      <History className="h-4 w-4" /> Start report
                    </Button>
                    <Button size="sm" variant="ghost" className="text-foreground/70">
                      View details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shared access</CardTitle>
                <p className="text-sm text-foreground/60">
                  Secure visitor links with expirations and audit trail
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-primary">
                <UserPlus className="h-4 w-4" /> Invite visitor
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sharedLinks.map((link) => (
                <div key={link.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{link.subject}</p>
                      <p className="text-xs text-foreground/60">
                        {link.audience} • Expires in {link.expiresIn}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-xs">
                      {link.viewers} views
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-white/30"
                      onClick={() => handleShare(link.id, link.subject)}
                    >
                      <Copy className="h-4 w-4" /> Copy link
                    </Button>
                    <Button size="sm" variant="ghost" className="text-foreground/70">
                      Audit trail
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Workspace signals</CardTitle>
              <p className="text-sm text-foreground/60">
                System notes on automation coverage and pending escalations
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Auto-classified findings",
                  value: 78,
                  message: "AI highlighted 4 anomalies that need analyst validation.",
                },
                {
                  label: "Shared report uptime",
                  value: 99,
                  message: "Visitor links healthy. No throttling detected.",
                },
              ].map((signal) => (
                <div key={signal.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{signal.label}</p>
                    <span className="text-sm text-primary">{signal.value}%</span>
                  </div>
                  <p className="mt-2 text-xs text-foreground/60">{signal.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
