// FILE: src/pages/Units.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, ChevronRight } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import AddUnitForm from "../components/forms/AddUnitForm";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import EmptyState from "../components/ui/EmptyState";
import { formatKES } from "../data/helpers";

export default function Units() {
  const { units, locations, tenants, rentRecords, addUnit, globalSearchQuery, setGlobalSearchQuery } = useRentSystem();
  const navigate = useNavigate();

  // Search and filter states using global context
  const searchQuery = globalSearchQuery;
  const setSearchQuery = setGlobalSearchQuery;
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter & Search logic
  const filteredUnits = units.filter((unit) => {
    const searchLower = searchQuery.toLowerCase();

    // 1. Search filter (unit ID, like MC-01, unitNumber like A1, type like Bedsitter)
    const matchesSearch =
      unit.id.toLowerCase().includes(searchLower) ||
      unit.type.toLowerCase().includes(searchLower) ||
      (unit.unitNumber && unit.unitNumber.toLowerCase().includes(searchLower));

    // Get location object of this unit
    const locObj = locations.find((l) => l.id === unit.locationId);
    const locationName = locObj ? locObj.name.toLowerCase() : "";
    const matchesLocationQuery = searchQuery ? locationName.includes(searchLower) : true;

    // Get tenant object of this unit
    const tenantObj = tenants.find((t) => t.id === unit.tenantId);
    const tenantName = tenantObj ? tenantObj.name.toLowerCase() : "";
    const matchesTenantQuery = searchQuery ? tenantName.includes(searchLower) : false;

    // 2. Select Location Filter
    const matchesLocationFilter = filterLocation === "all" || unit.locationId === filterLocation;

    // 3. Select Type Filter
    const matchesTypeFilter = filterType === "all" || unit.type === filterType;

    // 4. Select Status Filter
    const matchesStatusFilter = filterStatus === "all" || unit.status === filterStatus;

    return (matchesSearch || matchesLocationQuery || matchesTenantQuery) && matchesLocationFilter && matchesTypeFilter && matchesStatusFilter;
  });

  // Handle unit addition saving
  const handleSaveUnit = (data: any) => {
    addUnit(data);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header and Add unit trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs text-slate-400 mt-1">Full suite roster and vacancy directories</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors font-mono"
        >
          <Plus className="w-4 h-4" />
          Add Rent Unit
        </button>
      </div>

      {/* Filter and search bar console */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Unit # or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Location selector */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type selector */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all font-semibold">All Room Types</option>
              <option value="Bedsitter">Bedsitter</option>
              <option value="1 Bedroom">1 Bedroom</option>
              <option value="2 Bedroom">2 Bedroom</option>
            </select>
          </div>

          {/* Status selector */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="occupied">Occupied</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredUnits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <th className="py-3 px-6">Suite / Unit #</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Room Type</th>
                  <th className="py-3 px-6">Floor Level</th>
                  <th className="py-3 px-6">Current Tenant</th>
                  <th className="py-3 px-6">Monthly Rent</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUnits.map((unit) => {
                  const tenantObj = tenants.find((t) => t.id === unit.tenantId);
                  const locationObj = locations.find((l) => l.id === unit.locationId);

                  return (
                    <tr
                      key={unit.id}
                      onClick={() => navigate(`/units/${unit.id}`)}
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-800">{unit.id}</td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">{locationObj ? locationObj.name : "N/A"}</td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{unit.type}</td>
                      <td className="py-3.5 px-6 text-slate-500 font-mono">Floor {unit.floor}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-700">
                        {unit.status === "occupied" && tenantObj ? tenantObj.name : <span className="text-slate-400 font-normal">N/A</span>}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">{formatKES(unit.monthlyRent)}</td>
                      <td className="py-3.5 px-6">
                        <RentStatusBadge status={unit.status} />
                      </td>
                      <td className="py-3.5 px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/units/${unit.id}`);
                          }}
                          className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition"
                        >
                          Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No units found matching" description="Try relaxing your filter parameters or search queries." />
        )}
      </div>

      {/* Add Unit Modal */}
      {isModalOpen && (
        <AddUnitForm locations={locations} onSave={handleSaveUnit} onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}
