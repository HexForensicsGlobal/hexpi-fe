import { Sparkles, MessageSquare, Home, UserSearch, Wand, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const showDetails = !isCollapsed;
  
  const navigationTabs = [
    { id: "dashboard", title: "Dashboard", path: "/app", icon: Home },
    { id: "keyword", title: "Search", path: "/app/keyword-search", icon: UserSearch },
    { id: "ai", title: "AI Discovery", path: "/app/ai-search", icon: Sparkles },
    { id: "reports", title: "Reports", path: "/app/reports", icon: FileText },
    
  ];

  const recentConversations = [
    { id: 1, title: "Who is Morakinyo?", time: "Just now" },
  ];

  const recentlyVisited = [
    {
      id: "rv-1",
      title: "Search: Morakinyo",
      subtitle: "Keyword search • 3m ago",
      path: "/app/keyword-search?q=Morakinyo",
      type: "search",
    },
    {
      id: "rv-2",
      title: "Report: Incident-129",
      subtitle: "Report • 1d ago",
      path: "/app/reports/129",
      type: "report",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Link to="/" aria-label="HexPi Home">
            <img
              src="/HEX-PI_logo.svg"
              alt="Hex Pi logo"
              className={cn(
                "object-contain transition-all duration-200",
                isCollapsed ? "w-12 h-12" : "w-8 h-8"
              )}
            />
          </Link>
          {!isCollapsed && (
            <div>
              <p className="font-semibold text-sm text-foreground">HexPi</p>
              <p className="text-[10px] text-muted-foreground">Investigative Intelligence Suite</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        {/* Navigation Tabs */}
        <SidebarGroup className="">
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive =
                  tab.path === "/app"
                    ? location.pathname === "/app"
                    : location.pathname.startsWith(tab.path);
                return (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton 
                      className={`text-sidebar-foreground hover:bg-sidebar-accent ${isActive ? 'bg-sidebar-accent' : ''}`}
                      onClick={() => navigate(tab.path)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showDetails && (
          <>
            {/* Notifications */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm text-foreground">
                Notifications
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                      <Wand className="w-4 h-4" />
                      <span className="text-sm">Experimental AI initiatives</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                      <div className="flex items-start gap-2 w-full">
                        <FileText className="w-4 h-4 mt-0.5" aria-hidden="true" />
                        <div className="text-xs flex-1">
                          <div className="font-medium">Release notes</div>
                          <div className="text-muted-foreground">v1.2 — AI beta</div>
                        </div>
                        <span className="ml-auto inline-flex items-center rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          NEW
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Recently visited */}
            <SidebarGroup className="mt-2">
              <SidebarGroupLabel className="text-sm text-foreground mb-2">
                Recent
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {recentlyVisited.length === 0 ? (
                  <div className="text-xs text-muted-foreground px-3 py-2">
                    No recently visited pages.
                  </div>
                ) : (
                  <SidebarMenu>
                    {recentlyVisited.map((item) => {
                      const Icon = item.type === "report" ? FileText : UserSearch;
                      const isActive =
                        item.path === "/app"
                          ? location.pathname === "/app"
                          : location.pathname.startsWith(item.path);

                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            className={`text-sidebar-foreground hover:bg-sidebar-accent ${isActive ? "bg-sidebar-accent" : ""}`}
                            onClick={() => navigate(item.path)}
                          >
                            <Icon className="w-4 h-4" />
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-medium">{item.title}</span>
                              <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Query History */}
            <SidebarGroup className="mt-2">
              <SidebarGroupLabel className="text-sm text-foreground mb-2">
                Query History
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {recentConversations.length === 0 ? (
                  <div className="text-xs text-muted-foreground px-3 py-2">
                    Conversations with HexPI will be shown here.
                  </div>
                ) : (
                  <SidebarMenu>
                    {recentConversations.map((conv) => (
                      <SidebarMenuItem key={conv.id}>
                        <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                          <MessageSquare className="w-4 h-4" />
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-medium">{conv.title}</span>
                            <span className="text-xs text-muted-foreground">{conv.time}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Bottom tab group */}
        <div className="mt-auto border-t border-sidebar-border pt-4 space-y-2">
          <button
            className={cn(
              "flex items-center gap-2 text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors rounded px-3 py-2 w-full",
              isCollapsed && "mx-auto h-10 w-10 justify-center rounded-full p-0"
            )}
            aria-label="Sign in"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0">
              <path d="M17.7545 14.0002C18.9966 14.0002 20.0034 15.007 20.0034 16.2491V16.8245C20.0034 17.7188 19.6838 18.5836 19.1023 19.263C17.5329 21.0965 15.1457 22.0013 12.0004 22.0013C8.8545 22.0013 6.46849 21.0962 4.90219 19.2619C4.32242 18.583 4.00391 17.7195 4.00391 16.8267V16.2491C4.00391 15.007 5.01076 14.0002 6.25278 14.0002H17.7545ZM17.7545 15.5002H6.25278C5.83919 15.5002 5.50391 15.8355 5.50391 16.2491V16.8267C5.50391 17.3624 5.69502 17.8805 6.04287 18.2878C7.29618 19.7555 9.26206 20.5013 12.0004 20.5013C14.7387 20.5013 16.7063 19.7555 17.9627 18.2876C18.3117 17.8799 18.5034 17.361 18.5034 16.8245V16.2491C18.5034 15.8355 18.1681 15.5002 17.7545 15.5002ZM12.0004 2.00488C14.7618 2.00488 17.0004 4.24346 17.0004 7.00488C17.0004 9.76631 14.7618 12.0049 12.0004 12.0049C9.23894 12.0049 7.00036 9.76631 7.00036 7.00488C7.00036 4.24346 9.23894 2.00488 12.0004 2.00488ZM12.0004 3.50488C10.0674 3.50488 8.50036 5.07189 8.50036 7.00488C8.50036 8.93788 10.0674 10.5049 12.0004 10.5049C13.9334 10.5049 15.5004 8.93788 15.5004 7.00488C15.5004 5.07189 13.9334 3.50488 12.0004 3.50488Z" />
            </svg>
            {showDetails && <span>Sign in</span>}
          </button>

          <button
            className={cn(
              "flex items-center gap-2 text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors rounded px-3 py-2 w-full",
              isCollapsed && "mx-auto h-10 w-10 justify-center rounded-full p-0"
            )}
            aria-label="Support"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 shrink-0"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            {showDetails && <span>Support</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
