// FILE: src/pages/LocationDetail.tsx
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, User, CreditCard } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import { formatKES } from "../data/helpers";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const { locations, units, tenants } = useRentSystem();
  const navigate = useNavigate();

  const location = locations.find((l) => l.id === id);

  if (!location) {
    return (
      <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">Property plot not found</h3>
        <p className="text-xs text-slate-400 mt-1">Please confirm the path and try again.</p>
        <button
          onClick={() => navigate("/locations")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
        >
          Back to Plots
        </button>
      </div>
    );
  }

  // Get units belonging to this location
  const locUnits = units.filter((u) => u.locationId === location.id);
  const totalUnits = locUnits.length;
  const occupiedUnits = locUnits.filter((u) => u.status === "occupied").length;
  const occupancyPct = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs and navigation back */}
      <div className="flex items-center gap-3">
        <Link
          to="/locations"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-xs font-semibold text-slate-400">
          <Link to="/locations" className="hover:text-indigo-600 transition-colors">Locations</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-bold">{location.name}</span>
        </div>
      </div>

      {/* Hero card metadata */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-2 h-56 md:h-full relative bg-slate-100">
          <img
            src={location.image}
            alt={location.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8 md:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                {location.type} Portfolio
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{location.name}</h2>
            
            <div className="flex items-center gap-1.5 text-slate-400 mt-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">{location.address}</span>
            </div>

            {/* General metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 mt-6 pt-5">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Units Count</span>
                <span className="text-base font-bold text-slate-800 mt-0.5">{totalUnits} Rooms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Occupancy Rate</span>
                <span className="text-base font-bold text-slate-800 mt-0.5">{occupancyPct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Base Rent (KES)</span>
                <span className="text-base font-bold text-slate-800 mt-0.5">{formatKES(location.monthlyRent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Property Suites ({locUnits.length})</h3>
          <p className="text-xs text-slate-400 mt-0.5">Physical unit mappings and lease summaries</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {locUnits.map((unit) => {
            // Find current tenant
            const tenant = tenants.find((t) => t.id === unit.tenantId);

            return (
              <div
                key={unit.id}
                onClick={() => navigate(`/units/${unit.id}`)}
                className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Suite</span>
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight font-mono leading-none mt-0.5">
                        {unit.id}
                      </h4>
                    </div>
                    <RentStatusBadge status={unit.status} />
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3.5 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Suite Type</span>
                      <span className="font-bold text-slate-700">{unit.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Floor Level</span>
                      <span className="font-bold text-slate-700">Floor {unit.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Monthly Rent</span>
                      <span className="font-bold text-slate-800">{formatKES(unit.monthlyRent)}</span>
                    </div>
                  </div>
                </div>

                {/* Tenant status footprint */}
                <div className="border-t border-slate-100 mt-4 pt-3.5">
                  {unit.status === "occupied" && tenant ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                          {tenant.name}
                        </span>
                      </div>
                      <Link
                        to={`/tenants/${tenant.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-0.5">
                      <span className="text-[10px] bg-slate-50 text-slate-400 border border-slate-100 rounded-md py-1 px-3 block font-mono font-bold uppercase tracking-wider">
                        Available Suite
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
