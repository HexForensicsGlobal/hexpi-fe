import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative overflow-hidden bg-fixed bg-[url('/aurura_bg.jpeg')] bg-cover bg-center bg-no-repeat">
        {/* Blurred background with tint */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/60"></div>
        
        <AppSidebar />
        <Header />
        
        <main className="flex-1 relative pt-16">
          
          {/* Canvas */}
          <div id="canvas" className="relative z-10 flex flex-col min-h-[calc(100vh-3.5rem)]">
            <Outlet />

            {/* Footer */}
            <div className="text-center space-y-2 mt-auto pb-4">
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
