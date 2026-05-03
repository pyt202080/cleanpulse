"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  FileText,
  ChevronRight,
  CheckCircle,
  User,
  Phone,
  Plus,
  Minus,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { formatPrice, formatDuration } from "@/lib/utils/format";
import DaumPostcodeEmbed from "react-daum-postcode";
import Modal from "@/components/ui/Modal";
import { getCoordinates } from "@/app/actions/kakao";

export default function BookingPage() {
  const router = useRouter();
  const { services, addOrGetUser, addBooking, setMarketingConsent } = useStore();
  const activeServices = services.filter((s) => s.is_active);

  const [step, setStep] = useState(1);

  // Step 1: 연락처
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: 주소
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [postcodeHeight, setPostcodeHeight] = useState(450);

  // Step 3: 서비스 선택
  const [selectedServices, setSelectedServices] = useState<
    { serviceId: number; quantity: number }[]
  >([]);

  // Step 4: 날짜 & 요청사항
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [areaSize, setAreaSize] = useState("");
  const [request, setRequest] = useState("");
  const [marketingAgree, setMarketingAgree] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.serviceId === serviceId);
      if (exists) {
        return prev.filter((s) => s.serviceId !== serviceId);
      }
      return [...prev, { serviceId, quantity: 1 }];
    });
  };

  const updateQuantity = (serviceId: number, delta: number) => {
    setSelectedServices((prev) =>
      prev.map((s) =>
        s.serviceId === serviceId
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      )
    );
  };

  const totalPrice = selectedServices.reduce((sum, s) => {
    const service = activeServices.find((svc) => svc.id === s.serviceId);
    return sum + (service?.base_price || 0) * s.quantity;
  }, 0);

  const totalDuration = selectedServices.reduce((sum, s) => {
    const service = activeServices.find((svc) => svc.id === s.serviceId);
    return sum + (service?.estimated_minutes || 0) * s.quantity;
  }, 0);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = "이름을 입력해주세요";
      if (!phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
      else if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone.replace(/-/g, "")))
        newErrors.phone = "올바른 전화번호를 입력해주세요";
    }

    if (currentStep === 2) {
      if (!address.trim()) newErrors.address = "주소를 입력해주세요";
    }

    if (currentStep === 3) {
      if (selectedServices.length === 0) newErrors.services = "서비스를 선택해주세요";
    }

    if (currentStep === 4) {
      if (!date) newErrors.date = "날짜를 선택해주세요";
      if (!areaSize) newErrors.areaSize = "평수를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePostcodeResize = (size: { width: number; height: number }) => {
    setPostcodeHeight(size.height);
  };

  const handleAddressComplete = async (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "")
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
    setIsAddressModalOpen(false);

    // 좌표 변환 (서버 액션 호출)
    const coords = await getCoordinates(fullAddress);
    if (coords) {
      setLat(coords.lat);
      setLng(coords.lng);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;

    const finalLat = lat !== null ? lat : 36.35 + Math.random() * 0.05;
    const finalLng = lng !== null ? lng : 127.38 + Math.random() * 0.05;

    // Create or find user
    const userId = addOrGetUser({
      name,
      phone: phone.replace(/-/g, ""),
      address,
      detail_address: detailAddress,
      lat: finalLat,
      lng: finalLng,
    });

    // Set marketing consent
    setMarketingConsent(userId, marketingAgree);

    // Create booking
    const scheduledAt = `${date}T${time}:00Z`;
    addBooking(
      {
        user_id: userId,
        staff_id: null,
        address,
        detail_address: detailAddress,
        lat: finalLat,
        lng: finalLng,
        area_size: parseInt(areaSize) || 0,
        scheduled_at: scheduledAt,
        estimated_duration: totalDuration,
        final_duration: null,
        status: "대기",
        customer_request: request,
      },
      selectedServices.map((s) => {
        const service = activeServices.find((svc) => svc.id === s.serviceId)!;
        return {
          service_id: s.serviceId,
          quantity: s.quantity,
          price: service.base_price * s.quantity,
        };
      })
    );

    router.push("/booking/complete");
  };

  const stepTitles = ["연락처 정보", "주소 정보", "서비스 선택", "날짜 및 확인"];
  const stepDescriptions = [
    "예약 확인을 위한 연락처를 입력해주세요",
    "청소할 장소의 주소를 입력해주세요",
    "원하시는 서비스를 모두 선택해주세요",
    "희망 날짜와 시간을 선택해주세요",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={step > 1 ? "#" : "/"}
            onClick={(e) => {
              if (step > 1) {
                e.preventDefault();
                setStep(step - 1);
              }
            }}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-base font-bold text-slate-900">예약하기</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Dynamic Step Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-baseline gap-2 mb-1.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {stepTitles[step - 1]}
            </h2>
            <span className="text-lg font-bold text-brand-600">
              {step}<span className="text-slate-300 font-medium text-sm ml-0.5">/ 4</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {stepDescriptions[step - 1]}
          </p>
        </div>

        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in pb-24">
            <Input
              label="이름"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User size={18} />}
            />
            <Input
              label="전화번호"
              placeholder="010-1234-5678"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              hint="이 번호로 예약 조회가 가능합니다"
              icon={<Phone size={18} />}
            />
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in pb-24">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                주소
              </label>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-left
                  transition-all duration-200 cursor-pointer
                  ${
                    address
                      ? "border-brand-300 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }
                  ${errors.address ? "border-red-300" : ""}
                `}
              >
                {address ? (
                  <span className="flex items-center gap-2 text-slate-900">
                    <MapPin size={16} className="text-brand-500 shrink-0" />
                    {address}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-slate-400">
                    <MapPin size={16} className="shrink-0" />
                    클릭하여 주소를 검색하세요
                  </span>
                )}
              </button>
              {errors.address && (
                <p className="text-xs text-red-500 font-medium mt-1.5">
                  {errors.address}
                </p>
              )}
            </div>

            <Input
              label="상세 주소"
              placeholder="동/호수 (예: 101동 302호)"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>
        )}

        {/* Step 3: Service Selection */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in pb-24">
            {errors.services && (
              <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl">
                {errors.services}
              </p>
            )}

            <div className="space-y-3">
              {activeServices.map((service) => {
                const selected = selectedServices.find(
                  (s) => s.serviceId === service.id
                );
                return (
                  <Card
                    key={service.id}
                    padding="none"
                    className={`
                      transition-all duration-200 overflow-hidden
                      ${
                        selected
                          ? "border-brand-300 bg-brand-50/50 ring-1 ring-brand-200"
                          : "hover:border-slate-200"
                      }
                    `}
                  >
                    <div className="w-full p-4 flex items-center gap-3">
                      <button
                        onClick={() => toggleService(service.id)}
                        className="flex-1 flex items-center gap-3 text-left cursor-pointer min-w-0"
                      >
                        <div
                          className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                            transition-all duration-200
                            ${
                              selected
                                ? "border-brand-600 bg-brand-600"
                                : "border-slate-300"
                            }
                          `}
                        >
                          {selected && (
                            <CheckCircle size={14} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {service.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm text-slate-500">
                            <span className="font-semibold text-brand-600 whitespace-nowrap">
                              {formatPrice(service.base_price)}
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock size={12} />
                              {formatDuration(service.estimated_minutes)}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Quantity control */}
                      {selected && (
                        <div className="flex items-center gap-1.5 shrink-0 animate-fade-in">
                          <button
                            onClick={() => updateQuantity(service.id, -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer active:bg-slate-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 sm:w-6 text-center font-bold text-slate-900 text-sm sm:text-base">
                            {selected.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(service.id, 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer active:bg-slate-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Date & Confirmation */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in pb-24">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="예약 날짜"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
                icon={<CalendarDays size={18} />}
                min={new Date().toISOString().split("T")[0]}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  시간
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 11 }, (_, i) => i + 8).map((h) => (
                    <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                      {h > 12 ? `오후 ${h - 12}` : h === 12 ? "오후 12" : `오전 ${h}`}시
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="평수 (전용면적)"
              type="number"
              placeholder="32"
              value={areaSize}
              onChange={(e) => setAreaSize(e.target.value)}
              error={errors.areaSize}
              hint="예상 소요 시간 산정에 참고됩니다 (확정 아님)"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                요청사항 (선택)
              </label>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="특별히 신경 써주셨으면 하는 부분이 있다면 적어주세요"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none resize-none"
              />
            </div>

            {/* Summary */}
            <Card className="!bg-slate-50 !border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">
                예약 요약
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">이름</span>
                  <span className="font-medium text-slate-900">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">연락처</span>
                  <span className="font-medium text-slate-900">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">주소</span>
                  <span className="font-medium text-slate-900 text-right max-w-[60%]">
                    {address} {detailAddress}
                  </span>
                </div>
                <div className="border-t border-slate-200 my-2" />
                {selectedServices.map((s) => {
                  const service = activeServices.find(
                    (svc) => svc.id === s.serviceId
                  );
                  return (
                    <div key={s.serviceId} className="flex justify-between">
                      <span className="text-slate-500">
                        {service?.name}{" "}
                        {s.quantity > 1 && `x${s.quantity}`}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatPrice((service?.base_price || 0) * s.quantity)}
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-slate-200 my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">예상 총액</span>
                  <span className="text-brand-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">예상 소요시간</span>
                  <span className="font-medium text-slate-900">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                * 실제 금액과 소요시간은 현장 상황에 따라 변동될 수 있습니다.
              </p>
            </Card>

            {/* Marketing consent */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white cursor-pointer group">
              <input
                type="checkbox"
                checked={marketingAgree}
                onChange={(e) => setMarketingAgree(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <div>
                <span className="text-sm text-slate-700 font-medium group-hover:text-brand-600 transition-colors">
                  [선택] 마케팅 정보 수신 동의
                </span>
                <p className="mt-1 text-xs text-slate-400">
                  서비스 관련 할인 및 이벤트 정보를 문자로 받아보실 수 있습니다.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Global Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            {step === 3 ? (
              <>
                {selectedServices.length > 0 ? (
                  <div className="flex-1">
                    <div className="text-sm text-slate-500">
                      {selectedServices.length}개 서비스 ·{" "}
                      {formatDuration(totalDuration)}
                    </div>
                    <div className="text-lg font-bold text-brand-600">
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-slate-500 font-medium leading-tight">
                    서비스를<br />선택해주세요
                  </div>
                )}
                <Button size="lg" onClick={handleNext} disabled={selectedServices.length === 0}>
                  다음
                  <ChevronRight size={18} />
                </Button>
              </>
            ) : (
              <Button fullWidth size="lg" onClick={step === 4 ? handleSubmit : handleNext}>
                {step === 4 ? "예약 신청하기" : "다음"}
                {step !== 4 && <ChevronRight size={18} />}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="주소 검색"
        size="md"
        noPadding
      >
        <div 
          style={{ height: `${postcodeHeight}px` }} 
          className="w-full max-h-[70vh] transition-all duration-300 ease-in-out overflow-hidden"
        >
          <DaumPostcodeEmbed 
            onComplete={handleAddressComplete} 
            onResize={handlePostcodeResize}
            style={{ width: "100%", height: "100%" }} 
          />
        </div>
      </Modal>
    </div>
  );
}
