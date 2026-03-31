import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Light mode TETAP seperti semula (putih + biru)
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

// Dark mode yang DIPERBAIKI (lebih soft, nyaman, dan profesional)
export const darkTheme = {
	gradientColors: ["#1E293B", "#0F172A", "#0A0F1A"], // Gradien yang soft
	card: "#1E293B", // Card abu-abu kebiruan
	text: "#F1F5F9", // Teks putih kebiruan (tidak silau)
	textSecondary: "#94A3B8", // Teks sekunder abu-abu terang
	textTertiary: "#64748B", // Teks tersier abu-abu medium
	primary: "#3B82F6", // Biru elegan (tidak terlalu mencolok)
	primaryDark: "#2563EB", // Biru gelap
	modalOverlay: "rgba(0, 0, 0, 0.6)", // Overlay lebih soft
	cancelButton: "#334155", // Tombol cancel abu-abu
	cancelButtonText: "#94A3B8", // Teks cancel abu-abu terang
	buttonText: "#fff",
	border: "#334155", // Border abu-abu gelap
	background: "#0F172A", // Background utama
	icon: "#FFB347", // Icon warna oranye lembut (kontras)
	starFull: "#FFB800",
	starHalf: "#FFB800",
	starEmpty: "#334155", // Star kosong abu-abu
	header: "#1E293B",
	cardShadow: "#000",
};

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
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
			const savedTheme = await AsyncStorage.getItem("isDarkMode");
			if (savedTheme !== null) {
				setIsDarkMode(savedTheme === "true");
			}
		} catch (error) {
			console.error("Error loading theme preference:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleTheme = async () => {
		const newTheme = !isDarkMode;
		setIsDarkMode(newTheme);
		try {
			await AsyncStorage.setItem("isDarkMode", String(newTheme));
		} catch (error) {
			console.error("Error saving theme preference:", error);
		}
	};

	const setTheme = async (isDark) => {
		setIsDarkMode(isDark);
		try {
			await AsyncStorage.setItem("isDarkMode", String(isDark));
		} catch (error) {
			console.error("Error saving theme preference:", error);
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
