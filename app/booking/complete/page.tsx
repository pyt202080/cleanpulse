"use client";

import Link from "next/link";
import { CheckCircle, Home, Phone, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function BookingCompletePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-20" />
          <div className="relative w-24 h-24 gradient-brand rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900">
          예약이 접수되었습니다!
        </h1>
        <p className="mt-3 text-slate-500 leading-relaxed">
          확인 후 담당자가 연락드릴 예정입니다.
          <br />
          전화번호로 예약 상태를 조회할 수 있습니다.
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/lookup">
            <Button fullWidth size="lg" icon={<Phone size={18} />}>
              예약 조회하기
            </Button>
          </Link>
          <Link href="/">
            <Button fullWidth size="lg" variant="outline" icon={<Home size={18} />}>
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Sparkles size={14} className="text-brand-400" />
          청소 잘하는 남자 — 공간의 가치를 높이다
        </div>
      </div>
    </div>
  );
}
