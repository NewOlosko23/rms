// FILE: src/pages/TenantDetail.tsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  Fingerprint,
  Calendar,
  AlertOctagon,
  Download,
  Trash2,
  FileText,
  UploadCloud,
  CheckCircle,
  Clock,
  Lock,
  RefreshCw,
  Wrench
} from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import { useConfirm } from "../context/ConfirmContext";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import Avatar from "../components/ui/Avatar";
import { formatDate, formatKES, formatMonthYear } from "../data/helpers";

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const { tenants, units, locations, rentRecords, depositRecords, vacateTenant, markPaid, processDepositRefund, processRepairDeduction } = useRentSystem();
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useConfirm();

  const [activeTab, setActiveTab] = useState<"rent" | "docs" | "notes">("rent");
  const [internalNotes, setInternalNotes] = useState(
    "Resident has been extremely pleasant. Standard timely rent payment habits since move-in."
  );
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [repairAmount, setRepairAmount] = useState(0);
  const [repairReason, setRepairReason] = useState("");

  const tenant = tenants.find((t) => t.id === id);

  if (!tenant) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">Tenant profile not found</h3>
        <p className="text-xs text-slate-400 mt-1">Provide a correct URL footprint or return to directories.</p>
        <Link
          to="/tenants"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
        >
          Back to Tenants Directory
        </Link>
      </div>
    );
  }

  const assignedUnit = units.find((u) => u.id === tenant.unitId);
  const locationObj = locations.find((l) => l.id === tenant.locationId);
  const tenantDeposit = depositRecords.find((d) => d.tenantId === tenant.id);

  // Filter rent history for this tenant
  const tenantRentHistory = rentRecords
    .filter((r) => r.tenantId === tenant.id)
    .sort((a, b) => b.month.localeCompare(a.month));

  // Compute stats dynamically
  const paidYearBills = tenantRentHistory.filter((r) => r.status === "paid" && r.month.startsWith("2026"));
  const expectedYearBillValue = tenantRentHistory.reduce((s, r) => s + r.amount, 0);
  const paidYearBillValue = paidYearBills.reduce((s, r) => s + r.amount, 0);

  const handleVacate = async () => {
    const confirmed = await showConfirm({
      type: "confirm",
      title: "Evict Tenant?",
      message: `You are about to permanently remove ${tenant.name} from Unit ${tenant.unitId}. This will unassign the unit, clear pending rent records, and generate an activity log entry. This action cannot be undone.`,
      confirmLabel: "Evict Tenant",
      cancelLabel: "Cancel",
      isDanger: true,
    });

    if (confirmed) {
      vacateTenant(tenant.id);
      await showAlert("success", "Tenant Evicted", `${tenant.name} has been evicted from Unit ${tenant.unitId}.`);
      navigate("/tenants");
    }
  };

  const currentMonthRecord = tenantRentHistory.find(r => r.month === "2026-06");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/tenants")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-xs font-semibold text-slate-400">
          <Link to="/tenants" className="hover:text-indigo-600 transition-colors">Tenants</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-bold">{tenant.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: TENANT PERSONAL PROFILE CARD */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 flex flex-col items-center text-center">
            
            {/* Avatar block */}
            <Avatar name={tenant.name} src={tenant.avatar} size="xl" />
            
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-4">{tenant.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Resident Profile</p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3.5">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                Suite {tenant.unitId}
              </span>
              <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {locationObj ? locationObj.name : "N/A"}
              </span>
            </div>

            <div className="w-full border-t border-slate-100 my-5"></div>

            {/* Structured details list */}
            <div className="w-full space-y-3.5 text-left text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Mobile Contact</span>
                  <span className="font-bold text-slate-800">{tenant.phone}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Email Address</span>
                  <span className="font-bold text-slate-800 truncate block max-w-[200px]">{tenant.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">National ID</span>
                  <span className="font-bold text-slate-800 font-mono">{tenant.nationalId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Contract Lease Span</span>
                  <span className="font-bold text-slate-800">
                    {formatDate(tenant.moveInDate)} to {formatDate(tenant.leaseEndDate)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
                <AlertOctagon className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Rescue Next of Kin</span>
                  <span className="font-bold text-slate-700 block text-[11px]">{tenant.emergencyContact}</span>
                  <span className="text-slate-600 block text-[10px] mt-0.5">{tenant.emergencyPhone}</span>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-slate-100 my-5"></div>

            {/* DEPOSIT PAYMENT & STATUS CARD */}
            {tenantDeposit && (
              <div className="w-full space-y-3">
                {/* Deposit Payment Status */}
                <div className={`rounded-lg border p-4 space-y-2 ${
                  tenant.depositPaid 
                    ? "bg-emerald-50 border-emerald-200/60" 
                    : "bg-yellow-50 border-yellow-200/60"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className={`w-4 h-4 ${tenant.depositPaid ? "text-emerald-600" : "text-yellow-600"}`} />
                      <span className={`text-xs font-bold ${tenant.depositPaid ? "text-emerald-900" : "text-yellow-900"}`}>
                        {tenant.depositPaid ? "✓ Deposit Paid" : "⚠ Deposit Not Paid"}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      tenant.depositPaid ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {tenant.depositPaid ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className={`text-[9px] font-semibold ${tenant.depositPaid ? "text-emerald-700/70" : "text-yellow-700/70"}`}>Amount Required</span>
                      <p className={`text-sm font-bold mt-0.5 ${tenant.depositPaid ? "text-emerald-900" : "text-yellow-900"}`}>
                        {formatKES(tenantDeposit.amount)}
                      </p>
                    </div>
                    <div>
                      <span className={`text-[9px] font-semibold ${tenant.depositPaid ? "text-emerald-700/70" : "text-yellow-700/70"}`}>
                        {tenant.depositPaid ? "Paid Date" : "Due on Move-In"}
                      </span>
                      <p className={`text-sm font-bold mt-0.5 ${tenant.depositPaid ? "text-emerald-900" : "text-yellow-900"}`}>
                        {tenant.depositPaidDate ? formatDate(tenant.depositPaidDate) : formatDate(tenant.moveInDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deposit Current Status */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-lg border border-amber-200/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-900">Deposit Status</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      tenantDeposit.status === "held" ? "bg-blue-100 text-blue-700" :
                      tenantDeposit.status === "refunded" ? "bg-emerald-100 text-emerald-700" :
                      tenantDeposit.status === "repair_deducted" ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {tenantDeposit.status === "held" ? "Held" :
                       tenantDeposit.status === "refunded" ? "Refunded" :
                       tenantDeposit.status === "repair_deducted" ? "Deducted for Repairs" :
                       tenantDeposit.status === "rent_applied" ? "Applied to Rent" :
                       tenantDeposit.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] text-amber-700/70 font-semibold">Current Amount</span>
                      <p className="text-sm font-bold text-amber-900 mt-0.5">{formatKES(tenantDeposit.amount)}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-700/70 font-semibold">Status Since</span>
                      <p className="text-sm font-bold text-amber-900 mt-0.5">{tenantDeposit.paidDate ? formatDate(tenantDeposit.paidDate) : "—"}</p>
                    </div>
                  </div>

                  {tenantDeposit.status === "repair_deducted" && (
                    <div className="bg-white/60 rounded p-2 border border-amber-200/40 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-[9px] font-semibold text-slate-700">Repair Deduction</span>
                      </div>
                      <p className="text-[9px] text-slate-600">{tenantDeposit.deductionReason}</p>
                      <p className="text-xs font-bold text-orange-700">-{formatKES(tenantDeposit.deductionAmount)} ({formatKES(tenantDeposit.refundAmount)} refund due)</p>
                    </div>
                  )}

                  {tenantDeposit.status === "refunded" && (
                    <div className="bg-white/60 rounded p-2 border border-amber-200/40">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[9px] font-semibold text-slate-700">Refund Processed</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-700">{formatKES(tenantDeposit.refundAmount)} refunded on {formatDate(tenantDeposit.refundDate || "")}</p>
                    </div>
                  )}

                  {tenantDeposit.status === "held" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowRefundModal(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white text-amber-700 border border-amber-300 rounded text-[9px] font-bold hover:bg-amber-50 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Refund Deposit
                      </button>
                      <button
                        onClick={() => setShowRepairModal(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-white text-orange-700 border border-orange-300 rounded text-[9px] font-bold hover:bg-orange-50 transition cursor-pointer"
                      >
                        <Wrench className="w-3 h-3" />
                        Deduct for Repairs
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="w-full border-t border-slate-100 my-5"></div>

            {/* Profile Action Deck */}
            <div className="w-full space-y-2.5">
              <button
                onClick={() => showAlert("success", "Download Ready", "Lease PDF wrapper ready. Sourced template downloaded!")}
                className="w-full cursor-pointer py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                Download Signed Lease (PDF)
              </button>
              <button
                onClick={handleVacate}
                className="w-full cursor-pointer py-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                Evict / Terminate Contract
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TAB ACTIONS PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Selection Header */}
          <div className="bg-white p-1 rounded-xl border border-slate-200/80 flex shadow-xs text-xs font-semibold">
            <button
              onClick={() => setActiveTab("rent")}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                activeTab === "rent" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Rent Ledger History
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                activeTab === "docs" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Contract Documentation
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                activeTab === "notes" ? "bg-indigo-600 text-white font-bold" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Resident Logs
            </button>
          </div>

          {/* TAB 1 CONTENT: RENT LEDGER */}
          {activeTab === "rent" && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Dynamic Year Bill value */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 font-medium">YTD Paid Ratio (2026)</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">
                    {formatKES(paidYearBillValue)} <span className="text-slate-400 font-medium">/ {formatKES(expectedYearBillValue)}</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    Collection Safe
                  </span>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      <th className="py-2.5 px-6">Period</th>
                      <th className="py-2.5 px-6">Amount</th>
                      <th className="py-2.5 px-6">Method</th>
                      <th className="py-2.5 px-6">Receipt No</th>
                      <th className="py-2.5 px-6">Rent status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {tenantRentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-6 font-semibold text-slate-700">
                          {formatMonthYear(item.month)}
                        </td>
                        <td className="py-3 px-6 font-bold text-slate-800">{formatKES(item.amount)}</td>
                        <td className="py-3 px-6 font-medium text-slate-500">{item.paymentMethod || "N/A"}</td>
                        <td className="py-3 px-6 font-medium font-mono text-slate-600">{item.receiptNo || "N/A"}</td>
                        <td className="py-3 px-6">
                          <RentStatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: DOCUMENT ARCHIVES */}
          {activeTab === "docs" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Agreement Documentation</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Verify or upload digital legal proofs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ID Proof Card */}
                <div className="border border-slate-100 rounded-xl p-4 text-center space-y-3 bg-slate-50/50">
                  <FileText className="w-7 h-7 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs font-mono">Kenyan National ID</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Scanned Copy ID Proof</p>
                  </div>
                  <button
                    onClick={() => showAlert("info", "Upload", "Upload proof client trigger activated")}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-lg transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Scanned
                  </button>
                </div>

                {/* Lease Contract Card */}
                <div className="border border-slate-100 rounded-xl p-4 text-center space-y-3 bg-slate-50/50">
                  <FileText className="w-7 h-7 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs font-mono">Lease Contract</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Signed Tenancy contract</p>
                  </div>
                  <button
                    onClick={() => showAlert("info", "Upload", "Upload proof client trigger activated")}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-lg transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Contract
                  </button>
                </div>

                {/* Checks report Card */}
                <div className="border border-slate-100 rounded-xl p-4 text-center space-y-3 bg-slate-50/50">
                  <FileText className="w-7 h-7 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs font-mono">Move-In Checklist</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Handover inventory logs</p>
                  </div>
                  <button
                    onClick={() => showAlert("info", "Upload", "Upload proof client trigger activated")}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-lg transition"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Checklist
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 CONTENT: PRIVATE RESIDENT LOGS */}
          {activeTab === "notes" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Manager Resident Log Scratchpad</h4>
                <p className="text-xs text-slate-400 mt-0.5">Record critical conversation notes or agreements privately</p>
              </div>

              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 h-36 font-semibold"
                placeholder="Log notes about custom utility fees or tenant correspondence..."
              />
              <button
                onClick={() => {
                  showAlert("success", "Saved", "Tenant private log saved safely!");
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-indigo-500/10 cursor-pointer transition-colors"
              >
                Sync Conversation Log
              </button>
            </div>
          )}

        </div>

      </div>

      {/* REFUND MODAL */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Refund Deposit</h3>
              <p className="text-xs text-slate-400 mt-1">Process a deposit refund for {tenant.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">Refund Amount (KES)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                max={tenantDeposit?.amount || 0}
                placeholder={`Max: ${formatKES(tenantDeposit?.amount || 0)}`}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
              />
              <p className="text-[9px] text-slate-400">Original deposit: {formatKES(tenantDeposit?.amount || 0)}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundAmount(0);
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (refundAmount > 0 && refundAmount <= (tenantDeposit?.amount || 0) && tenantDeposit) {
                    processDepositRefund(tenantDeposit.id, refundAmount);
                    showAlert("success", "Refund Processed", `Deposit refund of ${formatKES(refundAmount)} has been processed for ${tenant.name}.`);
                    setShowRefundModal(false);
                    setRefundAmount(0);
                  } else {
                    showAlert("error", "Invalid Amount", "Please enter a valid refund amount.");
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPAIR DEDUCTION MODAL */}
      {showRepairModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Deduct for Repairs</h3>
              <p className="text-xs text-slate-400 mt-1">Record damage costs for {tenant.name}'s deposit</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">Deduction Amount (KES)</label>
              <input
                type="number"
                value={repairAmount}
                onChange={(e) => setRepairAmount(parseInt(e.target.value) || 0)}
                max={tenantDeposit?.amount || 0}
                placeholder="Enter repair cost"
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
              />
              <p className="text-[9px] text-slate-400">Available deposit: {formatKES(tenantDeposit?.amount || 0)}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">Reason for Deduction</label>
              <textarea
                value={repairReason}
                onChange={(e) => setRepairReason(e.target.value)}
                placeholder="e.g., Wall damage, broken window, carpet stains..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 h-20 font-semibold"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowRepairModal(false);
                  setRepairAmount(0);
                  setRepairReason("");
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (repairAmount > 0 && repairReason.trim() && repairAmount <= (tenantDeposit?.amount || 0) && tenantDeposit) {
                    processRepairDeduction(tenantDeposit.id, repairAmount, repairReason);
                    showAlert("success", "Deduction Recorded", `Repair deduction of ${formatKES(repairAmount)} recorded. Refund due: ${formatKES((tenantDeposit?.amount || 0) - repairAmount)}`);
                    setShowRepairModal(false);
                    setRepairAmount(0);
                    setRepairReason("");
                  } else {
                    showAlert("error", "Invalid Input", "Please enter valid amount and reason.");
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Apply Deduction
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
