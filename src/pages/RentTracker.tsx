// FILE: src/pages/RentTracker.tsx
import React, { useState, useEffect } from "react";
import { Download, CheckCircle, Send, Search, BellRing, Smartphone, AlertCircle, Sparkles, X, ChevronDown, Check, CreditCard, RefreshCw } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import StatCard from "../components/ui/StatCard";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import EmptyState from "../components/ui/EmptyState";
import Avatar from "../components/ui/Avatar";
import { formatKES, formatMonthYear, formatDate } from "../data/helpers";
import { motion, AnimatePresence } from "motion/react";

export default function RentTracker() {
  const { rentRecords, tenants, locations, markPaid, sendReminder, settings, simulateMpesaPayment, globalSearchQuery, setGlobalSearchQuery } = useRentSystem();
  
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const searchQuery = globalSearchQuery;
  const setSearchQuery = setGlobalSearchQuery;

  // Sandbox simulation panel state
  const [showSimulator, setShowSimulator] = useState(false);
  const [simTenantId, setSimTenantId] = useState("");
  const [simAmount, setSimAmount] = useState<number>(0);
  const [simCode, setSimCode] = useState("");
  const [simSuccess, setSimSuccess] = useState(false);

  // Dynamic toast notifications for intercepted transactions
  const [activeToast, setActiveToast] = useState<{
    id: string;
    message: string;
    code: string;
    amount: number;
    tenantName: string;
    unitId: string;
  } | null>(null);

  // Reminder Modal State
  const [reminderData, setReminderData] = useState<{
    tenantId: string;
    tenantName: string;
    tenantPhone: string;
    unitId: string;
    amount: number;
    month: string;
    smsBody: string;
  } | null>(null);

  // Generate mock transaction code on simulator load or change
  const generateSimCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "MP";
    for (let i = 0; i < 2; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    setSimCode(code);
  };

  useEffect(() => {
    generateSimCode();
  }, [simTenantId]);

  // Set default simulator tenant
  useEffect(() => {
    const defaultPending = rentRecords.find((r) => r.month === selectedMonth && r.status !== "paid");
    if (defaultPending) {
      setSimTenantId(defaultPending.tenantId);
      setSimAmount(defaultPending.amount);
    } else {
      const firstTenant = tenants[0];
      if (firstTenant) {
        setSimTenantId(firstTenant.id);
        const rent = rentRecords.find(r => r.tenantId === firstTenant.id)?.amount || 15000;
        setSimAmount(rent);
      }
    }
  }, [selectedMonth, rentRecords, tenants]);

  // Selectable months options
  const monthOptions = ["2026-06", "2026-05", "2026-04", "2026-03", "2026-02", "2026-01"];

  // Filter records by Month
  const monthRecords = rentRecords.filter((r) => r.month === selectedMonth);

  // Dynamic stat sums
  const totalExpected = monthRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = monthRecords.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0);
  const totalOutstanding = totalExpected - totalPaid;
  const collectionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  // Filter by search query & selected status tab
  const filteredRecords = monthRecords
    .map((record) => {
      const tenantObj = tenants.find((t) => t.id === record.tenantId);
      const locationObj = locations.find((l) => l.id === record.locationId);
      return {
        ...record,
        tenantName: tenantObj ? tenantObj.name : "N/A",
        tenantPhone: tenantObj ? tenantObj.phone : "",
        avatar: tenantObj ? tenantObj.avatar : "",
        locationName: locationObj ? locationObj.name : "N/A",
      };
    })
    .filter((record) => {
      // 1. Status Filter
      if (activeTab !== "all" && record.status !== activeTab) return false;

      // 2. Search query matches
      const matchesSearch =
        record.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.unitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.locationName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

  // Export ledger to standard browser CSV file
  const handleExportCSV = () => {
    try {
      const headers = ["Period", "Tenant Name", "Unit ID", "Location Plot", "Amount (KES)", "Rent Status", "Paid Date", "Receipt No", "Method"];
      const rows = filteredRecords.map((r) => [
        formatMonthYear(r.month),
        r.tenantName,
        r.unitId,
        r.locationName,
        r.amount,
        r.status.toUpperCase(),
        r.paidDate || "N/A",
        r.receiptNo || "N/A",
        r.paymentMethod || "N/A"
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `NestIQ_Ledger_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Fail exporting: browser context restriction.");
    }
  };

  // Trigger simulated transaction caught event
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTenantId) return;

    const matchedTenant = tenants.find((t) => t.id === simTenantId);
    const matchedRecord = rentRecords.find((r) => r.tenantId === simTenantId && r.status !== "paid");
    if (!matchedTenant) return;

    const codeToCommit = simCode || `MP${Math.floor(100000 + Math.random() * 900000)}`;
    const success = simulateMpesaPayment(simTenantId, simAmount, codeToCommit);

    if (success) {
      setSimSuccess(true);
      
      // Set active alert toast
      setActiveToast({
        id: `toast-${Date.now()}`,
        message: `Transaction Intercepted Successfully!`,
        code: codeToCommit,
        amount: simAmount,
        tenantName: matchedTenant.name,
        unitId: matchedRecord ? matchedRecord.unitId : matchedTenant.unitId,
      });

      generateSimCode();
      setTimeout(() => setSimSuccess(false), 2005);
      
      // Auto dismiss active toast after 6 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 6000);
    } else {
      alert("Simulation failed: This tenant has no pending or overdue invoices for this current billing cycle!");
    }
  };

  // Launch SMS reminder preview dialog
  const handleLaunchReminder = (record: typeof filteredRecords[0]) => {
    const mpesaTillText = settings.mpesaTill || "5431201";
    const monthText = formatMonthYear(record.month);
    
    // Calculate if late payment penalty is active and applicable to this record's location
    const hasPenalty = record.status === "overdue" && settings?.enableLatePaymentFee && settings?.lateFeeLocationIds?.includes(record.locationId);
    const penaltyAmount = hasPenalty ? settings.latePaymentFee : 0;
    const totalDue = record.amount + penaltyAmount;
    const penaltyMsg = hasPenalty ? ` (inclusive of KES ${settings.latePaymentFee.toLocaleString()} late payment penalty)` : "";

    const defaultSms = `Dear ${record.tenantName}, Rent for Suite ${record.unitId} (${monthText}) of KES ${totalDue.toLocaleString()}${penaltyMsg} is due. Please clear via our active M-Pesa Buy Goods Till: ${mpesaTillText} (NestIQ). Thank you for partner compliance.`;

    setReminderData({
      tenantId: record.tenantId,
      tenantName: record.tenantName,
      tenantPhone: record.tenantPhone,
      unitId: record.unitId,
      amount: totalDue,
      month: record.month,
      smsBody: defaultSms,
    });
  };

  const handleConfirmSendReminder = () => {
    if (!reminderData) return;
    sendReminder(reminderData.tenantId, reminderData.unitId);
    
    // Show quick browser alert or let the Context notifications handle standard feedback
    setReminderData(null);
    alert(`Success: Payment reminder dispatch request sent to the Avodal SMS Queue for ${reminderData.tenantName}!`);
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-300">
      
      {/* REALTIME INTERMEDIATE TRANSACTION TOAST BANNER */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 md:right-8 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-emerald-500/30 overflow-hidden"
          >
            <div className="p-4 space-y-3 font-semibold text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  M-Pesa Hook Intercept
                </span>
                <button
                  onClick={() => setActiveToast(null)}
                  className="p-1 rounded-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="font-bold">
                  Transaction Code: <span className="font-mono text-emerald-400 font-bold">{activeToast.code}</span>
                </p>
                <p className="text-[11px] font-medium leading-relaxed">
                  Real-time transfer of <span className="font-bold text-emerald-300">KES {activeToast.amount.toLocaleString()}</span> caught on Till <span className="font-bold underline text-white font-mono">{settings.mpesaTill}</span>. Matched immediately to tenant:
                </p>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-white text-[11px]">
                    <span>Name:</span>
                    <span>{activeToast.tenantName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px] font-mono">
                    <span>Suite:</span>
                    <span>{activeToast.unitId}</span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> System status automarked: PAID
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer shadow-2xs hover:border-slate-300 transition-colors"
          >
            {monthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {formatMonthYear(opt)}
              </option>
            ))}
          </select>

          {/* SIMULATOR TOGGLE */}
          <button
            onClick={() => {
              setShowSimulator(!showSimulator);
              generateSimCode();
            }}
            className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors font-mono shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            {showSimulator ? "Close Sim Intercept" : "Simulate Till Payment"}
          </button>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 cursor-pointer px-4  py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors font-mono"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export ledger (CSV)
        </button>
      </div>

      {/* SIMULATOR DRAWER PANEL */}
      {showSimulator && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white/90 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="font-bold text-xs flex items-center gap-2 text-indigo-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                M-PESA INSTANT INTERCEPT GATEWAY SANDBOX
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                We capture Buy Goods transfers to your configured Till <span className="font-mono text-white font-bold bg-slate-800 px-1.5 py-0.5 rounded-sm">{settings.mpesaTill}</span> and auto-match them against unpaid tenant balances.
              </p>
            </div>
            <button
              onClick={() => setShowSimulator(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSimulatePayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs font-semibold">
            <div>
              <label className="block text-slate-400 mb-1">Target Tenant (Unpaid)</label>
              <select
                value={simTenantId}
                onChange={(e) => {
                  setSimTenantId(e.target.value);
                  const matchedRecord = rentRecords.find(r => r.tenantId === e.target.value && r.status !== "paid");
                  setSimAmount(matchedRecord ? matchedRecord.amount : 15000);
                }}
                className="w-full text-xs p-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-hidden"
              >
                {tenants.map(t => {
                  const pendingRecord = rentRecords.find(r => r.tenantId === t.id && r.status !== "paid");
                  return (
                    <option key={t.id} value={t.id}>
                      {t.name} (Unit {t.unitId}) {pendingRecord ? `— KES ${pendingRecord.amount.toLocaleString()}` : " (No pending)"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Simulated Amount (KES)</label>
              <input
                type="number"
                value={simAmount}
                onChange={(e) => setSimAmount(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 bg-slate-800 border border-slate-700 text-white font-bold font-mono rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex justify-between select-none">
                <span>Transaction Code</span>
                <span onClick={generateSimCode} className="text-xs text-indigo-400 hover:underline cursor-pointer flex items-center gap-0.5">
                  <RefreshCw className="w-2.5 h-2.5" /> regen
                </span>
              </label>
              <input
                type="text"
                value={simCode}
                onChange={(e) => setSimCode(e.target.value)}
                placeholder="e.g. MP394R951X"
                className="w-full text-xs p-2.5 bg-slate-800 border border-slate-700 text-emerald-400 font-bold font-mono rounded-lg focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 focus:shadow-sm"
            >
              {simSuccess ? "Triggering..." : "Publish Till Payment"}
            </button>
          </form>
        </div>
      )}

      {/* Stats summaries row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Expected"
          value={formatKES(totalExpected)}
          subtitle={`Potential earnings for ${formatMonthYear(selectedMonth)}`}
          icon="Building2"
          accentColor="indigo"
        />
        <StatCard
          title="Total Collected"
          value={`${formatKES(totalPaid)} (${collectionRate}%)`}
          subtitle={`Payments finalized for ${formatMonthYear(selectedMonth)}`}
          icon="CheckCircle"
          accentColor="green"
        />
        <StatCard
          title="Outstanding Arrears"
          value={formatKES(totalOutstanding)}
          subtitle={`Uncollected outstanding amounts`}
          icon="AlertCircle"
          accentColor="amber"
        />
      </div>

      {/* Progress speed indicators */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-500 font-medium">Rent Collection Velocity</span>
          <span className="text-indigo-600 font-mono font-bold">{collectionRate}% complete</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${collectionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Tab controls and filters bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
        
        {/* Navigation tabs inside header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Status Tabs - SCROLLABLE ON MOBILE */}
          <div className="overflow-x-auto whitespace-nowrap max-w-full flex gap-1 bg-slate-100 p-1 rounded-lg scrollbar-none select-none flex-shrink-0">
            {["all", "paid", "pending", "overdue"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors uppercase tracking-wider text-[10px] font-bold ${
                  activeTab === tab
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tenant, room, plot name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white animate-transition"
            />
          </div>

        </div>

        {/* Ledger Table Grid - Responsive Scroll */}
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <th className="py-2.5 px-6">Tenant</th>
                  <th className="py-2.5 px-6">Suite</th>
                  <th className="py-2.5 px-6">Property Plot</th>
                  <th className="py-2.5 px-6">Rent Value</th>
                  <th className="py-2.5 px-6">Rent Status</th>
                  <th className="py-2.5 px-6">Paid Date</th>
                  <th className="py-2.5 px-6">Mpesa/Bank code</th>
                  <th className="py-2.5 px-6 shrink-0 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecords.map((item) => {
                  let rowColorClass = "";
                  if (item.status === "paid") {
                    rowColorClass = "bg-emerald-50/20 text-slate-800";
                  } else if (item.status === "pending") {
                    rowColorClass = "bg-amber-50/20 text-slate-800";
                  } else if (item.status === "overdue") {
                    rowColorClass = "bg-rose-50/20 text-slate-800";
                  }

                  return (
                    <tr key={item.id} className={`${rowColorClass} hover:bg-slate-50/80 transition-colors`}>
                      <td className="py-3 px-6 font-semibold">
                        <div className="flex items-center gap-3">
                          <Avatar name={item.tenantName} src={item.avatar} size="md" />
                          <div>
                            <span className="font-bold text-slate-800 block">{item.tenantName}</span>
                            <span className="text-[9px] text-slate-400 font-medium font-mono lowercase block leading-none">{item.tenantPhone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 font-mono font-bold text-slate-600">{item.unitId}</td>
                      <td className="py-3 px-6 text-slate-500 font-medium">{item.locationName}</td>
                      <td className="py-3 px-6 font-semibold">
                        <span className="font-bold text-slate-800 block">{formatKES(item.amount)}</span>
                        {item.status === "overdue" && settings?.enableLatePaymentFee && settings?.lateFeeLocationIds?.includes(item.locationId) && (
                          <span className="inline-block mt-1 text-[9px] text-rose-600 bg-rose-50/80 border border-rose-100 px-1.5 py-0.5 rounded-sm font-bold font-mono leading-none whitespace-nowrap animate-pulse">
                            + {formatKES(settings.latePaymentFee)} Penalty
                          </span>
                        )}
                        {item.status === "overdue" && (!settings?.enableLatePaymentFee || !settings?.lateFeeLocationIds?.includes(item.locationId)) && (
                          <span className="inline-block mt-1 text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-sm font-medium leading-none whitespace-nowrap">
                            Penalty Exempt
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <RentStatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-6 text-slate-400 font-medium whitespace-nowrap">
                        {item.paidDate ? formatDate(item.paidDate) : "N/A"}
                      </td>
                      <td className="py-3 px-6 font-mono font-bold text-slate-600">
                        {item.receiptNo ? (
                          <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-150/75 p-1 px-2.5 rounded-md text-[10px]">
                            {item.receiptNo}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex gap-2 justify-end">
                          {item.status === "paid" ? (
                            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono bg-emerald-50 p-1 px-2.5 rounded-md">
                              Receipted
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => markPaid(item.id, "M-Pesa")}
                                className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                              >
                                Collect
                              </button>
                              <button
                                onClick={() => handleLaunchReminder(item)}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                title="Edit & Send SMS Warning"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No rent records match filter checks" description="Check another status filter or change search terms." />
        )}
      </div>

      {/* DYNAMIC INTERACTIVE CUSTOM SMS REMINDER MODAL */}
      <AnimatePresence>
        {reminderData && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-xs font-semibold"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Review & Customise SMS</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Dispatches instantly via the Avodal SMS Queue</p>
                </div>
                <button
                  onClick={() => setReminderData(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                  <div>
                    <span className="block text-slate-400 font-mono text-[9px] uppercase">Recipient</span>
                    <span className="font-bold text-slate-700">{reminderData.tenantName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-mono text-[9px] uppercase">Phone Number</span>
                    <span className="font-bold text-slate-700 font-mono">{reminderData.tenantPhone || "+254712345678"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500">Edit SMS Message Content</label>
                  <textarea
                    rows={5}
                    value={reminderData.smsBody}
                    onChange={(e) => setReminderData({ ...reminderData, smsBody: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-250 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 rounded-xl leading-relaxed text-slate-700 bg-slate-50 focus:bg-white font-medium"
                  />
                  <p className="text-[10px] text-slate-400 text-right font-medium">
                    {reminderData.smsBody.length} characters (1 SMS segment)
                  </p>
                </div>

                {/* Micro Sim Phone frame mockup */}
                <div className="bg-slate-100 rounded-xl p-4 border border-slate-200/60 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 flex justify-center">
                    <span className="w-8 h-0.5 bg-slate-350 rounded-full mt-0.5"></span>
                  </div>
                  <span className="block text-[8px] tracking-wider text-slate-400 font-bold uppercase mb-2 font-mono">Tenant SMS View</span>
                  <div className="max-w-[85%] bg-slate-200/80 text-slate-800 p-2.5 rounded-xl rounded-tl-none font-medium leading-relaxed font-sans text-[11px] shadow-2xs">
                    {reminderData.smsBody}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 font-semibold">
                <button
                  onClick={() => setReminderData(null)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSendReminder}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Broadcast Reminder
                </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
