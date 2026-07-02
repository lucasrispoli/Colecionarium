"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { AuthResponse, LoginRequest, User } from "../types/User";
import { login as loginService } from "../services/auth.service";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const userDataStr = localStorage.getItem("user");

    if (token && userDataStr) {
      try {
        setUser(JSON.parse(userDataStr));
      } catch {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("user");
      }
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("user");
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response: AuthResponse = await loginService(data);

    Cookies.set("accessToken", response.accessToken);
    Cookies.set("refreshToken", response.refreshToken);

    const userData: User = {
      id: "1",
      username: data.username,
      roles: [
        {
          id: "1",
          name: "ADMIN",
        },
      ],
      accountLocked: false,
      createdAt: "",
      lastLoginAt: null,
      lockUntil: null,
      updatedAt: null,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}