import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/api/auth/me")
      .then(({ user: currentUser }) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(credentials) {
      const result = await apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) });
      setUser(result.user);
      return result.user;
    },
    async register(details) {
      const result = await apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(details) });
      setUser(result.user);
      return result.user;
    },
    async logout() {
      await apiRequest("/api/auth/logout", { method: "POST" });
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
