import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { QuickActions } from "@/components/QuickActions";
import { InfoCards } from "@/components/InfoCards";
import { DecorativeElements } from "@/components/DecorativeElements";
import { Button } from "@/components/ui/button";
import { Menu, Settings, Home } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative overflow-hidden" style={{ backgroundImage: "url('/snow_bg.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        
        <AppSidebar />
        
        <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 border-border/30">
          <div className="flex items-center gap-3 mr-4">
            <img
              src="/placeholder.svg"
              alt="Hex PIP logo"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <h2 className="text-sm font-semibold text-foreground">HEX PIP</h2>
          </div>

          <SidebarTrigger className="text-foreground">
          </SidebarTrigger>

          <Button variant="ghost" size="icon">
            <Home className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="ml-auto">
            <Settings className="w-5 h-5" />
          </Button>
        </header>
        
        <main className="flex-1 relative pt-14">
          <div className="absolute inset-0" style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.6)" }}></div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8">
            <div className="text-center mb-12">
              {/* decoration */}
              <div className="inline-block mb-2">
                {/* <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> */}
              </div>

              {/* Greeting */}
              {/* <h1 className="text-5xl font-semibold text-foreground mb-4">
                Good morning
              </h1>
              <p className="text-3xl text-foreground/90">
                What can I help you with today?
              </p> */}
            </div>

            <SearchBar />
            {/* <QuickActions /> */}
            {/* <InfoCards /> */}

            <div className="mt-12 text-center space-y-2">
              {/* <p className="text-xs text-muted-foreground">
              Hex PIP uses AI and may make mistakes. Please verify important information.
              </p> */}
              <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Hex Forensics. All rights reserved.
              </p>
            </div>
          </div>

          {/* <DecorativeElements /> */}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
