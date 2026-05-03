// ============================================
// Message Template Generator
// 시스템이 문구 생성 → 클립보드 복사 → 직원이 직접 전송
// ============================================

import { Booking, Staff, User, Service } from "@/lib/types/database";
import { formatDate, formatTime, formatDuration, formatPrice } from "./format";

/** 예약 신청 완료(접수) 시 고객에게 보낼 문구 */
export function generateBookingReceiptMessage(
  booking: Booking,
  user: User,
  services: { name: string; quantity: number; price: number }[]
): string {
  const serviceList = services
    .map((s) => `• ${s.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`)
    .join("\n");
  
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  return `[청소 잘하는 남자] 예약 신청이 완료되었습니다 📝

안녕하세요, ${user.name}님!
남겨주신 예약 신청이 성공적으로 접수되었습니다.

📅 일시: ${formatDate(booking.scheduled_at)} ${formatTime(booking.scheduled_at)}
📍 주소: ${booking.address} ${booking.detail_address}

🧹 신청 서비스:
${serviceList}
💰 예상 비용: ${formatPrice(totalPrice)}

담당 팀장님 배정 후 '예약 확정' 문자를 다시 한 번 보내드리겠습니다.
조금만 기다려 주세요! 🙏`;
}

/** 예약 확정 시 고객에게 보낼 문구 */
export function generateBookingConfirmMessage(
  booking: Booking,
  user: User,
  staff: Staff | undefined,
  services: { service: Service; quantity: number; price: number }[]
): string {
  const serviceList = services
    .map((s) => `• ${s.service.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`)
    .join("\n");

  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const staffName = staff ? staff.name : "배정중";
  const staffPhone = staff ? ` (${staff.phone})` : "";

  return `[청소 잘하는 남자] 예약이 확정되었습니다 ✨

안녕하세요, ${user.name}님!
담당 팀장이 배정되어 예약이 최종 확정되었습니다.

📅 일시: ${formatDate(booking.scheduled_at)} ${formatTime(booking.scheduled_at)}
📍 주소: ${booking.address} ${booking.detail_address}
👤 담당 기사: ${staffName} 팀장${staffPhone}

🧹 서비스:
${serviceList}

💰 예상 금액: ${formatPrice(totalPrice)}
⏱ 예상 소요: ${formatDuration(booking.estimated_duration)}

문의사항은 이 번호로 연락주세요.
감사합니다! 🙏`;
}

/** 예약 전날/당일 리마인드 문구 */
export function generateReminderMessage(
  booking: Booking,
  user: User,
  staff: Staff | undefined,
  services: { service: Service; quantity: number; price: number }[]
): string {
  const staffName = staff ? staff.name : "담당";
  const staffPhone = staff ? ` (${staff.phone})` : "";
  
  const serviceList = services
    .map((s) => `• ${s.service.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`)
    .join("\n");
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);

  return `[청소 잘하는 남자] 예약 리마인드 안내 🏠✨

안녕하세요, ${user.name}님!
내일 예약된 청소 서비스 관련하여 다시 한 번 안내드립니다.

📅 일시: ${formatDate(booking.scheduled_at)} ${formatTime(booking.scheduled_at)}
👤 담당 기사: ${staffName} 팀장${staffPhone}

🧹 서비스 내용:
${serviceList}
💰 결제 예정 금액: ${formatPrice(totalPrice)}

내일 방문 전 담당 기사님이 출발 전 다시 연락드릴 예정입니다.
원활한 주차 공간 확보를 부탁드립니다.

내일 뵙겠습니다! 감사합니다. 😊`;
}

/** 예약 배정 시 직원에게 보낼 문구 */
export function generateStaffAssignMessage(
  booking: Booking,
  user: User,
  services: { service: Service; quantity: number }[]
): string {
  const serviceList = services
    .map((s) => `• ${s.service.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`)
    .join("\n");

  return `[배정 알림] 새 작업이 배정되었습니다

📅 ${formatDate(booking.scheduled_at)} ${formatTime(booking.scheduled_at)}
📍 ${booking.address} ${booking.detail_address}
👤 고객: ${user.name}

🧹 작업:
${serviceList}

⏱ 예상: ${formatDuration(booking.estimated_duration)}
${booking.customer_request ? `\n📝 요청사항: ${booking.customer_request}` : ""}`;
}

/** 작업 완료 시 고객에게 보낼 문구 */
export function generateCompletionMessage(
  user: User,
  totalPrice: number,
  bankAccount: string
): string {
  return `[청소 잘하는 남자] 작업이 모두 완료되었습니다 ✅

안녕하세요, ${user.name}님!
요청하신 청소 작업이 성공적으로 완료되었습니다.

💰 최종 결제 금액: ${formatPrice(totalPrice)}
💳 입금 계좌: ${bankAccount}

이용해주셔서 진심으로 감사합니다.
서비스에 만족하셨다면 다음에도 찾아주세요! 😊

- 청소 잘하는 남자 드림`;
}

/** CRM 마케팅 재방문 유도 문구 */
export function generateCrmMessage(
  user: User,
  lastServiceDate: string
): string {
  return `[청소 잘하는 남자] ${user.name}님, 안녕하세요! 😊

마지막 이용일(${formatDate(lastServiceDate)}) 이후
오랜만에 인사드립니다.

🧹 깨끗한 공간이 그리우시다면
지금 예약하시면 재방문 고객 할인 혜택을 드려요!

📞 전화 또는 문자로 편하게 문의주세요.

- 청소 잘하는 남자
  공간의 가치를 높이다 ✨`;
}

/** 클립보드에 복사하는 함수 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
