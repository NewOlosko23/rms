// FILE: src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RentSystemProvider } from "./context/RentSystemContext";
import { AuthProvider } from "./context/AuthContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
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
import Help from "./pages/Help";
import Search from "./pages/Search";

export default function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <RentSystemProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes - Only accessible when NOT logged in */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <ResetPassword />
                  </PublicRoute>
                }
              />

              {/* Secure SaaS Panels - Only accessible when logged in */}
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
                <Route path="help" element={<Help />} />
                <Route path="search" element={<Search />} />
              </Route>

              {/* Clean catch-all redirects standard boundary */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </RentSystemProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}
