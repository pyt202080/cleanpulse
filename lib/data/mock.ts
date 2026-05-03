// ============================================
// Clean Pulse — Mock Data
// Supabase 연동 전까지 사용할 목업 데이터
// ============================================

import {
  User,
  Staff,
  Service,
  Booking,
  BookingService,
  Photo,
  ClientNote,
  MarketingConsent,
  Payment,
} from "@/lib/types/database";

// ── Services (관리자에서 CRUD 가능) ──────────────────────
export const mockServices: Service[] = [
  {
    id: 1,
    name: "입주 청소",
    estimated_minutes: 240,
    base_price: 250000,
    is_active: true,
  },
  {
    id: 2,
    name: "이사 청소",
    estimated_minutes: 210,
    base_price: 220000,
    is_active: true,
  },
  {
    id: 3,
    name: "에어컨 분해세척 (벽걸이)",
    estimated_minutes: 60,
    base_price: 80000,
    is_active: true,
  },
  {
    id: 4,
    name: "에어컨 분해세척 (스탠드)",
    estimated_minutes: 90,
    base_price: 120000,
    is_active: true,
  },
  {
    id: 5,
    name: "사무실 청소",
    estimated_minutes: 180,
    base_price: 300000,
    is_active: true,
  },
  {
    id: 6,
    name: "화장실 특수 청소",
    estimated_minutes: 120,
    base_price: 150000,
    is_active: true,
  },
  {
    id: 7,
    name: "바닥 왁스 코팅",
    estimated_minutes: 150,
    base_price: 200000,
    is_active: true,
  },
  {
    id: 8,
    name: "정기 청소 (월 1회)",
    estimated_minutes: 120,
    base_price: 100000,
    is_active: true,
  },
];

// ── Users ────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 1,
    name: "김민수",
    phone: "010-1234-5678",
    address: "대전 서구 둔산로 100",
    detail_address: "A아파트 301호",
    lat: 36.3504,
    lng: 127.3845,
    created_at: "2025-03-15T09:00:00Z",
  },
  {
    id: 2,
    name: "이서연",
    phone: "010-2345-6789",
    address: "대전 유성구 대학로 99",
    detail_address: "B빌라 201호",
    lat: 36.3622,
    lng: 127.3561,
    created_at: "2025-06-20T14:30:00Z",
  },
  {
    id: 3,
    name: "박준혁",
    phone: "010-3456-7890",
    address: "대전 동구 중앙로 200",
    detail_address: "C오피스텔 502호",
    lat: 36.3285,
    lng: 127.4275,
    created_at: "2025-09-01T11:00:00Z",
  },
  {
    id: 4,
    name: "최수정",
    phone: "010-4567-8901",
    address: "대전 중구 대종로 50",
    detail_address: "D아파트 1201호",
    lat: 36.3275,
    lng: 127.4014,
    created_at: "2024-12-10T16:00:00Z",
  },
  {
    id: 5,
    name: "정하린",
    phone: "010-5678-9012",
    address: "대전 대덕구 신탄진로 300",
    detail_address: "E아파트 805호",
    lat: 36.4220,
    lng: 127.4133,
    created_at: "2025-01-05T10:00:00Z",
  },
];

// ── Staff ────────────────────────────────────────────────
export const mockStaff: Staff[] = [
  {
    id: 1,
    auth_user_id: "admin-001",
    name: "사장님",
    phone: "010-0000-0001",
    role: "admin",
    status: "대기중",
    last_lat: 36.3504,
    last_lng: 127.3845,
    location_updated_at: "2026-05-03T08:00:00Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    auth_user_id: "staff-001",
    name: "김태현",
    phone: "010-1111-1111",
    role: "staff",
    status: "대기중",
    last_lat: 36.3550,
    last_lng: 127.3900,
    location_updated_at: "2026-05-03T08:30:00Z",
    is_active: true,
    created_at: "2024-06-01T00:00:00Z",
  },
  {
    id: 3,
    auth_user_id: "staff-002",
    name: "이동훈",
    phone: "010-2222-2222",
    role: "staff",
    status: "작업중",
    last_lat: 36.3300,
    last_lng: 127.4100,
    location_updated_at: "2026-05-03T09:15:00Z",
    is_active: true,
    created_at: "2024-08-15T00:00:00Z",
  },
  {
    id: 4,
    auth_user_id: "staff-003",
    name: "박성민",
    phone: "010-3333-3333",
    role: "staff",
    status: "대기중",
    last_lat: 36.3700,
    last_lng: 127.3600,
    location_updated_at: "2026-05-03T08:45:00Z",
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
  },
  {
    id: 5,
    auth_user_id: "staff-004",
    name: "최영수",
    phone: "010-4444-4444",
    role: "staff",
    status: "퇴근",
    last_lat: 36.3400,
    last_lng: 127.3800,
    location_updated_at: "2026-05-02T18:00:00Z",
    is_active: true,
    created_at: "2025-03-20T00:00:00Z",
  },
];

// ── Bookings (오늘 날짜 기준) ────────────────────────────
const today = new Date().toISOString().split("T")[0];

