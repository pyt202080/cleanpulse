"use client";

import { useState } from "react";
import { MapPin, UserCheck, Clock, Copy, Check, Navigation } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
import { haversineDistance } from "@/lib/utils/haversine";
import { formatTime, formatDuration, formatDistance } from "@/lib/utils/format";
import { generateBookingConfirmMessage, generateStaffAssignMessage, copyToClipboard } from "@/lib/utils/message-templates";
import { toast } from "@/components/ui/Toast";

export default function DispatchPage() {
  const { bookings, users, staff, services, bookingServices, assignStaff, updateStaffStatus } = useStore();
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const pendingBookings = bookings.filter((b) => b.status === "대기");
  const activeStaff = staff.filter((s) => s.role === "staff" && s.is_active && s.status !== "퇴근");

  const booking = pendingBookings.find((b) => b.id === selectedBooking);
  const user = booking ? users.find((u) => u.id === booking.user_id) : null;

  // Calculate distance for each staff member from selected booking
  const staffWithDistance = booking
    ? activeStaff
        .map((s) => ({
          staff: s,
          distance: haversineDistance(booking.lat, booking.lng, s.last_lat, s.last_lng),
        }))
        .sort((a, b) => a.distance - b.distance)
    : [];

  const nearbyStaff = staffWithDistance.filter((s) => s.distance <= 5);
  const farStaff = staffWithDistance.filter((s) => s.distance > 5);

  const handleAssign = async (staffId: number) => {
    if (!booking || !user) return;

    assignStaff(booking.id, staffId);
    updateStaffStatus(staffId, "대기중");

    const assignedStaff = staff.find((s) => s.id === staffId)!;
    const bServices = bookingServices
      .filter((bs) => bs.booking_id === booking.id)
      .map((bs) => {
        const svc = services.find((s) => s.id === bs.service_id)!;
        return { service: svc, quantity: bs.quantity, price: bs.price };
      });

    // Generate and copy customer message
    const msg = generateBookingConfirmMessage(booking, user, assignedStaff, bServices);
    const success = await copyToClipboard(msg);

    if (success) {
      toast("배정 완료! 고객 문자 문구가 클립보드에 복사되었습니다");
    } else {
      toast("배정 완료!", "info");
    }

    setSelectedBooking(null);
  };

  const handleCopyStaffMsg = async (staffId: number) => {
    if (!booking || !user) return;
    const bServices = bookingServices
      .filter((bs) => bs.booking_id === booking.id)
      .map((bs) => {
        const svc = services.find((s) => s.id === bs.service_id)!;
        return { service: svc, quantity: bs.quantity };
      });

    const msg = generateStaffAssignMessage(booking, user, bServices);
    const success = await copyToClipboard(msg);
    if (success) {
      setCopied(`staff-${staffId}`);
      setTimeout(() => setCopied(null), 2000);
      toast("직원 문자 문구가 복사되었습니다");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">스마트 배정 패널</h1>
        <p className="text-sm text-slate-500 mt-1">
          대기 중인 예약에 가장 가까운 직원을 배정하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Bookings */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            배정 대기 ({pendingBookings.length})
          </h2>

          {pendingBookings.length === 0 ? (
            <Card className="text-center py-10">
              <UserCheck size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">모든 예약이 배정되었습니다 🎉</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => {
                const bUser = users.find((u) => u.id === b.user_id);
                const bServices = bookingServices
                  .filter((bs) => bs.booking_id === b.id)
                  .map((bs) => services.find((s) => s.id === bs.service_id)?.name)
                  .filter(Boolean);

                return (
                  <Card
                    key={b.id}
                    hover
                    onClick={() => setSelectedBooking(b.id)}
                    className={selectedBooking === b.id ? "!border-brand-500 !bg-brand-50/50 ring-1 ring-brand-200" : ""}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-brand-600">{formatTime(b.scheduled_at)}</span>
                      <span className="text-xs text-slate-400">#{b.id}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{bUser?.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {b.address}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bServices.map((name) => (
                        <span key={name} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {name}
                        </span>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Staff Candidates */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            {selectedBooking ? "배정 가능 직원" : "예약을 선택하세요"}
          </h2>

          {!selectedBooking ? (
            <Card className="text-center py-10">
              <Navigation size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">좌측에서 예약을 선택하면</p>
              <p className="text-sm text-slate-500">가까운 직원이 표시됩니다</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Nearby (5km) */}
              {nearbyStaff.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1">
                    <MapPin size={12} /> 5km 이내
                  </div>
                  <div className="space-y-2">
                    {nearbyStaff.map(({ staff: s, distance }) => (
                      <Card key={s.id} padding="sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                              {s.name[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Badge variant={s.status === "대기중" ? "success" : "warning"} size="sm" dot>
                                  {s.status}
                                </Badge>
                                <span>{formatDistance(distance)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyStaffMsg(s.id)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              title="직원 문자 복사"
                            >
                              {copied === `staff-${s.id}` ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                            <Button size="sm" onClick={() => handleAssign(s.id)}>
                              배정
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Far */}
              {farStaff.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <MapPin size={12} /> 5km 초과
                  </div>
                  <div className="space-y-2">
                    {farStaff.map(({ staff: s, distance }) => (
                      <Card key={s.id} padding="sm" className="opacity-70">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                              {s.name[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-700 text-sm">{s.name}</div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Badge variant="default" size="sm" dot>
                                  {s.status}
                                </Badge>
                                <span>{formatDistance(distance)}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleAssign(s.id)}>
                            배정
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {staffWithDistance.length === 0 && (
                <Card className="text-center py-10">
                  <p className="text-sm text-slate-500">배정 가능한 직원이 없습니다</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
