// FILE: src/pages/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, ShieldCheck, Check } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";
import { useConfirm } from "../context/ConfirmContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useRentSystem();
  const navigate = useNavigate();
  const { showAlert } = useConfirm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      showAlert("warning", "Terms Required", "Please agree to the Terms of Service and Privacy Policy");
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

  const handleGoogleSignup = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simulate Google sign-up
    setSuccess(true);
    setTimeout(() => {
      login({
        name: "George Oloo",
        role: "Property Manager",
        email: "manager@avodal.co.ke",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        
        {/* LEFT COLUMN: BRANDING & ART */}
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
              <h3 className="text-lg font-bold text-slate-800">Account created!</h3>
              <p className="text-xs text-slate-500">Setting up your property dashboard. Redirecting...</p>
            </div>
          ) : (
            <>
              <div className="md:hidden flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  N
                </div>
                <span className="font-bold text-lg text-slate-800">NestIQ</span>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Create your account</h3>
                <p className="text-xs text-slate-400 mt-1">Join thousands of property managers managing rentals seamlessly</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="George Oloo"
                    className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all font-medium"
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
                    placeholder="oloo@avodal.co.ke"
                    className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Agree to terms */}
                <label className="flex items-center gap-2 py-1 cursor-pointer select-none">
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
                  className="w-full cursor-pointer py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-indigo-500/10 transition-all"
                >
                  Create Account
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 border-t border-slate-100"></div>
                <span className="relative px-3 bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                  or continue with
                </span>
              </div>

              {/* Google SSO */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>

              {/* Redirect to login */}
              <p className="text-center text-xs text-slate-500 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                  Sign in
                </Link>
              </p>

              <div className="mt-8 text-center border-t border-slate-100 pt-4">
                <a
                  href="https://avodal.co.ke"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-slate-400 font-semibold hover:text-indigo-600 transition-colors"
                >
                  Powered by Avodal
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
