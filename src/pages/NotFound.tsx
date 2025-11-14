import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const suggestions = [
    { label: "Run a new search", to: "/" },
    { label: "Review your history", to: "/results" },
    { label: "Learn about Hex PIP", to: "/about" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-black/70 to-black text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px] motion-safe:animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/4 rounded-full bg-sky-500/10 blur-[140px] motion-safe:animate-pulse-glow-delayed" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,222,191,0.15),_transparent_60%)] motion-safe:animate-pulse-glow" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl ">
        {/*className="motion-safe:animate-float" */}
          <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-foreground/70">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-foreground">
              <Compass className="h-4 w-4" />
            </span>
            Lost in the grid
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            We couldn't find that page.
          </h1>
          <p className="mt-4 text-base text-foreground/70 sm:text-lg">
            The link you followed may be broken or the page might have moved. Let's get you back to the right place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-white/30 text-foreground/80 hover:text-foreground sm:w-auto">
              <Link to="/about">Learn more about Hex PIP</Link>
            </Button>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-6">
            <p className="text-sm font-medium uppercase tracking-widest text-foreground/60">Try these instead</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {suggestions.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-foreground/80 transition hover:border-white/30 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-foreground/50">
            Error 404 · Request path: <span className="font-mono text-foreground/80">{location.pathname}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
