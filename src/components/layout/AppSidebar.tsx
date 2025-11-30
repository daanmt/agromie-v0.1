import { 
  LayoutDashboard, 
  Beef, 
  DollarSign, 
  Settings,
  Sprout,
  Activity
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Pecuária", url: "/pecuaria", icon: Beef },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Pastagens", url: "/pastagens", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-success" 
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground transition-all duration-200";

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r-2 border-border bg-sidebar shadow-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-sidebar-foreground">Gestão Rural</h2>
                <p className="text-base text-sidebar-foreground/70 font-medium">Simples</p>
              </div>
            </div>
          ) : (
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup className="px-4 pt-6">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "text-sidebar-foreground/70 font-semibold text-lg mb-4"}>
            Módulos Principais
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-16 text-lg font-semibold">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={isCollapsed ? item.title : undefined}
                      aria-label={`Ir para ${item.title}`}
                    >
                      <item.icon className={`h-7 w-7 ${isCollapsed ? "mx-auto" : "mr-4"}`} aria-hidden="true" />
                      {!isCollapsed && <span className="font-semibold">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom - disabled until route is implemented */}
        <div className="mt-auto p-4 border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="h-16 text-lg font-semibold opacity-50 cursor-not-allowed"
                disabled
                title="Configurações em breve"
              >
                <Settings className={`h-7 w-7 ${isCollapsed ? "mx-auto" : "mr-4"}`} aria-hidden="true" />
                {!isCollapsed && <span className="font-semibold">Configurações</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}