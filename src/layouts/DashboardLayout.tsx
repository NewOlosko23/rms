// FILE: src/layouts/DashboardLayout.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useRentSystem } from "../context/RentSystemContext";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ConfirmContext";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Users,
  CreditCard,
  CalendarDays,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Info,
  User,
  HelpCircle
} from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "true");
  const location = useLocation();
  const navigate = useNavigate();
  const mainContentRef = useRef<HTMLMainElement>(null);
  const { notifications, markNotificationsRead, globalSearchQuery, setGlobalSearchQuery } = useRentSystem();
  const { user, logout } = useAuth();
  const { showConfirm } = useConfirm();

  // Scroll to top when route changes
  useEffect(() => {
    if (mainContentRef.current) {
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setDesktopProfileOpen(false);
    setMobileProfileOpen(false);
    if (!notificationsOpen) {
      markNotificationsRead();
    }
  };

  const handleToggleDesktopProfile = () => {
    setDesktopProfileOpen(!desktopProfileOpen);
    setNotificationsOpen(false);
  };

  const handleToggleMobileProfile = () => {
    setMobileProfileOpen(!mobileProfileOpen);
    setNotificationsOpen(false);
  };

  // Handle global search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(globalSearchQuery)}`);
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };

  // Navigation Items
  const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Units", href: "/units", icon: Building2 },
    { name: "Tenants", href: "/tenants", icon: Users },
    { name: "Rent Tracker", href: "/rent-tracker", icon: CreditCard },
    { name: "Calendar", href: "/calendar", icon: CalendarDays },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Resolve current page title from path
  const currentPath = location.pathname;
  let pageTitle = "Dashboard";
  if (currentPath.startsWith("/locations")) {
    pageTitle = "Locations";
  } else if (currentPath.startsWith("/units")) {
    pageTitle = "Units";
  } else if (currentPath.startsWith("/tenants")) {
    pageTitle = "Tenants";
  } else if (currentPath.startsWith("/rent-tracker")) {
    pageTitle = "Rent Tracker";
  } else if (currentPath.startsWith("/calendar")) {
    pageTitle = "Calendar";
  } else if (currentPath.startsWith("/reports")) {
    pageTitle = "Reports & Analytics";
  } else if (currentPath.startsWith("/settings")) {
    pageTitle = "Account Settings";
  } else if (currentPath.startsWith("/help")) {
    pageTitle = "Help & Support";
  }

  // Handle Logout
  const handleLogout = async () => {
    const confirmed = await showConfirm({
      type: "confirm",
      title: "Sign Out?",
      message: "Are you sure you want to sign out? You will need to log in again to access your account.",
      confirmLabel: "Sign Out",
      cancelLabel: "Cancel",
      isDanger: true,
    });

    if (confirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* SIDEBAR - DESKTOP */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 sticky top-0 h-screen z-20 transition-all duration-300 relative ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        {/* Toggle Collapse/Expand Button */}
        <button
          onClick={() => {
            const nextState = !sidebarCollapsed;
            setSidebarCollapsed(nextState);
            localStorage.setItem("sidebar_collapsed", String(nextState));
          }}
          className="absolute top-5 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-400 shadow-xs z-30 hover:bg-slate-50 cursor-pointer transition-colors"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* LOGO */}
        <div className={`h-16 border-b border-slate-200 flex items-center transition-all duration-300 ${sidebarCollapsed ? "justify-center px-0" : "px-4 justify-between"}`}>
          {sidebarCollapsed ? (
            <Link to="/dashboard" className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </Link>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                N
              </div>
              <div className="animate-in fade-in duration-200">
                <span className="font-bold text-slate-800 text-lg tracking-tight">NestIQ</span>
                <span className="block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider -mt-1 font-mono">
                  By Avodal
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className={`flex-1 py-4 space-y-1 transition-all duration-300 ${sidebarCollapsed ? "px-2 overflow-visible" : "px-3 overflow-y-auto"}`}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href));
            const Icon = item.icon;
            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    sidebarCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 gap-3"
                  } ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span className="truncate animate-in fade-in duration-200">{item.name}</span>}
                </Link>

                {/* Floating Tooltip Custom Styling */}
                {sidebarCollapsed && (
                  <div className="absolute left-[72px] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                    {/* Tooltip caret arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className={`border-t border-slate-200 bg-slate-50/50 mt-auto transition-all duration-300 ${sidebarCollapsed ? "p-2" : "p-3"}`}>
          {/* Help Link */}
          <Link
            to="/help"
            className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 mb-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 ${
              sidebarCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2 gap-3"
            }`}
            title={sidebarCollapsed ? "Help" : ""}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!sidebarCollapsed && <span className="truncate">Help & Support</span>}
          </Link>

          {/* Copyright & Terms */}
          <div className={`border-t border-slate-200 pt-2 ${sidebarCollapsed ? "text-center" : ""}`}>
            <p className="text-[9px] text-slate-400 font-mono leading-tight">
              {sidebarCollapsed ? "© 2026" : "© 2026 NestIQ by Avodal"}
            </p>
            {!sidebarCollapsed && (
              <div className="flex gap-2 mt-1">
                <a href="#" className="text-[8px] text-indigo-500 hover:text-indigo-600 font-medium">Privacy</a>
                <span className="text-[8px] text-slate-300">•</span>
                <a href="#" className="text-[8px] text-indigo-500 hover:text-indigo-600 font-medium">Terms</a>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden h-14 bg-white border-b border-slate-200 px-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-md">
              N
            </div>
            <span className="font-bold text-slate-800 text-base">NestIQ</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={handleToggleNotifications}
            className="p-1.5 rounded-lg text-slate-600 relative hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={handleToggleMobileProfile}
            className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100 shadow-3xs cursor-pointer hover:opacity-90 focus:outline-hidden transition-all"
          >
            GO
          </button>

          {/* Mobile notification dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-150 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[9px] text-rose-600 bg-rose-50 font-bold px-2 py-0.5 rounded-full">{unreadCount} Unread</span>
                )}
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`px-3 py-2 hover:bg-slate-50 transition-colors flex gap-2 ${!notif.isRead ? "bg-indigo-50/20" : ""}`}>
                      <div className="mt-0.5">
                        {notif.type === "payment_received" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : notif.type === "overdue" ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-800 leading-tight">{notif.message}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{notif.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-slate-400 text-xs">No notifications yet</div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Profile Dropdown */}
          {mobileProfileOpen && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/55">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{user.email}</p>
              </div>
              <div className="p-1 space-y-0.5">
                <Link
                  to="/settings"
                  onClick={() => setMobileProfileOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all font-sans"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileProfileOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all font-sans"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  System Settings
                </Link>
                <div className="h-px bg-slate-100 my-1 font-semibold"></div>
                <button
                  onClick={() => {
                    setMobileProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left focus:outline-hidden font-sans"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE drawer SIDEBAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden flex">
          <div className="w-64 bg-white h-full flex flex-col p-3 relative animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 mt-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg tracking-tight">NestIQ</span>
                <span className="block text-[9px] text-indigo-600 font-semibold uppercase tracking-wider -mt-0.5 font-mono">
                  By Avodal
                </span>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-current" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-200 mt-auto">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  GO
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* DESKTOP TOP BAR */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200 px-6 items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full text-xs pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                id="header-global-search-input"
              />
              {globalSearchQuery ? (
                <button
                  type="button"
                  onClick={() => setGlobalSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden text-xs font-bold font-sans p-1"
                >
                  ✕
                </button>
              ) : (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 focus:outline-hidden transition-colors p-1"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Simple notification overlay list */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-30">
                  <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/55">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} Unread
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`px-3 py-2.5 hover:bg-slate-50 transition-colors flex gap-2.5 ${!notif.isRead ? "bg-indigo-50/15" : ""}`}>
                          <div className="mt-0.5">
                            {notif.type === "payment_received" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : notif.type === "overdue" ? (
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                            ) : (
                              <Info className="w-4 h-4 text-indigo-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{notif.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1 font-mono font-medium">{notif.timestamp}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-6 text-center text-slate-400 text-xs">No notifications logged</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative border-l border-slate-200 pl-3">
              <button
                onClick={handleToggleDesktopProfile}
                className="flex items-center gap-2 text-left cursor-pointer focus:outline-hidden hover:bg-slate-50 p-1 px-2 rounded-lg transition-colors group"
                id="user-profile-menu-button"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100 shadow-3xs group-hover:bg-indigo-100 transition-colors">
                  GO
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-none">{user.name}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5 leading-none">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
              </button>

              {/* Desktop Profile Dropdown menu */}
              {desktopProfileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150"
                  id="user-profile-dropdown"
                >
                  <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/settings"
                      onClick={() => setDesktopProfileOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all font-sans"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      View Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDesktopProfileOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all font-sans"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      System Settings
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setDesktopProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer text-left focus:outline-hidden font-sans"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
              </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main ref={mainContentRef} className="flex-1 p-3 md:p-6 max-w-full w-full mx-auto overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
