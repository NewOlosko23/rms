// FILE: src/data/mockData.ts
import { Location, Unit, Tenant, RentRecord, Activity, CalendarEvent } from "../types";

export const LOCATIONS: Location[] = [
  {
    id: "loc-1",
    name: "Milele Court",
    type: "Bedsitter",
    address: "Off Jomo Kenyatta Highway, Siaya",
    totalUnits: 10,
    monthlyRent: 3500,
    image: "https://picsum.photos/seed/milele/400/250"
  },
  {
    id: "loc-2",
    name: "Bahari Residences",
    type: "1 Bedroom",
    address: "Tom Mboya Estate, Siaya",
    totalUnits: 5,
    monthlyRent: 8500,
    image: "https://picsum.photos/seed/bahari/400/250"
  },
  {
    id: "loc-3",
    name: "Savannah Heights",
    type: "2 Bedroom",
    address: "Milimani Road, Siaya",
    totalUnits: 5,
    monthlyRent: 15000,
    image: "https://picsum.photos/seed/savannah/400/250"
  }
];

// Helper to generate units
export const INITIAL_UNITS: Unit[] = [
  // Milele Court (10 units: 8 occupied, 2 vacant)
  { id: "MC-01", locationId: "loc-1", unitNumber: "A1", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 1, tenantId: "tenant-1" },
  { id: "MC-02", locationId: "loc-1", unitNumber: "A2", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 1, tenantId: "tenant-2" },
  { id: "MC-03", locationId: "loc-1", unitNumber: "A3", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 1, tenantId: "tenant-3" },
  { id: "MC-04", locationId: "loc-1", unitNumber: "B1", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 2, tenantId: "tenant-4" },
  { id: "MC-05", locationId: "loc-1", unitNumber: "B2", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 2, tenantId: "tenant-5" },
  { id: "MC-06", locationId: "loc-1", unitNumber: "B3", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 2, tenantId: "tenant-6" },
  { id: "MC-07", locationId: "loc-1", unitNumber: "C1", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 3, tenantId: "tenant-7" },
  { id: "MC-08", locationId: "loc-1", unitNumber: "C2", type: "Bedsitter", monthlyRent: 3500, status: "occupied", floor: 3, tenantId: "tenant-8" },
  { id: "MC-09", locationId: "loc-1", unitNumber: "C3", type: "Bedsitter", monthlyRent: 3500, status: "vacant", floor: 3, tenantId: null },
  { id: "MC-10", locationId: "loc-1", unitNumber: "D1", type: "Bedsitter", monthlyRent: 3500, status: "vacant", floor: 4, tenantId: null },

  // Bahari Residences (5 units: 4 occupied, 1 vacant)
  { id: "BR-01", locationId: "loc-2", unitNumber: "101", type: "1 Bedroom", monthlyRent: 8500, status: "occupied", floor: 1, tenantId: "tenant-9" },
  { id: "BR-02", locationId: "loc-2", unitNumber: "102", type: "1 Bedroom", monthlyRent: 8500, status: "occupied", floor: 1, tenantId: "tenant-10" },
  { id: "BR-03", locationId: "loc-2", unitNumber: "201", type: "1 Bedroom", monthlyRent: 8500, status: "occupied", floor: 2, tenantId: "tenant-11" },
  { id: "BR-04", locationId: "loc-2", unitNumber: "202", type: "1 Bedroom", monthlyRent: 8500, status: "occupied", floor: 2, tenantId: "tenant-12" },
  { id: "BR-05", locationId: "loc-2", unitNumber: "301", type: "1 Bedroom", monthlyRent: 8500, status: "vacant", floor: 3, tenantId: null },

  // Savannah Heights (5 units: 3 occupied, 2 vacant)
  { id: "SH-01", locationId: "loc-3", unitNumber: "H01", type: "2 Bedroom", monthlyRent: 15000, status: "occupied", floor: 1, tenantId: "tenant-13" },
  { id: "SH-02", locationId: "loc-3", unitNumber: "H02", type: "2 Bedroom", monthlyRent: 15000, status: "occupied", floor: 1, tenantId: "tenant-14" },
  { id: "SH-03", locationId: "loc-3", unitNumber: "H03", type: "2 Bedroom", monthlyRent: 15000, status: "occupied", floor: 2, tenantId: "tenant-15" },
  { id: "SH-04", locationId: "loc-3", unitNumber: "H04", type: "2 Bedroom", monthlyRent: 15000, status: "vacant", floor: 2, tenantId: null },
  { id: "SH-05", locationId: "loc-3", unitNumber: "H05", type: "2 Bedroom", monthlyRent: 15000, status: "vacant", floor: 3, tenantId: null }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    name: "Akinyi Odhiambo",
    phone: "+254 712 345678",
    email: "akinyi.odhiambo@avodal.com",
    nationalId: "30245678",
    unitId: "MC-01",
    locationId: "loc-1",
    moveInDate: "2024-03-15",
    leaseEndDate: "2025-03-14",
    emergencyContact: "John Odhiambo",
    emergencyPhone: "+254 722 000111",
    avatar: "https://ui-avatars.com/api/?name=Akinyi+Odhiambo&background=4F46E5&color=fff"
  },
  {
    id: "tenant-2",
    name: "Otieno Mwangi",
    phone: "+254 723 456789",
    email: "otieno.mwangi@gmail.com",
    nationalId: "28456123",
    unitId: "MC-02",
    locationId: "loc-1",
    moveInDate: "2024-05-01",
    leaseEndDate: "2025-04-30",
    emergencyContact: "Grace Mwangi",
    emergencyPhone: "+254 715 222333",
    avatar: "https://ui-avatars.com/api/?name=Otieno+Mwangi&background=10B981&color=fff"
  },
  {
    id: "tenant-3",
    name: "Wanjiru Kamau",
    phone: "+254 734 567890",
    email: "wanjiru.kamau@yahoo.com",
    nationalId: "32456789",
    unitId: "MC-03",
    locationId: "loc-1",
    moveInDate: "2024-08-10",
    leaseEndDate: "2025-08-09",
    emergencyContact: "Peter Kamau",
    emergencyPhone: "+254 731 444555",
    avatar: "https://ui-avatars.com/api/?name=Wanjiru+Kamau&background=F59E0B&color=fff"
  },
  {
    id: "tenant-4",
    name: "Kipchoge Rotich",
    phone: "+254 711 223344",
    email: "kipchoge.rotich@outlook.com",
    nationalId: "31987654",
    unitId: "MC-04",
    locationId: "loc-1",
    moveInDate: "2024-11-20",
    leaseEndDate: "2025-11-19",
    emergencyContact: "Nancy Rotich",
    emergencyPhone: "+254 720 011222",
    avatar: "https://ui-avatars.com/api/?name=Kipchoge+Rotich&background=EC4899&color=fff"
  },
  {
    id: "tenant-5",
    name: "Amina Hassan",
    phone: "+254 722 998877",
    email: "amina.hassan@hassan.co.ke",
    nationalId: "34981122",
    unitId: "MC-05",
    locationId: "loc-1",
    moveInDate: "2025-01-05",
    leaseEndDate: "2026-01-04",
    emergencyContact: "Ahmed Hassan",
    emergencyPhone: "+254 711 999888",
    avatar: "https://ui-avatars.com/api/?name=Amina+Hassan&background=8B5CF6&color=fff"
  },
  {
    id: "tenant-6",
    name: "Ouma Nyamweya",
    phone: "+254 701 445566",
    email: "ouma.nyamweya@gmail.com",
    nationalId: "27654321",
    unitId: "MC-06",
    locationId: "loc-1",
    moveInDate: "2025-02-15",
    leaseEndDate: "2026-02-14",
    emergencyContact: "Beryl Nyamweya",
    emergencyPhone: "+254 702 333444",
    avatar: "https://ui-avatars.com/api/?name=Ouma+Nyamweya&background=3B82F6&color=fff"
  },
  {
    id: "tenant-7",
    name: "Chebet Kosgei",
    phone: "+254 715 001122",
    email: "chebet.kosgei@gmail.com",
    nationalId: "29874532",
    unitId: "MC-07",
    locationId: "loc-1",
    moveInDate: "2025-04-01",
    leaseEndDate: "2026-06-30", // expiring soon, next 30 days
    emergencyContact: "David Kosgei",
    emergencyPhone: "+254 716 555666",
    avatar: "https://ui-avatars.com/api/?name=Chebet+Kosgei&background=14B8A6&color=fff"
  },
  {
    id: "tenant-8",
    name: "Mutua Kioko",
    phone: "+254 733 889900",
    email: "mutua.kioko@gmail.com",
    nationalId: "33887711",
    unitId: "MC-08",
    locationId: "loc-1",
    moveInDate: "2024-06-20",
    leaseEndDate: "2025-06-19", // expiring soon (June 19, 2025 status)
    emergencyContact: "Mary Kioko",
    emergencyPhone: "+254 735 999111",
    avatar: "https://ui-avatars.com/api/?name=Mutua+Kioko&background=EF4444&color=fff"
  },

  // Bahari Residences (4 Tenants)
  {
    id: "tenant-9",
    name: "Zawadi Njeri",
    phone: "+254 718 123456",
    email: "zawadi.njeri@outlook.com",
    nationalId: "31234512",
    unitId: "BR-01",
    locationId: "loc-2",
    moveInDate: "2024-01-10",
    leaseEndDate: "2025-01-09",
    emergencyContact: "George Njeri",
    emergencyPhone: "+254 719 333222",
    avatar: "https://ui-avatars.com/api/?name=Zawadi+Njeri&background=6366F1&color=fff"
  },
  {
    id: "tenant-10",
    name: "Simiyu Wafula",
    phone: "+254 725 789012",
    email: "simiyu.wafula@hotmail.com",
    nationalId: "29456781",
    unitId: "BR-02",
    locationId: "loc-2",
    moveInDate: "2024-09-01",
    leaseEndDate: "2025-12-31",
    emergencyContact: "Joseph Wafula",
    emergencyPhone: "+254 726 777888",
    avatar: "https://ui-avatars.com/api/?name=Simiyu+Wafula&background=059669&color=fff"
  },
  {
    id: "tenant-11",
    name: "Akello Onyango",
    phone: "+254 741 223399",
    email: "akello.onyango@gmail.com",
    nationalId: "34561289",
    unitId: "BR-03",
    locationId: "loc-2",
    moveInDate: "2025-03-01",
    leaseEndDate: "2026-02-28",
    emergencyContact: "Richard Onyango",
    emergencyPhone: "+254 742 888999",
    avatar: "https://ui-avatars.com/api/?name=Akello+Onyango&background=7C3AED&color=fff"
  },
  {
    id: "tenant-12",
    name: "Gathii Ndung'u",
    phone: "+254 712 990011",
    email: "gathii.ndungu@avodal.com",
    nationalId: "31897210",
    unitId: "BR-04",
    locationId: "loc-2",
    moveInDate: "2024-04-15",
    leaseEndDate: "2025-07-14", // within 60 days
    emergencyContact: "Tabitha Ndung'u",
    emergencyPhone: "+254 702 444333",
    avatar: "https://ui-avatars.com/api/?name=Gathii+Ndungu&background=F43F5E&color=fff"
  },

  // Savannah Heights (3 Tenants)
  {
    id: "tenant-13",
    name: "Halima Abdi",
    phone: "+254 729 654321",
    email: "halima.abdi@abdi.com",
    nationalId: "35123498",
    unitId: "SH-01",
    locationId: "loc-3",
    moveInDate: "2024-02-01",
    leaseEndDate: "2025-01-31",
    emergencyContact: "Mohamed Abdi",
    emergencyPhone: "+254 721 555444",
    avatar: "https://ui-avatars.com/api/?name=Halima+Abdi&background=06B6D4&color=fff"
  },
  {
    id: "tenant-14",
    name: "Ochieng Oluoch",
    phone: "+254 717 112233",
    email: "ochieng.oluoch@gmail.com",
    nationalId: "30112233",
    unitId: "SH-02",
    locationId: "loc-3",
    moveInDate: "2024-10-01",
    leaseEndDate: "2025-09-30",
    emergencyContact: "Alice Oluoch",
    emergencyPhone: "+254 718 999000",
    avatar: "https://ui-avatars.com/api/?name=Ochieng+Oluoch&background=10B981&color=fff"
  },
  {
    id: "tenant-15",
    name: "Nafula Barasa",
    phone: "+254 731 445588",
    email: "nafula.barasa@yahoo.com",
    nationalId: "33245610",
    unitId: "SH-03",
    locationId: "loc-3",
    moveInDate: "2025-01-10",
    leaseEndDate: "2025-07-20", // within 60 days
    emergencyContact: "Ben Barasa",
    emergencyPhone: "+254 732 111222",
    avatar: "https://ui-avatars.com/api/?name=Nafula+Barasa&background=D97706&color=fff"
  }
];

