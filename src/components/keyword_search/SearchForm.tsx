import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Loader2,
  Search,
  ShieldCheck,
  UserSearch,
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase,
  CheckCircle2,
  Sparkles,
  Compass,
  Activity,
  Database,
  Globe,
  Server,
  AlertCircle,
} from "lucide-react";
import { stateOptions } from "@/lib/state-options";
import { Badge } from "../ui/badge";

export interface SearchFormData {
  searchType: "person" | "phone" | "email" | "address" | "business" | "multi";
  firstName: string;
  lastName: string;
  stateFilter: string;
  query?: string;
  selectedEntities?: string[];
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  businessName?: string;
}

interface SearchFormProps {
  status: "idle" | "searching" | "success" | "error";
  errorMessage?: string;
  onSubmit: (data: SearchFormData) => void;
  initialData?: Partial<SearchFormData>;
  lastQuery?: { firstName: string; lastName: string; stateFilter: string } | null;
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
  const [firstName, setFirstName] = useState(initialData?.firstName ?? "");
  const [lastName, setLastName] = useState(initialData?.lastName ?? "");
  const [stateFilter, setStateFilter] = useState(initialData?.stateFilter ?? "All States");
  const [query, setQuery] = useState(initialData?.query ?? "");
  const [selectedEntities, setSelectedEntities] = useState<string[]>(initialData?.selectedEntities ?? ["person", "business"]);
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [street, setStreet] = useState(initialData?.street ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [businessName, setBusinessName] = useState(initialData?.businessName ?? "");
  const [submittedData, setSubmittedData] = useState<SearchFormData | null>(null);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; query?: string; phone?: string; email?: string }>({});
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (initialData && initialData.firstName && initialData.lastName && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      const data: SearchFormData = {
        searchType: initialData.searchType ?? "person",
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        stateFilter: initialData.stateFilter ?? "All States",
        query: initialData.query,
        selectedEntities: initialData.selectedEntities,
        phone: initialData.phone,
        email: initialData.email,
        street: initialData.street,
        city: initialData.city,
        businessName: initialData.businessName,
      };
      setSubmittedData(data);
      onSubmit(data);
    }
  }, [initialData, onSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      stateFilter,
      query: query.trim(),
      phone: phone.trim(),
      email: email.trim(),
      street: street.trim(),
      city: city.trim(),
      businessName: businessName.trim(),
    };

    const newErrors: { firstName?: string; lastName?: string; query?: string; phone?: string; email?: string } = {};
    
    if (searchType === "person") {
        if (!trimmed.firstName) newErrors.firstName = "First name is required";
        if (!trimmed.lastName) newErrors.lastName = "Last name is required";
    }
    
    if (searchType === "multi" && !trimmed.query) {
        newErrors.query = "Search terms are required";
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
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      stateFilter: trimmed.stateFilter,
      query: trimmed.query,
      selectedEntities,
      phone: trimmed.phone,
      email: trimmed.email,
      street: trimmed.street,
      city: trimmed.city,
      businessName: trimmed.businessName,
    };

    setSubmittedData(data);
    onSubmit(data);
  };
  return (
    <div className="mb-8">
      {/* Search Controls Card */}
      <div className="mb-6">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-md inline-flex flex-wrap gap-1">
          {searchTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = searchType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchType(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-transparent border-transparent text-foreground/70 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          {searchType === "multi" && (
            <div className="md:col-span-4 space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Select Entities <span className="text-xs text-muted-foreground font-normal ml-1">(Select all that apply)</span>
                    </Label>
                    <ToggleGroup type="multiple" variant="outline" value={selectedEntities} onValueChange={setSelectedEntities} className="justify-start flex-wrap gap-2">
                        {searchTabs.filter(t => t.id !== 'multi').map(tab => {
                            const Icon = tab.icon;
                            return (
                                <ToggleGroupItem key={tab.id} value={tab.id} aria-label={tab.label} className="gap-2 data-[state=on]:bg-primary/50 data-[state=on]:border-primary/50 border-white/10 ">
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </ToggleGroupItem>
                            )
                        })}
                    </ToggleGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 space-y-2">
                        <Label htmlFor="query" className="text-sm font-medium">
                            Search Keywords<span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter names, businesses, or identifiers..."
                            className={errors.query ? "border-destructive focus-visible:ring-destructive" : undefined}
                        />
                        {errors.query && <p className="text-xs text-destructive">{errors.query}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="multiState" className="text-sm font-medium">State</Label>
                        <Select value={stateFilter} onValueChange={setStateFilter}>
                        <SelectTrigger id="multiState">
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
                </div>
            </div>
          )}

          {searchType === "person" && (
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          )}

          {searchType === "phone" && (
            <div className="md:col-span-4 space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number<span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9+\s]*$/.test(value)) {
                        setPhone(value);
                    }
                }}
                placeholder="Enter phone number (e.g. +1 555 000 0000)"
                type="tel"
                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          )}

          {searchType === "email" && (
            <div className="md:col-span-4 space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address<span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                type="email"
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
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
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressCity" className="text-sm font-medium">
                  City<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addressCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessCity" className="text-sm font-medium">
                  City (optional)
                </Label>
                <Input
                  id="businessCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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

      {/* Search Activity & System Status */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {/* Activity Feed */}
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl relative overflow-hidden">
            {status === "searching" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
            )}
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className={`h-5 w-5 ${status === 'searching' ? 'text-primary animate-pulse' : status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <h3 className="font-semibold text-lg">
                        {status === 'idle' && "Ready for Search"}
                        {status === 'searching' && "Processing Request..."}
                        {status === 'success' && "Search Complete"}
                        {status === 'error' && "System Alert"}
                    </h3>
                </div>

                <div className="space-y-4">
                    {status === 'idle' && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground/80">System Ready</span>
                                    {/* <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> */}
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Secure connection established to HexPi core. Neural search engine initialized and ready for query parameters.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                    <div className="text-xs text-muted-foreground mb-1">Search Protocol</div>
                                    <div className="text-sm font-mono text-foreground/90">Multi-Vector v2</div>
                                </div>
                                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                    <div className="text-xs text-muted-foreground mb-1">Encryption</div>
                                    <div className="text-sm font-mono text-emerald-400">AES-256</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-3">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-medium">Search Failed</span>
                            </div>
                            <p className="text-sm text-foreground/80">
                                {errorMessage || "An unexpected error occurred while processing your request. Please try again."}
                            </p>
                        </div>
                    )}

                    {(status === 'searching' || status === 'success') && submittedData && (
                        <>
                            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <span>Query Parameters</span>
                                    <span>
                                        <Badge className="text-[10px] h-4 mx-2 p-2 bg-primary/30">
                                            {submittedData.searchType.toUpperCase()}
                                        </Badge>
                                        {submittedData.searchType === 'multi' && (
                                            <span>{submittedData.selectedEntities?.map(e => e.toUpperCase()).join(', ')}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="font-mono text-sm text-foreground/90">
                                    {submittedData.searchType === 'multi' && submittedData.query && `"${submittedData.query}"`}
                                    {submittedData.searchType === 'person' && `${submittedData.firstName} ${submittedData.lastName}`}
                                    {submittedData.searchType === 'phone' && submittedData.phone}
                                    {submittedData.searchType === 'email' && submittedData.email}
                                    {submittedData.searchType === 'address' && `${submittedData.street}, ${submittedData.city}`}
                                    {submittedData.searchType === 'business' && submittedData.businessName}
                                    {submittedData.stateFilter !== "All States" && <span className="text-muted-foreground ml-2">[{submittedData.stateFilter}]</span>}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    {status === 'searching' ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                                    <span className="text-foreground/80">
                                        {status === 'searching' ? "Querying distributed databases..." : "Data retrieval successful"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    {status === 'searching' ? <Loader2 className="h-3 w-3 animate-spin text-primary delay-150" /> : <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                                    <span className="text-foreground/80">
                                        {status === 'searching' ? "Analyzing cross-reference matches..." : "Cross-references verified"}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Status</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                            <Database className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>Public Records</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">ONLINE</span>
                    </div>
                    
                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                            <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>Global Sources</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">ONLINE</span>
                    </div>

                    <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                            <Server className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>API Gateway</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">98ms</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Sync</span>
                    <span>Just now</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;