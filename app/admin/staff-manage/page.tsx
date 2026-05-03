"use client";

import { useState } from "react";
import { UserPlus, Phone, UserCheck, UserX } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
import { formatPhone, formatRelative } from "@/lib/utils/format";
import { toast } from "@/components/ui/Toast";

export default function StaffManagePage() {
  const { staff, addStaff, toggleStaffActive, updateStaffStatus } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const staffMembers = staff.filter((s) => s.role === "staff");
  const active = staffMembers.filter((s) => s.is_active);
  const inactive = staffMembers.filter((s) => !s.is_active);

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      toast("이름과 전화번호를 입력해주세요", "error");
      return;
    }
    addStaff({
      auth_user_id: `staff-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      role: "staff",
      status: "퇴근",
      last_lat: 36.35,
      last_lng: 127.38,
      location_updated_at: new Date().toISOString(),
      is_active: true,
    });
    toast(`${name} 직원이 등록되었습니다`);
    setIsModalOpen(false);
    setName("");
    setPhone("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">직원 관리</h1>
          <p className="text-sm text-slate-500 mt-1">직원 등록 및 상태를 관리합니다</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<UserPlus size={18} />}>
          직원 등록
        </Button>
      </div>

      {/* Active */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          재직 중 ({active.length})
        </h2>
        <div className="space-y-3">
          {active.map((s) => (
            <Card key={s.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone size={10} />
                        {formatPhone(s.phone)}
                      </span>
                      <span>·</span>
                      <span>위치 갱신: {formatRelative(s.location_updated_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={s.status === "대기중" ? "success" : s.status === "작업중" ? "info" : "default"}
                    dot
                    size="sm"
                  >
                    {s.status}
                  </Badge>
                  <button
                    onClick={() => toggleStaffActive(s.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="퇴사 처리"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive */}
      {inactive.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            퇴사 ({inactive.length})
          </h2>
          <div className="space-y-2">
            {inactive.map((s) => (
              <Card key={s.id} padding="sm" className="opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400">
                      {s.name[0]}
                    </div>
                    <div className="text-sm text-slate-500 line-through">{s.name}</div>
                  </div>
                  <button
                    onClick={() => toggleStaffActive(s.id)}
                    className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                    title="복직 처리"
                  >
                    <UserCheck size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="직원 등록">
        <div className="space-y-4">
          <Input label="이름" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="전화번호" placeholder="010-0000-0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <p className="text-xs text-slate-400">
            * Supabase 연동 후 로그인 계정이 자동 생성됩니다
          </p>
          <Button fullWidth size="lg" onClick={handleAdd}>
            등록하기
          </Button>
        </div>
      </Modal>
    </div>
  );
}
