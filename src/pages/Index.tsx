import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full relative overflow-hidden bg-sidebar">
        <AppSidebar />
        <main className="flex-1 relative flex flex-col h-screen overflow-hidden rounded-2xl m-2 bg-fixed bg-[url('/aurura_bg.jpeg')] bg-cover bg-center bg-no-repeat">
          {/* Blurred background with tint */}
          <div className="absolute inset-0 backdrop-blur-[100px] bg-black/60"></div>
          <Header />
          
          {/* Canvas */}
          <div id="canvas" className="relative flex flex-col flex-1 overflow-y-auto">
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
