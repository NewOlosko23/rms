// FILE: src/context/RentSystemContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Location, Unit, Tenant, RentRecord, Activity, CalendarEvent, SystemSettings, SystemNotification, DepositRecord } from "../types";
import {
  LOCATIONS,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_RENT_RECORDS,
  INITIAL_ACTIVITIES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_DEPOSIT_RECORDS
} from "../data/mockData";

interface RentSystemContextType {
  locations: Location[];
  units: Unit[];
  tenants: Tenant[];
  rentRecords: RentRecord[];
  depositRecords: DepositRecord[];
  activities: Activity[];
  calendarEvents: CalendarEvent[];
  settings: SystemSettings;
  notifications: SystemNotification[];
  isLoggedIn: boolean;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  login: (user: any) => void;
  logout: () => void;
  addTenant: (tenantData: any) => void;
  vacateTenant: (tenantId: string) => void;
  addUnit: (unitData: any) => void;
  markPaid: (recordId: string, paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash") => void;
  sendReminder: (tenantId: string, unitId: string) => void;
  updateSettings: (newSettings: SystemSettings) => void;
  addNotification: (message: string, type: SystemNotification["type"], tenantName?: string, unitId?: string) => void;
  markNotificationsRead: () => void;
  simulateMpesaPayment: (tenantId: string, amount: number, transactionCode: string) => boolean;
  processDepositRefund: (recordId: string, refundAmount: number) => void;
  processRepairDeduction: (recordId: string, deductionAmount: number, reason: string) => void;
  applyDepositToRent: (recordId: string) => void;
}

const RentSystemContext = createContext<RentSystemContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
  systemName: "NestIQ — Powered by Avodal",
  currency: "KES",
  latePaymentFee: 1000,
  enableLatePaymentFee: true,
  lateFeeLocationIds: ["loc-1", "loc-2"], // Default applicable to first two properties
  enableDeposits: true,
  depositFeeLocationIds: ["loc-1", "loc-2"], // Deposits only for Milele Court & Bahari (not Savannah Heights)
  depositRefundGraceDays: 7,
  mpesaTill: "5431201",
  gracePeriodDays: 5,
  enableSmsReminders: true,
  managerEmail: "GeorgeOloo@avodal.co.ke",
};

const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    message: "Rent matching confirmed: Akinyi Odhiambo (MC-01) paid KES 15,000 via M-Pesa",
    timestamp: "10 mins ago",
    tenantName: "Akinyi Odhiambo",
    unitId: "MC-01",
    isRead: false,
    type: "payment_received"
  },
  {
    id: "notif-2",
    message: "Rent overdue alert! Mutua Kioko (MC-08) is currently overdue.",
    timestamp: "2 days ago",
    tenantName: "Mutua Kioko",
    unitId: "MC-08",
    isRead: false,
    type: "overdue"
  },
  {
    id: "notif-3",
    message: "Lease expiration warning for Sunset Park Unit SP-02",
    timestamp: "5 days ago",
    isRead: true,
    type: "info"
  }
];

