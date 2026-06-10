// FILE: src/components/forms/AddUnitForm.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { Location } from "../../types";

interface AddUnitFormProps {
  locations: Location[];
  onSave: (unitData: any) => void;
  onClose: () => void;
}

export default function AddUnitForm({ locations, onSave, onClose }: AddUnitFormProps) {
  const [formData, setFormData] = useState({
    locationId: locations[0]?.id || "",
    unitNumber: "",
    type: "Bedsitter" as "Bedsitter" | "1 Bedroom" | "2 Bedroom",
    monthlyRent: 3500,
    floor: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (locId: string) => {
    const selectedLoc = locations.find((l) => l.id === locId);
    if (selectedLoc) {
      setFormData((prev) => ({
        ...prev,
        locationId: locId,
        type: selectedLoc.type as any,
        monthlyRent: selectedLoc.monthlyRent,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.unitNumber.trim()) newErrors.unitNumber = "Unit number is required (e.g. A4, 302)";
    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = "Rent price must be a dynamic positive value";
    }
    if (!formData.floor || formData.floor < 1) {
      newErrors.floor = "Floor number must be 1 or higher";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Add New Suite / Unit</h3>
            <p className="text-xs text-slate-400 mt-0.5">Expands plot inventory and lease options</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Location Plot */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Property Plot / Location *</label>
            <select
              value={formData.locationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.address})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unit Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Number *</label>
              <input
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData((p) => ({ ...p, unitNumber: e.target.value }))}
                placeholder="e.g. A4, 203, H06"
                className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                  errors.unitNumber ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
              />
              {errors.unitNumber && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.unitNumber}</p>}
            </div>

            {/* Floor */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Floor Level *</label>
              <input
                type="number"
                min={1}
                value={formData.floor}
                onChange={(e) => setFormData((p) => ({ ...p, floor: parseInt(e.target.value) || 1 }))}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Suite Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Suite Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as any }))}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Bedsitter">Bedsitter</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
              </select>
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Rent (KES) *</label>
              <input
                type="number"
                value={formData.monthlyRent}
                onChange={(e) => setFormData((p) => ({ ...p, monthlyRent: parseInt(e.target.value) || 0 }))}
                placeholder="KES"
                className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                  errors.monthlyRent ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white`}
              />
              {errors.monthlyRent && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.monthlyRent}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Add Suite Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
