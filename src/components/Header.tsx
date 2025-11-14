import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Settings, Home, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center border-border/30 pr-4">
      {/* Sidebar Header Section */}
      <div className="flex items-center gap-3 w-[14rem]">
        {/* logo */}
        <div className="flex items-center gap-3 pl-7 pt-4 text-experimental-green-foreground">
          <img
            src="/HEX-PI_logo.svg"
            alt="Hex PIP logo"
            className="w-10 h-10  object-contain"
          />
          {/* <h2 className="text-sm font-semibold font-serif text-experimental-green-foreground">Hex PIP</h2> */}
        </div>

        <div className="flex items-center ml-auto">
          <SidebarTrigger className="text-foreground">
          </SidebarTrigger>
          <Button variant="ghost" size="icon">
            <Home className="w-5 h-5" />
          </Button>
        </div>
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