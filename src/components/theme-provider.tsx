"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function DashboardThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-theme") as Theme | null;
    if (stored === "dark") {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("dashboard-theme", next);
      return next;
    });
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div className="min-h-screen" style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark-dashboard" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
