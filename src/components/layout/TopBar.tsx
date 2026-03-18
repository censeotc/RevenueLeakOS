import { useState } from "react";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { demoAlerts } from "@/data/seed";

export function TopBar() {
  const { user, logout, businessName } = useAuth();
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const unreadCount = demoAlerts.filter((a) => !a.read).length;

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div className="text-sm text-gray-500">{businessName}</div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setShowAlerts(!showAlerts); setShowMenu(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-80 overflow-y-auto">
              <div className="px-3 py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase">Alerts</span>
              </div>
              {demoAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-3 py-2.5 hover:bg-gray-50 cursor-pointer ${!alert.read ? "bg-primary-50/50" : ""}`}
                >
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowMenu(!showMenu); setShowAlerts(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold">
              {user?.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
