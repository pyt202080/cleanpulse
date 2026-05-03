"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, StickyNote, User } from "lucide-react";
import { useStore } from "@/lib/store";
import ToastContainer from "@/components/ui/Toast";

const tabs = [
  { href: "/staff/schedule", label: "일정", icon: CalendarDays },
  { href: "/staff/notes", label: "메모", icon: StickyNote },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useStore();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else if (currentUser.role !== "staff") {
      router.push("/admin/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "staff") return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top bar */}
      <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
            {currentUser.name[0]}
          </div>
          <span className="text-sm font-bold text-slate-900">{currentUser.name}</span>
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="h-16 bg-white border-t border-slate-100 flex items-center shrink-0 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                transition-colors
                ${isActive ? "text-brand-600" : "text-slate-400"}
              `}
            >
              <tab.icon size={22} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <ToastContainer />
    </div>
  );
}
