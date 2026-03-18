"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

interface AppTopbarProps {
  businessName?: string;
  userName?: string;
}

export function AppTopbar({ businessName = "Demo HVAC Pros", userName = "Mike Johnson" }: AppTopbarProps) {
  return (
    <header className="h-14 border-b border-slate-100 bg-white flex items-center px-4 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5 flex-1 max-w-sm">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search contacts, estimates..."
          className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none w-full"
        />
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <Bell className="h-4 w-4 text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* User menu */}
      <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          {userName.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium text-slate-900 leading-tight">{userName}</p>
          <p className="text-xs text-slate-400 leading-tight">{businessName}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
    </header>
  );
}
