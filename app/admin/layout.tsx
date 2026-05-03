"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Users,
  Megaphone,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import ToastContainer from "@/components/ui/Toast";

const navItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "예약 관리", icon: CalendarDays },
  { href: "/admin/dispatch", label: "배정 패널", icon: MapPin },
  { href: "/admin/customers", label: "고객 관리", icon: Users },
  { href: "/admin/crm", label: "CRM 마케팅", icon: Megaphone },
  { href: "/admin/staff-manage", label: "직원 관리", icon: UserCog },
  { href: "/admin/settings", label: "서비스 설정", icon: Settings },
];

const mobileNavItems = [
  { href: "/admin/dashboard", label: "홈", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "예약", icon: CalendarDays },
  { href: "/admin/customers", label: "고객", icon: Users },
  { href: "/admin/settings", label: "설정", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else if (currentUser.role !== "admin") {
      router.push("/staff/schedule");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "admin") return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">Clean Pulse</span>
                <span className="block text-[10px] text-slate-400">관리자</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  <item.icon size={18} className={isActive ? "text-brand-600" : ""} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
                {currentUser.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-400">👑 관리자</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="ml-2 lg:ml-0 text-sm font-semibold text-slate-700">
            {navItems.find((i) => i.href === pathname)?.label || "관리자"}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around z-40 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-3 gap-1 ${
                isActive ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-brand-600" : ""} />
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <ToastContainer />
    </div>
  );
}
