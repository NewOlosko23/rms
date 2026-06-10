// FILE: src/components/charts/RevenueBarChart.tsx
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatKES } from "../../data/helpers";

interface RevenueBarChartProps {
  data: { month: string; revenue: number }[];
}

export default function RevenueBarChart({ data }: RevenueBarChartProps) {
  const [period, setPeriod] = useState("6m");

  // Format Y-Axis values like "97K", "85K"
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
          <p className="text-xs font-semibold text-slate-500 mb-1">{payload[0].payload.month}</p>
          <p className="text-sm font-bold text-indigo-600">{formatKES(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Monthly Revenue</h3>
          <p className="text-xs text-slate-400 mt-0.5">YTD earnings across Siaya properties</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
        >
          <option value="6m">Last 6 Months</option>
          <option value="12m">This Year</option>
        </select>
      </div>

      <div className="flex-1 w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fill: "#64748B", fontSize: 10, fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar 
              dataKey="revenue" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
