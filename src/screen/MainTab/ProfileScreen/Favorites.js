import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFavorites } from "../../../context/FavoriteContext";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const Favorites = ({ navigation }) => {
	const { t } = useLanguage(); // Menggunakan hook bahasa
	const { theme } = useTheme(); // Menggunakan hook tema
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [groupedFavorites, setGroupedFavorites] = useState({});

	const { favorites, removeFavorite, isLoading, loadFavorites } =
		useFavorites();

	// Kategori yang tersedia
	const categories = [
		{
			value: "all",
			name: t("all"),
			icon: "apps-outline",
			iconColor: "#0a4914",
		},
		{
			value: "touristAttractions",
			name: t("touristAttractions"),
			icon: "image-outline",
			iconColor: "#FF5757",
		},
		{
			value: "culinary",
			name: t("culinary"),
			icon: "restaurant-outline",
			iconColor: "#FF8C42",
		},
		{
			value: "accommodation",
			name: t("accommodation"),
			icon: "bed-outline",
			iconColor: "#4CAF50",
		},
		{
			value: "souvenirs",
			name: t("souvenirs"),
			icon: "gift-outline",
			iconColor: "#9C27B0",
		},
		{
			value: "touristVillage",
			name: t("touristVillage"),
			icon: "home-outline",
			iconColor: "#2196F3",
		},
		{
			value: "travelAgency",
			name: t("travelAgency"),
			icon: "car-outline",
			iconColor: "#FF6B9D",
		},
	];

	useEffect(() => {
		checkLoginAndLoad();
		const unsubscribe = navigation.addListener("focus", checkLoginAndLoad);
		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		groupFavorites();
	}, [favorites]);

	// Fungsi untuk memeriksa login dan memuat data favorit
	const checkLoginAndLoad = async () => {
		const isLogin = await AsyncStorage.getItem("isLogin");
		if (isLogin !== "true") {
			// Menampilkan alert dengan tombol Cancel dan OK
			Alert.alert(t("login"), t("loginRequired"), [
				{
					text: t("cancel"),
					style: "cancel",
					onPress: () => {
						// Jika pengguna memilih Cancel, kembali ke halaman sebelumnya
						if (navigation.canGoBack()) {
							navigation.goBack();
						} else {
							// Jika tidak ada halaman sebelumnya, arahkan ke MainTab
							navigation.navigate("MainTab");
						}
					},
				},
				{
					text: t("ok"),
					onPress: () => {
						// Jika pengguna memilih OK, arahkan ke halaman Login
						navigation.replace("Login");
					},
				},
			]);
		} else {
			await loadFavorites();
		}
	};

	// Mengelompokkan favorit berdasarkan kategori
	const groupFavorites = () => {
		const grouped = {};
		favorites.forEach((item) => {
			const category = getMainCategory(item.category);
			if (!grouped[category]) grouped[category] = [];
			grouped[category].push(item);
		});
		setGroupedFavorites(grouped);
	};

	// Mendapatkan kategori utama dari subkategori
	const getMainCategory = (subCategory) => {
		const mapping = {
			"Wisata Alam": "touristAttractions",
			"Wisata Buatan": "touristAttractions",
			Kuliner: "culinary",
			Penginapan: "accommodation",
			"Oleh-oleh": "souvenirs",
			"Desa Wisata": "touristVillage",
			"Biro Perjalanan": "travelAgency",
		};
		return mapping[subCategory] || "touristAttractions";
	};

	// Menghapus item dari favorit
	const handleRemoveFavorite = (item) => {
		Alert.alert(
			t("removeFromFavorites"),
			`${t("removeFromFavoritesConfirm")} "${item.name}"?`,
			[
				{ text: t("cancel"), style: "cancel" },
				{
					text: t("delete"),
					onPress: async () => {
						try {
							const result = await removeFavorite(item.id);
							if (result && result.success) {
								Alert.alert(t("success"), result.message);
							} else {
								Alert.alert(t("failed"), result?.message || t("errorOccurred"));
							}
						} catch (error) {
							Alert.alert(t("error"), t("failedToRemove"));
						}
					},
					style: "destructive",
				},
			],
		);
	};

	// Menampilkan bintang rating
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

	// Mendapatkan warna badge kategori
	const getCategoryBadgeColor = (category) => {
		const colors = {
			"Wisata Alam": "#FF5757",
			"Wisata Buatan": "#FF5757",
			Kuliner: "#FF8C42",
			Penginapan: "#4CAF50",
			"Oleh-oleh": "#9C27B0",
			"Desa Wisata": "#2196F3",
			"Biro Perjalanan": "#FF6B9D",
		};
		return colors[category] || "#FF5757";
	};

	// Render card item favorit
	const renderCard = (item) => (
		<View key={item.id} style={[styles.card, { backgroundColor: theme.card }]}>
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

				<Text style={[styles.cardTitle, { color: theme.text }]}>
					{item.name}
				</Text>
				<Text style={[styles.cardAddress, { color: theme.textSecondary }]}>
					{item.address}
				</Text>

				<View style={styles.cardFooter}>
					<View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

					<TouchableOpacity
						style={[styles.detailButton, { backgroundColor: theme.primary }]}
						onPress={() => navigation.navigate("Detail", { item })}
					>
						<Text style={styles.detailButtonText}>{t("viewDetail")}</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Tombol hapus favorit */}
			<TouchableOpacity
				style={[styles.removeButton, { backgroundColor: theme.card }]}
				onPress={() => handleRemoveFavorite(item)}
			>
				<Ionicons name="close-circle" size={24} color="#FF3B30" />
			</TouchableOpacity>
		</View>
	);

	// Render item kategori
	const renderCategoryItem = (category) => {
		const isSelected = selectedCategory === category.value;

		let itemCount = 0;
		if (category.value === "all") {
			itemCount = favorites.length;
		} else {
			itemCount = groupedFavorites[category.value]?.length || 0;
		}

		return (
			<TouchableOpacity
				key={category.value}
				style={[
					styles.categoryItem,
					{ backgroundColor: theme.card, borderColor: theme.border },
					isSelected && {
						backgroundColor: category.iconColor,
						borderColor: category.iconColor,
					},
				]}
				onPress={() => setSelectedCategory(category.value)}
			>
				<Ionicons
					name={category.icon}
					size={16}
					color={isSelected ? "#FFF" : category.iconColor}
					style={{ marginRight: 6 }}
				/>
				<Text
					style={[
						styles.categoryItemText,
						{ color: theme.text },
						isSelected && styles.categoryItemTextActive,
					]}
				>
					{category.name} ({itemCount})
				</Text>
			</TouchableOpacity>
		);
	};

	// Mendapatkan favorit yang sudah difilter
	const getFilteredFavorites = () => {
		if (selectedCategory === "all") {
			return groupedFavorites;
		}
		return {
			[selectedCategory]: groupedFavorites[selectedCategory] || [],
		};
	};

	// Menampilkan loading
	if (isLoading) {
		return (
			<LinearGradient colors={theme.gradientColors} style={styles.container}>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={24} color={theme.text} />
						</TouchableOpacity>
						<Text style={[styles.headerTitle, { color: theme.text }]}>
							{t("myFavoritesTitle")}
						</Text>
						<View style={{ width: 24 }} />
					</View>
					<View style={styles.loadingContainer}>
						<Text style={{ color: theme.text }}>{t("loadingFavorites")}</Text>
					</View>
				</SafeAreaView>
			</LinearGradient>
		);
	}

	const filteredFavorites = getFilteredFavorites();
	const hasFavorites = favorites.length > 0;

	return (
		<LinearGradient colors={theme.gradientColors} style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Header dengan tombol kembali */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color={theme.text} />
					</TouchableOpacity>
					<Text style={[styles.headerTitle, { color: theme.text }]}>
						{t("myFavoritesTitle")}
					</Text>
					<View style={{ width: 24 }} />
				</View>

				{/* ScrollView untuk kategori */}
				<View style={styles.categoryScrollContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.categoryScrollContent}
					>
						{categories.map((category) => renderCategoryItem(category))}
					</ScrollView>
				</View>

				{/* Konten utama */}
				{!hasFavorites ? (
					<View style={styles.emptyContainer}>
						<Ionicons
							name="heart-outline"
							size={60}
							color={theme.textSecondary}
						/>
						<Text style={[styles.emptyTitle, { color: theme.text }]}>
							{t("noFavorites")}
						</Text>
						<Text style={[styles.emptyText, { color: theme.textSecondary }]}>
							{t("noFavoritesDesc")}
						</Text>
						<TouchableOpacity
							style={[styles.exploreButton, { backgroundColor: theme.primary }]}
							onPress={() => navigation.navigate("MainTab")}
						>
							<Text style={styles.exploreButtonText}>{t("exploreNow")}</Text>
						</TouchableOpacity>
					</View>
				) : (
					<ScrollView
						style={styles.contentContainer}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{Object.entries(filteredFavorites).map(
							([categoryKey, items]) =>
								items.length > 0 && (
									<View key={categoryKey} style={styles.categorySection}>
										{selectedCategory === "all" && (
											<Text
												style={[styles.categoryTitle, { color: theme.text }]}
											>
												{t(categoryKey)}
											</Text>
										)}
										{items.map((item) => renderCard(item))}
									</View>
								),
						)}
					</ScrollView>
				)}
			</SafeAreaView>
		</LinearGradient>
	);
};

