import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe } from "../api/authApi";

interface AuthUser {
  userId: number;
  nickname: string;
  profileImage: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getMe(token)
        .then((res) => {
          if (res.success) {
            setAccessToken(token);
            setUser(res.data);
          } else {
            localStorage.removeItem("accessToken");
          }
        })
        .catch(() => localStorage.removeItem("accessToken"))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    setUser(userData);
  };

  const logout = () => {
    console.log("[Logout] 로그아웃");
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
