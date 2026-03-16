import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext({});

export const useFavorites = () => {
	return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadFavorites();
	}, []);

	const loadFavorites = async () => {
		try {
			setIsLoading(true);
			const stored = await AsyncStorage.getItem("favorites");
			if (stored) {
				setFavorites(JSON.parse(stored));
			}
		} catch (error) {
			console.log("Error loading favorites:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const checkLogin = async () => {
		const isLogin = await AsyncStorage.getItem("isLogin");
		return isLogin === "true";
	};

	const isFavorite = (itemId) => {
		return favorites.some((item) => item.id === itemId);
	};

	const addFavorite = async (item) => {
		try {
			// Cek duplikat
			if (favorites.some((fav) => fav.id === item.id)) {
				return { success: false, message: "Item sudah ada di favorit" };
			}

			const newFavorites = [...favorites, item];
			setFavorites(newFavorites);
			await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
			return { success: true, message: "Data berhasil ditambahkan ke favorit" };
		} catch (error) {
			console.log("Error adding favorite:", error);
			return { success: false, message: "Gagal menambahkan" };
		}
	};

	// PERBAIKI FUNGSI REMOVE FAVORITE
	const removeFavorite = async (itemId) => {
		try {
			console.log("Menghapus item dengan ID:", itemId); 

			const newFavorites = favorites.filter((item) => {
				console.log("Item ID:", item.id, "vs", itemId);
				return item.id !== itemId;
			});

			console.log("Jumlah favorites setelah dihapus:", newFavorites.length);
			setFavorites(newFavorites);

			await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));

			return { success: true, message: "Data berhasil dihapus dari favorit" };
		} catch (error) {
			console.log("Error removing favorite:", error);
			return { success: false, message: "Gagal menghapus" };
		}
	};

	const toggleFavorite = async (item) => {
		const isLoggedIn = await checkLogin();

		if (!isLoggedIn) {
			return {
				success: false,
				requireLogin: true,
				message: "Silakan login terlebih dahulu",
			};
		}

		if (isFavorite(item.id)) {
			return await removeFavorite(item.id);
		} else {
			return await addFavorite(item);
		}
	};

	const clearFavorites = async () => {
		setFavorites([]);
		await AsyncStorage.removeItem("favorites");
	};

	const value = {
		favorites,
		isLoading,
		isFavorite,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		loadFavorites,
		clearFavorites,
	};

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
};
