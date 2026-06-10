// FILE: src/pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, ShieldCheck } from "lucide-react";
import { useRentSystem } from "../context/RentSystemContext";

export default function Login() {
  const [email, setEmail] = useState("manager@avodal.co.ke");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useRentSystem();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: "George Oloo",
      role: "Property Manager",
      email: email
    });
    navigate("/dashboard");
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
            <h2 className="text-2xl font-bold leading-tight">Rental management, simplified.</h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Empowering Kenyan landlords to manage plots, automate rent collections tracking, and run tenant screening seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-200 relative z-10">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Enterprise SSL Core Enclosure</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                N
              </div>
              <span className="font-bold text-lg text-slate-800">NestIQ</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Welcome back</h3>
            <p className="text-xs text-slate-400 mt-1">Provide your credentials to access the property dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@avodal.co.ke"
                className="w-full text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <Link to="/reset-password" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-500 font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-indigo-500/10 transition-all"
            >
              Sign in to NestIQ
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 border-t border-slate-100"></div>
            <span className="relative px-3 bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
              or continue with
            </span>
          </div>

          {/* Google SSO Placeholder */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.13C18.465 1.91 15.54 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.464 10.55-10.74 0-.726-.08-1.282-.175-1.985H12.24z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Redirect to signup */}
          <p className="text-center text-xs text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
              Create an account
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

        </div>
      </div>
    </div>
  );
}
