"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../assets/logos/logo_wo_text.png";
``;
export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [{ name: "Dashboard", href: "/dashboard" }];

  return (
    <Sidebar >
      <SidebarHeader className="w-full flex items-center ">
        <Image src={logo} alt="Logo" className="size-16" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav className="flex flex-col gap-2 p-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
