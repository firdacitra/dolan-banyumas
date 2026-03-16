import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Modal,
	Linking,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFavorites } from "../../context/FavoriteContext";

const { width } = Dimensions.get("window");

const lightTheme = {
	gradientColors: ["#24ccff", "#aaf1ff", "#e0efff"],
	card: "#FFFFFF",
	text: "#000000",
	textSecondary: "#666666",
	primary: "#057eff",
};

const theme = lightTheme;

export default function Detail({ navigation, route }) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const [activeSlide, setActiveSlide] = useState(0);
	const [lightboxVisible, setLightboxVisible] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isLogin, setIsLogin] = useState(false);

	const { item } = route.params;

	useEffect(() => {
		checkLoginStatus();
	}, []);

	const checkLoginStatus = async () => {
		const status = await AsyncStorage.getItem("isLogin");
		setIsLogin(status === "true");
	};

	const images = item.images || [item.image, item.image, item.image];

	const handleScroll = (event) => {
		const slideSize = event.nativeEvent.layoutMeasurement.width;
		const offset = event.nativeEvent.contentOffset.x;
		const activeIndex = Math.round(offset / slideSize);
		setActiveSlide(activeIndex);
	};

	const handleLikePress = async () => {
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

	// FUNGSI MAPS - KONFIRMASI SEDERHANA
	const handleOpenMaps = () => {
		const searchQuery = `${item.name}, ${item.address}`;
		const encodedQuery = encodeURIComponent(searchQuery);

		Alert.alert(
			"Buka Google Maps",
			`Lihat lokasi ${item.name} di Google Maps?`,
			[
				{
					text: "Tidak",
					style: "cancel",
				},
				{
					text: "Ya",
					onPress: () => {
						const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
						Linking.openURL(url).catch(() =>
							Alert.alert("Error", "Tidak dapat membuka Google Maps"),
						);
					},
				},
			],
		);
	};

	const handleCall = () => {
		const phoneNumber = item.phone || "081234567890";
		Linking.openURL(`tel:${phoneNumber}`).catch(() => {
			Alert.alert("Error", "Tidak dapat melakukan panggilan");
		});
	};

	const handlePesanTiket = () => {
		if (!isLogin) {
			Alert.alert("Belum Login", "Anda harus login untuk memesan tiket", [
				{ text: "Batal", style: "cancel" },
				{ text: "Login", onPress: () => navigation.navigate("Login") },
			]);
			return;
		}
		Alert.alert("Info", "Fitur pemesanan tiket akan segera tersedia");
	};

	return (
		<LinearGradient colors={theme.gradientColors} style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={24} color={theme.text} />
						</TouchableOpacity>
						<Text style={styles.headerTitle} numberOfLines={1}>
							{item.name}
						</Text>
						<View style={{ width: 24 }} />
					</View>

					<ScrollView
						horizontal
						pagingEnabled
						showsHorizontalScrollIndicator={false}
						onScroll={handleScroll}
						scrollEventThrottle={16}
					>
						{images.map((image, index) => (
							<TouchableOpacity
								key={index}
								activeOpacity={0.9}
								onPress={() => {
									setSelectedImage(image);
									setLightboxVisible(true);
								}}
							>
								<Image source={image} style={styles.image} />
							</TouchableOpacity>
						))}
					</ScrollView>

					<View style={styles.dots}>
						{images.map((_, index) => (
							<View
								key={index}
								style={index === activeSlide ? styles.dotActive : styles.dot}
							/>
						))}
					</View>

					<View style={styles.actionRow}>
						<TouchableOpacity
							style={styles.ticketBtn}
							onPress={handlePesanTiket}
						>
							<Text style={styles.ticketText}>Pesan Tiket</Text>
						</TouchableOpacity>

						<View style={styles.ratingRow}>
							{[1, 2, 3, 4, 5].map((i) => (
								<Ionicons
									key={i}
									name={i <= Math.floor(item.rating) ? "star" : "star-outline"}
									size={20}
									color="#FFC107"
								/>
							))}
							<Text style={styles.ratingText}>({item.rating})</Text>
						</View>

						<TouchableOpacity onPress={handleOpenMaps}>
							<Ionicons name="map-outline" size={24} color={theme.primary} />
						</TouchableOpacity>
					</View>

					<View style={styles.infoCard}>
						<TouchableOpacity style={styles.infoRow} onPress={handleCall}>
							<Ionicons name="call-outline" size={20} color={theme.primary} />
							<Text style={[styles.infoText, styles.linkText]}>
								{item.phone || "0812-3456-7890"}
							</Text>
						</TouchableOpacity>

						<View style={styles.infoRow}>
							<Ionicons name="time-outline" size={20} color={theme.primary} />
							<Text style={styles.infoText}>
								{item.openHours || "Senin - Minggu, 08:00 - 17:00"}
							</Text>
						</View>

						<View style={styles.infoRow}>
							<Ionicons
								name="pricetag-outline"
								size={20}
								color={theme.primary}
							/>
							<Text style={styles.infoText}>
								{item.price || "Rp 10.000 - Rp 25.000"}
							</Text>
						</View>
					</View>

					<View style={styles.descCard}>
						<Text style={styles.sectionTitle}>Deskripsi</Text>
						<Text style={styles.descText}>
							{item.description ||
								`${item.name} berlokasi di ${item.address}. Tempat ini menawarkan pengalaman menarik untuk dikunjungi.`}
						</Text>

						<View style={styles.divider} />

						<Text style={styles.sectionTitle}>Alamat</Text>
						<TouchableOpacity onPress={handleOpenMaps}>
							<Text style={styles.address}>📍 {item.address}</Text>
						</TouchableOpacity>
					</View>

					{item.facilities && item.facilities.length > 0 && (
						<View style={styles.descCard}>
							<Text style={styles.sectionTitle}>Fasilitas</Text>
							<View style={styles.facilitiesRow}>
								{item.facilities.map((facility, index) => (
									<View key={index} style={styles.facilityItem}>
										<Ionicons
											name="checkmark-circle"
											size={16}
											color={theme.primary}
										/>
										<Text style={styles.facilityText}>{facility}</Text>
									</View>
								))}
							</View>
						</View>
					)}
				</ScrollView>

				<View style={styles.bottomAction}>
					<View style={styles.priceContainer}>
						<Text style={styles.priceLabel}>Mulai dari</Text>
						<Text style={styles.priceValue}>{item.price || "Rp 10.000"}</Text>
					</View>

					<View style={styles.bottomButtons}>
						<TouchableOpacity
							style={[
								styles.likeButton,
								isFavorite(item.id) && styles.likeButtonActive,
							]}
							onPress={handleLikePress}
						>
							<Ionicons
								name={isFavorite(item.id) ? "heart" : "heart-outline"}
								size={24}
								color={isFavorite(item.id) ? "#FF3B30" : theme.text}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.bookButton}
							onPress={handlePesanTiket}
						>
							<Text style={styles.bookButtonText}>Booking</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Modal visible={lightboxVisible} transparent>
					<View style={styles.lightboxContainer}>
						<TouchableOpacity
							style={styles.lightboxClose}
							onPress={() => setLightboxVisible(false)}
						>
							<Ionicons name="close" size={30} color="#fff" />
						</TouchableOpacity>
						<Image source={selectedImage} style={styles.lightboxImage} />
					</View>
				</Modal>
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "transparent" },
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		justifyContent: "space-between",
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
		flex: 1,
		textAlign: "center",
		paddingHorizontal: 10,
		color: theme.text,
	},
	image: {
		width: width - 40,
		height: 220,
		borderRadius: 16,
		marginHorizontal: 20,
		marginBottom: 10,
	},
	dots: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: "#ccc",
		marginHorizontal: 4,
	},
	dotActive: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: theme.primary,
		marginHorizontal: 4,
	},
	actionRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginVertical: 15,
		paddingHorizontal: 16,
	},
	ticketBtn: {
		backgroundColor: theme.primary,
		paddingHorizontal: 18,
		paddingVertical: 8,
		borderRadius: 20,
	},
	ticketText: { fontSize: 12, color: "#fff", fontWeight: "600" },
	ratingRow: { flexDirection: "row", alignItems: "center" },
	ratingText: { marginLeft: 4, fontSize: 12, color: theme.textSecondary },
	infoCard: {
		backgroundColor: theme.card,
		marginHorizontal: 16,
		marginBottom: 10,
		padding: 16,
		borderRadius: 16,
		elevation: 3,
	},
	infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
	infoText: {
		marginLeft: 10,
		fontSize: 13,
		color: theme.textSecondary,
		flex: 1,
	},
	linkText: { color: theme.primary, textDecorationLine: "underline" },
	descCard: {
		backgroundColor: theme.card,
		marginHorizontal: 16,
		marginBottom: 10,
		padding: 16,
		borderRadius: 16,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: theme.text,
		marginBottom: 8,
	},
	descText: { fontSize: 13, color: theme.textSecondary, lineHeight: 20 },
	divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
	address: {
		fontSize: 13,
		color: theme.primary,
		marginTop: 4,
		fontWeight: "500",
		textDecorationLine: "underline",
	},
	facilitiesRow: { flexDirection: "row", flexWrap: "wrap" },
	facilityItem: {
		flexDirection: "row",
		alignItems: "center",
		width: "50%",
		marginBottom: 8,
	},
	facilityText: { marginLeft: 6, fontSize: 12, color: theme.textSecondary },
	bottomAction: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: theme.card,
		borderTopWidth: 1,
		borderTopColor: "#eee",
	},
	priceContainer: { flex: 1 },
	priceLabel: { fontSize: 11, color: theme.textSecondary },
	priceValue: { fontSize: 14, fontWeight: "bold", color: theme.primary },
	bottomButtons: { flexDirection: "row", alignItems: "center", gap: 10 },
	likeButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
	},
	likeButtonActive: { backgroundColor: "#FFE5E5" },
	bookButton: {
		backgroundColor: theme.primary,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 22,
	},
	bookButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
	lightboxContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.95)",
		justifyContent: "center",
		alignItems: "center",
	},
	lightboxImage: { width: "100%", height: "70%", resizeMode: "contain" },
	lightboxClose: {
		position: "absolute",
		top: 50,
		right: 20,
		zIndex: 10,
		padding: 10,
	},
});
