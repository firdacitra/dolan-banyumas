import React, { useRef, useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	Dimensions,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; 
import { getRecommendations } from "../../../constant/dataMenu/index.js";
import { eventData } from "../../../constant/dataEvent/index.js";
import { useFavorites } from "../../../context/FavoriteContext";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	const navigation = useNavigation();
	const { isFavorite, toggleFavorite } = useFavorites();

	const [activeSlide, setActiveSlide] = useState(0);
	const scrollViewRef = useRef(null);
	const [isLogin, setIsLogin] = useState(false);

	const recommendations = getRecommendations(5);
	const bannerImages = eventData;

	useEffect(() => {
		checkLogin();
		const unsubscribe = navigation.addListener("focus", checkLogin);
		return unsubscribe;
	}, [navigation]);

	const checkLogin = async () => {
		const status = await AsyncStorage.getItem("isLogin");
		setIsLogin(status === "true");
	};

	const handleScroll = (event) => {
		const slideSize = event.nativeEvent.layoutMeasurement.width;
		const offset = event.nativeEvent.contentOffset.x;
		const activeIndex = Math.round(offset / slideSize);
		setActiveSlide(activeIndex);
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
			Alert.alert("Info", result.message);
		}
	};

	const menuCategories = [
		{
			id: 1,
			title: "Objek Wisata",
			icon: require("../../../assets/logo_wisata.png"),
			route: "MenuList",
			params: { category: "objekWisata" },
		},
		{
			id: 2,
			title: "Kuliner",
			icon: require("../../../assets/logo_kuliner.png"),
			route: "MenuList",
			params: { category: "kuliner" },
		},
		{
			id: 3,
			title: "Penginapan",
			icon: require("../../../assets/logo_penginapan.png"),
			route: "MenuList",
			params: { category: "penginapan" },
		},
		{
			id: 4,
			title: "Oleh-oleh",
			icon: require("../../../assets/logo_oleh2.jpeg"),
			route: "MenuList",
			params: { category: "olehOleh" },
		},
		{
			id: 5,
			title: "Desa Wisata",
			icon: require("../../../assets/logo_desaWisata.jpeg"),
			route: "MenuList",
			params: { category: "desaWisata" },
		},
		{
			id: 6,
			title: "Biro Perjalanan",
			icon: require("../../../assets/logo_biro.png"),
			route: "MenuList",
			params: { category: "biroPerjalanan" },
		},
	];

	return (
		<LinearGradient
			colors={["#24ccff", "#aaf1ff", "#e0efff"]}
			style={{ flex: 1 }}
		>
			<SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Dolan Banyumas</Text>
						{!isLogin && (
							<TouchableOpacity
								style={styles.loginButton}
								onPress={() => navigation.navigate("Login")}
							>
								<Text style={styles.loginText}>Login</Text>
							</TouchableOpacity>
						)}
					</View>

					{/* Banner */}
					<View style={styles.bannerContainer}>
						<ScrollView
							ref={scrollViewRef}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							onScroll={handleScroll}
							scrollEventThrottle={16}
						>
							{bannerImages.map((item) => (
								<TouchableOpacity
									key={item.id}
									style={styles.bannerSlide}
									activeOpacity={0.9}
									onPress={() => navigation.navigate("Detail", { item })}
								>
									<View style={styles.bannerImageContainer}>
										<Image source={item.image} style={styles.bannerImage} />
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
						<View style={styles.dotsContainer}>
							{bannerImages.map((_, index) => (
								<View
									key={index}
									style={[
										styles.dot,
										activeSlide === index && styles.activeDot,
									]}
								/>
							))}
						</View>
					</View>

					{/* Menu Kategori */}
					<View style={styles.menuGrid}>
						{menuCategories.map((menu) => (
							<TouchableOpacity
								key={menu.id}
								style={styles.menuItem}
								onPress={() => navigation.navigate(menu.route, menu.params)}
							>
								<View style={styles.menuIconContainer}>
									<Image source={menu.icon} style={styles.menuIcon} />
								</View>
								<Text style={styles.menuTitle}>{menu.title}</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Rekomendasi */}
					<View style={styles.recommendationSection}>
						<Text style={styles.sectionTitle}>Rekomendasi buat kamu</Text>

						{recommendations.map((item) => (
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

								{/* TOMBOL FAVORITE PAKAI IONICONS */}
								<TouchableOpacity
									style={[
										styles.favoriteButton,
										isFavorite(item.id) && styles.favoriteButtonActive,
									]}
									onPress={() => handleLikePress(item)}
								>
									<Ionicons
										name={isFavorite(item.id) ? "heart" : "heart-outline"}
										size={22}
										color={isFavorite(item.id) ? "#FF3B30" : "#666"}
									/>
								</TouchableOpacity>
							</View>
						))}
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	loginButton: {
		backgroundColor: "#2196F3",
		paddingHorizontal: 25,
		paddingVertical: 6,
		borderRadius: 25,
	},
	loginText: {
		color: "#fff",
		fontSize: 13,
		fontWeight: "600",
	},
	bannerContainer: {
		marginVertical: 10,
	},
	bannerSlide: {
		width: width,
		paddingHorizontal: 20,
	},
	bannerImageContainer: {
		width: "100%",
		height: 180,
		borderRadius: 20,
		overflow: "hidden",
	},
	bannerImage: {
		width: "100%",
		height: 220,
		position: "absolute",
		top: 0,
	},
	dotsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	dot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: "#D3D3D3",
		marginHorizontal: 4,
	},
	activeDot: {
		backgroundColor: "#2196F3",
		width: 20,
	},
	menuGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingHorizontal: 10,
		marginVertical: 10,
	},
	menuItem: {
		width: "33.33%",
		alignItems: "center",
		marginBottom: 20,
	},
	menuIconContainer: {
		width: 70,
		height: 70,
		borderRadius: 40,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
	},
	menuIcon: {
		width: 60,
		height: 60,
		resizeMode: "contain",
		borderRadius: 25,
	},
	menuTitle: {
		marginTop: 8,
		fontSize: 13,
		textAlign: "center",
		color: "#333",
	},
	recommendationSection: {
		paddingHorizontal: 20,
		marginTop: 10,
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: "bold",
		marginBottom: 15,
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
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	favoriteButtonActive: {
		backgroundColor: "#FFE5E5",
	},
});

export default HomeScreen;
