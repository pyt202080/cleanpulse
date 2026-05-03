// ============================================
// Clean Pulse — Global Store (Zustand)
// Supabase 연동 전까지 목업 데이터로 CRUD 수행
// ============================================

import { create } from "zustand";
import {
  User,
  Staff,
  Service,
  Booking,
  BookingService,
  ClientNote,
  MarketingConsent,
  Payment,
  Photo,
  BookingStatus,
  StaffStatus,
} from "@/lib/types/database";
import {
  mockUsers,
  mockStaff,
  mockServices,
  mockBookings,
  mockBookingServices,
  mockClientNotes,
  mockMarketingConsents,
  mockPayments,
  mockPhotos,
} from "@/lib/data/mock";

interface CleanPulseStore {
  // ── Data ──
  users: User[];
  staff: Staff[];
  services: Service[];
  bookings: Booking[];
  bookingServices: BookingService[];
  clientNotes: ClientNote[];
  marketingConsents: MarketingConsent[];
  payments: Payment[];
  photos: Photo[];

  // ── Auth (mock) ──
  currentUser: Staff | null;
  login: (authId: string) => boolean;
  logout: () => void;

  // ── Company Settings ──
  companySettings: { bankAccount: string };
  updateCompanySettings: (settings: { bankAccount: string }) => void;

  // ── Services CRUD ──
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: number, updates: Partial<Service>) => void;
  deleteService: (id: number) => void;

  // ── Bookings ──
  addBooking: (booking: Omit<Booking, "id" | "created_at" | "updated_at">, services: { service_id: number; quantity: number; price: number }[]) => number;
  updateBookingStatus: (id: number, status: BookingStatus) => void;
  assignStaff: (bookingId: number, staffId: number) => void;

  // ── Staff ──
  updateStaffStatus: (id: number, status: StaffStatus) => void;
  updateStaffLocation: (id: number, lat: number, lng: number) => void;
  addStaff: (staff: Omit<Staff, "id" | "created_at">) => void;
  toggleStaffActive: (id: number) => void;

  // ── Client Notes ──
  addClientNote: (note: Omit<ClientNote, "id" | "created_at">) => void;

  // ── Photos ──
  addPhoto: (photo: Omit<Photo, "id" | "uploaded_at">) => void;

  // ── Payments ──
  addPayment: (payment: Omit<Payment, "id">) => void;

  // ── Users (from booking) ──
  addOrGetUser: (user: Omit<User, "id" | "created_at">) => number;

  // ── Marketing ──
  setMarketingConsent: (userId: number, isAgreed: boolean) => void;
}

let nextId = 100; // Auto-increment counter

export const useStore = create<CleanPulseStore>((set, get) => ({
  // ── Initial Data ──
  users: mockUsers,
  staff: mockStaff,
  services: mockServices,
  bookings: mockBookings,
  bookingServices: mockBookingServices,
  clientNotes: mockClientNotes,
  marketingConsents: mockMarketingConsents,
  payments: mockPayments,
  photos: mockPhotos,

  // ── Company Settings ──
  companySettings: {
    bankAccount: "신한은행 110-123-456789 (예금주: 청소잘하는남자)",
  },
  updateCompanySettings: (settings) => set({ companySettings: settings }),

  // ── Auth ──
  currentUser: null,

  login: (authId: string) => {
    const staff = get().staff.find((s) => s.auth_user_id === authId && s.is_active);
    if (staff) {
      set({ currentUser: staff });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  // ── Services CRUD ──
  addService: (service) => {
    const newService: Service = { ...service, id: ++nextId };
    set((state) => ({ services: [...state.services, newService] }));
  },

  updateService: (id, updates) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteService: (id) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, is_active: false } : s)),
    }));
  },

  // ── Bookings ──
  addBooking: (booking, services) => {
    const bookingId = ++nextId;
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: bookingId,
      created_at: now,
      updated_at: now,
    };

    const newBookingServices: BookingService[] = services.map((s) => ({
      id: ++nextId,
      booking_id: bookingId,
      ...s,
    }));

    set((state) => ({
      bookings: [...state.bookings, newBooking],
      bookingServices: [...state.bookingServices, ...newBookingServices],
    }));

    return bookingId;
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, status, updated_at: new Date().toISOString() } : b
      ),
    }));
  },

  assignStaff: (bookingId, staffId) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, staff_id: staffId, status: "확정" as BookingStatus, updated_at: new Date().toISOString() }
          : b
      ),
    }));
  },

  // ── Staff ──
  updateStaffStatus: (id, status) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
  },

  updateStaffLocation: (id, lat, lng) => {
    set((state) => ({
      staff: state.staff.map((s) =>
        s.id === id
          ? { ...s, last_lat: lat, last_lng: lng, location_updated_at: new Date().toISOString() }
          : s
      ),
    }));
  },

  addStaff: (staff) => {
    const newStaff: Staff = {
      ...staff,
      id: ++nextId,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ staff: [...state.staff, newStaff] }));
  },

  toggleStaffActive: (id) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s)),
    }));
  },

  // ── Client Notes ──
  addClientNote: (note) => {
    const newNote: ClientNote = {
      ...note,
      id: ++nextId,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ clientNotes: [...state.clientNotes, newNote] }));
  },

  // ── Photos ──
  addPhoto: (photo) => {
    const newPhoto: Photo = {
      ...photo,
      id: ++nextId,
      uploaded_at: new Date().toISOString(),
    };
    set((state) => ({ photos: [...state.photos, newPhoto] }));
  },

  // ── Payments ──
  addPayment: (payment) => {
    const newPayment: Payment = { ...payment, id: ++nextId };
    set((state) => ({ payments: [...state.payments, newPayment] }));
  },

  // ── Users ──
  addOrGetUser: (userData) => {
    const existing = get().users.find((u) => u.phone === userData.phone);
    if (existing) return existing.id;

    const newUser: User = {
      ...userData,
      id: ++nextId,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    return newUser.id;
  },

  // ── Marketing ──
  setMarketingConsent: (userId, isAgreed) => {
    const now = new Date().toISOString();
    set((state) => {
      const existing = state.marketingConsents.find((c) => c.user_id === userId);
      if (existing) {
        return {
          marketingConsents: state.marketingConsents.map((c) =>
            c.user_id === userId
              ? { ...c, is_agreed: isAgreed, agreed_at: isAgreed ? now : c.agreed_at, revoked_at: isAgreed ? null : now }
              : c
          ),
        };
      }
      return {
        marketingConsents: [
          ...state.marketingConsents,
          { id: ++nextId, user_id: userId, is_agreed: isAgreed, agreed_at: now, revoked_at: null },
        ],
      };
    });
  },
}));
