import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

const STORAGE_KEY = "admin_session";

// Mock admin credentials (will be replaced with API later)
const MOCK_ADMINS = [
  { id: "1", email: "admin@kirei.com", password: "admin123", name: "Admin User", role: "admin" as const },
  { id: "2", email: "manager@kirei.com", password: "manager123", name: "Store Manager", role: "manager" as const },
];

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        // Check if session is still valid (24 hours)
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const admin = MOCK_ADMINS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!admin) {
      return { success: false, error: "Invalid email or password" };
    }

    const { password: _, ...userWithoutPassword } = admin;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = {
      user: userWithoutPassword,
      expiresAt: expiresAt.toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(userWithoutPassword);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
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
