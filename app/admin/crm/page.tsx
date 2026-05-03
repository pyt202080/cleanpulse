"use client";

import { useState } from "react";
import { Megaphone, Copy, Check, Filter, Users, Calendar } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatPhone, formatDate, formatRelative } from "@/lib/utils/format";
import { generateCrmMessage, copyToClipboard } from "@/lib/utils/message-templates";
import { toast } from "@/components/ui/Toast";

export default function CrmPage() {
  const { users, bookings, marketingConsents } = useStore();
  const [monthsAgo, setMonthsAgo] = useState(6);
  const [copied, setCopied] = useState<number | null>(null);

  // 마케팅 동의 + 일정 기간 경과 고객 필터
  const consentedUserIds = marketingConsents
    .filter((c) => c.is_agreed)
    .map((c) => c.user_id);

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsAgo);

  const targets = consentedUserIds
    .map((userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return null;

      const userBookings = bookings
        .filter((b) => b.user_id === userId)
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

      const lastBooking = userBookings[0];
      if (!lastBooking) return null;

      const lastDate = new Date(lastBooking.scheduled_at);
      if (lastDate > cutoff) return null; // 최근 예약이 기준 내이면 제외

      return {
        user,
        lastBookingDate: lastBooking.scheduled_at,
        totalBookings: userBookings.length,
      };
    })
    .filter(Boolean) as { user: typeof users[0]; lastBookingDate: string; totalBookings: number }[];

  const handleCopy = async (userId: number) => {
    const target = targets.find((t) => t.user.id === userId);
    if (!target) return;

    const msg = generateCrmMessage(target.user, target.lastBookingDate);
    const success = await copyToClipboard(msg);
    if (success) {
      setCopied(userId);
      setTimeout(() => setCopied(null), 2000);
      toast("문자 문구가 복사되었습니다");
    }
  };

  const handleCopyAll = async () => {
    const allMessages = targets
      .map((t) => `[${t.user.name} / ${formatPhone(t.user.phone)}]\n${generateCrmMessage(t.user, t.lastBookingDate)}`)
      .join("\n\n---\n\n");

    const success = await copyToClipboard(allMessages);
    if (success) {
      toast(`${targets.length}명의 문구가 복사되었습니다`);
    }
  };

  const periods = [
    { months: 3, label: "3개월" },
    { months: 6, label: "6개월" },
    { months: 12, label: "1년" },
    { months: 24, label: "2년" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">CRM 마케팅</h1>
        <p className="text-sm text-slate-500 mt-1">
          마케팅 동의 고객 중 재방문 유도 대상을 추출합니다
        </p>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Filter size={16} className="text-brand-500" />
            마지막 예약 이후 경과 기간:
          </div>
          <div className="flex gap-2">
            {periods.map((p) => (
              <button
                key={p.months}
                onClick={() => setMonthsAgo(p.months)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
                  ${monthsAgo === p.months ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
                `}
              >
                {p.label}+
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-brand-500" />
          <span className="text-sm text-slate-600">
            대상 고객: <span className="font-bold text-brand-600">{targets.length}명</span>
          </span>
        </div>
        {targets.length > 0 && (
          <Button size="sm" variant="secondary" onClick={handleCopyAll} icon={<Copy size={14} />}>
            전체 문구 복사
          </Button>
        )}
      </div>

      {targets.length === 0 ? (
        <Card className="text-center py-10">
          <Megaphone size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            해당 기간 조건에 맞는 고객이 없습니다
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {targets.map((target) => (
            <Card key={target.user.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                    {target.user.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{target.user.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatPhone(target.user.phone)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        마지막: {formatRelative(target.lastBookingDate)}
                      </span>
                      <span>·</span>
                      <span>총 {target.totalBookings}건</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={copied === target.user.id ? "secondary" : "outline"}
                  onClick={() => handleCopy(target.user.id)}
                  icon={copied === target.user.id ? <Check size={14} /> : <Copy size={14} />}
                >
                  {copied === target.user.id ? "복사됨" : "문구 복사"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
