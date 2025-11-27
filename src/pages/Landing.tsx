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
  ArrowUpRight,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Globe,
  Menu,
  X,
} from "lucide-react";

const Landing = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();
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
      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 pb-6 pt-10 text-sm text-foreground/80">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/HEX-PI_logo.svg" alt="Hex PIP" className="h-8 w-8 sm:h-10 sm:w-10" />
          <div>
            <p className="text-sm sm:text-base font-semibold text-foreground">Hex PIP</p>
            <p className="text-xs text-foreground/60">Investigative Intelligence Cloud</p>
          </div>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/results" className="hover:text-primary">Results</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <a href="#faq" className="hover:text-primary">FAQ</a>
        </nav>
        <div className="hidden gap-3 md:flex">
          <Button variant="outline" className="border-white/20 text-foreground hover:text-background">
            Login
          </Button>
          <Button className="bg-primary">Sign up</Button>
        </div>
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[88px] left-0 right-0 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="rounded-lg border border-white/10 bg-black/95 backdrop-blur-xl p-4 shadow-2xl">
            <nav className="flex flex-col gap-4 mb-4">
              <Link 
                to="/" 
                className="hover:text-primary py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/results" 
                className="hover:text-primary py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Results
              </Link>
              <Link 
                to="/about" 
                className="hover:text-primary py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <a 
                href="#faq" 
                className="hover:text-primary py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" className="w-full border-white/20 text-foreground hover:text-background">
                Login
              </Button>
              <Button className="w-full bg-primary">Sign up</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero*/}
      <div className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-6xl flex-col justify-center gap-12 px-6 pb-20">
        <section className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-foreground/60">
            <Badge variant="outline" className="border-white/15 bg-white/5 text-foreground/80">
              Backed by 300+ risk, trust & safety teams
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
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">The Background Intelligence Platform</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/70">
            PIP orchestrates social, telecom, court, and specialty data so investigators can instantly see ties, locations, and risk triggers for any person or business of interest.
          </p>
        </section>

        <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="relative mx-auto mb-5 w-full max-w-xl rounded-full bg-black/60 px-4 py-2 text-center text-sm font-medium text-foreground/80">
            Kick off a trace — pinpoint a person or business in under 60 seconds
          </div>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="e.g. Ahmed"
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
                placeholder="e.g. Ikenna"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
              <Select value={stateFilter} onValueChange={setStateFilter} disabled>
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
                Launch background sweep  <ArrowUpRight className="mr-1 h-3 w-3" />
              </Button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-foreground/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              Encrypted session
            </div>
            <p>Powered by the <span className="font-bold">Hex Forensics</span> Entity Graph.</p>
          </div>
        </section>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20">

        <section className="relative grid gap-6 rounded-xl border-t border-white/10 bg-gradient-to-r from-primary/20 to-emerald-500/20 p-6 text-left shadow-xl backdrop-blur-xl md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-primary/90">AI Orchestrator
              <Badge variant="secondary" className="bg-white/50 text-foreground ml-2">
                <BotIcon className=" mr-1 h-3.5 w-3.5" /> <span className="text-xs">New</span>
              </Badge>
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Spin up an AI-guided discovery</h2>
            <p className="mt-3 text-sm text-foreground/80">
              Let our Orchestrator triage datasets, summarize narratives, and surface red flags without leaving your investigation workspace.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 text-sm my-auto">
            
            {/* <Button variant="secondary" className="bg-background text-foreground">
              Run AI search now
            </Button> */}
            <Button variant="outline" className="border-white/40">
              See how the copilot works <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-white/5 bg-white/5 p-6 text-center text-foreground/80 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/60">Signal classes</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Camera, label: "Visual identifiers" },
              { icon: ScrollText, label: "Company filings" },
              { icon: School, label: "Academic credentials" },
              { icon: Landmark, label: "Deeds & assets" },
              { icon: Fingerprint, label: "Regulatory actions" },
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

        <section className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-sm font-semibold text-foreground/70">Why investigative teams pick Hex PIP</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{
              icon: Users,
              label: "Network intelligence",
              text: "Link charts across social, corporate, and telecom identities for faster attribution."
            }, {
              icon: ShieldCheck,
              label: "Audit-ready compliance",
              text: "Granular logging, least-privilege roles, and jurisdictional guardrails out of the box."
            }, {
              icon: History,
              label: "Deep history",
              text: "Corporate, court, and media archives stretching back 20+ years."
            }, {
              icon: Sparkles,
              label: "Narrative briefs",
              text: "AI-crafted storyboards translate raw entity data into action-ready briefs."
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

      <footer className="mx-auto mt-4 w-full max-w-7xl rounded-3xl border-t border-white/10 bg-black/10 px-6 py-10 text-sm text-foreground/80 backdrop-blur-2xl sm:px-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_repeat(2,0.8fr)] lg:grid-cols-[1.5fr_repeat(3,0.7fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/HEX-PI_logo.svg" alt="Hex PIP" className="h-10 w-10" />
              <div>
                <p className="text-base font-semibold text-foreground">Hex PIP</p>
                <p className="text-xs text-foreground/60">Investigative Intelligence Cloud</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/70">
              We fuse proprietary entity graphs, AI summarization, and analyst-grade telemetry so you can close diligence loops with fewer handoffs.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full border border-white/15 px-3 py-1">FCRA-aligned workflows</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Zero-trust controls</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/" className="hover:text-primary">Platform overview</Link>
              <Link to="/results" className="hover:text-primary">Sample results</Link>
              <Link to="/about" className="hover:text-primary">About the team</Link>
              <a href="#faq" className="hover:text-primary">FAQ</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <div className="mt-4 space-y-2">
              <a href="mailto:intel@hexforensics.com" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> intel@hexforensics.com
              </a>
              <a href="tel:+12125555555" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" /> +1 (212) 555-5555
              </a>
              <p className="flex items-center gap-2 text-foreground/60">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 24/7 breach watch
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="mt-4 flex gap-3">
              {[{ icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                { icon: Globe, label: "Research blog", href: "https://hexforensics.com" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-foreground/70 transition hover:border-primary/60 hover:text-primary"
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-foreground/60">
              Follow along for data sourcing releases, SOC updates, and investigation playbooks.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Hex Forensics Global. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="/privacy" className="hover:text-primary">Privacy</a>
            <a href="/terms" className="hover:text-primary">Terms</a>
            <a href="/security" className="hover:text-primary">Security</a>
            <span>Data residency: US &amp; EU</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
