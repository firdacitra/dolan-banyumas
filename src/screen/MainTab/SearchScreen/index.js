import React, { useState, useMemo, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Pressable,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAllData } from "../../../constant/dataMenu";
import { useFavorites } from "../../../context/FavoriteContext"; 

/* ================= THEME ================= */
const lightTheme = {
	gradientColors: ["#24ccff", "#aaf1ff", "#e0efff"],
	card: "#FFFFFF",
	text: "#000000",
	textSecondary: "#666666",
	primary: "#057eff",
};

const theme = lightTheme;

/* ================= FILTER ================= */
const FILTERS = [
	"Semua",
	"Wisata Alam",
	"Wisata Buatan",
	"Kuliner",
	"Penginapan",
	"Oleh-oleh",
	"Desa Wisata",
	"Biro Perjalanan",
];

const SearchScreen = () => {
	const navigation = useNavigation();

	// GUNAKAN FAVORITES CONTEXT
	const { isFavorite, toggleFavorite } = useFavorites();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Semua");
	const [showFilter, setShowFilter] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	const allData = useMemo(() => getAllData(), []);

	// Cek status login
	useEffect(() => {
		checkLoginStatus();

		const unsubscribe = navigation.addListener("focus", checkLoginStatus);
		return unsubscribe;
	}, [navigation]);

	const checkLoginStatus = async () => {
		const status = await AsyncStorage.getItem("isLogin");
		setIsLogin(status === "true");
	};

	/* ================= HANDLE LIKE ================= */
	const handleLikePress = async (item) => {
		const loginStatus = await AsyncStorage.getItem("isLogin");

		if (loginStatus !== "true") {
			Alert.alert(
				"Belum Login",
				"Anda harus login terlebih dahulu untuk menyukai item",
				[
					{ text: "Batal", style: "cancel" },
					{ text: "Login", onPress: () => navigation.navigate("Login") },
				],
			);
			return;
		}

		const result = await toggleFavorite(item);
		if (result && result.message) {
			// Tampilkan pesan singkat (bisa diganti dengan toast)
			Alert.alert("Info", result.message);
		}
	};

	/* ================= FILTER + SEARCH ================= */
	const filteredData = useMemo(() => {
		let data = allData;

		if (searchQuery) {
			const q = searchQuery.toLowerCase();

			data = data.filter((item) => {
				const name = item?.name?.toLowerCase() || "";
				const address = item?.address?.toLowerCase() || "";

				return name.includes(q) || address.includes(q);
			});
		}

		if (activeFilter !== "Semua") {
			data = data.filter((item) => item.category === activeFilter);
		}

		return data;
	}, [searchQuery, activeFilter, allData]);

	/* ================= STAR ================= */
	const renderStars = (rating = 0) => {
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
				{/* SEARCH */}
				<View style={styles.header}>
					<View style={styles.searchBox}>
						<Ionicons name="search" size={18} color="#999" />

						<TextInput
							placeholder="Cari wisata, kuliner, penginapan..."
							placeholderTextColor="#999"
							style={styles.searchInput}
							value={searchQuery}
							onChangeText={setSearchQuery}
							onFocus={() => setShowFilter(true)}
						/>

						<Pressable onPress={() => setShowFilter(!showFilter)}>
							<Ionicons name="options-outline" size={20} color="#666" />
						</Pressable>
					</View>

					{showFilter && (
						<View style={styles.filterDropdown}>
							{FILTERS.map((filter) => (
								<TouchableOpacity
									key={filter}
									style={[
										styles.filterItem,
										activeFilter === filter && styles.filterItemActive,
									]}
									onPress={() => {
										setActiveFilter(filter);
										setShowFilter(false);
									}}
								>
									<Text
										style={[
											styles.filterText,
											activeFilter === filter && styles.filterTextActive,
										]}
									>
										{filter}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					)}
				</View>

				{/* LIST */}
				<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
					{filteredData.length > 0 ? (
						filteredData.map((item) => {
							const isFav = isFavorite(item.id);

							return (
								<View key={item.id} style={styles.card}>
									<Image source={item.image} style={styles.image} />

									<View style={styles.content}>
										<Text
											style={[
												styles.category,
												{
													backgroundColor: getCategoryBadgeColor(item.category),
												},
											]}
										>
											{item.category}
										</Text>

										<Text style={styles.title}>{item.name}</Text>

										<Text style={styles.address}>{item.address}</Text>

										<View style={styles.footer}>
											<View style={styles.rating}>
												{renderStars(item.rating)}
											</View>

											<TouchableOpacity
												style={styles.detailBtn}
												onPress={() => navigation.navigate("Detail", { item })}
											>
												<Text style={styles.detailText}>
													Lihat selengkapnya
												</Text>
											</TouchableOpacity>
										</View>
									</View>

									{/* TOMBOL FAVORITE DENGAN CONTEXT */}
									<TouchableOpacity
										style={[
											styles.favoriteButton,
											isFav && styles.favoriteButtonActive,
										]}
										onPress={() => handleLikePress(item)}
									>
										<Ionicons
											name={isFav ? "heart" : "heart-outline"}
											size={18}
											color={isFav ? "#FF3B30" : "#666"}
										/>
									</TouchableOpacity>
								</View>
							);
						})
					) : (
						<View style={styles.empty}>
							<Ionicons name="search-outline" size={50} color="#999" />
							<Text style={styles.emptyText}>Data tidak ditemukan</Text>
							{searchQuery && (
								<TouchableOpacity
									style={styles.clearButton}
									onPress={() => {
										setSearchQuery("");
										setActiveFilter("Semua");
									}}
								>
									<Text style={styles.clearButtonText}>Reset Pencarian</Text>
								</TouchableOpacity>
							)}
						</View>
					)}
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default SearchScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "transparent",
	},

	header: {
		paddingHorizontal: 16,
		paddingTop: 10,
		zIndex: 10,
	},

	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 15,
		height: 46,
		gap: 8,
		elevation: 4,
	},

	searchInput: {
		flex: 1,
		fontSize: 14,
		color: theme.text,
	},

	filterDropdown: {
		marginTop: 8,
		backgroundColor: "#fff",
		borderRadius: 16,
		paddingVertical: 8,
		elevation: 5,
	},

	filterItem: {
		paddingVertical: 10,
		paddingHorizontal: 16,
	},

	filterItemActive: {
		backgroundColor: "#E3F2FD",
	},

	filterText: {
		fontSize: 13,
		color: "#555",
	},

	filterTextActive: {
		color: theme.primary,
		fontWeight: "600",
	},

	list: {
		paddingHorizontal: 16,
		paddingTop: 10,
	},

	card: {
		flexDirection: "row",
		backgroundColor: theme.card,
		borderRadius: 20,
		padding: 14,
		marginBottom: 14,
		elevation: 5,
		position: "relative",
	},

	image: {
		width: 90,
		height: 90,
		borderRadius: 16,
	},

	content: {
		flex: 1,
		marginLeft: 12,
	},

	category: {
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 12,
		fontSize: 11,
		color: "#fff",
		fontWeight: "600",
		marginBottom: 6,
	},

	title: {
		fontSize: 15,
		fontWeight: "700",
		color: theme.text,
	},

	address: {
		fontSize: 12,
		color: theme.textSecondary,
		marginVertical: 4,
	},

	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 6,
	},

	rating: {
		flexDirection: "row",
	},

	detailBtn: {
		backgroundColor: theme.primary,
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 18,
	},

	detailText: {
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
		elevation: 4,
	},
	favoriteButtonActive: {
		backgroundColor: "#FFE5E5",
	},

	empty: {
		paddingVertical: 80,
		alignItems: "center",
	},

	emptyText: {
		color: "#999",
		fontSize: 14,
		marginTop: 10,
	},

	clearButton: {
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: theme.primary,
		borderRadius: 20,
	},

	clearButtonText: {
		color: "#fff",
		fontWeight: "600",
	},

	starFull: {
		color: "#FFB800",
		fontSize: 18,
		marginRight: 2,
	},

	starHalf: {
		color: "#FFB800",
		fontSize: 18,
		marginRight: 2,
		opacity: 0.5,
	},

	starEmpty: {
		color: "#DADADA",
		fontSize: 18,
		marginRight: 2,
	},
});
