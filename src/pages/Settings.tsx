// FILE: src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { Settings2, Save, Building, CreditCard, Bell } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";

export default function Settings() {
  const { settings, updateSettings, locations } = useRentSystem();
  const [formData, setFormData] = useState({
    systemName: "",
    currency: "KES",
    latePaymentFee: 1000,
    enableLatePaymentFee: true,
    lateFeeLocationIds: [] as string[],
    enableDeposits: true,
    depositFeeLocationIds: [] as string[],
    depositRefundGraceDays: 7,
    mpesaTill: "",
    gracePeriodDays: 5,
    enableSmsReminders: true,
    managerEmail: "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with settings from context
  useEffect(() => {
    if (settings) {
      setFormData({
        systemName: settings.systemName || "NestIQ — Powered by Avodal",
        currency: settings.currency || "KES",
        latePaymentFee: settings.latePaymentFee ?? 1000,
        enableLatePaymentFee: settings.enableLatePaymentFee ?? true,
        lateFeeLocationIds: settings.lateFeeLocationIds || [],
        enableDeposits: settings.enableDeposits ?? true,
        depositFeeLocationIds: settings.depositFeeLocationIds || [],
        depositRefundGraceDays: settings.depositRefundGraceDays ?? 7,
        mpesaTill: settings.mpesaTill || "5431201",
        gracePeriodDays: settings.gracePeriodDays ?? 5,
        enableSmsReminders: settings.enableSmsReminders ?? true,
        managerEmail: settings.managerEmail || "GeorgeOloo@avodal.co.ke",
      });
    }
  }, [settings]);

  const handleLocationIdToggle = (locId: string) => {
    const current = formData.lateFeeLocationIds || [];
    const next = current.includes(locId)
      ? current.filter(id => id !== locId)
      : [...current, locId];
    setFormData({ ...formData, lateFeeLocationIds: next });
  };

  const handleDepositLocationToggle = (locId: string) => {
    const current = formData.depositFeeLocationIds || [];
    const next = current.includes(locId)
      ? current.filter(id => id !== locId)
      : [...current, locId];
    setFormData({ ...formData, depositFeeLocationIds: next });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateSettings(formData);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <p className="text-xs text-slate-400 mt-1">Configure systemic multipliers, payment APIs, and notification triggers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
        
        {/* ROW 1: COMPANY & PORTFOLIO META */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/85 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4.5 h-4.5 text-indigo-600" />
            General Company Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1">Company / Platform Branding Name</label>
              <input
                type="text"
                value={formData.systemName}
                onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Primary Manager Email Address</label>
              <input
                type="email"
                value={formData.managerEmail}
                onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ROW 2: FINANCIAL ARREARS & MPESA INTEGRATION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/85 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
            Financial Collection Rules
          </h3>

          {/* GLOBAL LATE PAYMENT PENALTY TOGGLE SWITCH */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100/80">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Enable Late Payment Penalty Fees</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                When enabled, overdue tenants will be subject to a flat-rate penalty fee.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.enableLatePaymentFee}
                onChange={(e) => setFormData({ ...formData, enableLatePaymentFee: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 mb-1">Default Local Currency</label>
              <select
                disabled
                value={formData.currency}
                className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-lg cursor-not-allowed"
              >
                <option value="KES">Kenyan Shillings (KES)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1 flex items-center justify-between">
                <span>Late Payment Penalty Fee (KES)</span>
                {!formData.enableLatePaymentFee && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Deactivated</span>}
              </label>
              <input
                type="number"
                disabled={!formData.enableLatePaymentFee}
                value={formData.latePaymentFee}
                onChange={(e) => setFormData({ ...formData, latePaymentFee: parseInt(e.target.value) || 0 })}
                className={`w-full text-xs p-2.5 border rounded-lg font-mono font-bold focus:outline-hidden ${
                  formData.enableLatePaymentFee 
                    ? "bg-slate-50 border-slate-200 focus:bg-white text-slate-800" 
                    : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 flex items-center justify-between">
                <span>Rent Grace Period (Days)</span>
                {!formData.enableLatePaymentFee && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Deactivated</span>}
              </label>
              <input
                type="number"
                disabled={!formData.enableLatePaymentFee}
                value={formData.gracePeriodDays}
                onChange={(e) => setFormData({ ...formData, gracePeriodDays: parseInt(e.target.value) || 0 })}
                className={`w-full text-xs p-2.5 border rounded-lg font-mono font-bold focus:outline-hidden ${
                  formData.enableLatePaymentFee 
                    ? "bg-slate-50 border-slate-200 focus:bg-white text-slate-800" 
                    : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {/* SPECIFIC PROPERTIES DELEGATION SELECTION */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className={`text-xs font-bold ${formData.enableLatePaymentFee ? "text-slate-700" : "text-slate-400"}`}>
              Select Applicable Properties (Plots)
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium mb-3">
              Check the properties where late payment penalties should apply. If unchecked, late fees will not be charged.
            </p>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${formData.enableLatePaymentFee ? "" : "opacity-50 pointer-events-none"}`}>
              {locations.map((loc) => {
                const isChecked = formData.lateFeeLocationIds?.includes(loc.id);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => formData.enableLatePaymentFee && handleLocationIdToggle(loc.id)}
                    className={`flex items-center justify-between p-3 border rounded-xl text-left cursor-pointer transition-all ${
                      isChecked
                        ? "bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{loc.name}</p>
                      <p className="text-[9px] text-slate-400-500 font-medium leading-none mt-1">{loc.address}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isChecked 
                        ? "bg-indigo-600 border-indigo-500 text-white" 
                        : "border-slate-300 bg-slate-50"
                    }`}>
                      {isChecked && (
                        <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-slate-600 mb-1">M-Pesa Buy Goods Till Number</label>
            <input
              type="text"
              value={formData.mpesaTill}
              onChange={(e) => setFormData({ ...formData, mpesaTill: e.target.value })}
              className="w-full sm:w-1/2 text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-hidden focus:bg-white rounded-lg font-mono font-bold"
              placeholder="e.g. 5431201"
            />
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">
              Customers receive immediate receipt hooks via the Avodal SMS router upon matching Till transfers.
            </p>
          </div>
        </div>

        {/* ROW 2B: SECURITY DEPOSIT MANAGEMENT */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/85 shadow-xs space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4.5 h-4.5 text-amber-600" />
            Tenant Security Deposits
          </h3>

          {/* GLOBAL DEPOSIT TOGGLE SWITCH */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100/80">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Enable Deposit Collection</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                When enabled, tenants will be required to pay one month's rent as a security deposit on move-in.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.enableDeposits}
                onChange={(e) => setFormData({ ...formData, enableDeposits: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1 flex items-center justify-between">
                <span>Deposit Refund Grace Period (Days)</span>
                {!formData.enableDeposits && <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Deactivated</span>}
              </label>
              <input
                type="number"
                disabled={!formData.enableDeposits}
                value={formData.depositRefundGraceDays}
                onChange={(e) => setFormData({ ...formData, depositRefundGraceDays: parseInt(e.target.value) || 0 })}
                className={`w-full text-xs p-2.5 border rounded-lg font-mono font-bold focus:outline-hidden ${
                  formData.enableDeposits 
                    ? "bg-slate-50 border-slate-200 focus:bg-white text-slate-800" 
                    : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Days before automatic refund processing after tenant vacation</p>
            </div>
          </div>

          {/* SPECIFIC PROPERTIES DELEGATION FOR DEPOSITS */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className={`text-xs font-bold ${formData.enableDeposits ? "text-slate-700" : "text-slate-400"}`}>
              Select Applicable Properties (Plots)
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium mb-3">
              Check the properties where deposit collection should be enforced. Unchecked properties will not require deposits.
            </p>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${formData.enableDeposits ? "" : "opacity-50 pointer-events-none"}`}>
              {locations.map((loc) => {
                const isChecked = formData.depositFeeLocationIds?.includes(loc.id);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => formData.enableDeposits && handleDepositLocationToggle(loc.id)}
                    className={`flex items-center justify-between p-3 border rounded-xl text-left cursor-pointer transition-all ${
                      isChecked
                        ? "bg-amber-50/50 border-amber-200 text-amber-700 shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold leading-tight">{loc.name}</p>
                      <p className="text-[9px] text-slate-400 font-medium leading-none mt-1">KES {loc.monthlyRent.toLocaleString()} deposit</p>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isChecked 
                        ? "bg-amber-600 border-amber-500 text-white" 
                        : "border-slate-300 bg-slate-50"
                    }`}>
                      {isChecked && (
                        <svg className="w-2.5 h-2.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 3: COMMUNICATIVE SMS TRIGGERS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/85 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4.5 h-4.5 text-amber-600" />
            Communication & SMS Broadcasts
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-slate-800">Enable Automated SMS Arrears Broadcast</h5>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                SMS warnings are automatically dispatched via Avodal's gateway on the 6th day if pending ledger entries remain uncollected.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.enableSmsReminders}
                onChange={(e) => setFormData({ ...formData, enableSmsReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3 items-center">
          {success && (
            <span className="text-emerald-600 text-xs font-bold animate-pulse">
              ✓ Parameters committed successfully!
            </span>
          )}
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/10 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Commit Settings"}
          </button>
        </div>

      </form>

    </div>
  );
}
