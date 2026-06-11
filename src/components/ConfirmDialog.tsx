import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type AlertType = "confirm" | "alert" | "error" | "success" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDanger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  type,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      case "alert":
      default:
        return <AlertCircle className="w-6 h-6 text-slate-500" />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "confirm":
        return "bg-amber-50 border-b border-amber-100";
      case "error":
        return "bg-red-50 border-b border-red-100";
      case "success":
        return "bg-emerald-50 border-b border-emerald-100";
      case "info":
        return "bg-blue-50 border-b border-blue-100";
      case "alert":
      default:
        return "bg-slate-50 border-b border-slate-100";
    }
  };

  const getButtonColor = () => {
    if (isDanger) return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
    switch (type) {
      case "confirm":
        return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500";
      case "error":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      case "alert":
      default:
        return "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-start ${getHeaderColor()}`}>
          <div className="flex gap-3 items-start flex-1">
            <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50 ml-2 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-sm text-slate-600 space-y-3">
          <p className="leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2.5 text-xs font-semibold text-white ${getButtonColor()} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading && (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
