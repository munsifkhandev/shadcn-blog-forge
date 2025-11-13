import { FileText, PlusCircle, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type DashboardPage = "posts" | "new-post" | "settings";

interface UserDashboardSidebarProps {
  activePage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
}

const menuItems = [
  { id: "posts" as DashboardPage, title: "My Posts", icon: FileText },
  { id: "new-post" as DashboardPage, title: "Create Post", icon: PlusCircle },
  { id: "settings" as DashboardPage, title: "Settings", icon: User },
];

export function UserDashboardSidebar({ activePage, onPageChange }: UserDashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-muted/50">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onPageChange(item.id)}
                    isActive={activePage === item.id}
                    className="hover:bg-background/50"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
