// FILE: src/components/ui/StatCard.tsx
import React from "react";
import * as LucideIcons from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: keyof typeof LucideIcons;
  accentColor: "indigo" | "green" | "amber" | "red";
}

export default function StatCard({ title, value, subtitle, icon, accentColor }: StatCardProps) {
  const IconComponent = LucideIcons[icon] as React.ComponentType<{ className?: string }>;

  // Accent specific colors for icons and bg, removing generic colored left-borders
  const accentClasses = {
    indigo: {
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    green: {
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    amber: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    red: {
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.indigo;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{title}</span>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-[11px] text-slate-400 font-semibold">{subtitle}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${currentAccent.iconBg}`}>
        {IconComponent && <IconComponent className={`w-5 h-5 ${currentAccent.iconColor}`} />}
      </div>
    </div>
  );
}
