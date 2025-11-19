import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  History,
  Loader2,
  MapPin,
  Sparkles,
  UserSearch,
} from "lucide-react";

export interface SearchResult {
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

export const filterCandidateRecords = (
  firstName: string,
  lastName: string,
  stateFilter: string
): SearchResult[] => {
  const filtered = candidateRecords.filter((record) => {
    const name = record.name.toLowerCase();
    const matchesFirst = name.includes(firstName.toLowerCase());
    const matchesLast = name.includes(lastName.toLowerCase());
    const matchesState =
      stateFilter === "All States" || record.location.includes(stateFilter);
    return matchesFirst && matchesLast && matchesState;
  });

  return filtered.length > 0 ? filtered : candidateRecords;
};

interface SearchResultsProps {
  status: "idle" | "searching" | "success";
  lastQuery: { firstName: string; lastName: string; stateFilter: string } | null;
  results: SearchResult[];
}

const SearchResults = ({ status, lastQuery, results }: SearchResultsProps) => {
  if (status !== "success" || !lastQuery) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Search Highlights */}
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
      
      {/* Search Results */}
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
  );
};

export default SearchResults;