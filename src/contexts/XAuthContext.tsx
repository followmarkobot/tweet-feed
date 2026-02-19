"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface XAuthContextValue {
  isConnected: boolean;
  xHandle: string | null;
  isChecking: boolean;
  checkStatus: () => Promise<void>;
}

const XAuthContext = createContext<XAuthContextValue>({
  isConnected: false,
  xHandle: null,
  isChecking: true,
  checkStatus: async () => {},
});

export function XAuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [xHandle, setXHandle] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/auth/twitter/status", {
        cache: "no-store",
      });

      if (!response.ok) {
        setIsConnected(false);
        setXHandle(null);
        return;
      }

      const payload = (await response.json()) as {
        connected: boolean;
        handle: string | null;
      };

      setIsConnected(Boolean(payload.connected));
      setXHandle(payload.handle || null);
    } catch (error) {
      console.error("Failed to check X auth status:", error);
      setIsConnected(false);
      setXHandle(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const value = useMemo(
    () => ({ isConnected, xHandle, isChecking, checkStatus }),
    [isConnected, xHandle, isChecking, checkStatus]
  );

  return <XAuthContext.Provider value={value}>{children}</XAuthContext.Provider>;
}

export function useXAuth() {
  return useContext(XAuthContext);
}
