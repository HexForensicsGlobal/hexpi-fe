import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { QuickActions } from "@/components/QuickActions";
import { InfoCards } from "@/components/InfoCards";
import Header from "@/components/Header";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative overflow-hidden" style={{ backgroundImage: "url('/aurura_bg.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        
        <AppSidebar />
        
        <Header />
        
        <main className="flex-1 relative pt-14">
          {/* Blurred background with tint */}
          <div className="absolute inset-0" style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.6)" }}></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-[calc(100vh-3.5rem)] p-8">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center mb-12">
                {/* Greeting */}
                {/* <h1 className="text-5xl font-semibold font-serif text-foreground mb-4">
                  Good morning, Nuel
                </h1> */}
                <p className="text-3xl text-foreground/90">
                  What are we looking for today?
                </p>
              </div>

              <SearchBar />
              <QuickActions />
              {/* <InfoCards /> */}
            </div>
            
            {/* Footer */}
            <div className="text-center space-y-2 mt-12 ">
              {/* <p className="text-xs text-muted-foreground">
              Hex PIP uses AI and may make mistakes. Please verify important information.
              </p> */}
              <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Hex Forensics. All rights reserved.
              </p>
            </div>
          </div>

        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
