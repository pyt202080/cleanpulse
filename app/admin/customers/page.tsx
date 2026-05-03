"use client";

import { useState } from "react";
import { Search, Phone, MapPin, Calendar, FileText, StickyNote } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
import { formatPhone, formatDate, formatRelative } from "@/lib/utils/format";

export default function CustomersPage() {
  const { users, bookings, clientNotes, staff, marketingConsents } = useStore();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.includes(search) ||
      u.phone.includes(search.replace(/-/g, "")) ||
      u.address.includes(search)
  );

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const userBookings = bookings.filter((b) => b.user_id === selectedUser);
  const userNotes = clientNotes.filter((n) => n.user_id === selectedUser);
  const userConsent = marketingConsents.find((c) => c.user_id === selectedUser);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">고객 관리</h1>
        <p className="text-sm text-slate-500 mt-1">고객 정보와 메모를 관리합니다</p>
      </div>

      <Input
        placeholder="이름, 전화번호, 주소로 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search size={18} />}
      />

      <div className="space-y-3">
        {filtered.map((user) => {
          const bookingCount = bookings.filter((b) => b.user_id === user.id).length;
          const noteCount = clientNotes.filter((n) => n.user_id === user.id).length;
          const consent = marketingConsents.find((c) => c.user_id === user.id);

          return (
            <Card key={user.id} hover onClick={() => setSelectedUser(user.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone size={10} />
                        {formatPhone(user.phone)}
                      </span>
                      <span>·</span>
                      <span>예약 {bookingCount}건</span>
                      {noteCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-amber-500">메모 {noteCount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {consent?.is_agreed && (
                    <Badge variant="brand" size="sm">마케팅 동의</Badge>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUserData ? `${selectedUserData.name} 고객 정보` : ""}
        size="lg"
      >
        {selectedUserData && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={14} className="text-brand-500" />
                {formatPhone(selectedUserData.phone)}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={14} className="text-brand-500" />
                {selectedUserData.address} {selectedUserData.detail_address}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar size={14} className="text-brand-500" />
                가입일: {formatDate(selectedUserData.created_at)}
              </div>
              {userConsent && (
                <Badge variant={userConsent.is_agreed ? "brand" : "default"} size="sm">
                  마케팅 {userConsent.is_agreed ? "동의" : "미동의"}
                </Badge>
              )}
            </div>

            {/* Notes */}
            {userNotes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                  <StickyNote size={14} />
                  직원 메모 ({userNotes.length})
                </h3>
                <div className="space-y-2">
                  {userNotes.map((note) => {
                    const writer = staff.find((s) => s.id === note.staff_id);
                    return (
                      <div key={note.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-sm text-slate-700">{note.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">
                            {writer?.name} · {formatRelative(note.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Booking History */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                <FileText size={14} />
                예약 이력 ({userBookings.length})
              </h3>
              <div className="space-y-2">
                {userBookings.length === 0 ? (
                  <p className="text-sm text-slate-400">예약 이력이 없습니다</p>
                ) : (
                  userBookings
                    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
                    .map((b) => {
                      const assignedStaff = staff.find((s) => s.id === b.staff_id);
                      return (
                        <div key={b.id} className="p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{formatDate(b.scheduled_at)}</span>
                            <Badge
                              variant={b.status === "완료" ? "success" : b.status === "취소" ? "danger" : "default"}
                              size="sm"
                            >
                              {b.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            담당: {assignedStaff?.name || "미배정"}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