// Style untuk komponen
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#000",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginTop: 20,
		marginBottom: 10,
	},
	emptyText: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
		marginBottom: 20,
	},
	exploreButton: {
		backgroundColor: "#2196F3",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 25,
	},
	exploreButtonText: {
		color: "#fff",
		fontWeight: "600",
	},
	categoryScrollContainer: {
		height: 56,
		paddingVertical: 8,
		paddingLeft: 16,
		marginBottom: 8,
	},
	categoryScrollContent: {
		paddingRight: 16,
		gap: 8,
	},
	categoryItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 25,
		backgroundColor: "#FFF",
		borderWidth: 1.5,
		borderColor: "#E0E0E0",
		elevation: 2,
	},
	categoryItemText: {
		fontSize: 13,
		fontWeight: "500",
		color: "#555",
	},
	categoryItemTextActive: {
		color: "#FFF",
		fontWeight: "600",
	},
	contentContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 80,
	},
	categorySection: {
		marginBottom: 20,
	},
	categoryTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 12,
		marginLeft: 4,
	},
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 20,
		marginBottom: 15,
		padding: 15,
		elevation: 4,
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
	},
	cardAddress: {
		fontSize: 12,
		color: "#999",
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
		backgroundColor: "#2196F3",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 18,
	},
	detailButtonText: {
		color: "#fff",
		fontSize: 11,
		fontWeight: "600",
	},
	removeButton: {
		position: "absolute",
		top: 8,
		right: 8,
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
	},
});

export default Favorites;
