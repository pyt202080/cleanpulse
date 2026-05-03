"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, staff } = useStore();
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");

  const activeStaff = staff.filter((s) => s.is_active);

  const handleLogin = () => {
    if (!selectedId) {
      setError("계정을 선택해주세요");
      return;
    }
    const success = login(selectedId);
    if (success) {
      const user = activeStaff.find((s) => s.auth_user_id === selectedId);
      if (user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/staff/schedule");
      }
    } else {
      setError("로그인에 실패했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-brand flex items-center justify-center mb-4">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Clean Pulse
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            직원 / 관리자 로그인
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs text-slate-400 mb-4 text-center">
            ⚡ Supabase 연동 전 — 아래에서 계정을 선택해주세요
          </p>

          <div className="space-y-2 mb-4">
            {activeStaff.map((s) => (
              <button
                key={s.auth_user_id}
                onClick={() => {
                  setSelectedId(s.auth_user_id);
                  setError("");
                }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left
                  transition-all duration-200 cursor-pointer
                  ${
                    selectedId === s.auth_user_id
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:border-slate-300"
                  }
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      s.role === "admin"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-brand-100 text-brand-700"
                    }
                  `}
                >
                  {s.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-400">
                    {s.role === "admin" ? "👑 관리자" : "🧹 직원"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mb-3">{error}</p>
          )}

          <Button fullWidth size="lg" onClick={handleLogin} icon={<LogIn size={18} />}>
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
