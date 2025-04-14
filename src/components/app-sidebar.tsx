import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router";
import { useCallback } from "react";
import { Home, Settings2 } from "lucide-react";

type Group = {
  title?: string;
  items: {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    url: string;
  }[];
};

type SidebarConfig = {
  navigation: Group[];
};

export const sidebarConfig: SidebarConfig = {
  navigation: [
    {
      items: [
        {
          title: "Home",
          icon: Home,
          url: "/",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          title: "App settings",
          icon: Settings2,
          url: "/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();

  const isActive = useCallback((url: string) => pathname === url, [pathname]);

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {sidebarConfig.navigation.map((item) => (
          <SidebarGroup key={item.title}>
            {item.title && <SidebarGroupLabel>{item.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
