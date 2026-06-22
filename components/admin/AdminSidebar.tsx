"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Video, FileText, Megaphone, LogOut, Atom } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/notes", label: "Notes", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a1230] border-r border-blue-900/20 flex flex-col z-40">
      {/* Brand */}
      <div className="p-6 border-b border-blue-900/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "Outfit" }}>
              KPT <span className="text-orange-500">Admin</span>
            </div>
            <div className="text-[#7a8dbe] text-xs">Control Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-600/15 text-blue-400"
                  : "text-[#7a8dbe] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-900/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#7a8dbe] hover:text-red-400 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
