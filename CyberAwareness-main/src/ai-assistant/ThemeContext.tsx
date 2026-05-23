import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme preference or detect system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    setIsInitialized(true);
  }, []);

  const applyRootDarkClass = (darkMode: boolean) => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  };

  // Apply theme to DOM
  useEffect(() => {
    if (!isInitialized) return;

    let shouldBeDark = isDark;

    if (theme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldBeDark = theme === 'dark';
    }

    setIsDark(shouldBeDark);
    applyRootDarkClass(shouldBeDark);

    // Save preference
    if (theme !== 'system') {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }, [theme, isInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const shouldBeDark = mediaQuery.matches;
      setIsDark(shouldBeDark);
      const htmlElement = document.documentElement;
      if (shouldBeDark) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
