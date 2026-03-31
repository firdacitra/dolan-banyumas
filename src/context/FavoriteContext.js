import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext({});

export const useFavorites = () => {
	return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// ambil key berdasarkan user login
	const getFavoriteKey = async () => {
		const user = await AsyncStorage.getItem("user");
		if (!user) return null;

		const parsed = JSON.parse(user);
		return `favorites_${parsed.username}`;
	};

	useEffect(() => {
		loadFavorites();
	}, []);

	const loadFavorites = async () => {
		try {
			setIsLoading(true);

			const key = await getFavoriteKey();
			if (!key) {
				setFavorites([]);
				return;
			}

			const stored = await AsyncStorage.getItem(key);

			if (stored) {
				setFavorites(JSON.parse(stored));
			} else {
				setFavorites([]);
			}
		} catch (error) {
			console.log("Error loading favorites:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isFavorite = (itemId) => {
		return favorites.some((item) => item.id === itemId);
	};

	const addFavorite = async (item) => {
		try {
			const key = await getFavoriteKey();
			if (!key) {
				return { success: false, message: "Harus login dulu" };
			}

			if (favorites.some((fav) => fav.id === item.id)) {
				return { success: false, message: "Sudah ada di favorit" };
			}

			const newFavorites = [...favorites, item];
			setFavorites(newFavorites);

			await AsyncStorage.setItem(key, JSON.stringify(newFavorites));

			return { success: true, message: "Ditambahkan ke favorit" };
		} catch (error) {
			console.log(error);
			return { success: false };
		}
	};

	const removeFavorite = async (itemId) => {
		try {
			const key = await getFavoriteKey();
			if (!key) return;

			const newFavorites = favorites.filter((item) => item.id !== itemId);

			setFavorites(newFavorites);
			await AsyncStorage.setItem(key, JSON.stringify(newFavorites));

			return { success: true, message: "Dihapus dari favorit" };
		} catch (error) {
			console.log(error);
			return { success: false };
		}
	};

	const toggleFavorite = async (item) => {
		if (isFavorite(item.id)) {
			return await removeFavorite(item.id);
		} else {
			return await addFavorite(item);
		}
	};

	// ❗ INI PENTING BANGET
	const clearFavoritesState = () => {
		setFavorites([]); // reset UI doang (bukan hapus storage)
	};

	const value = {
		favorites,
		isLoading,
		isFavorite,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		loadFavorites,
		clearFavoritesState,
	};

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
};
