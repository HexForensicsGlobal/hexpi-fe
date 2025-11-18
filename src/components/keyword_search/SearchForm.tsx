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
import {
  Loader2,
  Search,
  ShieldCheck,
  UserSearch,
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase,
} from "lucide-react";
import { stateOptions } from "@/lib/state-options";

interface SearchFormData {
  searchType: "name" | "phone" | "email" | "address" | "business";
  firstName: string;
  lastName: string;
  stateFilter: string;
}

interface SearchFormProps {
  status: "idle" | "searching" | "success";
  onSubmit: (data: SearchFormData) => void;
  initialData?: Partial<SearchFormData>;
}

const searchTabs = [
  { id: "name", label: "Name", icon: UserSearch },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "email", label: "Email", icon: Mail },
  { id: "address", label: "Address", icon: HomeIcon },
  { id: "business", label: "Business Name", icon: Briefcase },
] as const;

const SearchForm = ({ status, onSubmit, initialData }: SearchFormProps) => {
  const [searchType, setSearchType] = useState<"name" | "phone" | "email" | "address" | "business">(
    initialData?.searchType ?? "name"
  );
  const [firstName, setFirstName] = useState(initialData?.firstName ?? "");
  const [lastName, setLastName] = useState(initialData?.lastName ?? "");
  const [stateFilter, setStateFilter] = useState(initialData?.stateFilter ?? "All States");
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (initialData && initialData.firstName && initialData.lastName && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      onSubmit({
        searchType: initialData.searchType ?? "name",
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        stateFilter: initialData.stateFilter ?? "All States",
      });
    }
  }, [initialData, onSubmit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      stateFilter,
    };

    const newErrors: { firstName?: string; lastName?: string } = {};
    if (searchType === "name" && !trimmed.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (searchType === "name" && !trimmed.lastName) {
      newErrors.lastName = "Last name is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSubmit({
      searchType,
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      stateFilter: trimmed.stateFilter,
    });
  };
  return (
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
  );
};

export default SearchForm;