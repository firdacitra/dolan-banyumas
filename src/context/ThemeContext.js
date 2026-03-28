import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme definitions
export const lightTheme = {
  gradientColors: ["#24ccff", "#aaf1ff", "#e0efff"],
  card: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  textTertiary: "#999999",
  primary: "#007AFF",
  primaryDark: "#0056b3",
  modalOverlay: "rgba(0, 0, 0, 0.5)",
  cancelButton: "#f0f0f0",
  cancelButtonText: "#666",
  buttonText: "#fff",
  border: "#E0E0E0",
  background: "#F5F5F5",
  icon: "#666666",
  starFull: "#FFB800",
  starHalf: "#FFB800",
  starEmpty: "#E0E0E0",
  header: "#FFFFFF",
  cardShadow: "#000",
};

export const darkTheme = {
  gradientColors: ["#1a1a2e", "#16213e", "#0f3460"],
  card: "#1e1e2a",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textTertiary: "#888888",
  primary: "#0a84ff",
  primaryDark: "#0056b3",
  modalOverlay: "rgba(0, 0, 0, 0.8)",
  cancelButton: "#2a2a2a",
  cancelButtonText: "#ccc",
  buttonText: "#fff",
  border: "#333333",
  background: "#121212",
  icon: "#AAAAAA",
  starFull: "#FFB800",
  starHalf: "#FFB800",
  starEmpty: "#444444",
  header: "#1a1a1a",
  cardShadow: "#000",
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('isDarkMode', String(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTheme = async (isDark) => {
    setIsDarkMode(isDark);
    try {
      await AsyncStorage.setItem('isDarkMode', String(isDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
        setTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};