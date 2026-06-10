// FILE: src/pages/ResetPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, KeyRound, Check, HelpCircle } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-md w-full border border-slate-200/50">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            N
          </div>
          <div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">NestIQ</span>
            <span className="block text-[9px] text-indigo-600 font-semibold uppercase tracking-wider -mt-1 font-mono">
              By Avodal
            </span>
          </div>
        </div>

        {!isSuccess ? (
          /* STATE 1: REQUEST PASSWORD RESET */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
                No worries! Enter your registered login email and we will dispatch a decryption link shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@avodal.co.ke"
                  className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-indigo-500/10 transition-colors"
              >
                Send secure recovery link
              </button>
            </form>

            <div className="text-center border-t border-slate-100 pt-4">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Back to login registry
              </Link>
            </div>
          </div>
        ) : (
          /* STATE 2: SUCCESS VIEW */
          <div className="space-y-6 animate-in zoom-in-95 duration-200 text-center">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Check your inbox</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                A password reset authorization link has been sent to <br />
                <strong className="text-slate-800 font-semibold">{email}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <p className="text-[11px] text-slate-400 font-medium">
                Didn't receive the email? Double-check your spam folder or attempt to resend.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Resend authorization email
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
                <ChevronLeft className="w-4 h-4" />
                Return to login
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center border-t border-slate-100 pt-3">
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
            Powered by Avodal
          </span>
        </div>

      </div>
    </div>
  );
}
