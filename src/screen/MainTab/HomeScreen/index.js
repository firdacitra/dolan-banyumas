// src/screen/HomeScreen/index.js
import React, { useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	Dimensions,
	FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getRecommendations } from "../../../constant/dataMenu";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
	const navigation = useNavigation();
	const [activeSlide, setActiveSlide] = React.useState(0);
	const scrollViewRef = useRef(null);

	const recommendations = getRecommendations(5);

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
			icon: require("../../../assets/logo_oleh2.png"),
			route: "MenuList",
			params: { category: "olehOleh" },
		},
		{
			id: 5,
			title: "Desa Wisata",
			icon: require("../../../assets/logo_desa.png"),
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

	const bannerImages = [
		require("../../../assets/logo.png"),
		require("../../../assets/depo bay.jpg"),
		require("../../../assets/depo bay.jpg"),
	];

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

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Dolan Banyumas</Text>
					<TouchableOpacity style={styles.loginButton}>
						<Text style={styles.loginText}>Login</Text>
					</TouchableOpacity>
				</View>

				{/* Banner Carousel */}
				<View style={styles.bannerContainer}>
					<ScrollView
						ref={scrollViewRef}
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onScroll={handleScroll}
						scrollEventThrottle={16}
					>
						{bannerImages.map((image, index) => (
							<View key={index} style={styles.bannerSlide}>
								<Image source={image} style={styles.bannerImage} />
							</View>
						))}
					</ScrollView>

					{/* Dots Indicator */}
					<View style={styles.dotsContainer}>
						{bannerImages.map((_, index) => (
							<View
								key={index}
								style={[styles.dot, activeSlide === index && styles.activeDot]}
							/>
						))}
					</View>
				</View>

				{/* Menu Categories */}
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

				{/* Recommendations Section */}
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

							<TouchableOpacity style={styles.favoriteButton}>
								<Text style={styles.favoriteIcon}>♡</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E8F4F8",
	},
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
	bannerImage: {
		width: "100%",
		height: 180,
		borderRadius: 20,
		resizeMode: "cover",
		marginBottom: 10,
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	},
	dotsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
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
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	menuIcon: {
		width: 50,
		height: 50,
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
		color: "#333",
		marginBottom: 15,
	},
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 20,
		marginBottom: 15,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
		position: "relative",
	},

	cardImage: {
		width: 95,
		height: 95,
		borderRadius: 16,
		resizeMode: "cover",
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
		color: "#333",
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
		alignItems: "center",
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
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5,
	},

	favoriteIcon: {
		fontSize: 24,
		color: "#333",
	},
});

export default HomeScreen;