export function RentSystemProvider({ children }: { children: React.ReactNode }) {
  const [locations] = useState<Location[]>(LOCATIONS);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rentRecords, setRentRecords] = useState<RentRecord[]>([]);
  const [depositRecords, setDepositRecords] = useState<DepositRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  // Initialize from LocalStorage or mock data
  useEffect(() => {
    const storedUnits = localStorage.getItem("nest_iq_units");
    const storedTenants = localStorage.getItem("nest_iq_tenants");
    const storedRentRecords = localStorage.getItem("nest_iq_rent_records");
    const storedDepositRecords = localStorage.getItem("nest_iq_deposit_records");
    const storedActivities = localStorage.getItem("nest_iq_activities");
    const storedEvents = localStorage.getItem("nest_iq_events");
    const storedSettings = localStorage.getItem("nest_iq_settings");
    const storedNotifications = localStorage.getItem("nest_iq_notifications");
    const storedAuth = localStorage.getItem("nest_iq_logged_in");

    setUnits(storedUnits ? JSON.parse(storedUnits) : INITIAL_UNITS);
    setTenants(storedTenants ? JSON.parse(storedTenants) : INITIAL_TENANTS);
    setRentRecords(storedRentRecords ? JSON.parse(storedRentRecords) : INITIAL_RENT_RECORDS);
    setDepositRecords(storedDepositRecords ? JSON.parse(storedDepositRecords) : INITIAL_DEPOSIT_RECORDS);
    setActivities(storedActivities ? JSON.parse(storedActivities) : INITIAL_ACTIVITIES);
    setCalendarEvents(storedEvents ? JSON.parse(storedEvents) : INITIAL_CALENDAR_EVENTS);
    setSettings(storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS);
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : DEFAULT_NOTIFICATIONS);
    setIsLoggedIn(storedAuth === "true");
  }, []);

  // Save changes helper
  const saveState = (
    updatedUnits: Unit[],
    updatedTenants: Tenant[],
    updatedRentRecords: RentRecord[],
    updatedActivities: Activity[],
    updatedEvents: CalendarEvent[],
    updatedDepositRecords?: DepositRecord[]
  ) => {
    setUnits(updatedUnits);
    setTenants(updatedTenants);
    setRentRecords(updatedRentRecords);
    if (updatedDepositRecords) setDepositRecords(updatedDepositRecords);
    setActivities(updatedActivities);
    setCalendarEvents(updatedEvents);

    localStorage.setItem("nest_iq_units", JSON.stringify(updatedUnits));
    localStorage.setItem("nest_iq_tenants", JSON.stringify(updatedTenants));
    localStorage.setItem("nest_iq_rent_records", JSON.stringify(updatedRentRecords));
    if (updatedDepositRecords) localStorage.setItem("nest_iq_deposit_records", JSON.stringify(updatedDepositRecords));
    localStorage.setItem("nest_iq_activities", JSON.stringify(updatedActivities));
    localStorage.setItem("nest_iq_events", JSON.stringify(updatedEvents));
  };

  // Auth Operations
  const login = (user: any) => {
    localStorage.setItem("nest_iq_logged_in", "true");
    localStorage.setItem("nest_iq_user", JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("nest_iq_logged_in");
    localStorage.removeItem("nest_iq_user");
    setIsLoggedIn(false);
  };

  // Onboard Tenant
  const addTenant = (tenantData: any) => {
    const newTenantId = `tenant-${Date.now()}`;
    const selectedUnit = units.find((u) => u.id === tenantData.unitId);
    if (!selectedUnit) return;

    const newTenant: Tenant = {
      id: newTenantId,
      name: tenantData.name,
      phone: tenantData.phone,
      email: tenantData.email,
      nationalId: tenantData.nationalId,
      unitId: tenantData.unitId,
      locationId: selectedUnit.locationId,
      moveInDate: tenantData.moveInDate,
      leaseEndDate: new Date(new Date(tenantData.moveInDate).setFullYear(new Date(tenantData.moveInDate).getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      emergencyContact: tenantData.emergencyContact,
      emergencyPhone: tenantData.emergencyPhone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantData.name)}&background=4F46E5&color=fff`,
    };

    // Update unit is now occupied
    const updatedUnits = units.map((u) =>
      u.id === tenantData.unitId ? { ...u, status: "occupied" as const, tenantId: newTenantId } : u
    );

    // Create current month rent record for this new tenant
    const newRentRecord: RentRecord = {
      id: `rr-${Date.now()}`,
      tenantId: newTenantId,
      unitId: tenantData.unitId,
      locationId: selectedUnit.locationId,
      month: "2026-06", // Current active system month
      amount: selectedUnit.monthlyRent,
      status: "pending",
      paidDate: null,
      receiptNo: null,
      paymentMethod: null,
    };

    // Log Activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "tenant",
      message: `${tenantData.name} has moved into unit ${tenantData.unitId}`,
      timestamp: new Date().toISOString(),
      category: "blue",
    };

    // Add Calendar Event
    const newCalendarEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      type: "move_in",
      title: `Onboarded: ${tenantData.name}`,
      date: tenantData.moveInDate,
      tenantName: tenantData.name,
      unitId: tenantData.unitId,
      details: "Tenant signed lease agreement and key handover complete."
    };

    saveState(
      updatedUnits,
      [newTenant, ...tenants],
      [newRentRecord, ...rentRecords],
      [newActivity, ...activities],
      [newCalendarEvent, ...calendarEvents]
    );

    addNotification(`${tenantData.name} onboarded successfully to Suite ${tenantData.unitId}`, "info", tenantData.name, tenantData.unitId);
  };

  // Vacate Tenant
  const vacateTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) return;

    const updatedUnits = units.map((u) =>
      u.tenantId === tenantId ? { ...u, status: "vacant" as const, tenantId: null } : u
    );

    const updatedTenants = tenants.filter((t) => t.id !== tenantId);

    // Mark current rent records as adjusted or delete pending
    const updatedRentRecords = rentRecords.filter(r => !(r.tenantId === tenantId && r.status === "pending"));

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "tenant",
      message: `Tenant ${tenant.name} vacated Unit ${tenant.unitId}`,
      timestamp: new Date().toISOString(),
      category: "amber",
    };

    saveState(
      updatedUnits,
      updatedTenants,
      updatedRentRecords,
      [newActivity, ...activities],
      calendarEvents
    );

    addNotification(`Tenant ${tenant.name} has vacate-cleared Unit ${tenant.unitId}`, "info", tenant.name, tenant.unitId);
  };

  // Add Suite Unit
  const addUnit = (unitData: any) => {
    const selectedLoc = locations.find((l) => l.id === unitData.locationId);
    if (!selectedLoc) return;

    // e.g. MC-11 for Milele Court (loc-1)
    const unitPrefix = selectedLoc.id === "loc-1" ? "MC" : selectedLoc.id === "loc-2" ? "BR" : "SH";
    const newUnitId = `${unitPrefix}-${unitData.unitNumber}`;

    const newUnit: Unit = {
      id: newUnitId,
      locationId: unitData.locationId,
      unitNumber: unitData.unitNumber,
      type: unitData.type,
      monthlyRent: unitData.monthlyRent,
      status: "vacant",
      floor: unitData.floor,
      tenantId: null,
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "system",
      message: `Suite registered: Unit ${newUnitId} created at ${selectedLoc.name}`,
      timestamp: new Date().toISOString(),
      category: "blue",
    };

    saveState(
      [...units, newUnit],
      tenants,
      rentRecords,
      [newActivity, ...activities],
      calendarEvents
    );
  };

  // Mark Rent as Paid
  const markPaid = (recordId: string, paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash") => {
    const record = rentRecords.find((r) => r.id === recordId);
    if (!record) return;

    const tenant = tenants.find((t) => t.id === record.tenantId);
    if (!tenant) return;

    const receiptNo = `N-${paymentMethod === "M-Pesa" ? "MP" : paymentMethod === "Bank Transfer" ? "BK" : "CH"}-${Math.floor(100 + Math.random() * 900)}`;

    const updatedRecords = rentRecords.map((r) =>
      r.id === recordId
        ? {
            ...r,
            status: "paid" as const,
            paidDate: new Date().toISOString().split("T")[0],
            receiptNo,
            paymentMethod,
          }
        : r
    );

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "payment",
      message: `Rent marked paid — ${tenant.name} (${record.unitId}) — KES ${record.amount.toLocaleString()} via ${paymentMethod}`,
      timestamp: new Date().toISOString(),
      category: "green",
    };

    saveState(
      units,
      tenants,
      updatedRecords,
      [newActivity, ...activities],
      calendarEvents
    );

    addNotification(`Rent of KES ${record.amount.toLocaleString()} received from ${tenant.name} (${record.unitId})`, "payment_received", tenant.name, record.unitId);
  };

  // Send Arrears Reminder
  const sendReminder = (tenantId: string, unitId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    // Log Event
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "alert",
      message: `Direct premium warning SMS sent to ${tenant.name} (${unitId}) regarding arrears matching Till ${settings.mpesaTill}`,
      timestamp: new Date().toISOString(),
      category: "amber"
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem("nest_iq_activities", JSON.stringify(updatedActivities));

    addNotification(`Arrears alert broadcasted via SMS to ${tenant.name} (${unitId})`, "reminder_sent", tenant.name, unitId);
  };

  // Settings manager
  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem("nest_iq_settings", JSON.stringify(newSettings));
  };

  // Notification utilities
  const addNotification = (message: string, type: SystemNotification["type"], tenantName?: string, unitId?: string) => {
    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      message,
      timestamp: "Just now",
      tenantName,
      unitId,
      isRead: false,
      type,
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem("nest_iq_notifications", JSON.stringify(updated));
  };

  const markNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem("nest_iq_notifications", JSON.stringify(updated));
  };

  // M-Pesa Transaction Simulation Catcher
  const simulateMpesaPayment = (tenantId: string, amount: number, transactionCode: string): boolean => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return false;

    // Find first active/unpaid rent record for this tenant
    const record = rentRecords.find(r => r.tenantId === tenantId && r.status !== "paid");
    if (!record) return false;

    // Set as paid
    const updatedRecords = rentRecords.map(r => 
      r.id === record.id 
        ? {
            ...r,
            status: "paid" as const,
            paidDate: new Date().toISOString().split("T")[0],
            receiptNo: transactionCode,
            paymentMethod: "M-Pesa" as const,
          }
        : r
    );

    // Add activity logger
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "payment",
      message: `[M-Pesa Hook] Transaction ${transactionCode} caught — KES ${amount.toLocaleString()} received via Till ${settings.mpesaTill} for Tenant ${tenant.name} (Unit ${tenant.unitId})`,
      timestamp: new Date().toISOString(),
      category: "green",
    };

    saveState(
      units,
      tenants,
      updatedRecords,
      [newActivity, ...activities],
      calendarEvents
    );

    // Dispatch realtime warning toast / alert in notifications
    addNotification(
      `🚨 [M-Pesa Hook] Transaction ${transactionCode} caught! matched Tenant ${tenant.name} (Suite ${tenant.unitId}) for payment of KES ${amount.toLocaleString()}`,
      "payment_received",
      tenant.name,
      tenant.unitId
    );

    return true;
  };

  // Process Deposit Refund
  const processDepositRefund = (recordId: string, refundAmount: number) => {
    const deposit = depositRecords.find((d) => d.id === recordId);
    if (!deposit) return;

    const tenant = tenants.find((t) => t.id === deposit.tenantId);
    if (!tenant) return;

    const updatedDeposits = depositRecords.map((d) =>
      d.id === recordId
        ? {
            ...d,
            status: "refunded" as const,
            refundAmount,
            refundDate: new Date().toISOString().split("T")[0],
          }
        : d
    );

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "payment",
      message: `Deposit refund processed — ${tenant.name} refunded KES ${refundAmount.toLocaleString()} (held: ${deposit.amount.toLocaleString()})`,
      timestamp: new Date().toISOString(),
      category: "green",
    };

    saveState(
      units,
      tenants,
      rentRecords,
      [newActivity, ...activities],
      calendarEvents,
      updatedDeposits
    );

    addNotification(`Deposit refund of KES ${refundAmount.toLocaleString()} processed for ${tenant.name}`, "info", tenant.name, tenant.unitId);
  };

  // Process Repair Deduction
  const processRepairDeduction = (recordId: string, deductionAmount: number, reason: string) => {
    const deposit = depositRecords.find((d) => d.id === recordId);
    if (!deposit) return;

    const tenant = tenants.find((t) => t.id === deposit.tenantId);
    if (!tenant) return;

    const refundAmount = Math.max(0, deposit.amount - deductionAmount);

    const updatedDeposits = depositRecords.map((d) =>
      d.id === recordId
        ? {
            ...d,
            status: "repair_deducted" as const,
            deductionAmount,
            deductionReason: reason,
            refundAmount,
            refundDate: new Date().toISOString().split("T")[0],
          }
        : d
    );

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "payment",
      message: `Repair deduction applied to deposit — ${tenant.name} deducted KES ${deductionAmount.toLocaleString()} for: ${reason} (refund due: ${refundAmount.toLocaleString()})`,
      timestamp: new Date().toISOString(),
      category: "orange",
    };

    saveState(
      units,
      tenants,
      rentRecords,
      [newActivity, ...activities],
      calendarEvents,
      updatedDeposits
    );

    addNotification(`Repair deduction of KES ${deductionAmount.toLocaleString()} applied to ${tenant.name}'s deposit`, "info", tenant.name, tenant.unitId);
  };

  // Apply Deposit to Rent
  const applyDepositToRent = (recordId: string) => {
    const deposit = depositRecords.find((d) => d.id === recordId);
    if (!deposit) return;

    const tenant = tenants.find((t) => t.id === deposit.tenantId);
    if (!tenant) return;

    const updatedDeposits = depositRecords.map((d) =>
      d.id === recordId
        ? {
            ...d,
            status: "rent_applied" as const,
          }
        : d
    );

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: "payment",
      message: `Deposit applied to rent — ${tenant.name}'s held deposit of KES ${deposit.amount.toLocaleString()} applied as rent payment`,
      timestamp: new Date().toISOString(),
      category: "indigo",
    };

    saveState(
      units,
      tenants,
      rentRecords,
      [newActivity, ...activities],
      calendarEvents,
      updatedDeposits
    );

    addNotification(`Deposit of KES ${deposit.amount.toLocaleString()} applied to ${tenant.name}'s rent account`, "info", tenant.name, tenant.unitId);
  };

  return (
    <RentSystemContext.Provider
      value={{
        locations,
        units,
        tenants,
        rentRecords,
        depositRecords,
        activities,
        calendarEvents,
        settings,
        notifications,
        isLoggedIn,
        globalSearchQuery,
        setGlobalSearchQuery,
        login,
        logout,
        addTenant,
        vacateTenant,
        addUnit,
        markPaid,
        sendReminder,
        updateSettings,
        addNotification,
        markNotificationsRead,
        simulateMpesaPayment,
        processDepositRefund,
        processRepairDeduction,
        applyDepositToRent,
      }}
    >
      {children}
    </RentSystemContext.Provider>
  );
}

export function useRentSystem() {
  const context = useContext(RentSystemContext);
  if (!context) {
    throw new Error("useRentSystem must be used within a RentSystemProvider");
  }
  return context;
}

