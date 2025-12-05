import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Search,
  UserSearch,
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase,
  Compass,
  AlertCircle,
  MapPin,
  Database,
  Server,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { stateOptions } from "@/lib/state-options";
import api from "@/services/api";

export interface SearchFormData {
  searchType: "person" | "phone" | "email" | "address" | "business" | "multi";
  query: string;
  stateFilter: string;
  phone?: string;
  email?: string;
  street?: string;
  businessName?: string;
}

interface SearchFormProps {
  status: "idle" | "searching" | "success" | "error";
  errorMessage?: string;
  onSubmit: (data: SearchFormData) => void;
  initialData?: Partial<SearchFormData>;
  lastQuery?: { query: string; stateFilter: string } | null;
}

interface SystemHealth {
  api: "online" | "offline" | "checking";
  records: "online" | "offline" | "checking";
}

const searchTabs = [
    { id: "multi", label: "Multi-Search", icon: Compass },
    { id: "person", label: "Person", icon: UserSearch },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "email", label: "Email", icon: Mail },
    { id: "address", label: "Address", icon: HomeIcon },
    { id: "business", label: "Business", icon: Briefcase },
] as const;

const SearchForm = ({ status, errorMessage, onSubmit, initialData, lastQuery }: SearchFormProps) => {
  const [searchType, setSearchType] = useState<"person" | "phone" | "email" | "address" | "business" | "multi">(
    initialData?.searchType ?? "multi"
  );
  const [stateFilter, setStateFilter] = useState(initialData?.stateFilter ?? "All States");
  const [query, setQuery] = useState(initialData?.query ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [street, setStreet] = useState(initialData?.street ?? "");
  const [businessName, setBusinessName] = useState(initialData?.businessName ?? "");
  const [submittedData, setSubmittedData] = useState<SearchFormData | null>(null);
  const [errors, setErrors] = useState<{ query?: string; phone?: string; email?: string }>({});
  const hasAutoSubmitted = useRef(false);
  
  // System health state
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    api: "checking",
    records: "checking",
  });

  // Check system health on mount and periodically
  useEffect(() => {
    const checkHealth = async () => {
      // Check API health
      try {
        await api.health();
        setSystemHealth(prev => ({ ...prev, api: "online" }));
      } catch {
        setSystemHealth(prev => ({ ...prev, api: "offline" }));
      }

      // Check search/records health
      try {
        await api.searchHealth();
        setSystemHealth(prev => ({ ...prev, records: "online" }));
      } catch {
        setSystemHealth(prev => ({ ...prev, records: "offline" }));
      }
    };

    checkHealth();
    
    // Re-check every 5 minutes
    const interval = setInterval(checkHealth, 300000);
    return () => clearInterval(interval);
  }, []);

  // Sync form state with lastQuery when navigating back to the page
  useEffect(() => {
    if (lastQuery && lastQuery.query && !query) {
      setQuery(lastQuery.query);
      setStateFilter(lastQuery.stateFilter);
    }
  }, [lastQuery, query]);

  useEffect(() => {
    if (initialData && initialData.query && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      const data: SearchFormData = {
        searchType: initialData.searchType ?? "multi",
        query: initialData.query,
        stateFilter: initialData.stateFilter ?? "All States",
        phone: initialData.phone,
        email: initialData.email,
        street: initialData.street,
        businessName: initialData.businessName,
      };
      setSubmittedData(data);
      onSubmit(data);
    }
  }, [initialData, onSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = {
      stateFilter,
      query: query.trim(),
      phone: phone.trim(),
      email: email.trim(),
      street: street.trim(),
      businessName: businessName.trim(),
    };

    const newErrors: { query?: string; phone?: string; email?: string } = {};
    
    if ((searchType === "person" || searchType === "multi") && !trimmed.query) {
        newErrors.query = "Search query is required";
    }

    if (searchType === "phone") {
        if (!trimmed.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[+]?[\d\s]+$/.test(trimmed.phone)) {
             newErrors.phone = "Invalid phone number format";
        }
    }

    if (searchType === "email") {
        if (!trimmed.email) {
            newErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
            newErrors.email = "Invalid email address format";
        }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const data: SearchFormData = {
      searchType,
      query: trimmed.query,
      stateFilter: trimmed.stateFilter,
      phone: trimmed.phone,
      email: trimmed.email,
      street: trimmed.street,
      businessName: trimmed.businessName,
    };

    setSubmittedData(data);
    onSubmit(data);
  };
  return (
    <div>
      {/* Search Type Tabs - more subtle */}
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border border-white/10 bg-black/20 p-1 inline-flex flex-wrap gap-0.5">
          {searchTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = searchType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchType(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Card - layered border effect */}
      <div className="p-0.5 border border-border/70 rounded-3xl shadow-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {searchType === "multi" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Search across people, addresses, and organizations
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter names, businesses, or identifiers..."
                    className={`h-12 text-base pl-4 pr-24 ${errors.query ? "border-destructive focus-visible:ring-destructive" : "border-white/10"}`}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                    disabled={status === "searching"}
                  >
                    {status === "searching" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1.5" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[140px] h-12 text-xs border-white/10">
                    <MapPin className="h-3 w-3 mr-1.5 text-foreground/50" />
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state} value={state} className="text-xs">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.query && <p className="text-xs text-destructive text-center">{errors.query}</p>}
            </div>
          )}

          {searchType === "person" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Find individuals by name across corporate affiliations and public records
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="personQuery"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Enter full name (e.g. John Smith)"
                    className={`h-12 text-base pl-4 pr-24 ${errors.query ? "border-destructive focus-visible:ring-destructive" : "border-white/10"}`}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                    disabled={status === "searching"}
                  >
                    {status === "searching" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1.5" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[140px] h-12 text-xs border-white/10">
                    <MapPin className="h-3 w-3 mr-1.5 text-foreground/50" />
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state} value={state} className="text-xs">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.query && <p className="text-xs text-destructive text-center">{errors.query}</p>}
            </div>
          )}

          {searchType === "phone" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Look up phone numbers to find associated individuals and businesses
              </p>
              <div className="relative">
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9+\s]*$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  placeholder="Enter phone number (e.g. +234 800 000 0000)"
                  type="tel"
                  className={`h-12 text-base pl-4 pr-24 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : "border-white/10"}`}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                  disabled={status === "searching"}
                >
                  {status === "searching" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-1.5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {errors.phone && <p className="text-xs text-destructive text-center">{errors.phone}</p>}
            </div>
          )}

          {searchType === "email" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Search email addresses to identify linked profiles and organizations
              </p>
              <div className="relative">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                  className={`h-12 text-base pl-4 pr-24 ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-white/10"}`}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                  disabled={status === "searching"}
                >
                  {status === "searching" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-1.5" />
                      Search
                    </>
                  )}
                </Button>
              </div>
              {errors.email && <p className="text-xs text-destructive text-center">{errors.email}</p>}
            </div>
          )}

          {searchType === "address" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Search by location to find registered businesses and individuals
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Enter street address"
                    className="h-12 text-base pl-4 pr-24 border-white/10"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                    disabled={status === "searching"}
                  >
                    {status === "searching" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1.5" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[140px] h-12 text-xs border-white/10">
                    <MapPin className="h-3 w-3 mr-1.5 text-foreground/50" />
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state} value={state} className="text-xs">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {searchType === "business" && (
            <div className="space-y-4">
              <p className="text-center text-xs text-foreground/50">
                Find registered companies and their corporate information
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="h-12 text-base pl-4 pr-24 border-white/10"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 h-9 bg-primary/50 hover:bg-primary/90" 
                    disabled={status === "searching"}
                  >
                    {status === "searching" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1.5" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[140px] h-12 text-xs border-white/10">
                    <MapPin className="h-3 w-3 mr-1.5 text-foreground/50" />
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state} value={state} className="text-xs">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </form>

        {/* System Status Card */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between gap-6 text-[10px]">
            {/* Search activity */}
            <div className="flex items-center gap-3">
              {status === "idle" && (
                <span className="text-foreground/30">Ready for query</span>
              )}
              {status === "searching" && (
                <div className="flex items-center gap-1.5 text-primary">
                  <Activity className="h-3 w-3 animate-pulse" />
                  <span>Processing...</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Complete</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-1.5 text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  <span>Error</span>
                </div>
              )}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-foreground/30">
                <Database className="h-3 w-3" />
                <span>Records</span>
                <span className={
                  systemHealth.records === "online" ? "text-emerald-400" :
                  systemHealth.records === "checking" ? "text-yellow-400 animate-pulse" :
                  "text-destructive"
                }>●</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground/30">
                <Server className="h-3 w-3" />
                <span>API</span>
                <span className={
                  systemHealth.api === "online" ? "text-emerald-400" :
                  systemHealth.api === "checking" ? "text-yellow-400 animate-pulse" :
                  "text-destructive"
                }>●</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`uppercase tracking-wider ${
                  systemHealth.api === "online" && systemHealth.records === "online"
                    ? "text-emerald-400"
                    : systemHealth.api === "checking" || systemHealth.records === "checking"
                    ? "text-yellow-400"
                    : "text-destructive"
                }`}>
                  {systemHealth.api === "online" && systemHealth.records === "online"
                    ? "System Online"
                    : systemHealth.api === "checking" || systemHealth.records === "checking"
                    ? "Checking..."
                    : "System Unavailable"}
                </span>
              </div>
            </div>
          </div>

          {/* Error message */}
          {status === "error" && errorMessage && (
            <div className="mt-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-xs text-foreground/70">{errorMessage}</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;