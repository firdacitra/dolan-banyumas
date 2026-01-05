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

	// DATA DUMMY (nanti dari backend Laravel)
	const data = route?.params || {
		title: "Museum Wayang Banyumas",
		image: require("../../assets/depo bay.jpg"),
		rating: 4,
		description: `Lorem ipsum dolor sit amet`,
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#EAF6FF" }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{/* ===== HEADER ===== */}
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{data.title}</Text>
					<View style={{ width: 24 }} />
				</View>

				{/* ===== IMAGE ===== */}
				<Image source={data.image} style={styles.image} />

				{/* ===== DOT ===== */}
				<View style={styles.dots}>
					<View style={styles.dotActive} />
					<View style={styles.dot} />
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
								name={i <= data.rating ? "star" : "star-outline"}
								size={20}
								color="#FFC107"
							/>
						))}
					</View>

					<Ionicons name="location-outline" size={22} color="#000" />
				</View>

				{/* ===== DESCRIPTION CARD ===== */}
				<View style={styles.descCard}>
					<Text style={styles.descText}>{data.description}</Text>
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

				<TouchableOpacity style={styles.downloadBtn}>
					<Ionicons name="download-outline" size={22} color="#000" />
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
	},

	image: {
		width: width - 40,
		height: 200,
		borderRadius: 16,
		alignSelf: "center",
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
	downloadBtn: {
		backgroundColor: "#E0E0E0",
		padding: 10,
		borderRadius: 20,
	},
});
