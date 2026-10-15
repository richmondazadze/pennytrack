"use client";
import { createContext, useContext, useEffect, useState } from "react";

// "system" follows the OS; "light" and "dark" are explicit choices.
const STORAGE_KEY = "pt-theme";
const ThemeContext = createContext({ theme: "system", setTheme: () => {} });

// Runs before hydration (see app/layout.js) so the app never flashes the wrong theme.
export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d&&location.pathname!=="/"&&location.pathname!=="/login")document.documentElement.classList.add("dark")}catch(e){}})()`;

function applyTheme(theme, enabled) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", enabled && dark);
}

// Marketing pages always render light; the app honours the user's theme.
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");

  useEffect(() => {
    try {
      setThemeState(localStorage.getItem(STORAGE_KEY) || "system");
    } catch {}
  }, []);

  const setTheme = (next) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

// Used by the app shell: applies the theme while mounted, removes it on unmount.
export function useApplyTheme() {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    applyTheme(theme, true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(theme, true);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      document.documentElement.classList.remove("dark");
    };
  }, [theme]);
}

export const useTheme = () => useContext(ThemeContext);
