import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, Home, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 border-border/30">
      {/* logo */}
      <div className="flex items-center gap-3 mr-4">
        <img
          src="/HEX-PI_logo.svg"
          alt="Hex PIP logo"
          className="w-8 h-8  object-contain"
        />
          {/* <h2 className="text-sm font-semibold font-serif text-foreground">Hex PIP</h2> */}
      </div>

      <SidebarTrigger className="text-foreground">
      </SidebarTrigger>

      <Button variant="ghost" size="icon">
        <Home className="w-5 h-5" />
      </Button>

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