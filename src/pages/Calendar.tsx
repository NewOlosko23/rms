// FILE: src/pages/Calendar.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus, CalendarDays, AlertCircle } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import Avatar from "../components/ui/Avatar";
import { formatDate } from "../data/helpers";

interface EventFormData {
  title: string;
  type: "inspection" | "move_in" | "maintenance" | "other";
  date: string;
  tenantName: string;
  unitId: string;
  details: string;
}

export default function Calendar() {
  const { calendarEvents, units } = useRentSystem();
  
  // Hardcoded date focus for demonstration is June 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed (5 = June)

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<EventFormData>({
    title: "",
    type: "inspection",
    date: "2026-06-15",
    tenantName: "",
    unitId: "",
    details: "",
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = 30; // June has 30 days
  const startingDayOffset = 0; // June 1st 2026 is a Monday (0 offset if we start on Monday)

  // Navigate month (mock controls)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Convert month and day to "YYYY-MM-DD" matching string
  const getFormattedDate = (dayNum: number) => {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(dayNum).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  // Active events for a day
  const getDayEvents = (dayNum: number) => {
    const formatted = getFormattedDate(dayNum);
    return calendarEvents.filter((ev) => ev.date === formatted);
  };

  // Handle saving new calendar event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    // We can directly push the item locally or triggers context hooks!
    // Simply push locally or save to state: since Context manages localStorage state, let's push to calendarEvents!
    // Let's mock successful state save:
    calendarEvents.push({
      id: `cal-${Date.now()}`,
      type: newEvent.type,
      title: newEvent.title,
      date: newEvent.date,
      tenantName: newEvent.tenantName || undefined,
      unitId: newEvent.unitId || undefined,
      details: newEvent.details,
    });
    localStorage.setItem("nest_iq_events", JSON.stringify(calendarEvents));

    alert(`Event booked: "${newEvent.title}" on ${newEvent.date}!`);
    setShowAddEventModal(false);
    // reset form
    setNewEvent({
      title: "",
      type: "inspection",
      date: "2026-06-15",
      tenantName: "",
      unitId: "",
      details: "",
    });
  };

  // Active Day click filter
  const activeEventsList = selectedDay
    ? calendarEvents.filter((ev) => ev.date === getFormattedDate(selectedDay))
    : calendarEvents.filter((ev) => ev.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header section with add custom */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-105 pb-5">
        <div>
          <p className="text-xs text-slate-400 mt-1">Schedule key inspections, routine audits, and moveouts</p>
        </div>
        <button
          onClick={() => setShowAddEventModal(true)}
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors font-mono"
        >
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: MONTH GRID VIEW */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Calendar month control bar */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CalendarDays className="w-4.5 h-4.5 text-indigo-600" />
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={prevMonth}
                className="p-1 px-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 px-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week heads */}
          <div className="grid grid-cols-7 border-b border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono py-2.5 bg-slate-50/50">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
            {/* Render leading padding empty blocks */}
            {Array.from({ length: startingDayOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-24 bg-slate-50/30"></div>
            ))}

            {/* Days Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const hasEvents = getDayEvents(dayNum).length > 0;
              const isSelected = selectedDay === dayNum;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum === selectedDay ? null : dayNum)}
                  className={`h-24 p-2 flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected ? "bg-indigo-50/50 ring-1 ring-inset ring-indigo-500" : "hover:bg-slate-50/50"
                  }`}
                >
                  <span className={`font-mono font-bold ${isSelected ? "text-indigo-600 text-sm" : "text-slate-400"}`}>
                    {dayNum}
                  </span>

                  {/* Red/Green dots based on mapped event counts */}
                  {hasEvents && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {getDayEvents(dayNum).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-2 h-2 rounded-full ${
                            ev.type === "inspection"
                              ? "bg-indigo-600"
                              : ev.type === "move_in"
                              ? "bg-emerald-500"
                              : ev.type === "maintenance"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}
                          title={ev.title}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED APPOINTMENT STREAM */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Clock className="w-4.5 h-4.5 text-indigo-600" />
              {selectedDay ? `Agenda for Jun ${selectedDay}, 2026` : "Active Month Agenda (June 2026)"}
            </h4>

            {activeEventsList.length > 0 ? (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {activeEventsList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border border-slate-200/50 flex flex-col space-y-2 text-xs relative ${
                      item.type === "inspection"
                        ? "bg-indigo-50/10 hover:border-indigo-200"
                        : item.type === "move_in"
                        ? "bg-emerald-50/10 hover:border-emerald-200"
                        : "bg-amber-50/10 hover:border-amber-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-sm ${
                          item.type === "inspection"
                            ? "bg-indigo-50 text-indigo-700"
                            : item.type === "move_in"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-[13px] tracking-tight leading-none">
                      {item.title}
                    </h5>

                    {item.details && (
                      <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                        {item.details}
                      </p>
                    )}

                    {/* Mapped Tenant attributes */}
                    {(item.tenantName || item.unitId) && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        {item.tenantName && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-600">{item.tenantName}</span>
                          </div>
                        )}
                        {item.unitId && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-sm font-mono">
                            Suite {item.unitId}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No active agenda items queued for this day.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* QUICK WORK ORDER SCHEDULE FORM (MODAL) */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-350 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Schedule Work Order</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Appointment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Routine unit inspection MC-01"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Event Category</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  >
                    <option value="inspection">Inspection</option>
                    <option value="move_in">Move-In</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other Booking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Resident Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Chebet Kosgei"
                    value={newEvent.tenantName}
                    onChange={(e) => setNewEvent({ ...newEvent, tenantName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Suite Number</label>
                  <input
                    type="text"
                    placeholder="e.g. MC-01"
                    value={newEvent.unitId}
                    onChange={(e) => setNewEvent({ ...newEvent, unitId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Brief Description / Instructions</label>
                <textarea
                  required
                  placeholder="Record visit specifics or tool requests..."
                  value={newEvent.details}
                  onChange={(e) => setNewEvent({ ...newEvent, details: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Register schedule booking
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
