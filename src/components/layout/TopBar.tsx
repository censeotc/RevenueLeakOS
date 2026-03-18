"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function TopBar({ user }: TopBarProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500">
          <span className="text-slate-300">●</span>{" "}
          <span className="text-green-600 font-medium">Live</span>
          <span className="text-slate-400 ml-2">All systems operational</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition"
          >
            <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user.name ? getInitials(user.name) : "U"}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-800 leading-tight">
                {user.name ?? "User"}
              </p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