export const mockBookings: Booking[] = [
  {
    id: 1,
    user_id: 1,
    staff_id: 2,
    address: "대전 서구 둔산로 100",
    detail_address: "A아파트 301호",
    lat: 36.3504,
    lng: 127.3845,
    area_size: 32,
    scheduled_at: `${today}T09:00:00Z`,
    estimated_duration: 240,
    final_duration: null,
    status: "확정",
    customer_request: "베란다 중점 청소 부탁드립니다",
    created_at: `${today}T00:00:00Z`,
    updated_at: `${today}T00:00:00Z`,
  },
  {
    id: 2,
    user_id: 2,
    staff_id: 3,
    address: "대전 유성구 대학로 99",
    detail_address: "B빌라 201호",
    lat: 36.3622,
    lng: 127.3561,
    area_size: 24,
    scheduled_at: `${today}T10:00:00Z`,
    estimated_duration: 60,
    final_duration: null,
    status: "작업중",
    customer_request: "에어컨 2대 세척 요청",
    created_at: `${today}T00:00:00Z`,
    updated_at: `${today}T00:00:00Z`,
  },
  {
    id: 3,
    user_id: 3,
    staff_id: null,
    address: "대전 동구 중앙로 200",
    detail_address: "C오피스텔 502호",
    lat: 36.3285,
    lng: 127.4275,
    area_size: 18,
    scheduled_at: `${today}T14:00:00Z`,
    estimated_duration: 120,
    final_duration: null,
    status: "대기",
    customer_request: "",
    created_at: `${today}T00:00:00Z`,
    updated_at: `${today}T00:00:00Z`,
  },
  {
    id: 4,
    user_id: 4,
    staff_id: 4,
    address: "대전 중구 대종로 50",
    detail_address: "D아파트 1201호",
    lat: 36.3275,
    lng: 127.4014,
    area_size: 45,
    scheduled_at: `${today}T13:00:00Z`,
    estimated_duration: 240,
    final_duration: 260,
    status: "완료",
    customer_request: "창틀 꼼꼼히 해주세요",
    created_at: "2026-05-02T00:00:00Z",
    updated_at: "2026-05-02T17:30:00Z",
  },
  {
    id: 5,
    user_id: 5,
    staff_id: null,
    address: "대전 대덕구 신탄진로 300",
    detail_address: "E아파트 805호",
    lat: 36.4220,
    lng: 127.4133,
    area_size: 30,
    scheduled_at: `${today}T15:30:00Z`,
    estimated_duration: 210,
    final_duration: null,
    status: "대기",
    customer_request: "반려견 있습니다. 참고 부탁드려요",
    created_at: `${today}T00:00:00Z`,
    updated_at: `${today}T00:00:00Z`,
  },
];

// ── Booking Services ─────────────────────────────────────
export const mockBookingServices: BookingService[] = [
  { id: 1, booking_id: 1, service_id: 1, quantity: 1, price: 250000 },
  { id: 2, booking_id: 2, service_id: 3, quantity: 2, price: 160000 },
  { id: 3, booking_id: 3, service_id: 6, quantity: 1, price: 150000 },
  { id: 4, booking_id: 4, service_id: 1, quantity: 1, price: 250000 },
  { id: 5, booking_id: 4, service_id: 7, quantity: 1, price: 200000 },
  { id: 6, booking_id: 5, service_id: 2, quantity: 1, price: 220000 },
];

// ── Marketing Consents ───────────────────────────────────
export const mockMarketingConsents: MarketingConsent[] = [
  { id: 1, user_id: 1, is_agreed: true, agreed_at: "2025-03-15T09:00:00Z", revoked_at: null },
  { id: 2, user_id: 2, is_agreed: true, agreed_at: "2025-06-20T14:30:00Z", revoked_at: null },
  { id: 3, user_id: 3, is_agreed: false, agreed_at: "2025-09-01T11:00:00Z", revoked_at: "2025-10-01T00:00:00Z" },
  { id: 4, user_id: 4, is_agreed: true, agreed_at: "2024-12-10T16:00:00Z", revoked_at: null },
  { id: 5, user_id: 5, is_agreed: true, agreed_at: "2025-01-05T10:00:00Z", revoked_at: null },
];

// ── Payments ─────────────────────────────────────────────
export const mockPayments: Payment[] = [
  { id: 1, booking_id: 4, amount: 450000, method: "계좌이체", status: "완료", paid_at: "2026-05-02T17:30:00Z" },
];

// ── Photos ───────────────────────────────────────────────
export const mockPhotos: Photo[] = [
  { id: 1, booking_id: 4, staff_id: 4, url: "/mock/photo-before-1.jpg", category: "before", uploaded_at: "2026-05-02T13:05:00Z" },
  { id: 2, booking_id: 4, staff_id: 4, url: "/mock/photo-after-1.jpg", category: "after", uploaded_at: "2026-05-02T17:20:00Z" },
];

// ── Client Notes ─────────────────────────────────────────
export const mockClientNotes: ClientNote[] = [
  {
    id: 1,
    user_id: 1,
    staff_id: 2,
    booking_id: null,
    content: "베란다 창틀에 매우 예민하신 고객. 마무리 후 반드시 확인 요청.",
    tags: ["예민", "창틀"],
    created_at: "2025-04-20T15:00:00Z",
  },
  {
    id: 2,
    user_id: 5,
    staff_id: 3,
    booking_id: null,
    content: "소형견(포메라니안) 1마리. 낯선 사람에게 짖음. 작업 시 문 닫아줄 것.",
    tags: ["강아지", "주의"],
    created_at: "2025-02-10T12:00:00Z",
  },
  {
    id: 3,
    user_id: 4,
    staff_id: 4,
    booking_id: 4,
    content: "VVIP 고객. 매번 음료 챙겨주시고 팁도 주심. 서비스 최고로 해드릴 것.",
    tags: ["VVIP", "단골"],
    created_at: "2026-05-02T17:25:00Z",
  },
  {
    id: 4,
    user_id: 3,
    staff_id: 2,
    booking_id: null,
    content: "주차 불가 구역. 근처 공영주차장 이용해야 함 (도보 5분).",
    tags: ["주차불가"],
    created_at: "2025-10-15T10:00:00Z",
  },
];
