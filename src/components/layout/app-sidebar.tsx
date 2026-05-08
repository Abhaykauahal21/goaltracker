"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Map,
  Calendar,
  BarChart3,
  Trophy,
  Settings,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Roadmaps",
    url: "/roadmaps",
    icon: Map,
  },
  {
    title: "Daily Planner",
    url: "/planner",
    icon: Clock,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Trophy,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <CheckCircle2 size={24} />
          </div>
          <span className="group-data-[collapsible=icon]:hidden">GoalTracker</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="New Roadmap">
                  <PlusCircle />
                  <span>New Roadmap</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <UserButton />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">My Account</span>
            <span className="text-xs text-muted-foreground">Settings & Profile</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
