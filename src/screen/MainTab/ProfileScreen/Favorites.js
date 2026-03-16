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

const Favorites = ({ navigation }) => {
	const [selectedCategory, setSelectedCategory] = useState("Semua");
	const [groupedFavorites, setGroupedFavorites] = useState({});

	const { favorites, removeFavorite, isLoading, loadFavorites } =
		useFavorites();

	const categories = [
		{ name: "Semua", icon: "apps-outline", iconColor: "#0a4914" },
		{ name: "Objek Wisata", icon: "image-outline", iconColor: "#FF5757" },
		{ name: "Kuliner", icon: "restaurant-outline", iconColor: "#FF8C42" },
		{ name: "Penginapan", icon: "bed-outline", iconColor: "#4CAF50" },
		{ name: "Oleh-oleh", icon: "gift-outline", iconColor: "#9C27B0" },
		{ name: "Desa Wisata", icon: "home-outline", iconColor: "#2196F3" },
		{ name: "Biro Perjalanan", icon: "car-outline", iconColor: "#FF6B9D" },
	];

	useEffect(() => {
		checkLoginAndLoad();
		const unsubscribe = navigation.addListener("focus", checkLoginAndLoad);
		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		groupFavorites();
	}, [favorites]);

	const checkLoginAndLoad = async () => {
		const isLogin = await AsyncStorage.getItem("isLogin");
		if (isLogin !== "true") {
			Alert.alert("Belum Login", "Silakan login untuk melihat favorit", [
				{ text: "OK", onPress: () => navigation.goBack() },
			]);
		} else {
			await loadFavorites();
		}
	};

	const groupFavorites = () => {
		const grouped = {};
		favorites.forEach((item) => {
			const category = getMainCategory(item.category);
			if (!grouped[category]) grouped[category] = [];
			grouped[category].push(item);
		});
		setGroupedFavorites(grouped);
	};

	const getMainCategory = (subCategory) => {
		const mapping = {
			"Wisata Alam": "Objek Wisata",
			"Wisata Buatan": "Objek Wisata",
			Kuliner: "Kuliner",
			Penginapan: "Penginapan",
			"Oleh-oleh": "Oleh-oleh",
			"Desa Wisata": "Desa Wisata",
			"Biro Perjalanan": "Biro Perjalanan",
		};
		return mapping[subCategory] || "Objek Wisata";
	};

	// PERBAIKI FUNGSI HANDLE REMOVE
	const handleRemoveFavorite = (item) => {
		Alert.alert(
			"Hapus dari Favorit",
			`Apakah Anda yakin ingin menghapus "${item.name}" dari favorit?`,
			[
				{ text: "Batal", style: "cancel" },
				{
					text: "Hapus",
					onPress: async () => {
						try {
							console.log("Mencoba menghapus:", item.id, item.name); // Debug

							const result = await removeFavorite(item.id);

							console.log("Hasil remove:", result); // Debug

							if (result && result.success) {
								Alert.alert("Berhasil", result.message);
							} else {
								Alert.alert("Gagal", result?.message || "Terjadi kesalahan");
							}
						} catch (error) {
							console.log("Error di handleRemove:", error);
							Alert.alert("Error", "Gagal menghapus favorit");
						}
					},
					style: "destructive",
				},
			],
		);
	};

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

	const renderCard = (item) => (
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
					<View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

					<TouchableOpacity
						style={styles.detailButton}
						onPress={() => navigation.navigate("Detail", { item })}
					>
						<Text style={styles.detailButtonText}>Lihat selengkapnya</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* TOMBOL HAPUS */}
			<TouchableOpacity
				style={styles.removeButton}
				onPress={() => handleRemoveFavorite(item)}
			>
				<Ionicons name="close-circle" size={24} color="#FF3B30" />
			</TouchableOpacity>
		</View>
	);

	const renderCategoryItem = (category) => {
		const isSelected = selectedCategory === category.name;

		let itemCount = 0;
		if (category.name === "Semua") {
			itemCount = favorites.length;
		} else {
			const mappedCategory = {
				"Objek Wisata": "Objek Wisata",
				Kuliner: "Kuliner",
				Penginapan: "Penginapan",
				"Oleh-oleh": "Oleh-oleh",
				"Desa Wisata": "Desa Wisata",
				"Biro Perjalanan": "Biro Perjalanan",
			}[category.name];
			itemCount = groupedFavorites[mappedCategory]?.length || 0;
		}

		return (
			<TouchableOpacity
				key={category.name}
				style={[
					styles.categoryItem,
					isSelected && {
						backgroundColor: category.iconColor,
						borderColor: category.iconColor,
					},
				]}
				onPress={() => setSelectedCategory(category.name)}
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
						isSelected && styles.categoryItemTextActive,
					]}
				>
					{category.name} ({itemCount})
				</Text>
			</TouchableOpacity>
		);
	};

	const getFilteredFavorites = () => {
		if (selectedCategory === "Semua") {
			return groupedFavorites;
		}

		const categoryMap = {
			"Objek Wisata": "Objek Wisata",
			Kuliner: "Kuliner",
			Penginapan: "Penginapan",
			"Oleh-oleh": "Oleh-oleh",
			"Desa Wisata": "Desa Wisata",
			"Biro Perjalanan": "Biro Perjalanan",
		};

		const mappedCategory = categoryMap[selectedCategory];
		return {
			[selectedCategory]: groupedFavorites[mappedCategory] || [],
		};
	};

	if (isLoading) {
		return (
			<LinearGradient
				colors={["#72b8f6", "#a7d4fc", "#E6F2FF"]}
				style={styles.container}
			>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>Favorit Saya</Text>
						<View style={{ width: 24 }} />
					</View>
					<View style={styles.loadingContainer}>
						<Text>Memuat favorit...</Text>
					</View>
				</SafeAreaView>
			</LinearGradient>
		);
	}

	const filteredFavorites = getFilteredFavorites();
	const hasFavorites = favorites.length > 0;

	return (
		<LinearGradient
			colors={["#72b8f6", "#a7d4fc", "#E6F2FF"]}
			style={styles.container}
		>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Favorit Saya</Text>
					<View style={{ width: 24 }} />
				</View>

				{/* Category Scroll */}
				<View style={styles.categoryScrollContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.categoryScrollContent}
					>
						{categories.map((category) => renderCategoryItem(category))}
					</ScrollView>
				</View>

				{/* Content */}
				{!hasFavorites ? (
					<View style={styles.emptyContainer}>
						<Ionicons name="heart-outline" size={60} color="#999" />
						<Text style={styles.emptyTitle}>Belum Ada Favorit</Text>
						<Text style={styles.emptyText}>
							Item yang kamu sukai akan muncul di sini
						</Text>
						<TouchableOpacity
							style={styles.exploreButton}
							onPress={() => navigation.navigate("MainTab")}
						>
							<Text style={styles.exploreButtonText}>Jelajahi Sekarang</Text>
						</TouchableOpacity>
					</View>
				) : (
					<ScrollView
						style={styles.contentContainer}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{Object.entries(filteredFavorites).map(
							([category, items]) =>
								items.length > 0 && (
									<View key={category} style={styles.categorySection}>
										{selectedCategory === "Semua" && (
											<Text style={styles.categoryTitle}>{category}</Text>
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
