import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, Home, Bell, Sparkles, ArrowRightToLine, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

const Header = () => {
  const { state } = useSidebar();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center backdrop-blur-[2px] border-border/30 p-4 mt-2">
      {/* Sidebar Header Section */}
      <div
        className={`flex items-center gap-3 transition-[width] duration-200 ease-linear`}
      >
        <div className={`flex items-center`}>
          <SidebarTrigger className="text-foreground">
          </SidebarTrigger>
        </div>

        <div className={`flex items-center gap-3 pt-4 text-experimental-green-foreground flex-shrink-0`}>
          {/* logo */}
          <Link to="/">
            <img
              src="/HEX-PI_logo.svg"
              alt="Hex PIP logo"
              className="w-10 h-10  object-contain"
            />
          </Link>
          {/* Page topic */}
          <div>
            {/* TO-DO: Adjust dynamically based on route or context */}
            <p className="font-semibold text-white">Keyword Search</p>
            <p className="text-xs text-foreground/60">Live intelligence workspace</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs ml-auto">
        <Link to="/" className="text-primary hover:underline">
          Back to Home
        </Link>
        <Link to="https://hexforensics.com/" target="blank">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <ArrowUpRight className="mr-1 h-3 w-3" /> About Hex Forensics
          </Badge>
        </Link>
      </div>

      <div className="ml-auto">
        <Button variant="ghost" size="icon" >
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