import { createContext, useEffect, useState } from "react";
import { getUser } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, Loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};