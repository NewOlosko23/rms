// FILE: src/components/ui/OccupancyRing.tsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface OccupancyRingProps {
  occupiedCount: number;
  totalCount: number;
}

export default function OccupancyRing({ occupiedCount, totalCount }: OccupancyRingProps) {
  const occupiedPct = totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0;
  const vacantCount = Math.max(0, totalCount - occupiedCount);

  const data = [
    { name: "Occupied", value: occupiedCount, color: "#4F46E5" },
    { name: "Vacant", value: vacantCount, color: "#E5E7EB" },
  ];

  return (
    <div className="relative w-[120px] h-[120px] flex items-center justify-center mx-auto">
      <PieChart width={120} height={120}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={42}
          outerRadius={50}
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
      <div className="absolute text-center">
        <span className="block text-xl font-extrabold text-slate-800 leading-none">{occupiedPct}%</span>
        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider block mt-0.5">Occupied</span>
      </div>
    </div>
  );
}
