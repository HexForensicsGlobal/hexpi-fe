import { FormEvent, useState } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Sparkles, Search, ArrowUpRight, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

const Header = () => {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const showQuickSearch = !location.pathname.startsWith("/app/ai-search");
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = quickQuery.trim();
    if (!trimmed) {
      return;
    }
    navigate("/app/ai-search", { state: { query: trimmed } });
  };
  return (
    <header className="w-full z-50 h-auto flex items-center backdrop-blur-md border-b border-white/10 bg-black/10 px-4 py-2">
      <div className="flex items-center">
        <SidebarTrigger className="text-foreground" />
      </div>
      
      {/* Quick Search */} 
      {showQuickSearch ? (
        <form onSubmit={handleQuickSearch} className="flex flex-1 justify-center px-4">
            <div className="flex w-full max-w-3xl items-center gap-2 py-auto">
            {/* Navigation badges */}
            <div className="px-6 py-4 m-auto">
              {/* Breadcrumb*/}
              <div className="flex items-center justify-between">
                {/* <div className="flex items-center gap-2 text-sm">
                  <Link to="/app" className="text-foreground/60 hover:text-foreground transition">
                    Dashboard
                  </Link>
                  <ChevronRight className="h-4 w-4 text-foreground/40" />
                  <span className="text-foreground font-medium">Keyword Search</span>
                </div> */}

                <div className="flex items-center gap-3 text-xs m-auto">
                  <Link to="/" className="text-primary hover:underline">
                    Back to Landing
                  </Link>
                  <Link to="https://hexforensics.com/" target="blank">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <ArrowUpRight className="mr-1 h-3 w-3" /> About Hex Forensics
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              <Input
                value={quickQuery}
                onChange={(event) => setQuickQuery(event.target.value)}
                placeholder="Live AI search..."
                className="h-10 w-full bg-white/5 border-white/10 pl-10 text-sm placeholder:text-foreground/60"
              />
            </div>
            {/* <Button type="submit" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Launch AI
            </Button> */}
          </div>
        </form>
      ) : (
        <div className="flex flex-1 ">
          <div className="px-6 py-4 m-auto">
            {/* Breadcrumb*/}
            <div className="flex items-center justify-between mb-4">
              {/* <div className="flex items-center gap-2 text-sm">
                <Link to="/app" className="text-foreground/60 hover:text-foreground transition">
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4 text-foreground/40" />
                <span className="text-foreground font-medium">Keyword Search</span>
              </div> */}

              <div className="flex items-center gap-3 text-xs m-auto">
                <Link to="/" className="text-primary hover:underline">
                  Back to Home
                </Link>
                <Link to="https://hexforensics.com/" target="blank">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <ArrowUpRight className="mr-1 h-3 w-3" /> About Hex Forensics
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notification and Settings */}
      <div className="ml-4 flex items-center">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;