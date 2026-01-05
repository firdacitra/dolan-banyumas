import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width * 0.9;

export default function HomeScreen({ navigation }) {
	const [activeBanner, setActiveBanner] = useState(0);
	const bannerRef = useRef(null);

	/* ================= BANNER ================= */
	const banners = [
		require("../../../assets/logo_wisata.png"),
		require("../../../assets/depo bay.jpg"),
		require("../../../assets/logo_wisata.png"),
	];

	useEffect(() => {
		const interval = setInterval(() => {
			const next = (activeBanner + 1) % banners.length;
			bannerRef.current?.scrollTo({
				x: next * BANNER_WIDTH,
				animated: true,
			});
			setActiveBanner(next);
		}, 3000);

		return () => clearInterval(interval);
	}, [activeBanner, banners.length]);

	const onScrollBanner = (e) => {
		const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
		setActiveBanner(index);
	};

	/* ================= MENU (REUSABLE) ================= */
	const menus = [
		{
			title: "Objek Wisata",
			icon: require("../../../assets/logo_wisata.png"),
			type: "wisata",
		},
		{
			title: "Kuliner",
			icon: require("../../../assets/logo_kuliner.png"),
			type: "kuliner",
		},
		{
			title: "Penginapan",
			icon: require("../../../assets/logo_penginapan.png"),
			type: "penginapan",
		},
		{
			title: "Oleh-oleh",
			icon: require("../../../assets/logo_oleh2.png"),
			type: "oleh2",
		},
		{
			title: "Desa Wisata",
			icon: require("../../../assets/logo_desa.png"),
			type: "desa",
		},
		{
			title: "Biro Perjalanan",
			icon: require("../../../assets/logo_biro.png"),
			type: "biro",
		},
	];

	/* ================= REKOMENDASI ================= */
	const recommendations = [
		{
			id: 1,
			title: "Depo Bay",
			address: "Jl. Menteri Supeno No.10, Banyumas",
			image: require("../../../assets/depo bay.jpg"),
			category: "Wisata Buatan",
			rating: 4,
		},
		{
			id: 2,
			title: "Curug Bayan",
			address: "Desa Ketenger, Banyumas",
			image: require("../../../assets/logo_wisata.png"),
			category: "Wisata Alam",
			rating: 5,
		},
	];

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#EAF6FF" }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* ================= HEADER ================= */}
				<View style={styles.header}>
					<Text style={styles.title}>Dolan Banyumas</Text>
					<TouchableOpacity
						style={styles.loginBtn}
						onPress={() => navigation.navigate("Login")}
					>
						<Text style={{ color: "#fff" }}>Login</Text>
					</TouchableOpacity>
				</View>

				{/* ================= BANNER ================= */}
				<ScrollView
					ref={bannerRef}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={onScrollBanner}
					scrollEventThrottle={16}
				>
					{banners.map((img, i) => (
						<Image key={i} source={img} style={styles.banner} />
					))}
				</ScrollView>

				<View style={styles.dots}>
					{banners.map((_, i) => (
						<View
							key={i}
							style={[styles.dot, activeBanner === i && styles.dotActive]}
						/>
					))}
				</View>

				{/* ================= MENU ================= */}
				<View style={styles.menu}>
					{menus.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={styles.menuItem}
							onPress={() =>
								navigation.navigate("MenuList", {
									type: item.type,
									title: item.title,
								})
							}
						>
							<Image source={item.icon} style={styles.menuIcon} />
							<Text style={styles.menuText}>{item.title}</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* ================= REKOMENDASI ================= */}
				<Text style={styles.section}>Rekomendasi buat kamu</Text>

				{recommendations.map((item) => (
					<View key={item.id} style={styles.recommendCard}>
						<Image source={item.image} style={styles.recommendImage} />

						<View style={styles.recommendContent}>
							<View style={styles.rowBetween}>
								<View style={styles.badge}>
									<Text style={styles.badgeText}>{item.category}</Text>
								</View>
								<Ionicons name="heart-outline" size={22} color="#555" />
							</View>

							<Text style={styles.recommendTitle}>{item.title}</Text>
							<Text style={styles.recommendDesc}>{item.address}</Text>

							<View style={styles.rowBetween}>
								<View style={styles.rating}>
									{[1, 2, 3, 4, 5].map((i) => (
										<Ionicons
											key={i}
											name={i <= item.rating ? "star" : "star-outline"}
											size={16}
											color={i <= item.rating ? "#FFC107" : "#aaa"}
										/>
									))}
								</View>

								<TouchableOpacity
									style={styles.detailBtn}
									onPress={() => navigation.navigate("Detail", item)}
								>
									<Text style={styles.detailText}>Lihat selengkapnya</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
		alignItems: "center",
	},
	title: { fontSize: 18, fontWeight: "bold" },
	loginBtn: {
		backgroundColor: "#1E88E5",
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 20,
	},

	banner: {
		width: BANNER_WIDTH,
		height: 160,
		borderRadius: 16,
		marginHorizontal: width * 0.05,
	},

	dots: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 10,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#bbb",
		marginHorizontal: 4,
	},
	dotActive: {
		backgroundColor: "#1E88E5",
		width: 18,
	},

	menu: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
	},
	menuItem: {
		alignItems: "center",
		width: "30%",
		marginBottom: 20,
	},
	menuIcon: { width: 60, height: 60, borderRadius: 30 },
	menuText: { marginTop: 6, fontSize: 12 },

	section: {
		fontSize: 16,
		fontWeight: "bold",
		margin: 16,
	},

	recommendCard: {
		flexDirection: "row",
		backgroundColor: "#fff",
		marginHorizontal: 20,
		borderRadius: 16,
		padding: 10,
		marginBottom: 10,
		elevation: 5,
	},
	recommendImage: {
		width: 110,
		height: 110,
		borderRadius: 12,
	},
	recommendContent: {
		flex: 1,
		marginLeft: 10,
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	badge: {
		backgroundColor: "#E53935",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 8,
	},
	badgeText: {
		color: "#fff",
		fontSize: 10,
	},
	recommendTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginTop: 4,
	},
	recommendDesc: {
		fontSize: 11,
		color: "#666",
		marginVertical: 5,
	},
	rating: {
		flexDirection: "row",
	},
	detailBtn: {
		backgroundColor: "#1E88E5",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
		margin: 10,
	},
	detailText: {
		color: "#fff",
		fontSize: 11,
	},
});
