// FILE: src/types/index.ts

export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  totalUnits: number;
  monthlyRent: number;
  image: string;
}

export interface Unit {
  id: string;                  // e.g. "MC-01"
  locationId: string;
  unitNumber: string;          // e.g. "A1"
  type: "Bedsitter" | "1 Bedroom" | "2 Bedroom";
  monthlyRent: number;
  status: "occupied" | "vacant";
  floor: number;
  tenantId: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  unitId: string;
  locationId: string;
  moveInDate: string;
  leaseEndDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  avatar: string;
}

export interface RentRecord {
  id: string;
  tenantId: string;
  unitId: string;
  locationId: string;
  month: string;               // e.g. "2025-06" (using June 2025 as the default current month based on the prompt)
  amount: number;
  status: "paid" | "pending" | "overdue";
  paidDate: string | null;
  receiptNo: string | null;
  paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash" | null;
}

export interface Activity {
  id: string;
  type: "payment" | "tenant" | "alert" | "system";
  message: string;
  timestamp: string; // ISO date
  category: "green" | "blue" | "red" | "amber";
}

export interface SystemSettings {
  systemName: string;
  currency: string;
  latePaymentFee: number;
  enableLatePaymentFee: boolean; // Optional parameter
  lateFeeLocationIds: string[]; // Decided per property plot
  mpesaTill: string;
  gracePeriodDays: number;
  enableSmsReminders: boolean;
  managerEmail: string;
}

export interface SystemNotification {
  id: string;
  message: string;
  timestamp: string;
  tenantName?: string;
  unitId?: string;
  isRead: boolean;
  type: "payment_received" | "overdue" | "reminder_sent" | "info";
}

export interface CalendarEvent {
  id: string;
  type: "rent_due" | "move_in" | "lease_expiry";
  title: string;
  date: string; // YYYY-MM-DD
  tenantName?: string;
  unitId?: string;
  details?: string;
}
