import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Detail({ navigation, route }) {
	const [liked, setLiked] = useState(false);
	const [activeSlide, setActiveSlide] = useState(0);

	// Ambil data dari route params
	const { item } = route.params;

	// Array gambar untuk carousel (bisa pakai gambar yang sama dulu atau tambahin field images di data)
	const images = [item.image, item.image, item.image];

	const handleScroll = (event) => {
		const slideSize = event.nativeEvent.layoutMeasurement.width;
		const offset = event.nativeEvent.contentOffset.x;
		const activeIndex = Math.round(offset / slideSize);
		setActiveSlide(activeIndex);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#EAF6FF" }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* ===== HEADER ===== */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.headerTitle} numberOfLines={1}>
						{item.name}
					</Text>
					<View style={{ width: 24 }} />
				</View>

				{/* ===== IMAGE CAROUSEL ===== */}
				<ScrollView
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					style={{ marginBottom: 10 }}
				>
					{images.map((image, index) => (
						<Image key={index} source={image} style={styles.image} />
					))}
				</ScrollView>

				{/* ===== DOT ===== */}
				<View style={styles.dots}>
					{images.map((_, index) => (
						<View
							key={index}
							style={index === activeSlide ? styles.dotActive : styles.dot}
						/>
					))}
				</View>

				{/* ===== ACTION ROW ===== */}
				<View style={styles.actionRow}>
					<TouchableOpacity style={styles.ticketBtn}>
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
					</View>

					<TouchableOpacity>
						<Ionicons name="location-outline" size={22} color="#000" />
					</TouchableOpacity>
				</View>

				{/* ===== DESCRIPTION CARD ===== */}
				<View style={styles.descCard}>
					<Text style={styles.descText}>
						{item.description ||
							`${item.name} berlokasi di ${item.address}. Tempat ini menawarkan pengalaman yang menarik dan tak terlupakan untuk dikunjungi.`}
					</Text>
					{item.address && (
						<Text
							style={[styles.descText, { marginTop: 10, fontWeight: "600" }]}
						>
							📍 Alamat: {item.address}
						</Text>
					)}
				</View>
			</ScrollView>

			{/* ===== BOTTOM ACTION ===== */}
			<View style={styles.bottomAction}>
				<TouchableOpacity onPress={() => setLiked(!liked)}>
					<Ionicons
						name={liked ? "heart" : "heart-outline"}
						size={26}
						color={liked ? "red" : "#000"}
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
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
	},

	image: {
		width: width - 40,
		height: 200,
		borderRadius: 16,
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 10,
		boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	},

	dots: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 10,
	},
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
		backgroundColor: "#000",
		marginHorizontal: 4,
	},

	actionRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		marginVertical: 10,
	},
	ticketBtn: {
		backgroundColor: "#E0E0E0",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	ticketText: {
		fontSize: 12,
	},

	ratingRow: {
		flexDirection: "row",
	},

	descCard: {
		backgroundColor: "#fff",
		margin: 16,
		padding: 16,
		borderRadius: 16,
		elevation: 4,
	},
	descText: {
		fontSize: 13,
		color: "#333",
		lineHeight: 20,
	},

	bottomAction: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
	},
});
