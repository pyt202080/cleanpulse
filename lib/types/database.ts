// ============================================
// Clean Pulse — Database Types
// ============================================

export interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  detail_address: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface MarketingConsent {
  id: number;
  user_id: number;
  is_agreed: boolean;
  agreed_at: string;
  revoked_at: string | null;
}

export type StaffRole = "admin" | "staff";
export type StaffStatus = "대기중" | "작업중" | "퇴근";

export interface Staff {
  id: number;
  auth_user_id: string;
  name: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  last_lat: number;
  last_lng: number;
  location_updated_at: string;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  estimated_minutes: number;
  base_price: number;
  is_active: boolean;
}

export type BookingStatus = "대기" | "확정" | "작업중" | "완료" | "취소";

export interface Booking {
  id: number;
  user_id: number;
  staff_id: number | null;
  address: string;
  detail_address: string;
  lat: number;
  lng: number;
  area_size: number;
  scheduled_at: string;
  estimated_duration: number;
  final_duration: number | null;
  status: BookingStatus;
  customer_request: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: User;
  staff?: Staff;
  services?: BookingService[];
  photos?: Photo[];
}

export interface BookingService {
  id: number;
  booking_id: number;
  service_id: number;
  quantity: number;
  price: number;
  // Joined
  service?: Service;
}

export interface BookingStatusLog {
  id: number;
  booking_id: number;
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  changed_by: number | null;
  changed_at: string;
}

export type PaymentMethod = "현금" | "계좌이체" | "카드";
export type PaymentStatus = "대기" | "완료";

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string | null;
}

export type PhotoCategory = "before" | "after";

export interface Photo {
  id: number;
  booking_id: number;
  staff_id: number;
  url: string;
  category: PhotoCategory;
  uploaded_at: string;
}

export interface ClientNote {
  id: number;
  user_id: number;
  staff_id: number;
  booking_id: number | null;
  content: string;
  tags: string[];
  created_at: string;
  // Joined
  staff?: Staff;
}

// ============================================
// UI Helper Types
// ============================================

export interface DispatchCandidate {
  staff: Staff;
  distance_km: number;
  estimated_end_time: string | null;
}

export interface CrmTarget {
  user: User;
  last_booking_date: string;
  total_bookings: number;
  marketing_consent: MarketingConsent;
}
