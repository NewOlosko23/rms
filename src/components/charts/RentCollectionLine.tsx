// FILE: src/components/charts/RentCollectionLine.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatKES } from "../../data/helpers";

interface TrendDataPoint {
  month: string;
  collectionRate: number;
  occupancyRate: number;
}

interface RentCollectionLineProps {
  data: TrendDataPoint[];
}

export default function RentCollectionLine({ data }: RentCollectionLineProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">Performance Benchmarks</h3>
      <p className="text-xs text-slate-400 mb-6">Historical trends across Siaya portfolios</p>

      <div className="flex-1 w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [`${value}%`, name]}
              contentStyle={{ background: "#FFF", borderRadius: "8px", border: "1px solid #E2E8F0" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", fontWeight: 500, pt: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="collectionRate" 
              name="Rent Collection Rate" 
              stroke="#10B981" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="occupancyRate" 
              name="Occupancy Rate" 
              stroke="#4F46E5" 
              strokeWidth={2.5}
              dot={{ strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
