"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ViewMode = "digest" | "twitter" | "facebook";

interface ViewContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType>({
  view: "digest",
  setView: () => {},
});

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>("digest");

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  return useContext(ViewContext);
}
