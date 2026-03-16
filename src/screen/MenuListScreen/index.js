import React, { useState, useMemo, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	objekWisataData,
	kulinerData,
	penginapanData,
	olehOlehData,
	desaWisataData,
	biroPerjalananData,
} from "../../constant/dataMenu";

import { useFavorites } from "../../context/FavoriteContext"; // IMPORT CONTEXT

/* ================= THEME ================= */
const lightTheme = {
	gradientColors: ["#24ccff", "#aaf1ff", "#e0efff"],
	card: "#FFFFFF",
	text: "#000000",
	textSecondary: "#666666",
	primary: "#057eff",
};

const theme = lightTheme;

const MenuListScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { category } = route.params;

	// GUNAKAN FAVORITES CONTEXT
	const { isFavorite, toggleFavorite } = useFavorites();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Rating");
	const [isLogin, setIsLogin] = useState(false);

	// Cek status login
	useEffect(() => {
		checkLoginStatus();
	}, []);

	const checkLoginStatus = async () => {
		const status = await AsyncStorage.getItem("isLogin");
		setIsLogin(status === "true");
	};

	const getCategoryData = () => {
		const dataMap = {
			objekWisata: objekWisataData,
			kuliner: kulinerData,
			penginapan: penginapanData,
			olehOleh: olehOlehData,
			desaWisata: desaWisataData,
			biroPerjalanan: biroPerjalananData,
		};
		return dataMap[category] || [];
	};

	const getCategoryTitle = () => {
		const titleMap = {
			objekWisata: "Objek Wisata",
			kuliner: "Kuliner",
			penginapan: "Penginapan",
			olehOleh: "Oleh-oleh",
			desaWisata: "Desa Wisata",
			biroPerjalanan: "Biro Perjalanan",
		};
		return titleMap[category] || "Menu";
	};

	// HANDLE LIKE
	const handleLikePress = async (item) => {
		const loginStatus = await AsyncStorage.getItem("isLogin");

		if (loginStatus !== "true") {
			Alert.alert("Belum Login", "Anda harus login untuk menyukai item", [
				{ text: "Batal", style: "cancel" },
				{ text: "Login", onPress: () => navigation.navigate("Login") },
			]);
			return;
		}

		const result = await toggleFavorite(item);
		if (result && result.message) {
			Alert.alert("Info", result.message);
		}
	};

	const filteredData = useMemo(() => {
		let data = getCategoryData();

		if (searchQuery) {
			data = data.filter(
				(item) =>
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.address.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		if (activeFilter === "Rating") {
			data = [...data].sort((a, b) => b.rating - a.rating);
		} else if (activeFilter === "Terpopuler") {
			data = [...data].sort((a, b) => b.rating - a.rating);
		} else if (activeFilter === "Termurah") {
			data = [...data].sort((a, b) => (a.price || 0) - (b.price || 0));
		}

		return data;
	}, [searchQuery, activeFilter, category]);

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(
					<Text key={i} style={styles.starFull}>
						★
					</Text>,
				);
			} else if (i === fullStars && hasHalfStar) {
				stars.push(
					<Text key={i} style={styles.starHalf}>
						★
					</Text>,
				);
			} else {
				stars.push(
					<Text key={i} style={styles.starEmpty}>
						★
					</Text>,
				);
			}
		}
		return stars;
	};

	const getCategoryBadgeColor = (categoryName) => {
		const colors = {
			"Wisata Alam": "#FF5757",
			"Wisata Buatan": "#FF5757",
			Kuliner: "#FF8C42",
			Penginapan: "#4CAF50",
			"Oleh-oleh": "#9C27B0",
			"Desa Wisata": "#2196F3",
			"Biro Perjalanan": "#FF6B9D",
		};
		return colors[categoryName] || "#FF5757";
	};

	return (
		<LinearGradient colors={theme.gradientColors} style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				{/* HEADER */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<Ionicons name="arrow-back" size={22} color={theme.text} />
					</TouchableOpacity>

					<View style={styles.searchContainer}>
						<Ionicons name="search" size={18} color="#999" />
						<TextInput
							style={styles.searchInput}
							placeholder={`Cari ${getCategoryTitle()}`}
							placeholderTextColor="#999"
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
					</View>
				</View>

				{/* FILTER */}
				<View style={styles.filterContainer}>
					{["Rating", "Terpopuler", "Termurah"].map((filter) => (
						<TouchableOpacity
							key={filter}
							style={[
								styles.filterChip,
								activeFilter === filter && styles.filterChipActive,
							]}
							onPress={() => setActiveFilter(filter)}
						>
							<Text
								style={[
									styles.filterChipText,
									activeFilter === filter && styles.filterChipTextActive,
								]}
							>
								{filter}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* LIST */}
				<ScrollView
					style={styles.listContainer}
					showsVerticalScrollIndicator={false}
				>
					{filteredData.length > 0 ? (
						filteredData.map((item) => (
							<View key={item.id} style={styles.card}>
								<Image source={item.image} style={styles.cardImage} />

								<View style={styles.cardContent}>
									<View
										style={[
											styles.categoryBadge,
											{ backgroundColor: getCategoryBadgeColor(item.category) },
										]}
									>
										<Text style={styles.categoryText}>{item.category}</Text>
									</View>

									<Text style={styles.cardTitle}>{item.name}</Text>
									<Text style={styles.cardAddress}>{item.address}</Text>

									<View style={styles.cardFooter}>
										<View style={styles.ratingContainer}>
											{renderStars(item.rating)}
										</View>

										<TouchableOpacity
											style={styles.detailButton}
											onPress={() => navigation.navigate("Detail", { item })}
										>
											<Text style={styles.detailButtonText}>
												Lihat selengkapnya
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* TOMBOL FAVORITE DENGAN CONTEXT */}
								<TouchableOpacity
									style={[
										styles.favoriteButton,
										isFavorite(item.id) && styles.favoriteButtonActive,
									]}
									onPress={() => handleLikePress(item)}
								>
									<Ionicons
										name={isFavorite(item.id) ? "heart" : "heart-outline"}
										size={18}
										color={isFavorite(item.id) ? "#FF3B30" : "#666"}
									/>
								</TouchableOpacity>
							</View>
						))
					) : (
						<View style={styles.emptyContainer}>
							<Ionicons name="search-outline" size={50} color="#999" />
							<Text style={styles.emptyText}>Tidak ada data ditemukan</Text>
							{searchQuery ? (
								<TouchableOpacity
									style={styles.resetButton}
									onPress={() => setSearchQuery("")}
								>
									<Text style={styles.resetButtonText}>Reset Pencarian</Text>
								</TouchableOpacity>
							) : null}
						</View>
					)}
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent",
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
		gap: 10,
	},

	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
	},

	searchContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 15,
		height: 42,
		gap: 8,
		elevation: 4,
	},

	searchInput: {
		flex: 1,
		fontSize: 14,
		color: theme.text,
	},

	filterContainer: {
		flexDirection: "row",
		paddingHorizontal: 15,
		paddingVertical: 15,
		gap: 10,
	},

	filterChip: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#E0E0E0",
	},

	filterChipActive: {
		backgroundColor: theme.primary,
	},

	filterChipText: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},

	filterChipTextActive: {
		color: "#fff",
		fontWeight: "600",
	},

	listContainer: {
		flex: 1,
		paddingHorizontal: 15,
	},

	card: {
		flexDirection: "row",
		backgroundColor: theme.card,
		borderRadius: 20,
		marginBottom: 15,
		padding: 15,
		elevation: 5,
		position: "relative",
	},

	cardImage: {
		width: 95,
		height: 95,
		borderRadius: 16,
	},

	cardContent: {
		flex: 1,
		paddingLeft: 12,
		justifyContent: "space-between",
	},

	categoryBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 12,
		marginBottom: 6,
	},

	categoryText: {
		color: "#fff",
		fontSize: 11,
		fontWeight: "600",
	},

	cardTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: theme.text,
	},

	cardAddress: {
		fontSize: 12,
		color: theme.textSecondary,
		marginBottom: 8,
	},

	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	ratingContainer: {
		flexDirection: "row",
	},

	starFull: {
		fontSize: 18,
		color: "#FFB800",
	},

	starHalf: {
		fontSize: 18,
		color: "#FFB800",
		opacity: 0.5,
	},

	starEmpty: {
		fontSize: 18,
		color: "#E0E0E0",
	},

	detailButton: {
		backgroundColor: theme.primary,
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 18,
	},

	detailButtonText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "600",
	},

	favoriteButton: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},

	favoriteButtonActive: {
		backgroundColor: "#FFE5E5",
	},

	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 50,
	},

	emptyText: {
		fontSize: 16,
		color: "#999",
		marginTop: 10,
	},

	resetButton: {
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: theme.primary,
		borderRadius: 20,
	},

	resetButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
});

export default MenuListScreen;
