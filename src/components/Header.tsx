import { FormEvent, useState } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Sparkles, Search, ArrowUpRight, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="w-full z-50">
      <header className="flex items-center backdrop-blur-md px-4 py-2">
        {/* Sidebar Toggle */}
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="text-foreground" />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs text-muted-foreground">
            Toggle Sidebar (Ctrl+B)
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Center content: navigation badges + optional quick search */}
      <div className="flex flex-1 justify-center px-4">
        <div className="flex w-full max-w-3xl items-center gap-2">
          {/* Navigation badges */}
          <div className="px-6 py-4 m-auto">
            <div className="flex items-center gap-3 text-xs">
              <Link to="/" className="text-primary hover:underline">
                Back to Landing
              </Link>
              <Link to="https://hexforensics.com/" target="_blank" rel="noreferrer">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <ArrowUpRight className="mr-1 h-3 w-3" /> About Hex Forensics
                </Badge>
              </Link>
            </div>
          </div>

          {/* Quick Search - conditionally rendered */}
          {showQuickSearch && (
            <form onSubmit={handleQuickSearch} className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              <Input
                value={quickQuery}
                onChange={(event) => setQuickQuery(event.target.value)}
                placeholder="Live AI search..."
                className="h-10 w-full bg-white/5 border-white/10 pl-10 text-sm placeholder:text-foreground/60"
              />
            </form>
          )}
        </div>
      </div>

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
    <hr className="mx-28 border-white/10" />
  </div>
  );
};

export default Header;