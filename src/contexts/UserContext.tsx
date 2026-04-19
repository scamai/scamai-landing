"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type User = {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  plan: "free" | "paid";
};

type UserContextValue = {
  user: User | null;
  loading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credential: string) => {
    const res = await fetch("/api/auth/google-onetap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(err.error);
    }
    const data = await res.json();
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
