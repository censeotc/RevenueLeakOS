"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const routeLabels: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/opportunities": "Opportunities",
  "/app/calls": "Calls",
  "/app/estimates": "Estimates",
  "/app/reactivation": "Reactivation",
  "/app/campaigns": "Campaigns",
  "/app/contacts": "Contacts",
  "/app/reports": "Reports",
  "/app/templates": "Templates",
  "/app/integrations": "Integrations",
  "/app/settings": "Settings",
  "/app/demo-walkthrough": "Demo Walkthrough",
};

function getPageName(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];

  const matchingRoute = Object.entries(routeLabels).find(([route]) =>
    pathname.startsWith(route + "/")
  );
  if (matchingRoute) return matchingRoute[1];

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "Dashboard";
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Topbar() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Breadcrumb / Page name */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">{pageName}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  MR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Mike Reynolds</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Owner
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
