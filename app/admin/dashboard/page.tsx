"use client";

import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { formatTime, formatPrice, formatRelative } from "@/lib/utils/format";

export default function AdminDashboard() {
  const { bookings, staff, users, bookingServices, services, payments } = useStore();

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) =>
    b.scheduled_at.startsWith(today)
  );

  const pending = todayBookings.filter((b) => b.status === "대기");
  const confirmed = todayBookings.filter((b) => b.status === "확정");
  const inProgress = todayBookings.filter((b) => b.status === "작업중");
  const completed = todayBookings.filter((b) => b.status === "완료");

  const activeStaff = staff.filter((s) => s.role === "staff" && s.is_active);
  const availableStaff = activeStaff.filter((s) => s.status === "대기중");
  const workingStaff = activeStaff.filter((s) => s.status === "작업중");

  const todayRevenue = payments
    .filter((p) => p.status === "완료" && p.paid_at?.startsWith(today))
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      label: "오늘 예약",
      value: todayBookings.length,
      suffix: "건",
      icon: CalendarDays,
      color: "text-brand-600",
      bg: "bg-brand-50",
    },
    {
      label: "배정 대기",
      value: pending.length,
      suffix: "건",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "작업 완료",
      value: completed.length,
      suffix: "건",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "가용 직원",
      value: availableStaff.length,
      suffix: `/${activeStaff.length}명`,
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
  ];

  const statusVariant: Record<string, "warning" | "info" | "success" | "danger" | "default"> = {
    "대기": "warning",
    "확정": "info",
    "작업중": "info",
    "완료": "success",
    "취소": "danger",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">대시보드</h1>
        <p className="text-sm text-slate-500 mt-1">
          오늘의 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className={`animate-fade-in stagger-${i + 1}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stat.value}
              <span className="text-sm font-medium text-slate-400 ml-0.5">
                {stat.suffix}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              배정 대기 예약
            </h2>
            <Link href="/admin/dispatch">
              <Button size="sm" variant="ghost" icon={<ArrowRight size={14} />}>
                배정 패널
              </Button>
            </Link>
          </div>

          {pending.length === 0 ? (
            <Card className="text-center py-10">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                모든 예약이 배정 완료되었습니다 🎉
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pending.map((booking) => {
                const user = users.find((u) => u.id === booking.user_id);
                const bServices = bookingServices
                  .filter((bs) => bs.booking_id === booking.id)
                  .map((bs) => services.find((s) => s.id === bs.service_id)?.name)
                  .filter(Boolean);

                return (
                  <Card key={booking.id} hover>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="warning" dot>배정 대기</Badge>
                          <span className="text-xs text-slate-400">
                            #{booking.id}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {user?.name} · {formatTime(booking.scheduled_at)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin size={12} />
                          {booking.address}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bServices.map((name) => (
                            <span
                              key={name}
                              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link href="/admin/dispatch">
                        <Button size="sm" variant="secondary">
                          배정하기
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Staff Status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">직원 현황</h2>
            <Link href="/admin/staff-manage">
              <Button size="sm" variant="ghost" icon={<ArrowRight size={14} />}>
                관리
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {activeStaff.map((s) => {
              const statusConfig: Record<string, { variant: "success" | "info" | "default"; label: string }> = {
                "대기중": { variant: "success", label: "대기중" },
                "작업중": { variant: "info", label: "작업중" },
                "퇴근": { variant: "default", label: "퇴근" },
              };
              const config = statusConfig[s.status] || statusConfig["퇴근"];

              return (
                <Card key={s.id} padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                      {s.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatRelative(s.location_updated_at)}
                      </div>
                    </div>
                    <Badge variant={config.variant} dot size="sm">
                      {config.label}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          오늘의 전체 일정
        </h2>
        {todayBookings.length === 0 ? (
          <Card className="text-center py-10">
            <CalendarDays size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">오늘 예약이 없습니다</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayBookings
              .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
              .map((booking) => {
                const user = users.find((u) => u.id === booking.user_id);
                const assignedStaff = staff.find((s) => s.id === booking.staff_id);
                const bServices = bookingServices
                  .filter((bs) => bs.booking_id === booking.id)
                  .map((bs) => services.find((s) => s.id === bs.service_id)?.name)
                  .filter(Boolean);

                return (
                  <Card key={booking.id} padding="sm" hover>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-600">
                        {formatTime(booking.scheduled_at)}
                      </span>
                      <Badge variant={statusVariant[booking.status]} size="sm">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin size={10} />
                      {booking.address}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {bServices.slice(0, 2).map((name) => (
                          <span key={name} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            {name}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400">
                        {assignedStaff?.name || "미배정"}
                      </span>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
