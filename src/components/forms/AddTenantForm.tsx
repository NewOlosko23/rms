// FILE: src/components/forms/AddTenantForm.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { Unit } from "../../types";

interface AddTenantFormProps {
  vacantUnits: Unit[];
  onSave: (tenantData: any) => void;
  onClose: () => void;
}

export default function AddTenantForm({ vacantUnits, onSave, onClose }: AddTenantFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
    unitId: vacantUnits[0]?.id || "",
    moveInDate: new Date().toISOString().split("T")[0],
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.nationalId.trim() || formData.nationalId.length < 7) {
      newErrors.nationalId = "Valid National ID is required";
    }
    if (!formData.unitId) newErrors.unitId = "You must select a unit";
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Add New Tenant</h3>
            <p className="text-xs text-slate-400 mt-0.5">Onboard a new resident into your property portfolio</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Akinyi Odhiambo"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.name ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number (+254...) *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +254 712 345678"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.phone ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. akinyi@gmail.com"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.email ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
              </div>

              {/* National ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">National ID Number *</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="8-digit ID"
                  maxLength={8}
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.nationalId ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.nationalId && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.nationalId}</p>}
              </div>

              {/* Move-In Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Move-in Date *</label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Unit Allocation */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Suite / Unit Allocation *</label>
                {vacantUnits.length > 0 ? (
                  <select
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  >
                    {vacantUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.id} ({u.type} - KES {u.monthlyRent.toLocaleString()}/mo)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-red-500 p-2.5 bg-red-50 border border-red-100 rounded-lg font-medium">
                    No vacant suites are currently available. Please vacancy check or list more units first.
                  </p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-slate-100 pt-3 col-span-2 mt-2">
                <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-2 font-mono">
                  Emergency Contact Details
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Next of Kin Name"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.emergencyContact ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.emergencyContact && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.emergencyContact}</p>}
              </div>

              {/* Contact Person Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person Phone *</label>
                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="KIN Phone Number"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.emergencyPhone ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.emergencyPhone && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.emergencyPhone}</p>}
              </div>
            </div>
          </div>

          {/* Sticky Pinned Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={vacantUnits.length === 0}
              className={`px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                vacantUnits.length === 0 ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Onboard Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
