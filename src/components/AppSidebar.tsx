import { Sparkles, MessageSquare, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const recentConversations = [
    { id: 1, title: "How can PIP help me?", time: "Just now" },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/placeholder.svg"
              alt="Hex PIP logo"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">Hex PIP</h2>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">
            Labs
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Experimental AI initiatives</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">
            Check out what's new
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium">New modes, group chats,</div>
                      <div className="text-muted-foreground">better memory, and a face to talk to</div>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs text-muted-foreground mb-2">
            Conversation History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="text-xs text-muted-foreground px-3 py-2">
              Conversations with PIP will be shown here.
            </div>
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
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pt-8">
          <button className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <span>👤</span>
            <span>Sign in</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
