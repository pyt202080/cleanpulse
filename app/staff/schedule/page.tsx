"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Clock, ChevronRight, Navigation, Phone, AlertCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatTime, formatDuration, formatDate } from "@/lib/utils/format";

export default function StaffSchedule() {
  const { currentUser, bookings, users, bookingServices, services, clientNotes, updateBookingStatus } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const myBookings = bookings
    .filter((b) => b.staff_id === currentUser?.id && b.scheduled_at.startsWith(today))
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const statusVariant: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
    "대기": "warning", "확정": "info", "작업중": "info", "완료": "success", "취소": "danger",
  };

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    updateBookingStatus(bookingId, newStatus as "확정" | "작업중" | "완료");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">오늘의 일정</h1>
        <p className="text-sm text-slate-500 mt-0.5">{formatDate(new Date().toISOString())}</p>
      </div>

      {myBookings.length === 0 ? (
        <Card className="text-center py-12">
          <Clock size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">오늘 배정된 일정이 없습니다</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {myBookings.map((booking) => {
            const user = users.find((u) => u.id === booking.user_id);
            const bServices = bookingServices
              .filter((bs) => bs.booking_id === booking.id)
              .map((bs) => services.find((s) => s.id === bs.service_id)?.name)
              .filter(Boolean);
            const notes = clientNotes.filter((n) => n.user_id === booking.user_id);
            const hasWarning = notes.some((n) => n.tags.some((t) => ["주의", "예민", "블랙리스트", "강아지"].includes(t)));

            return (
              <Card key={booking.id} className="!p-0 overflow-hidden">
                {/* Status bar */}
                <div className={`
                  px-4 py-2 flex items-center justify-between
                  ${booking.status === "작업중" ? "bg-brand-600 text-white" : "bg-slate-50"}
                `}>
                  <span className="text-lg font-bold">
                    {formatTime(booking.scheduled_at)}
                  </span>
                  <Badge variant={statusVariant[booking.status]} dot>
                    {booking.status}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  {/* Customer & Address */}
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{user?.name}</div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                      <MapPin size={14} className="text-brand-500 shrink-0" />
                      {booking.address} {booking.detail_address}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5">
                    {bServices.map((name) => (
                      <span key={name} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg font-medium">
                        {name}
                      </span>
                    ))}
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      {booking.area_size}평 · {formatDuration(booking.estimated_duration)}
                    </span>
                  </div>

                  {/* Warning Notes */}
                  {hasWarning && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-700">
                        {notes.slice(0, 2).map((n) => (
                          <div key={n.id} className="mb-1">
                            <span className="font-bold">[{n.tags.join(", ")}]</span> {n.content.slice(0, 60)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Request */}
                  {booking.customer_request && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                      📝 {booking.customer_request}
                    </div>
                  )}

                  {/* Action Buttons - 큰 터치 타겟 */}
                  <div className="flex gap-2 pt-1">
                    {/* 내비게이션 버튼 */}
                    <Button
                      size="lg"
                      variant="outline"
                      fullWidth
                      icon={<Navigation size={18} />}
                      onClick={() => {
                        const encoded = encodeURIComponent(booking.address);
                        window.open(`https://map.kakao.com/link/to/${encoded},${booking.lat},${booking.lng}`, "_blank");
                      }}
                    >
                      길찾기
                    </Button>

                    {/* 전화 버튼 */}
                    <a href={`tel:${user?.phone}`} className="shrink-0">
                      <Button size="lg" variant="secondary" icon={<Phone size={18} />}>
                        전화
                      </Button>
                    </a>
                  </div>

                  {/* Status Change */}
                  <div className="flex gap-2">
                    {booking.status === "확정" && (
                      <Button
                        fullWidth
                        size="xl"
                        onClick={() => handleStatusChange(booking.id, "작업중")}
                      >
                        🧹 작업 시작
                      </Button>
                    )}
                    {booking.status === "작업중" && (
                      <Link href={`/staff/booking/${booking.id}`} className="w-full">
                        <Button fullWidth size="xl" variant="secondary">
                          📸 사진 보고 & 완료
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
