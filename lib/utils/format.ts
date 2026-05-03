// ============================================
// Format Utilities
// ============================================

import { format, formatDistanceToNow, differenceInCalendarDays } from "date-fns";
import { ko } from "date-fns/locale";

/** 전화번호 포맷: 01012345678 → 010-1234-5678 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/** 금액 포맷: 250000 → "250,000원" */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

/** 시간(분) 포맷: 240 → "4시간", 150 → "2시간 30분" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/** 날짜 포맷: "2026-05-03" → "2026년 5월 3일 (토)" */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "yyyy년 M월 d일 (E)", { locale: ko });
}

/** 시간 포맷: "2026-05-03T09:00:00Z" → "오전 9:00" */
export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), "a h:mm", { locale: ko });
}

/** 날짜+시간 포맷: "5월 3일 오전 9:00" */
export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "M월 d일 a h:mm", { locale: ko });
}

/** 상대 시간: "3시간 전", "어제" */
export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ko });
}

/** 평수 포맷: 32 → "32평" */
export function formatArea(size: number): string {
  return `${size}평`;
}

/** 거리 포맷: 3.45 → "3.5km" */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${Math.round(km * 10) / 10}km`;
}

/** 디데이 포맷: D-Day, D-1, D+2 */
export function formatDDay(dateStr: string): string {
  const targetDate = new Date(dateStr);
  const today = new Date();
  const diff = differenceInCalendarDays(targetDate, today);

  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}
