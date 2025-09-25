import { useState } from "react";
import { 
  LayoutDashboard, 
  Wheat, 
  Users, 
  CloudRain, 
  Package, 
  DollarSign, 
  QrCode,
  Calendar,
  Settings
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
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Gestão de Lavouras", url: "/lavouras", icon: Wheat },
  { title: "Gestão Pecuária", url: "/pecuaria", icon: Users },
  { title: "Clima & Seca", url: "/clima", icon: CloudRain },
  { title: "Insumos & Estoque", url: "/insumos", icon: Package },
  { title: "Financeiro Rural", url: "/financeiro", icon: DollarSign },
  { title: "Rastreabilidade", url: "/rastreabilidade", icon: QrCode },
  { title: "Agenda", url: "/agenda", icon: Calendar },
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
      : "hover:bg-accent hover:text-accent-foreground transition-all duration-200";

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r-2 border-border bg-card shadow-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-secondary">
        {/* Logo/Brand Section */}
        <div className="p-4 border-b border-border">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wheat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">AgroERP</h2>
                <p className="text-xs text-muted-foreground">Gestão Agrícola</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Wheat className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup className="px-2 pt-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "text-muted-foreground font-medium mb-2"}>
            Módulos Principais
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto p-2 border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-11">
                <NavLink 
                  to="/configuracoes" 
                  className={getNavCls}
                  title={isCollapsed ? "Configurações" : undefined}
                >
                  <Settings className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                  {!isCollapsed && <span className="font-medium">Configurações</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}