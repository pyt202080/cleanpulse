"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Search, MapPin, Clock, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useStore } from "@/lib/store";
import { formatDate, formatTime, formatPrice, formatDuration } from "@/lib/utils/format";

const statusVariant: Record<string, "default" | "info" | "warning" | "success" | "danger"> = {
  "대기": "warning",
  "확정": "info",
  "작업중": "brand" as "info",
  "완료": "success",
  "취소": "danger",
};

export default function LookupPage() {
  const { bookings, users, bookingServices, services, staff } = useStore();
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof bookings>([]);

  const handleSearch = () => {
    const cleaned = phone.replace(/-/g, "");
    const user = users.find((u) => u.phone.replace(/-/g, "") === cleaned);
    if (user) {
      const userBookings = bookings
        .filter((b) => b.user_id === user.id)
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
      setResults(userBookings);
    } else {
      setResults([]);
    }
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-base font-bold text-slate-900">예약 조회</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-900">예약 조회</h2>
          <p className="mt-1 text-sm text-slate-500">
            예약 시 사용한 전화번호로 조회하세요
          </p>
        </div>

        <div className="flex gap-3 mb-8 animate-fade-in stagger-1">
          <div className="flex-1">
            <Input
              placeholder="010-1234-5678"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone size={18} />}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button size="lg" onClick={handleSearch} icon={<Search size={18} />}>
            조회
          </Button>
        </div>

        {searched && results.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">
              해당 번호로 등록된 예약이 없습니다
            </p>
            <p className="mt-1 text-sm text-slate-400">
              전화번호를 다시 확인해주세요
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-slate-500">
              총 <span className="font-bold text-brand-600">{results.length}</span>건의 예약
            </p>
            {results.map((booking) => {
              const bServices = bookingServices
                .filter((bs) => bs.booking_id === booking.id)
                .map((bs) => ({
                  ...bs,
                  service: services.find((s) => s.id === bs.service_id),
                }));
              const assignedStaff = staff.find((s) => s.id === booking.staff_id);
              const totalPrice = bServices.reduce((sum, bs) => sum + bs.price, 0);

              return (
                <Card key={booking.id} hover>
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={statusVariant[booking.status] || "default"}
                      dot
                    >
                      {booking.status}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      #{booking.id}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={14} className="text-brand-500 shrink-0" />
                      {formatDate(booking.scheduled_at)} {formatTime(booking.scheduled_at)}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={14} className="text-brand-500 shrink-0" />
                      {booking.address} {booking.detail_address}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={14} className="text-brand-500 shrink-0" />
                      {formatDuration(booking.estimated_duration)}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {bServices.map((bs) => (
                        <span
                          key={bs.id}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {bs.service?.name}
                          {bs.quantity > 1 && ` x${bs.quantity}`}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {assignedStaff ? `담당: ${assignedStaff.name}` : "담당자 배정 중"}
                      </span>
                      <span className="font-bold text-brand-600 text-sm">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
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
