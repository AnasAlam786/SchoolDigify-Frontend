import { useEffect, useState } from "react";
import { ThemeContext } from "./themeContext.js";

const STORAGE_KEY = "schooldigify-theme";

function getInitialTheme() {
  if (typeof document !== "undefined") {
    const activeTheme = document.documentElement.dataset.theme;
    if (activeTheme === "light" || activeTheme === "dark") return activeTheme;
  }

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    return "dark";
  }

  return "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark"),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}