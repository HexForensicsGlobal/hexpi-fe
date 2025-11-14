import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  History,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserSearch,
} from "lucide-react";
import { stateOptions } from "@/lib/state-options";

interface PrefillState {
  prefill?: {
    firstName?: string;
    lastName?: string;
    stateFilter?: string;
  };
}

interface SearchResult {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  insights: string[];
  status: "Live" | "Archived";
  updated: string;
}

const candidateRecords: SearchResult[] = [
  {
    id: "1",
    name: "Johnathan Smith",
    location: "New York, NY",
    matchScore: 92,
    insights: ["Utilities account", "Property filings", "Alias detected"],
    status: "Live",
    updated: "2h ago",
  },
  {
    id: "2",
    name: "Joanna Smith",
    location: "Austin, TX",
    matchScore: 78,
    insights: ["Business registration", "Social media"],
    status: "Live",
    updated: "5h ago",
  },
  {
    id: "3",
    name: "John Smith",
    location: "Seattle, WA",
    matchScore: 66,
    insights: ["Court docket", "Professional license"],
    status: "Archived",
    updated: "1d ago",
  },
];

const KeywordSearchHome = () => {
  const { state } = useLocation();
  const prefill = (state as PrefillState | null)?.prefill;

  const [firstName, setFirstName] = useState(prefill?.firstName ?? "");
  const [lastName, setLastName] = useState(prefill?.lastName ?? "");
  const [stateFilter, setStateFilter] = useState(prefill?.stateFilter ?? "All States");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [status, setStatus] = useState<"idle" | "searching" | "success">("idle");
  const [results, setResults] = useState<SearchResult[]>(candidateRecords);
  const [lastQuery, setLastQuery] = useState<{ firstName: string; lastName: string; stateFilter: string } | null>(null);
  const [prefillApplied, setPrefillApplied] = useState(false);
  const timeoutId = useRef<number>();

  const runSearch = useCallback(
    (overrides?: { firstName: string; lastName: string; stateFilter: string }) => {
      const payload = overrides ?? {
        firstName,
        lastName,
        stateFilter,
      };

      const trimmed = {
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        stateFilter: payload.stateFilter,
      };

      const newErrors: { firstName?: string; lastName?: string } = {};
      if (!trimmed.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!trimmed.lastName) {
        newErrors.lastName = "Last name is required";
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setStatus("idle");
        return;
      }

      setStatus("searching");

      timeoutId.current = window.setTimeout(() => {
        const filtered = candidateRecords.filter((record) => {
          const name = record.name.toLowerCase();
          const matchesFirst = name.includes(trimmed.firstName.toLowerCase());
          const matchesLast = name.includes(trimmed.lastName.toLowerCase());
          const matchesState =
            trimmed.stateFilter === "All States" || record.location.includes(trimmed.stateFilter);
          return matchesFirst && matchesLast && matchesState;
        });

        setResults(filtered.length > 0 ? filtered : candidateRecords);
        setLastQuery(trimmed);
        setStatus("success");
      }, 800);
    },
    [firstName, lastName, stateFilter],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch();
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!prefill || prefillApplied) {
      return;
    }
    setFirstName(prefill.firstName ?? "");
    setLastName(prefill.lastName ?? "");
    setStateFilter(prefill.stateFilter ?? "All States");
    setPrefillApplied(true);
  }, [prefill, prefillApplied]);

  useEffect(() => {
    if (!prefillApplied || !prefill) {
      return;
    }
    if (prefill.firstName && prefill.lastName) {
      runSearch({
        firstName: prefill.firstName,
        lastName: prefill.lastName,
        stateFilter: prefill.stateFilter ?? "All States",
      });
    }
  }, [prefillApplied, prefill, runSearch]);

  return (
    <div className="min-h-screen bg-slate-950 text-foreground">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 text-sm text-foreground/80">
          <div className="flex items-center gap-3">
            <img src="/HEX-PI_logo.svg" alt="Hex PIP" className="h-9 w-9" />
            <div>
              <p className="font-semibold text-white">Keyword Search</p>
              <p className="text-xs text-foreground/60">Live intelligence workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            SOC2 shielded
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-primary hover:underline">
              Back to overview
            </Link>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> AI enrichment
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:max-w-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground/80">Search parameters</p>
              <p className="text-xs text-foreground/60">Autofilled from your landing form</p>
            </div>
            {prefill?.firstName || prefill?.lastName ? (
              <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                Prefilled
              </Badge>
            ) : null}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
                className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last name"
                className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateFilter">State</Label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger id="stateFilter">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="lg" className="w-full text-base">
              {status === "searching" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching records
                </span>
              ) : (
                "Search now"
              )}
            </Button>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-foreground/70">
              <p className="flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-primary" />
                Last synced 12 minutes ago
              </p>
              <p className="mt-1">Includes court filings, utilities, telecom, and property tax records.</p>
            </div>
          </form>
        </section>

        <section className="flex-1 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-black/70 p-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary/90">Live results</p>
              <h2 className="text-2xl font-semibold text-white">Entity resolution</h2>
              {lastQuery ? (
                <p className="text-xs text-foreground/70">
                  Showing matches for {lastQuery.firstName} {lastQuery.lastName} • {lastQuery.stateFilter}
                </p>
              ) : (
                <p className="text-xs text-foreground/60">Run a search to hydrate this workspace.</p>
              )}
            </div>
            <Badge variant="outline" className="border-white/20 text-foreground/70">
              <UserSearch className="mr-2 h-4 w-4" /> {results.length} candidates
            </Badge>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{result.name}</p>
                    <p className="flex items-center gap-1 text-sm text-foreground/70">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {result.location}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-foreground">
                    Match score {result.matchScore}%
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.insights.map((insight) => (
                    <Badge key={insight} variant="outline" className="border-white/15 text-foreground/70">
                      <CheckCircle2 className="mr-1 h-3 w-3 text-primary" /> {insight}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" /> {result.status}
                  </span>
                  <span>Updated {result.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default KeywordSearchHome;
