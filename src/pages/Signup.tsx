// FILE: src/pages/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, ShieldCheck, Check } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useRentSystem();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      login({
        name: formData.name || "George Oloo",
        role: "Property Manager",
        email: formData.email || "oloogeorge633@gmail.com",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        
        {/* LEFT COLUMN: BRANDING */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-505/20 via-transparent to-transparent"></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white text-indigo-700 flex items-center justify-center font-bold text-lg">
              N
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">NestIQ</span>
              <span className="block text-[9px] text-indigo-200 font-semibold uppercase tracking-wider -mt-1 font-mono">
                Power of Avodal
              </span>
            </div>
          </div>

          <div className="space-y-4 my-auto relative z-10 max-w-sm">
            <Building2 className="w-16 h-16 text-indigo-200/90" />
            <h2 className="text-2xl font-bold leading-tight">Start managing your plots.</h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Register in under 2 minutes. Gain total visibility into room vacancies, rent streams, smart arrears notifications, and instant reports.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-200 relative z-10">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Enterprise SSL Core Enclosure</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SIGNUP FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {success ? (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Account success!</h3>
              <p className="text-xs text-slate-500">Creating your property vault. Directing to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Create your account</h3>
                <p className="text-xs text-slate-400 mt-1">Get started with our Kenyan rental management suite.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. George Oloo"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. oloo@avodal.co.ke"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +254 712 345678"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm password</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                {/* Agree to terms */}
                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 font-medium">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>

                {/* Sign up button */}
                <button
                  type="submit"
                  className="w-full cursor-pointer py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors mt-2"
                >
                  Create NestIQ Account
                </button>
              </form>

              {/* Redirect to login */}
              <p className="text-center text-xs text-slate-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </p>

              <div className="mt-6 text-center border-t border-slate-100 pt-3">
                <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                  Powered by Avodal
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
