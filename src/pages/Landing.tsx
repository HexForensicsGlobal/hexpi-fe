import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { stateOptions } from "@/lib/state-options";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  Users,
  History,
  Sparkles,
  ChevronRight,
  BotIcon,
  Shield,
  BadgeCheck,
  Lock,
  Camera,
  ScrollText,
  School,
  Landmark,
  Fingerprint,
} from "lucide-react";

const Landing = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/app/keyword-search", {
      state: {
        prefill: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          stateFilter,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[rgba(2,8,23,0.9)] to-black text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4 text-sm text-foreground/80">
          <div className="flex items-center gap-3">
            <img src="/HEX-PI_logo.svg" alt="Hex PIP" className="h-10 w-10" />
            <div>
              <p className="text-base font-semibold text-foreground">Hex PIP</p>
              <p className="text-xs text-foreground/60">People Intelligence Platform</p>
            </div>
          </div>
          <nav className="hidden gap-6 sm:flex">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/results" className="hover:text-primary">Results</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <a href="#faq" className="hover:text-primary">FAQ</a>
          </nav>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-foreground hover:text-background">
              Login
            </Button>
            <Button className="bg-primary">Sign up</Button>
          </div>
        </header>

        <section className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-foreground/60">
            <Badge variant="outline" className="border-white/15 bg-white/5 text-foreground/80">
              Accredited • BBB Rating A
            </Badge>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1">
              <Shield className="h-4 w-4 text-primary" />
              SOC 2 & GDPR ready
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-1">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              Verified data providers
            </div>
          </div>
          <Badge className="mx-auto mt-6 bg-white/10 text-sm text-foreground/80">Trusted by compliance teams</Badge>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Public Records Search</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/70">
            Discover social media, public filings, background checks, civil judgements, contact
            information, and more—powered by Hex Forensics data infrastructure.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="relative mb-5 rounded-full bg-black/60 px-4 py-2 text-center text-sm font-medium text-foreground/80">
            Start here — look up a friend, partner, or yourself in seconds
          </div>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="e.g. John"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="e.g. Smith"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger id="state">
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
            <div className="md:col-span-3">
              <Button type="submit" size="lg" className="w-full text-base">
                Search public records
              </Button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              Secure connection confirmed
            </div>
            <p>Powered by Hex Forensics data graph</p>
          </div>
        </section>

        <section className="relative grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-primary/20 to-emerald-500/20 p-6 text-left shadow-xl backdrop-blur-xl md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-primary/90">AI assisted search</p>
            <h2 className="mt-2 text-2xl font-semibold">Start an AI-guided discovery</h2>
            <p className="mt-3 text-sm text-foreground/80">
              Summaries, conversation-ready insights, and red-flag monitoring fed directly to your
              investigations dashboard.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 text-sm">
            <Badge variant="secondary" className="bg-white/80 text-foreground">
              <BotIcon className="mr-1 h-3.5 w-3.5" /> New
            </Badge>
            <Button variant="secondary" className="bg-background text-foreground">
              Try AI search now
            </Button>
            <Button variant="outline" className="border-white/40">
              AI-assisted search <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-6 text-center text-foreground/80 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/60">Data coverage</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Camera, label: "Photos" },
              { icon: ScrollText, label: "Court filings" },
              { icon: School, label: "Education" },
              { icon: Landmark, label: "Property" },
              { icon: Fingerprint, label: "Background" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-6"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold text-foreground/70">Why professionals trust Hex PIP</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              icon: Users,
              label: "Social insights",
              text: "Cross-network profiles, relationships, and alias detection."
            }, {
              icon: ShieldCheck,
              label: "Compliance ready",
              text: "Confidential infrastructure with audit logging enabled."
            }, {
              icon: History,
              label: "Historic filings",
              text: "Corporate & court documents dating back two decades."
            }, {
              icon: Sparkles,
              label: "AI summaries",
              text: "Readable briefs generated from raw entity data."
            }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/30 p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm text-foreground/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
