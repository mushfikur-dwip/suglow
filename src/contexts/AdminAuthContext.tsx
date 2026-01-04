import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_token";
const USER_KEY = "user";

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Only set admin/manager users in this context
        // Don't remove customer tokens - they use different auth context
        if (parsed.role === 'admin' || parsed.role === 'manager') {
          setUser({
            id: parsed.id.toString(),
            email: parsed.email,
            name: `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || parsed.email,
            role: parsed.role
          });
        }
        // If customer, just ignore - don't remove their token
      } catch (error) {
        // Only remove if parsing fails, not if role doesn't match
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success && response.token) {
        // Only allow admin and manager roles
        if (response.user.role !== 'admin' && response.user.role !== 'manager') {
          return { success: false, error: "Access denied. Admin privileges required." };
        }

        const adminUser: AdminUser = {
          id: response.user.id.toString(),
          email: response.user.email,
          name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || response.user.email,
          role: response.user.role
        };

        localStorage.setItem(STORAGE_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        setUser(adminUser);

        return { success: true };
      }

      return { success: false, error: response.message || "Login failed" };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || "Invalid email or password" };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
