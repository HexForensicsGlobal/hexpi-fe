import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  BellRing,
  Briefcase,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const summaryCards = [
  {
    label: "Active investigations",
    value: "24",
    delta: "+3 this week",
    icon: Briefcase,
  },
  {
    label: "Watchlist alerts",
    value: "8",
    delta: "2 critical",
    icon: BellRing,
  },
  {
    label: "AI briefs generated",
    value: "42",
    delta: "Last 24h",
    icon: Sparkles,
  },
];

const signalFeed = [
  {
    id: "1",
    title: "Political contribution flagged",
    entity: "Marisol Vega",
    time: "5m ago",
    level: "High",
  },
  {
    id: "2",
    title: "Alias match on utilities account",
    entity: "J. Carter",
    time: "18m ago",
    level: "Medium",
  },
  {
    id: "3",
    title: "Travel pattern anomaly",
    entity: "Tarek I.",
    time: "2h ago",
    level: "Low",
  },
];

const activity = [
  {
    id: "1",
    name: "Dani Rivera",
    action: "Published AI brief for Morakinyo O.",
    timestamp: "Just now",
  },
  {
    id: "2",
    name: "Kwame Mensah",
    action: "Shared dossier to Legal Ops",
    timestamp: "27m ago",
  },
  {
    id: "3",
    name: "Alex Chen",
    action: "Tagged new entity in watchlist",
    timestamp: "1h ago",
  },
];

const AppDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 px-16 py-10 text-foreground">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Badge className="bg-experimental-green/20 text-experimental-green-foreground mb-3 hover:bg-experimental-green/20">
            Live workspace
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold">Operational overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Track investigations, watchlist health, and AI-driven briefs across your teams in one command center.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/20">
            Download report
          </Button>
          <Button onClick={() => navigate("/app/investigations?action=new")}>
            Start new case
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">{card.label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{card.value}</div>
                <p className="text-xs text-foreground/60">{card.delta}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Signal feed</CardTitle>
                <p className="text-sm text-foreground/60">Prioritized items from watchlists & anomaly detection</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {signalFeed.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-foreground/70">{item.entity}</p>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-xs">
                    {item.level}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-foreground/60">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Platform health</CardTitle>
            <p className="text-sm text-foreground/60">
              System assurance, compliance posture, and AI utilization levels
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300" />
                <div>
                  <p className="text-sm text-foreground/70">Compliance coverage</p>
                  <p className="text-xl font-semibold">SOC2 • GDPR • CJIS</p>
                </div>
              </div>
              <Separator className="my-4 bg-white/10" />
              <div>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <span>AI utilization</span>
                  <span>84%</span>
                </div>
                <Progress value={84} className="mt-2" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-10 w-10 rounded-full border border-primary/30 bg-primary/10 p-2 text-primary" />
                <div>
                  <p className="text-sm text-foreground/70">Live sessions</p>
                  <p className="text-xl font-semibold">127 analysts</p>
                </div>
              </div>
              <Separator className="my-4 bg-white/10" />
              <p className="text-xs text-foreground/60">
                43% collaborating in shared cases • 29% reviewing AI briefs • 18% validating records
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team activity</CardTitle>
              <p className="text-sm text-foreground/60">Collaboration highlights and handoffs</p>
            </div>
            <Badge variant="secondary" className="bg-white/10 text-foreground">
              <Users className="mr-1 h-3.5 w-3.5" /> 12 online now
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/30 p-4">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {entry.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-sm text-foreground/70">{entry.action}</p>
                  <p className="text-xs text-foreground/50">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming tasks</CardTitle>
              <p className="text-sm text-foreground/60">Next actions across priority dockets</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View board
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Refresh travel records", "Prepare board briefing", "Escalate dual-citizen case"].map((task) => (
              <div
                key={task}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <div>
                  <p className="text-sm font-medium">{task}</p>
                  <p className="text-xs text-foreground/60">Due today • Owner: Intel Ops</p>
                </div>
                <Button size="sm" variant="outline" className="border-white/20">
                  Open
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppDashboard;
