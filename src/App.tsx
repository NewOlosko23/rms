// FILE: src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RentSystemProvider, useRentSystem } from "./context/RentSystemContext";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

// Core dashboard modules
import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Units from "./pages/Units";
import UnitDetail from "./pages/UnitDetail";
import Tenants from "./pages/Tenants";
import TenantDetail from "./pages/TenantDetail";
import RentTracker from "./pages/RentTracker";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Protect route wrapper for dashboard authorization
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRentSystem();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <RentSystemProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Pathways */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Secure SaaS Panels */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:id" element={<LocationDetail />} />
            <Route path="units" element={<Units />} />
            <Route path="units/:id" element={<UnitDetail />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenants/:id" element={<TenantDetail />} />
            <Route path="rent-tracker" element={<RentTracker />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Clean catch-all redirects standard boundary */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RentSystemProvider>
  );
}
