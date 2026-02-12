"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAdmin: boolean;
  login: (token: string, isAdminSession?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAdmin(data.isAdmin || false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (token: string, isAdminSession: boolean = false) => {
    if (isAdminSession) {
      document.cookie = `admin_session=${token}; path=/; HttpOnly; SameSite=Lax`;
      setIsAdmin(true);
      router.push("/admin");
    } else {
      document.cookie = `employee_session=${token}; path=/; HttpOnly; SameSite=Lax`;
      setIsAdmin(false);
      router.push("/dashboard");
    }
  };

  const logout = () => {
    // Clear both sessions
    document.cookie =
      "employee_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setIsAdmin(false);
    router.push("/employee/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
