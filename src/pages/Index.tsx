import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { QuickActions } from "@/components/QuickActions";
import { InfoCards } from "@/components/InfoCards";
import { DecorativeElements } from "@/components/DecorativeElements";
import { Menu } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gradient-start via-background to-gradient-end relative overflow-hidden">
        <AppSidebar />
        
        <main className="flex-1 relative">
          <header className="h-14 flex items-center px-4 border-b border-border/30 backdrop-blur-sm">
            <SidebarTrigger className="text-foreground">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
          </header>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8">
            <div className="text-center mb-12">
              {/* decoration */}
              <div className="inline-block mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>

              {/* Greeting */}
              <h1 className="text-5xl font-semibold text-foreground mb-4">
                Good morning
              </h1>
              <p className="text-3xl text-foreground/90">
                What can I help you with today?
              </p>
            </div>

            <SearchBar />
            <QuickActions />
            {/* <InfoCards /> */}

            <div className="mt-12 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
              Hex PIP uses AI and may make mistakes. Please verify important information.
              </p>
              <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Hex Forensics. All rights reserved.
              </p>
            </div>
          </div>

          <DecorativeElements />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
