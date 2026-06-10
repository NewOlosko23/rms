// FILE: src/components/ui/RentStatusBadge.tsx
import React from "react";

export type StatusType = "paid" | "pending" | "overdue" | "vacant" | "occupied";

interface RentStatusBadgeProps {
  status: StatusType | string;
}

export default function RentStatusBadge({ status }: RentStatusBadgeProps) {
  const normalizedStatus = (status || "").toLowerCase() as StatusType;

  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    overdue: "bg-rose-50 text-rose-700 border border-rose-200",
    vacant: "bg-slate-50 text-slate-500 border border-slate-200",
    occupied: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  };

  const currentStyle = styles[normalizedStatus] || "bg-slate-50 text-slate-600 border border-slate-200";

  const labels = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    vacant: "Vacant",
    occupied: "Occupied",
  };

  const labelString = labels[normalizedStatus] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${currentStyle}`}>
      {labelString}
    </span>
  );
}
