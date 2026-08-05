import { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";

// Create the context
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const { theme, setTheme } = useAuth();

  // Keep API compatibility for existing components while enforcing a single brand palette.
  const palette = "somaiya";
  const setPalette = () => {};

  const value = {
    theme,
    palette,
    setTheme,
    setPalette,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
