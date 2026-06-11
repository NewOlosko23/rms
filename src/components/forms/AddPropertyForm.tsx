// FILE: src/components/forms/AddPropertyForm.tsx
import React, { useState } from "react";
import { X, Upload, Check } from "lucide-react";

interface AddPropertyFormProps {
  onSave: (propertyData: any) => void;
  onClose: () => void;
}

export default function AddPropertyForm({ onSave, onClose }: AddPropertyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Bedsitter",
    address: "",
    totalUnits: 5,
    monthlyRent: 5000,
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Property name is required";
    if (!formData.address.trim()) newErrors.address = "Property address is required";
    if (!formData.totalUnits || formData.totalUnits < 1) {
      newErrors.totalUnits = "Total units must be 1 or more";
    }
    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = "Base rent must be a positive value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalUnits" || name === "monthlyRent" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }

    setUploadedFile(file);
    setUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    setErrors((prev) => ({ ...prev, image: "" }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          
          // Create a data URL for preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setFormData((prev) => ({
              ...prev,
              image: e.target?.result as string,
            }));
          };
          reader.readAsDataURL(file);
          
          return 100;
        }
        return prev + Math.random() * 40;
      });
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Add New Property</h3>
            <p className="text-xs text-slate-400 mt-0.5">Register a new rental plot to your portfolio</p>
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
            {/* Property Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Property Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Milele Court, Bahari Residences"
                className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                  errors.name ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Property Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Property Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Off Jomo Kenyatta Highway, Siaya"
                className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                  errors.address ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
              />
              {errors.address && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Default Unit Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Bedsitter">Bedsitter</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedroom">2 Bedroom</option>
                </select>
              </div>

              {/* Total Units */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Units *</label>
                <input
                  type="number"
                  name="totalUnits"
                  value={formData.totalUnits}
                  onChange={handleChange}
                  min={1}
                  placeholder="5"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.totalUnits ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.totalUnits && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.totalUnits}</p>}
              </div>

              {/* Base Monthly Rent */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Base Monthly Rent (KES) *</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  min={1}
                  placeholder="5000"
                  className={`w-full text-xs px-3 py-2.5 bg-slate-50 border ${
                    errors.monthlyRent ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"
                  } rounded-lg focus:outline-hidden focus:ring-1 focus:bg-white transition-all`}
                />
                {errors.monthlyRent && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.monthlyRent}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Property Image Upload</label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  uploadComplete
                    ? "border-emerald-300 bg-emerald-50"
                    : uploading
                    ? "border-indigo-300 bg-indigo-50"
                    : errors.image
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />

                {uploadComplete ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check className="w-6 h-6 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700">Upload complete!</p>
                    <p className="text-[10px] text-emerald-600">{uploadedFile?.name}</p>
                  </div>
                ) : uploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <svg className="w-6 h-6 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-indigo-700">Uploading...</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-200"
                        style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-indigo-600 font-mono">{Math.min(Math.round(uploadProgress), 100)}%</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Drop image here or click to upload</p>
                    <p className="text-[10px] text-slate-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
              {errors.image && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.image}</p>}

              {/* Image Preview */}
              {formData.image && !uploading && (
                <div className="mt-3 w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                  <img src={formData.image} alt="Property preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Form Footer */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
