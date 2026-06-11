import React, { createContext, useContext, useState, useEffect } from "react";
import { ADMIN_USER } from "../data/mockData";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  company: string;
  avatar: string;
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (on mount)
  useEffect(() => {
    checkAuth();
  }, []);

  // Auto-logout when session expires (check every minute)
  useEffect(() => {
    const checkSessionExpiry = setInterval(() => {
      const storedSession = localStorage.getItem("nest_iq_auth_session");
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session.expiresAt <= Date.now()) {
            logout();
            // Show session expired message
            setError("Your session has expired. Please login again.");
          }
        } catch (err) {
          // Invalid session, logout
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSessionExpiry);
  }, []);

  const checkAuth = () => {
    const storedSession = localStorage.getItem("nest_iq_auth_session");
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // Check if session exists and hasn't expired
        if (session.user && session.expiresAt && session.expiresAt > Date.now()) {
          setUser(session.user);
          setIsLoggedIn(true);
          setError(null);
        } else {
          // Session expired or invalid
          localStorage.removeItem("nest_iq_auth_session");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        // Invalid JSON, clear it
        localStorage.removeItem("nest_iq_auth_session");
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Validate credentials against mock admin
        if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
          const userData: AuthUser = {
            id: ADMIN_USER.id,
            email: ADMIN_USER.email,
            name: ADMIN_USER.name,
            role: ADMIN_USER.role,
            phone: ADMIN_USER.phone,
            company: ADMIN_USER.company,
            avatar: ADMIN_USER.avatar,
            permissions: ADMIN_USER.permissions,
          };

          // Store session with 7-day expiry (more reliable than 24h)
          const session = {
            user: userData,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            loginTime: new Date().toISOString(),
          };

          localStorage.setItem("nest_iq_auth_session", JSON.stringify(session));
          setUser(userData);
          setIsLoggedIn(true);
          setError(null);
          setIsLoading(false);
          resolve(true);
        } else {
          setError("Invalid email or password. Please try again.");
          setIsLoggedIn(false);
          setUser(null);
          setIsLoading(false);
          resolve(false);
        }
      }, 800); // Simulate 800ms network delay
    });
  };

  const logout = () => {
    localStorage.removeItem("nest_iq_auth_session");
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
