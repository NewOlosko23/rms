// FILE: src/pages/Locations.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Building2, Home, ArrowRight, Plus } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import { formatKES } from "../data/helpers";

export default function Locations() {
  const { locations, units } = useRentSystem();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs text-slate-400 mt-1">Manage Siaya plot directories and unit capacities</p>
        </div>
        <button
          onClick={() => alert("This feature is disabled on the read-only demo. You can registration-expand individual suites in the Units tab.")}
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-all font-mono"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          Add Property Plot
        </button>
      </div>

      {/* Plots Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => {
          // Calculate dynamic occupancy for this location
          const locUnits = units.filter((u) => u.locationId === loc.id);
          const totalUnitsCount = locUnits.length || loc.totalUnits;
          const occupiedUnitsCount = locUnits.filter((u) => u.status === "occupied").length;
          const occupancyRate = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;

          return (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group hover:border-indigo-300 hover:shadow-md transition-all duration-300"
            >
              {/* Image Block */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={loc.image}
                  alt={loc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                
                {/* Unit Type overlay tag */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-700 shadow-sm uppercase tracking-wider font-mono">
                  {loc.type}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold truncate leading-none">{loc.address}</span>
                  </div>

                  {/* Pricing and Capacity Row */}
                  <div className="grid grid-cols-2 gap-4 my-5 border-y border-slate-100 py-3.5 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Base Price</p>
                      <p className="font-bold text-slate-800 mt-0.5">{formatKES(loc.monthlyRent)}/mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Capacity</p>
                      <p className="font-bold text-slate-800 mt-0.5">{occupiedUnitsCount} / {totalUnitsCount} Units</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar occupancy */}
                <div className="space-y-1.5 pb-2">
                  <div className="flex justify-between items-center text-[11px] font-semibold">
                    <span className="text-slate-500">Utilization Rate</span>
                    <span className="text-indigo-600 font-mono font-bold">{occupancyRate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => navigate(`/locations/${loc.id}`)}
                  className="w-full cursor-pointer mt-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  View Plot Units
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