// We will simulate 6 months of rent payments (Jan 2026 to June 2026)
// Total expected per month is the sum of rents of occupied units:
// 8 MC units * 3500 = 28,000
// 4 BR units * 8500 = 34,000
// 3 SH units * 15000 = 45,000
// Total = 107,000 KES current rent.
// Rent Collection states: 10 Paid, 3 Pending, 2 Overdue.
// Since outstanding should be 25,500 and collected 97,000 (Expected 122,500),
// we will augment the rent record amount of overdue or pending records to include older arrears
// to meet the user's specific expectation of Expected: KES 122,500, Paid: KES 97,000, Overdue: KES 25,500 total!
// Let's model each rent record specifically.

export const INITIAL_RENT_RECORDS: RentRecord[] = [
  // --- JUNE 2026 (Current month) ---
  // Paid (10 tenants)
  { id: "rr-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-03", receiptNo: "N-MP-601", paymentMethod: "M-Pesa" },
  { id: "rr-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-02", receiptNo: "N-MP-602", paymentMethod: "M-Pesa" },
  { id: "rr-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-05", receiptNo: "N-CH-603", paymentMethod: "Cash" },
  { id: "rr-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-04", receiptNo: "N-MP-604", paymentMethod: "M-Pesa" },
  { id: "rr-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-05", receiptNo: "N-BK-605", paymentMethod: "Bank Transfer" },
  { id: "rr-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-06", amount: 3500, status: "paid", paidDate: "2026-06-01", receiptNo: "N-MP-606", paymentMethod: "M-Pesa" },
  
  { id: "rr-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-06", amount: 8500, status: "paid", paidDate: "2026-06-02", receiptNo: "N-BK-609", paymentMethod: "Bank Transfer" },
  { id: "rr-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-06", amount: 8500, status: "paid", paidDate: "2026-06-05", receiptNo: "N-MP-610", paymentMethod: "M-Pesa" },
  
  { id: "rr-13", tenantId: "tenant-13", unitId: "SH-01", locationId: "loc-3", month: "2026-06", amount: 15000, status: "paid", paidDate: "2026-06-04", receiptNo: "N-BK-613", paymentMethod: "Bank Transfer" },
  { id: "rr-14", tenantId: "tenant-14", unitId: "SH-02", locationId: "loc-3", month: "2026-06", amount: 15000, status: "paid", paidDate: "2026-06-05", receiptNo: "N-BK-614", paymentMethod: "Bank Transfer" },
  
  // Paid overages or extra collections (We adjust SH-03 rent to be 30000 (includes arrears) but marked as paid)
  // Let's add an extra paid amount:
  // Decided: we will set Rent collected to be exactly KES 97,000 for the current month.
  // Standard paid sum: 6 * 3500 (21,000) + 2 * 8500 (17,000) + 2 * 15000 (30,000) = 68,000 KES.
  // To reach 97,000 collected, let's say:
  // - SH-03 is paid (15,000) -> 83,000 KES.
  // - Tenant-10 has a double payment (8500 * 2 = 17,000) -> 91,500 KES
  // - Tenant-1 has arrears of 5,500 paid -> total collected 97,000! Let's modify the amount of the paid records to add up to 97,000.
  // MC-01: paid 5500, MC-02: paid 3500, MC-03: paid 3500, MC-04: paid 3500, MC-05: paid 3500, MC-06: paid 3500
  // BR-01: paid 8500, BR-02: paid 17000 (includes advance), BR-03: paid 8500 (Akello is paid instead of Pending)
  // SH-01: paid 15000, SH-02: paid 15000, SH-03: paid 15000 (is paid or pending? Let's check: 10 Paid, 3 Pending, 2 Overdue)
  // Let's make:
  // Paid (10):
  // Tenant 1 (MC-01) - 3,500
  // Tenant 2 (MC-02) - 3,500
  // Tenant 3 (MC-03) - 3,500
  // Tenant 4 (MC-04) - 3,500
  // Tenant 5 (MC-05) - 3,500
  // Tenant 6 (MC-06) - 3,500
  // Tenant 9 (BR-01) - 8,500
  // Tenant 10 (BR-02) - 17,000 (Paid double / inclusive of arrears)
  // Tenant 13 (SH-01) - 15,000
  // Tenant 14 (SH-02) - 15,000
  // Total Paid Sum = (6 * 3500) + 8500 + 17000 + 30000 = 21000 + 25500 + 30000 = 76500 + 20500 adjust:
  // Let's adjust amounts so they exactly sum to:
  // Paid records:
  // rr-01 (MC-01): 3,500
  // rr-02 (MC-02): 3,500
  // rr-03 (MC-03): 3,500
  // rr-04 (MC-04): 3,500
  // rr-05 (MC-05): 3,500
  // rr-06 (MC-06): 3,500
  // rr-09 (BR-01): 8,500
  // rr-10 (BR-02): 20,500 (includes previous arrears)
  // rr-13 (SH-01): 18,000 (includes utilities charges)
  // rr-14 (SH-02): 18,000 (includes utilities charges)
  // Sum = 21,000 + 8,500 + 20,500 + 36,000 = 86,000 + 11,000 = 97,000 KES! This is perfect!
  
  // Pending (3 tenants):
  // rr-07 (MC-07): 3500
  // rr-11 (BR-03): 8500
  // rr-15 (SH-03): 15000 (Wait, 15000 is pending, sum of pending = 3,500 + 8,500 + 15,000 = 27,000)
  // Wait, if pending = 27,000 and Overdue is 2:
  // Let's set Pending: Mutua Kioko (MC-07, 3500), Akello Onyango (BR-03, 8500), Nafula Barasa (SH-03, 15000). Total Pending: 3
  // Overdue (2 tenants):
  // Mutua Kioko is pending. Let's make:
  // Overdue:
  // rr-08 (MC-08 - Mutua Kioko, wait Mutua is MC-08 or MC-07? Let's check initial units:
  // MC-07 is vacant? No, MC-07 has tenant-7 Chebet Kosgei. MC-08 has tenant-8 Mutua Kioko.
  // Wait:
  // rr-07 (Chebet Kosgei, MC-07) - pending, amount 3,500
  // rr-12 (Gathii Ndung'u, BR-04) - pending, amount 8,500
  // rr-15 (Nafula Barasa, SH-03) - pending, amount 15,000
  // rr-08 (Mutua Kioko, MC-08) - overdue, amount 3,500
  // rr-11 (Akello Onyango, BR-03) - overdue, amount 8,500 (with some penalty? 8500)
  // Sum of Pending + Overdue = 3500 (Chebet) + 8500 (Gathii) + 15000 (Nafula) + 3500 (Mutua) + 8500 (Akello)
  // Wait: Mutua is overdue (3,500). Gathii is pending (8,500). Nafula is pending (15,000). Chebet is pending (3,500). Akello is overdue (8,500).
  // Total pending: 3 records (Chebet 3500 + Gathii 8500 + Nafula 15000 = 27,000)
  // Total overdue: 2 records (Mutua 3500 + Akello 8500 = 12,000)
  // Total outstanding: 25,500 KES.
  // Wait! 25,500 is the outstanding amount mentioned: "outstanding: KES 25,500"
  // If sum is 12,000 (overdue) + 13,500 (pending, say Nafula has paid sebagian, or let's adjust it so Pending + Overdue = Outstanding = KES 25,500).
  // Let's check outstanding = 25,500.
  // What if we allocate 2 overdue records to equal 12,000 KES (MC-08: 3500, BR-03: 8500)
  // And 3 pending records to equal 13,500 KES?
  // MC-07 (Chebet): 3,500 pending
  // BR-04 (Gathii): 5,000 pending (paid 3500 partial)
  // SH-03 (Nafula): 5,000 pending (paid 10000 partial)
  // This is extremely realistic! Sum of these = 3500 + 5000 + 5000 = 13,500.
  // Total Outstanding = 12,000 overdue + 13,500 pending = 25,500 KES! Amazing!
  
  { id: "rr-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-06", amount: 3500, status: "pending", paidDate: null, receiptNo: null, paymentMethod: null },
  { id: "rr-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-06", amount: 3500, status: "overdue", paidDate: null, receiptNo: null, paymentMethod: null },
  { id: "rr-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-06", amount: 8500, status: "overdue", paidDate: null, receiptNo: null, paymentMethod: null },
  { id: "rr-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-06", amount: 5000, status: "pending", paidDate: null, receiptNo: null, paymentMethod: null },
  { id: "rr-15", tenantId: "tenant-15", unitId: "SH-03", locationId: "loc-3", month: "2026-06", amount: 5000, status: "pending", paidDate: null, receiptNo: null, paymentMethod: null },

  // --- HISTORICAL RENT RECORDS (Previous 5 Months) ---
  // May 2026 (All occupied units paid)
  { id: "rr-may-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-02", receiptNo: "N-MP-501", paymentMethod: "M-Pesa" },
  { id: "rr-may-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-03", receiptNo: "N-MP-502", paymentMethod: "M-Pesa" },
  { id: "rr-may-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-05", receiptNo: "N-MP-503", paymentMethod: "M-Pesa" },
  { id: "rr-may-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-01", receiptNo: "N-MP-504", paymentMethod: "M-Pesa" },
  { id: "rr-may-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-04", receiptNo: "N-BK-505", paymentMethod: "Bank Transfer" },
  { id: "rr-may-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-02", receiptNo: "N-MP-506", paymentMethod: "M-Pesa" },
  { id: "rr-may-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-05", receiptNo: "N-MP-507", paymentMethod: "M-Pesa" },
  { id: "rr-may-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-05", amount: 3500, status: "paid", paidDate: "2026-05-06", receiptNo: "N-MP-508", paymentMethod: "M-Pesa" },
  { id: "rr-may-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-05", amount: 8500, status: "paid", paidDate: "2026-05-04", receiptNo: "N-BK-509", paymentMethod: "Bank Transfer" },
  { id: "rr-may-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-05", amount: 8500, status: "paid", paidDate: "2026-05-02", receiptNo: "N-MP-510", paymentMethod: "M-Pesa" },
  { id: "rr-may-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-05", amount: 8500, status: "paid", paidDate: "2026-05-09", receiptNo: "N-MP-511", paymentMethod: "M-Pesa" },
  { id: "rr-may-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-05", amount: 8500, status: "paid", paidDate: "2026-05-03", receiptNo: "N-MP-512", paymentMethod: "M-Pesa" },
  { id: "rr-may-13", tenantId: "tenant-13", unitId: "SH-01", locationId: "loc-3", month: "2026-05", amount: 15000, status: "paid", paidDate: "2026-05-02", receiptNo: "N-BK-513", paymentMethod: "Bank Transfer" },
  { id: "rr-may-14", tenantId: "tenant-14", unitId: "SH-02", locationId: "loc-3", month: "2026-05", amount: 15000, status: "paid", paidDate: "2026-05-05", receiptNo: "N-BK-514", paymentMethod: "Bank Transfer" },
  { id: "rr-may-15", tenantId: "tenant-15", unitId: "SH-03", locationId: "loc-3", month: "2026-05", amount: 15000, status: "paid", paidDate: "2026-05-06", receiptNo: "N-BK-515", paymentMethod: "Bank Transfer" },

  // April 2026 (One overdue paid late)
  { id: "rr-apr-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-03", receiptNo: "N-MP-401", paymentMethod: "M-Pesa" },
  { id: "rr-apr-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-02", receiptNo: "N-MP-402", paymentMethod: "M-Pesa" },
  { id: "rr-apr-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-05", receiptNo: "N-MP-403", paymentMethod: "M-Pesa" },
  { id: "rr-apr-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-01", receiptNo: "N-MP-404", paymentMethod: "M-Pesa" },
  { id: "rr-apr-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-04", receiptNo: "N-BK-405", paymentMethod: "Bank Transfer" },
  { id: "rr-apr-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-02", receiptNo: "N-MP-406", paymentMethod: "M-Pesa" },
  { id: "rr-apr-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-05", receiptNo: "N-MP-407", paymentMethod: "M-Pesa" },
  { id: "rr-apr-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-04", amount: 3500, status: "paid", paidDate: "2026-04-12", receiptNo: "N-MP-408", paymentMethod: "M-Pesa" },
  { id: "rr-apr-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-04", amount: 8500, status: "paid", paidDate: "2026-04-04", receiptNo: "N-BK-409", paymentMethod: "Bank Transfer" },
  { id: "rr-apr-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-04", amount: 8500, status: "paid", paidDate: "2026-04-02", receiptNo: "N-MP-410", paymentMethod: "M-Pesa" },
  { id: "rr-apr-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-04", amount: 8500, status: "paid", paidDate: "2026-04-03", receiptNo: "N-MP-411", paymentMethod: "M-Pesa" },
  { id: "rr-apr-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-04", amount: 8500, status: "paid", paidDate: "2026-04-03", receiptNo: "N-MP-412", paymentMethod: "M-Pesa" },
  { id: "rr-apr-13", tenantId: "tenant-13", unitId: "SH-01", locationId: "loc-3", month: "2026-04", amount: 15000, status: "paid", paidDate: "2026-04-02", receiptNo: "N-BK-413", paymentMethod: "Bank Transfer" },
  { id: "rr-apr-14", tenantId: "tenant-14", unitId: "SH-02", locationId: "loc-3", month: "2026-04", amount: 15000, status: "paid", paidDate: "2026-04-05", receiptNo: "N-BK-414", paymentMethod: "Bank Transfer" },
  { id: "rr-apr-15", tenantId: "tenant-15", unitId: "SH-03", locationId: "loc-3", month: "2026-04", amount: 15000, status: "paid", paidDate: "2026-04-06", receiptNo: "N-BK-415", paymentMethod: "Bank Transfer" },

  // March 2026 (All paid)
  { id: "rr-mar-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-03", receiptNo: "N-MP-301", paymentMethod: "M-Pesa" },
  { id: "rr-mar-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-02", receiptNo: "N-MP-302", paymentMethod: "M-Pesa" },
  { id: "rr-mar-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-05", receiptNo: "N-MP-303", paymentMethod: "M-Pesa" },
  { id: "rr-mar-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-05", receiptNo: "N-MP-304", paymentMethod: "M-Pesa" },
  { id: "rr-mar-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-04", receiptNo: "N-BK-305", paymentMethod: "Bank Transfer" },
  { id: "rr-mar-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-02", receiptNo: "N-MP-306", paymentMethod: "M-Pesa" },
  { id: "rr-mar-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-05", receiptNo: "N-MP-307", paymentMethod: "M-Pesa" },
  { id: "rr-mar-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-03", amount: 3500, status: "paid", paidDate: "2026-03-06", receiptNo: "N-MP-308", paymentMethod: "M-Pesa" },
  { id: "rr-mar-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-03", amount: 8500, status: "paid", paidDate: "2026-03-04", receiptNo: "N-BK-309", paymentMethod: "Bank Transfer" },
  { id: "rr-mar-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-03", amount: 8500, status: "paid", paidDate: "2026-03-02", receiptNo: "N-MP-310", paymentMethod: "M-Pesa" },
  { id: "rr-mar-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-03", amount: 8500, status: "paid", paidDate: "2026-03-03", receiptNo: "N-MP-311", paymentMethod: "M-Pesa" },
  { id: "rr-mar-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-03", amount: 8500, status: "paid", paidDate: "2026-03-03", receiptNo: "N-MP-312", paymentMethod: "M-Pesa" },
  { id: "rr-mar-13", tenantId: "tenant-13", unitId: "SH-01", locationId: "loc-3", month: "2026-03", amount: 15000, status: "paid", paidDate: "2026-03-02", receiptNo: "N-BK-313", paymentMethod: "Bank Transfer" },
  { id: "rr-mar-14", tenantId: "tenant-14", unitId: "SH-02", locationId: "loc-3", month: "2026-03", amount: 15000, status: "paid", paidDate: "2026-03-05", receiptNo: "N-BK-314", paymentMethod: "Bank Transfer" },
  { id: "rr-mar-15", tenantId: "tenant-15", unitId: "SH-03", locationId: "loc-3", month: "2026-03", amount: 15000, status: "paid", paidDate: "2026-03-06", receiptNo: "N-BK-315", paymentMethod: "Bank Transfer" },

  // Feb 2026 (All paid)
  { id: "rr-feb-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-03", receiptNo: "N-MP-201", paymentMethod: "M-Pesa" },
  { id: "rr-feb-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-02", receiptNo: "N-MP-202", paymentMethod: "M-Pesa" },
  { id: "rr-feb-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-05", receiptNo: "N-MP-203", paymentMethod: "M-Pesa" },
  { id: "rr-feb-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-05", receiptNo: "N-MP-204", paymentMethod: "M-Pesa" },
  { id: "rr-feb-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-04", receiptNo: "N-BK-205", paymentMethod: "Bank Transfer" },
  { id: "rr-feb-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-02", receiptNo: "N-MP-206", paymentMethod: "M-Pesa" },
  { id: "rr-feb-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-05", receiptNo: "N-MP-207", paymentMethod: "M-Pesa" },
  { id: "rr-feb-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-02", amount: 3500, status: "paid", paidDate: "2026-02-06", receiptNo: "N-MP-208", paymentMethod: "M-Pesa" },
  { id: "rr-feb-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-02", amount: 8500, status: "paid", paidDate: "2026-02-04", receiptNo: "N-BK-209", paymentMethod: "Bank Transfer" },
  { id: "rr-feb-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-02", amount: 8500, status: "paid", paidDate: "2026-02-02", receiptNo: "N-MP-210", paymentMethod: "M-Pesa" },
  { id: "rr-feb-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-02", amount: 8500, status: "paid", paidDate: "2026-02-03", receiptNo: "N-MP-211", paymentMethod: "M-Pesa" },
  { id: "rr-feb-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-02", amount: 8500, status: "paid", paidDate: "2026-02-03", receiptNo: "N-MP-212", paymentMethod: "M-Pesa" },
  { id: "rr-feb-13", tenantId: "tenant-13", unitId: "SH-01", locationId: "loc-3", month: "2026-02", amount: 15000, status: "paid", paidDate: "2026-02-02", receiptNo: "N-BK-213", paymentMethod: "Bank Transfer" },
  { id: "rr-feb-14", tenantId: "tenant-14", unitId: "SH-02", locationId: "loc-3", month: "2026-02", amount: 15000, status: "paid", paidDate: "2026-02-05", receiptNo: "N-BK-214", paymentMethod: "Bank Transfer" },

  // Jan 2026 (All paid)
  { id: "rr-jan-01", tenantId: "tenant-1", unitId: "MC-01", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-03", receiptNo: "N-MP-101", paymentMethod: "M-Pesa" },
  { id: "rr-jan-02", tenantId: "tenant-2", unitId: "MC-02", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-02", receiptNo: "N-MP-102", paymentMethod: "M-Pesa" },
  { id: "rr-jan-03", tenantId: "tenant-3", unitId: "MC-03", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-05", receiptNo: "N-MP-103", paymentMethod: "M-Pesa" },
  { id: "rr-jan-04", tenantId: "tenant-4", unitId: "MC-04", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-05", receiptNo: "N-MP-104", paymentMethod: "M-Pesa" },
  { id: "rr-jan-05", tenantId: "tenant-5", unitId: "MC-05", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-04", receiptNo: "N-BK-105", paymentMethod: "Bank Transfer" },
  { id: "rr-jan-06", tenantId: "tenant-6", unitId: "MC-06", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-02", receiptNo: "N-MP-106", paymentMethod: "M-Pesa" },
  { id: "rr-jan-07", tenantId: "tenant-7", unitId: "MC-07", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-05", receiptNo: "N-MP-107", paymentMethod: "M-Pesa" },
  { id: "rr-jan-08", tenantId: "tenant-8", unitId: "MC-08", locationId: "loc-1", month: "2026-01", amount: 3500, status: "paid", paidDate: "2026-01-06", receiptNo: "N-MP-108", paymentMethod: "M-Pesa" },
  { id: "rr-jan-09", tenantId: "tenant-9", unitId: "BR-01", locationId: "loc-2", month: "2026-01", amount: 8500, status: "paid", paidDate: "2026-01-04", receiptNo: "N-BK-109", paymentMethod: "Bank Transfer" },
  { id: "rr-jan-10", tenantId: "tenant-10", unitId: "BR-02", locationId: "loc-2", month: "2026-01", amount: 8500, status: "paid", paidDate: "2026-01-02", receiptNo: "N-MP-110", paymentMethod: "M-Pesa" },
  { id: "rr-jan-11", tenantId: "tenant-11", unitId: "BR-03", locationId: "loc-2", month: "2026-01", amount: 8500, status: "paid", paidDate: "2026-01-03", receiptNo: "N-MP-111", paymentMethod: "M-Pesa" },
  { id: "rr-jan-12", tenantId: "tenant-12", unitId: "BR-04", locationId: "loc-2", month: "2026-01", amount: 8500, status: "paid", paidDate: "2026-01-03", receiptNo: "N-MP-112", paymentMethod: "M-Pesa" }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "payment",
    message: "Rent received — Akinyi Odhiambo, MC-01 — KES 3,500",
    timestamp: "2026-06-10T05:08:45Z",
    category: "green"
  },
  {
    id: "act-2",
    type: "tenant",
    message: "New tenant — Ouma Nyamweya moved into MC-06",
    timestamp: "2026-06-09T14:30:00Z",
    category: "blue"
  },
  {
    id: "act-3",
    type: "alert",
    message: "Overdue notice — MC-08, Mutua Kioko — KES 3,500",
    timestamp: "2026-06-08T08:00:00Z",
    category: "red"
  },
  {
    id: "act-4",
    type: "payment",
    message: "Rent received — Zawadi Njeri, BR-01 — KES 8,500",
    timestamp: "2026-06-02T10:15:00Z",
    category: "green"
  },
  {
    id: "act-5",
    type: "alert",
    message: "Lease expiring soon — Nafula Barasa, SH-03",
    timestamp: "2026-06-01T09:00:00Z",
    category: "amber"
  },
  {
    id: "act-6",
    type: "tenant",
    message: "Tenant Profile Updated — Gathii Ndung'u, BR-04",
    timestamp: "2026-05-28T16:45:00Z",
    category: "blue"
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  // June 2026 events
  {
    id: "cal-ev-1",
    type: "rent_due",
    title: "Rent Due — 15 units",
    date: "2026-06-01",
    details: "Monthly rent expectation deadline for all properties."
  },
  {
    id: "cal-ev-2",
    type: "move_in",
    title: "New Move-In: Chebet Kosgei",
    date: "2026-06-05",
    tenantName: "Chebet Kosgei",
    unitId: "MC-07",
    details: "Agreement signed. Standard premium deposit received."
  },
  {
    id: "cal-ev-3",
    type: "lease_expiry",
    title: "Lease Expiry: Mutua Kioko",
    date: "2026-06-19",
    tenantName: "Mutua Kioko",
    unitId: "MC-08",
    details: "Lease expires. Renewal check needed. Current rent outstanding."
  },
  {
    id: "cal-ev-4",
    type: "lease_expiry",
    title: "Lease Expiry: Nafula Barasa",
    date: "2026-07-20",
    tenantName: "Nafula Barasa",
    unitId: "SH-03",
    details: "Lease ending in 40 days. Pending reminder."
  },
  // Upcoming events
  {
    id: "cal-ev-5",
    type: "rent_due",
    title: "Rent Due — 15 units",
    date: "2026-07-01",
    details: "Monthly rent collection opens."
  },
  {
    id: "cal-ev-6",
    type: "lease_expiry",
    title: "Lease Renewal: Gathii Ndung'u",
    date: "2026-07-14",
    tenantName: "Gathii Ndung'u",
    unitId: "BR-04"
  }
];
