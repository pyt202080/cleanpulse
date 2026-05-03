"use client";

import { useState } from "react";
import { CalendarDays, List, MapPin, Clock, Filter, MessageSquare, Check, Copy } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatDate, formatTime, formatDuration, formatPrice, formatDDay } from "@/lib/utils/format";
import { 
  generateBookingReceiptMessage,
  generateBookingConfirmMessage, 
  generateReminderMessage,
  generateCompletionMessage, 
  copyToClipboard 
} from "@/lib/utils/message-templates";
import { toast } from "@/components/ui/Toast";

export default function BookingsPage() {
  const { bookings, users, staff, bookingServices, services, companySettings } = useStore();
  const [filter, setFilter] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null); // bookingId-type

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
  );

  const statusVariant: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
    "대기": "warning", "확정": "info", "작업중": "info", "완료": "success", "취소": "danger",
  };

  const statusDisplay: Record<string, string> = {
    "대기": "예약 배정 대기",
    "확정": "예약 확정",
    "작업중": "작업중",
    "완료": "작업 완료",
    "취소": "예약 취소",
  };

  const filters = [
    { key: "all", label: "전체" },
    { key: "대기", label: "배정 대기" },
    { key: "확정", label: "예약 확정" },
    { key: "작업중", label: "작업중" },
    { key: "완료", label: "작업 완료" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">예약 관리</h1>
        <p className="text-sm text-slate-500 mt-1">모든 예약을 관리합니다</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap
              transition-all duration-200 cursor-pointer
              ${filter === f.key ? "bg-brand-600 text-white" : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"}
            `}
          >
            {f.label}
            {f.key !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                {bookings.filter((b) => b.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {sorted.map((booking) => {
          const user = users.find((u) => u.id === booking.user_id);
          const assignedStaff = staff.find((s) => s.id === booking.staff_id);
          const bServices = bookingServices
            .filter((bs) => bs.booking_id === booking.id)
            .map((bs) => ({
              name: services.find((s) => s.id === bs.service_id)?.name,
              price: bs.price,
              quantity: bs.quantity,
            }));
          const totalPrice = bServices.reduce((sum, s) => sum + s.price, 0);

          const handleCopyMessage = async (type: "receipt" | "confirm" | "reminder" | "completion") => {
            if (!user) {
              toast("고객 정보가 없습니다");
              return;
            }

            let msg = "";
            const detailedServices = bServices.map(bs => ({
              name: bs.name!,
              quantity: bs.quantity,
              price: bs.price
            }));

            const fullDetailedServices = bServices.map(bs => ({
              service: services.find(s => s.name === bs.name)!,
              quantity: bs.quantity,
              price: bs.price
            })).filter(s => s.service);

            try {
              switch (type) {
                case "receipt":
                  msg = generateBookingReceiptMessage(booking, user, detailedServices);
                  break;
                case "confirm":
                  msg = generateBookingConfirmMessage(booking, user, assignedStaff, fullDetailedServices);
                  break;
                case "reminder":
                  msg = generateReminderMessage(booking, user, assignedStaff, fullDetailedServices);
                  break;
                case "completion":
                  msg = generateCompletionMessage(user, totalPrice, companySettings?.bankAccount);
                  break;
              }

              const success = await copyToClipboard(msg);
              if (success) {
                setCopiedKey(`${booking.id}-${type}`);
                setTimeout(() => setCopiedKey(null), 2000);
                toast("문구가 복사되었습니다");
              }
            } catch (err: any) {
              toast(err.message || "오류가 발생했습니다");
            }
          };

          const msgButtons = [
            { type: "receipt" as const, label: "신청", icon: MessageSquare },
            { type: "confirm" as const, label: "확정", icon: Check },
            { type: "reminder" as const, label: "리마인드", icon: Copy },
            { type: "completion" as const, label: "완료", icon: List },
          ];

          return (
            <Card key={booking.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[booking.status]} dot>
                    {statusDisplay[booking.status]}
                  </Badge>
                  <span className="text-xs text-slate-400">#{booking.id}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {msgButtons.map((btn) => {
                    const isCopied = copiedKey === `${booking.id}-${btn.type}`;
                    const Icon = btn.icon;
                    return (
                      <Button 
                        key={btn.type}
                        size="xs" 
                        variant={isCopied ? "secondary" : "outline"}
                        onClick={() => handleCopyMessage(btn.type)}
                        className="px-2 h-7 text-[10px] sm:text-xs"
                      >
                        {isCopied ? "복사됨" : (
                          <span className="flex items-center gap-1">
                            <Icon size={12} />
                            {btn.label}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900">{user?.name}</div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CalendarDays size={14} className="text-brand-400 shrink-0" />
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-600">
                        {formatDDay(booking.scheduled_at)}
                      </span>
                      <span>
                        {formatDate(booking.scheduled_at)} {formatTime(booking.scheduled_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={14} className="text-brand-400 shrink-0" />
                    <span className="line-clamp-1">
                      {booking.address} {booking.detail_address}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} className="text-brand-400" />
                    {formatDuration(booking.estimated_duration)} · {booking.area_size}평
                  </div>
                  <div className="text-slate-500">
                    담당: {assignedStaff?.name || <span className="text-amber-500">미배정</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bServices.map((s, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {s.name}{s.quantity > 1 ? ` x${s.quantity}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {booking.customer_request && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  📝 {booking.customer_request}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
