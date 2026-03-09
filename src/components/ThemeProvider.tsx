import React, { createContext, useContext, ReactNode } from 'react';
import { useHabitStore } from '@/store/habitStore';

interface ThemeContextType {
  theme: 'pastel' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useHabitStore((state) => state.theme);
  const setTheme = useHabitStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'pastel' ? 'dark' : 'pastel');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'pastel' ? 'pastel-theme' : 'dark-theme'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
