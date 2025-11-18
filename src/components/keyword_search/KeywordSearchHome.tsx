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
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase,
  ChevronRight,
  Clock,
  BarChart3,
  BookmarkPlus,
  ArrowUpRight,
  Search,
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

  const [searchType, setSearchType] = useState<"name" | "phone" | "email" | "address" | "business">("name");
  const [firstName, setFirstName] = useState(prefill?.firstName ?? "");
  const [lastName, setLastName] = useState(prefill?.lastName ?? "");
  const [stateFilter, setStateFilter] = useState(prefill?.stateFilter ?? "All States");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [status, setStatus] = useState<"idle" | "searching" | "success">("idle");
  const [results, setResults] = useState<SearchResult[]>(candidateRecords);
  const [lastQuery, setLastQuery] = useState<{ firstName: string; lastName: string; stateFilter: string } | null>(null);
  const [prefillApplied, setPrefillApplied] = useState(false);
  const timeoutId = useRef<number>();

  const searchTabs = [
    { id: "name", label: "Name", icon: UserSearch },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "email", label: "Email", icon: Mail },
    { id: "address", label: "Address", icon: HomeIcon },
    { id: "business", label: "Business Name", icon: Briefcase },
  ] as const;

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
    <div className="flex-1 flex flex-col text-foreground">
      
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
          {/* Main Content Area */}
          <div>
            {/* Page Header */}
            <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary">
                  Keyword Search
                </Badge>
                {prefill?.firstName || prefill?.lastName ? (
                  <Badge variant="outline" className="border-emerald-400/50 text-emerald-300">
                    Prefilled
                  </Badge>
                ) : null}
              </div>
              <h1 className="text-3xl font-semibold mb-2">Run Proactive Background Intelligence</h1>
              <p className="text-sm text-foreground/70 max-w-2xl">
                Activate a national sweep of public records, device signals, and specialty datasets to assemble an always-current profile on the person or business you&#39;re vetting.
              </p>
            </div>

            {/* Search Form Card */}
            <div className="mb-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Choose Your Search Mode</h2>
                  
                  {/* Search Type Tabs */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {searchTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = searchType === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSearchType(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-white/5 border-white/20 text-foreground/70 hover:bg-white/10 hover:border-white/30"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>


                <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
                  {searchType === "name" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder="Enter First Name"
                          className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : undefined}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-destructive">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          placeholder="Enter Last Name"
                          className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : undefined}
                        />
                        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                          City (optional)
                        </Label>
                        <Input
                          id="city"
                          placeholder="Enter City"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stateFilter" className="text-sm font-medium">State</Label>
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
                    </>
                  )}

                  {searchType === "phone" && (
                    <div className="md:col-span-4 space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        type="tel"
                      />
                    </div>
                  )}

                  {searchType === "email" && (
                    <div className="md:col-span-4 space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        placeholder="Enter email address"
                        type="email"
                      />
                    </div>
                  )}

                  {searchType === "address" && (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="street" className="text-sm font-medium">
                          Street Address<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="street"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressCity" className="text-sm font-medium">
                          City<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="addressCity"
                          placeholder="Enter City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressState" className="text-sm font-medium">State</Label>
                        <Select value={stateFilter} onValueChange={setStateFilter}>
                          <SelectTrigger id="addressState">
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
                    </>
                  )}

                  {searchType === "business" && (
                    <>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="businessName" className="text-sm font-medium">
                          Business Name<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="businessName"
                          placeholder="Enter business name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessCity" className="text-sm font-medium">
                          City (optional)
                        </Label>
                        <Input
                          id="businessCity"
                          placeholder="Enter City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessState" className="text-sm font-medium">State</Label>
                        <Select value={stateFilter} onValueChange={setStateFilter}>
                          <SelectTrigger id="businessState">
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
                    </>
                  )}

                  <div className="md:col-span-4">
                    <Button type="submit" size="lg" className="w-full text-base mt-2">
                        {status === "searching" ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Searching records
                        </span>
                        ) : (
                        <span className="flex items-center justify-center gap-2">
                           Start background scan<Search className="h-4 w-4" />
                        </span>
                        )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-start gap-3 text-xs text-foreground/70">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Responsible Data Use</p>
                      <p>
                        By starting a background scan I confirm I&#39;m using this data for legitimate investigative purposes, and I agree to the <a href="#" className="text-primary hover:underline">Terms of Use</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>. This platform is not a consumer reporting agency and should not be used for credit or employment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step Status */}
            {(status === "searching" || status === "success") && (
              <div className="mb-8">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      {status === "searching" ? (
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      ) : (
                        <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {status === "searching" ? "Building a live dossier..." : "Profiles ready to review"}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {status === "searching" 
                          ? "Cross-referencing utility, telecom, and civil sources in real time."
                          : `We surfaced the strongest matches for ${lastQuery?.firstName} ${lastQuery?.lastName} plus adjacent variations.`
                        }
                      </p>
                    </div>
                    {/* {status === "success" && (
                      <Button size="lg">
                        VIEW REPORTS
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {status === "success" && lastQuery && (
              <div className="mt-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-semibold">Identity Resolution Matches</h2>
                    <Badge variant="outline" className="border-white/20 text-foreground/70">
                      <UserSearch className="mr-2 h-4 w-4" /> {results.length} candidates
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70">
                    Aggregated candidates for {lastQuery.firstName} {lastQuery.lastName} • {lastQuery.stateFilter}
                  </p>
                </div>

                <div className="space-y-4">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{result.name}</h3>
                            <Badge variant="secondary" className="bg-white/10 text-foreground">
                              Match score {result.matchScore}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{result.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {result.insights.map((insight) => (
                              <Badge key={insight} variant="outline" className="border-white/15 text-foreground/70">
                                <CheckCircle2 className="mr-1 h-3 w-3 text-primary" /> {insight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button>Open background brief</Button>
                          <div className="flex items-center gap-2 text-xs text-foreground/60">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span>{result.status}</span>
                            <span>•</span>
                            <span>Updated {result.updated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-foreground/70">
                  <div className="flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">Signal refresh completed 12 minutes ago</span>
                  </div>
                  <p className="mt-1">Coverage spans state court dockets, property indexes, telecom, utilities, and professional licensing.</p>
                </div>
              </div>
            )}
          </div>
        
          {/* Highlights - Right panel */}
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
                  <Badge className="bg-primary/10 text-primary mb-4">
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

        </div>
      </div>

    </div>
  );
};

export default KeywordSearchHome;
