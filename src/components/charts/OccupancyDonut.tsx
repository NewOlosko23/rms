// FILE: src/components/charts/OccupancyDonut.tsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface OccupancyDonutProps {
  occupied: number;
  vacant: number;
}

export default function OccupancyDonut({ occupied, vacant }: OccupancyDonutProps) {
  const total = occupied + vacant;
  const occupiedPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const data = [
    { name: "Occupied", value: occupied, color: "#4F46E5" },
    { name: "Vacant", value: vacant, color: "#E2E8F0" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">Occupancy Rate</h3>
      <p className="text-xs text-slate-400 mb-4">Current rental utilization ratio</p>

      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Ring wrapper */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <span className="block text-3xl font-extrabold text-slate-800 leading-none">{occupiedPct}%</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">Occupied</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 justify-center mt-6 w-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600 block"></span>
            <div>
              <span className="font-semibold text-slate-700">{occupied}</span>
              <span className="text-slate-400 ml-1">Occupied</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200 block"></span>
            <div>
              <span className="font-semibold text-slate-700">{vacant}</span>
              <span className="text-slate-400 ml-1">Vacant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
