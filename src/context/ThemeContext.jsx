import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bankadmin_theme') || 'light';
  });

  const [density, setDensity] = useState(() => {
    return localStorage.getItem('bankadmin_density') || 'normal';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bankadmin_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('bankadmin_density', density);
  }, [density]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDensity = () => {
    setDensity(prev => (prev === 'normal' ? 'compact' : 'normal'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, density, setDensity, toggleDensity }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
