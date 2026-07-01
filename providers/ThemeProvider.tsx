"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const themes = ["obsidian", "midnight", "legion-red", "gold-commander", "light"] as const;
export type Theme = (typeof themes)[number];

const storageKey = "ix-vault-theme";
const defaultTheme: Theme = "obsidian";

const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void } | null>(null);

function isTheme(value: string | null): value is Theme {
  return Boolean(value && themes.includes(value as Theme));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const nextTheme = isTheme(saved) ? saved : defaultTheme;
    setThemeState(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
