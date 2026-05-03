"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  Power,
  PowerOff,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
import { formatPrice, formatDuration } from "@/lib/utils/format";
import { toast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { services, addService, updateService, deleteService, companySettings, updateCompanySettings } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [price, setPrice] = useState("");

  const resetForm = () => {
    setName("");
    setMinutes("");
    setPrice("");
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    setName(service.name);
    setMinutes(service.estimated_minutes.toString());
    setPrice(service.base_price.toString());
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !minutes || !price) {
      toast("모든 항목을 입력해주세요", "error");
      return;
    }

    if (editingId) {
      updateService(editingId, {
        name: name.trim(),
        estimated_minutes: parseInt(minutes),
        base_price: parseInt(price),
      });
      toast("서비스가 수정되었습니다");
    } else {
      addService({
        name: name.trim(),
        estimated_minutes: parseInt(minutes),
        base_price: parseInt(price),
        is_active: true,
      });
      toast("서비스가 추가되었습니다");
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleToggle = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    updateService(id, { is_active: !service.is_active });
    toast(service.is_active ? "서비스가 비활성화되었습니다" : "서비스가 활성화되었습니다");
  };

  const activeServices = services.filter((s) => s.is_active);
  const inactiveServices = services.filter((s) => !s.is_active);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            서비스 설정
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            제공하는 청소 서비스를 관리합니다
          </p>
        </div>
        <Button onClick={openAdd} icon={<Plus size={18} />}>
          서비스 추가
        </Button>
      </div>

      {/* Company Settings */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          기본 설정
        </h2>
        <Card padding="md">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <Input
                label="정산 계좌 정보"
                placeholder="예: 신한은행 110-123-456789 (예금주: 홍길동)"
                value={companySettings.bankAccount}
                onChange={(e) => updateCompanySettings({ bankAccount: e.target.value })}
                hint="작업 완료 안내 문자 발송 시 고객에게 안내되는 계좌번호입니다."
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => toast("계좌 정보가 저장되었습니다.")}
            >
              저장
            </Button>
          </div>
        </Card>
      </div>

      {/* Active Services */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          활성 서비스 ({activeServices.length})
        </h2>
        <div className="space-y-3">
          {activeServices.map((service) => (
            <Card key={service.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <span className="text-brand-600 font-bold text-sm">
                      {service.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {service.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-brand-600">
                        {formatPrice(service.base_price)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDuration(service.estimated_minutes)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(service.id)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleToggle(service.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <PowerOff size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            비활성 서비스 ({inactiveServices.length})
          </h2>
          <div className="space-y-3">
            {inactiveServices.map((service) => (
              <Card key={service.id} padding="sm" className="opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-400 font-bold text-sm">
                        {service.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-500 line-through">
                        {service.name}
                      </div>
                      <div className="text-xs text-slate-400">비활성</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(service.id)}
                    className="p-2 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
                  >
                    <Power size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? "서비스 수정" : "서비스 추가"}
      >
        <div className="space-y-4">
          <Input
            label="서비스명"
            placeholder="예: 입주 청소"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="기준 소요시간 (분)"
            type="number"
            placeholder="240"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            hint="기준 소요시간입니다"
          />
          <Input
            label="기준 요금 (원)"
            type="number"
            placeholder="250000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            hint="기준 요금이며, 실제 금액은 현장에 따라 다를 수 있습니다"
          />
          <div className="pt-2">
            <Button fullWidth size="lg" onClick={handleSubmit}>
              {editingId ? "수정 완료" : "추가하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
