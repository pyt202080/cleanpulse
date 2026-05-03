"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, CheckCircle, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/Toast";

export default function StaffBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser, bookings, updateBookingStatus, addPhoto, users } = useStore();
  const bookingId = parseInt(id);
  const booking = bookings.find((b) => b.id === bookingId);
  const user = booking ? users.find((u) => u.id === booking.user_id) : null;

  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">예약을 찾을 수 없습니다</p>
      </div>
    );
  }

  const handleAddPhoto = (category: "before" | "after") => {
    // Mock photo — 실제로는 카메라/갤러리에서 가져와서 압축
    const mockUrl = `/mock/photo-${category}-${Date.now()}.jpg`;
    if (category === "before") {
      setBeforePhotos((prev) => [...prev, mockUrl]);
    } else {
      setAfterPhotos((prev) => [...prev, mockUrl]);
    }
    addPhoto({
      booking_id: bookingId,
      staff_id: currentUser!.id,
      url: mockUrl,
      category,
    });
    toast(`${category === "before" ? "Before" : "After"} 사진이 추가되었습니다`);
  };

  const handleComplete = () => {
    updateBookingStatus(bookingId, "완료");
    toast("작업이 완료 처리되었습니다! 🎉");
    router.push("/staff/schedule");
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
      >
        <ArrowLeft size={16} /> 돌아가기
      </button>

      <div>
        <h1 className="text-xl font-extrabold text-slate-900">작업 보고</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {user?.name} · {booking.address}
        </p>
      </div>

      {/* Before Photos */}
      <Card>
        <h2 className="text-sm font-bold text-slate-700 mb-3">📸 Before 사진</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {beforePhotos.map((url, i) => (
            <div key={i} className="aspect-square bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
              Before {i + 1}
            </div>
          ))}
        </div>
        <Button
          fullWidth
          size="lg"
          variant="outline"
          onClick={() => handleAddPhoto("before")}
          icon={<Camera size={18} />}
        >
          Before 사진 추가
        </Button>
      </Card>

      {/* After Photos */}
      <Card>
        <h2 className="text-sm font-bold text-slate-700 mb-3">✨ After 사진</h2>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {afterPhotos.map((url, i) => (
            <div key={i} className="aspect-square bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 text-xs">
              After {i + 1}
            </div>
          ))}
        </div>
        <Button
          fullWidth
          size="lg"
          variant="outline"
          onClick={() => handleAddPhoto("after")}
          icon={<Camera size={18} />}
        >
          After 사진 추가
        </Button>
      </Card>

      {/* Complete Button */}
      <Button
        fullWidth
        size="xl"
        onClick={handleComplete}
        icon={<CheckCircle size={20} />}
      >
        작업 완료 처리
      </Button>
    </div>
  );
}
