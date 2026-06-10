// FILE: src/pages/Tenants.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, ChevronRight, UserCheck } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import AddTenantForm from "../components/forms/AddTenantForm";
import RentStatusBadge from "../components/ui/RentStatusBadge";
import Avatar from "../components/ui/Avatar";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../data/helpers";

export default function Tenants() {
  const { tenants, units, locations, rentRecords, addTenant, globalSearchQuery, setGlobalSearchQuery } = useRentSystem();
  const navigate = useNavigate();

  // Search/Filters using global context
  const searchQuery = globalSearchQuery;
  const setSearchQuery = setGlobalSearchQuery;
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterRentStatus, setFilterRentStatus] = useState("all");

  // Onboard modal open
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active Month
  const currentMonth = "2026-06";

  // Filter Logic
  const filteredTenants = tenants.filter((tenant) => {
    // 1. Search Query
    const locObj = locations.find((l) => l.id === tenant.locationId);
    const locationName = locObj ? locObj.name.toLowerCase() : "";
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tenant.phone.includes(searchQuery) ||
                          tenant.unitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          locationName.includes(searchQuery.toLowerCase());

    // 2. Location Filter
    const matchesLocation = filterLocation === "all" || tenant.locationId === filterLocation;

    // 3. Rent Status Filter (Current month June 2026)
    const currentMonthRecord = rentRecords.find((r) => r.tenantId === tenant.id && r.month === currentMonth);
    const rentStatus = currentMonthRecord ? currentMonthRecord.status : "pending";
    const matchesRentStatus = filterRentStatus === "all" || rentStatus === filterRentStatus;

    return matchesSearch && matchesLocation && matchesRentStatus;
  });

  const vacantUnits = units.filter((u) => u.status === "vacant");

  const handleSaveTenant = (formData: any) => {
    addTenant(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with trigger button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs text-slate-400 mt-1">Onboard and manage tenant contracts securely</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors font-mono"
        >
          <Plus className="w-4 h-4" />
          Onboard Tenant
        </button>
      </div>

      {/* Roster Controls Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tenant name, mobile, unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Location plot filter */}
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rent Collection filter */}
          <div>
            <select
              value={filterRentStatus}
              onChange={(e) => setFilterRentStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              <option value="all">All Rent Statuses</option>
              <option value="paid">Paid June Rent</option>
              <option value="pending">Pending June Rent</option>
              <option value="overdue">Overdue June Rent</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredTenants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <th className="py-3 px-6">Tenant</th>
                  <th className="py-3 px-6">Assigned Suite</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Mobile Phone</th>
                  <th className="py-3 px-6">Move-In</th>
                  <th className="py-3 px-6">Lease Expiration</th>
                  <th className="py-3 px-6">June Rent</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTenants.map((ten) => {
                  const locationObj = locations.find((l) => l.id === ten.locationId);
                  const juneRec = rentRecords.find((r) => r.tenantId === ten.id && r.month === currentMonth);
                  const rentStatus = juneRec ? juneRec.status : "pending";

                  return (
                    <tr
                      key={ten.id}
                      onClick={() => navigate(`/tenants/${ten.id}`)}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={ten.name} src={ten.avatar} size="md" />
                          <div>
                            <span className="font-bold text-slate-800 block">{ten.name}</span>
                            <span className="text-[10px] text-slate-400">ID: {ten.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-600">{ten.unitId}</td>
                      <td className="py-3.5 px-6 font-medium text-slate-500">
                        {locationObj ? locationObj.name : "N/A"}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-600">{ten.phone}</td>
                      <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(ten.moveInDate)}</td>
                      <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">{formatDate(ten.leaseEndDate)}</td>
                      <td className="py-3.5 px-6">
                        <RentStatusBadge status={rentStatus} />
                      </td>
                      <td className="py-3.5 px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tenants/${ten.id}`);
                          }}
                          className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition"
                        >
                          View
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
          <EmptyState title="No tenants found matching" description="Modify search parameters or onboard a brand new resident." />
        )}
      </div>

      {/* Onboard Tenant Modal */}
      {isModalOpen && (
        <AddTenantForm vacantUnits={vacantUnits} onSave={handleSaveTenant} onClose={() => setIsModalOpen(false)} />
      )}

    </div>
  );
}
