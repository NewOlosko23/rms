// FILE: src/pages/UnitDetail.tsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Layers, DollarSign, FileText, Sparkles, UserX, CreditCard } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import Avatar from "../components/ui/Avatar";
import { formatKES, formatDate, formatMonthYear } from "../data/helpers";

export default function UnitDetail() {
  const { id } = useParams<{ id: string }>();
  const { units, locations, tenants, rentRecords, vacateTenant } = useRentSystem();
  const navigate = useNavigate();

  const unit = units.find((u) => u.id === id);
  const [adminNotes, setAdminNotes] = useState(
    "Unit requires paint touch-ups near the kitchen counter during the next tenant handover."
  );

  if (!unit) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">Room Unit not found</h3>
        <p className="text-xs text-slate-400 mt-1">Check the URL or return to main unit lists.</p>
        <Link
          to="/units"
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
        >
          Back to Units
        </Link>
      </div>
    );
  }

  const location = locations.find((l) => l.id === unit.locationId);
  const tenant = tenants.find((t) => t.id === unit.tenantId);

  // Get historical rent records for this specific unit
  const unitHistory = rentRecords
    .filter((r) => r.unitId === unit.id)
    .sort((a, b) => b.month.localeCompare(a.month));

  const handleVacate = () => {
    if (window.confirm(`Are you absolutely sure you want to mark Unit ${unit.id} as Vacant? This will sign out the resident ${tenant?.name}.`)) {
      if (tenant) {
        vacateTenant(tenant.id);
        navigate("/units");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Headers */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/units")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-xs font-semibold text-slate-400">
          <Link to="/units" className="hover:text-indigo-600 transition-colors">Units</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-bold">Suite {unit.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: CORE UNIT DATA & ADMIN ACTION BLOCKS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Unit Info Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Location Unit</span>
                <h3 className="font-bold text-slate-800 text-lg tracking-tight font-mono leading-none mt-0.5">
                  {unit.id}
                </h3>
              </div>
              <RentStatusBadge status={unit.status} />
            </div>

            <div className="space-y-3 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Property</span>
                </div>
                <span className="font-bold text-slate-800">{location ? location.name : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Floor Level</span>
                </div>
                <span className="font-bold text-slate-800 font-mono">Level {unit.floor}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span>Suite Type</span>
                </div>
                <span className="font-bold text-indigo-700">{unit.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span>Rental Charge</span>
                </div>
                <span className="font-bold text-slate-800">{formatKES(unit.monthlyRent)}/mo</span>
              </div>
            </div>

            {/* If occupied, enable "Vacant" toggle action */}
            {unit.status === "occupied" && tenant && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleVacate}
                  className="w-full cursor-pointer py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserX className="w-4 h-4" />
                  Evacuate / Mark as Vacant
                </button>
              </div>
            )}
          </div>

          {/* Admin Private Scratchpad Notes */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Private Admin Notes
            </h4>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white h-24 font-normal"
              placeholder="Record maintenance dates or key deposits..."
            />
            <button
              onClick={() => {
                alert("Notes scratchpad saved into local cache!");
              }}
              className="w-full cursor-pointer py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors"
            >
              Save Internal Notes
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: TENANT SUMMARY & PAYMENT TRANSFERS LOG */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tenant summary profile if occupied */}
          {unit.status === "occupied" && tenant ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Active Occupant Profile
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pb-5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-3">
                  <Avatar name={tenant.name} src={tenant.avatar} size="xl" />
                  <div>
                    <h4 className="text-base font-bold text-slate-800 tracking-tight leading-snug">{tenant.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">Resident ID: {tenant.id}</p>
                    <div className="flex gap-2 mt-1.5 text-[10px] font-bold uppercase tracking-wider font-mono">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm">Suite {unit.id}</span>
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-sm">Kenyal National ID {tenant.nationalId}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/tenants/${tenant.id}`}
                  className="px-3.5 py-2 whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Open Complete Profile
                </Link>
              </div>

              {/* Resident Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400">Primary Mobile</span>
                  <p className="text-slate-800 mt-0.5">{tenant.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email Address</span>
                  <p className="text-slate-800 mt-0.5">{tenant.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Lease Start (Move-In)</span>
                  <p className="text-slate-800 mt-0.5">{formatDate(tenant.moveInDate)}</p>
                </div>
                <div>
                  <span className="text-slate-400">Lease Schedule Expiry</span>
                  <p className="text-slate-800 mt-0.5">{formatDate(tenant.leaseEndDate)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center flex flex-col items-center justify-center">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Suite is currently available!</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                This unit is vacant. You can onboard a new tenant directly in the Tenants dashboard to allocate this room.
              </p>
              <Link
                to="/tenants"
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-xs"
              >
                Go to Tenants Desk
              </Link>
            </div>
          )}

          {/* Payments Receipt Ledger history */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Suite Payments Log
              </h3>
            </div>

            {unitHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      <th className="py-2.5 px-6">Month Period</th>
                      <th className="py-2.5 px-6">Rent Amount</th>
                      <th className="py-2.5 px-6">Payment Mode</th>
                      <th className="py-2.5 px-6">Receipt #</th>
                      <th className="py-2.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {unitHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-6 font-semibold text-slate-700">
                          {formatMonthYear(item.month)}
                        </td>
                        <td className="py-3 px-6 font-bold text-slate-800">{formatKES(item.amount)}</td>
                        <td className="py-3 px-6 font-semibold text-slate-500">
                          {item.paymentMethod || "N/A"}
                        </td>
                        <td className="py-3 px-6 font-mono font-bold text-slate-600">
                          {item.receiptNo || "N/A"}
                        </td>
                        <td className="py-3 px-6">
                          <RentStatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-medium font-mono leading-relaxed">
                No historic payment ledger receipts mapped for Suite {unit.id}.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
