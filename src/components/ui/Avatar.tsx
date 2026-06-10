// FILE: src/components/ui/Avatar.tsx
import React from "react";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
  // Get initials
  const getInitials = (fullName: string) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic bg color mapping based on name hash
  const getColorHash = (fullName: string) => {
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-indigo-100 text-indigo-700",
      "bg-emerald-100 text-emerald-700",
      "bg-violet-100 text-violet-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-16 h-16 text-lg font-bold",
  };

  const initials = getInitials(name);
  const colorClass = getColorHash(name);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src && src.trim() !== "") {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-full object-cover border border-slate-200`}
        onError={(e) => {
          // If image fails, revert to placeholder
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold tracking-wider font-mono shadow-xs border border-slate-200/50 ${colorClass}`}>
      {initials}
    </div>
  );
}
