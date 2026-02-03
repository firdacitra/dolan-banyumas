import React, { useState, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
	Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getAllData } from "../../../constant/dataMenu";

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

	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Semua");
	const [showFilter, setShowFilter] = useState(false);
	const [favorites, setFavorites] = useState([]);

	const allData = useMemo(() => getAllData(), []);

	/* ================= FAVORITE ================= */
	const toggleFavorite = (id) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
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
		<SafeAreaView style={styles.container}>
			{/* ================= SEARCH BAR ================= */}
			<View style={styles.header}>
				<View style={styles.searchBox}>
					<Ionicons name="search" size={18} color="#999" />

					<TextInput
						placeholder="Cari wisata, kuliner, penginapan..."
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

			{/* ================= LIST ================= */}
			<ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
				{filteredData.length > 0 ? (
					filteredData.map((item) => {
						const isFavorite = favorites.includes(item.id);

						return (
							<View key={item.id} style={styles.card}>
								<Image source={item.image} style={styles.image} />

								<View style={styles.content}>
									<Text
										style={[
											styles.category,
											{ backgroundColor: getCategoryBadgeColor(item.category) },
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
											<Text style={styles.detailText}>Lihat selengkapnya</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* ❤️ LOVE BUTTON */}
								<TouchableOpacity
									style={styles.favoriteButton}
									onPress={() => toggleFavorite(item.id)}
								>
									<Ionicons
										name={isFavorite ? "heart" : "heart-outline"}
										size={18}
										color={isFavorite ? "#FF5757" : "#666"}
									/>
								</TouchableOpacity>
							</View>
						);
					})
				) : (
					<View style={styles.empty}>
						<Text style={styles.emptyText}>Data tidak ditemukan</Text>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default SearchScreen;

/* ================= STYLE ================= */
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#E8F4F8" },

	header: { paddingHorizontal: 16, paddingTop: 10, zIndex: 10 },

	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 15,
		height: 44,
		gap: 8,
		elevation: 3,
	},

	searchInput: { flex: 1, fontSize: 14, color: "#333" },

	filterDropdown: {
		marginTop: 8,
		backgroundColor: "#fff",
		borderRadius: 16,
		paddingVertical: 8,
		elevation: 4,
	},

	filterItem: { paddingVertical: 10, paddingHorizontal: 16 },
	filterItemActive: { backgroundColor: "#E3F2FD" },
	filterText: { fontSize: 13, color: "#555" },
	filterTextActive: { color: "#2196F3", fontWeight: "600" },

	list: { paddingHorizontal: 16, paddingTop: 10 },

	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 14,
		marginBottom: 14,
		elevation: 4,
		position: "relative",
	},

	image: { width: 90, height: 90, borderRadius: 16 },

	content: { flex: 1, marginLeft: 12 },

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

	title: { fontSize: 15, fontWeight: "700", color: "#333" },
	address: { fontSize: 12, color: "#999", marginVertical: 4 },

	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 6,
	},

	rating: { flexDirection: "row" },

	detailBtn: {
		backgroundColor: "#2196F3",
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 18,
	},

	detailText: { color: "#fff", fontSize: 12, fontWeight: "600" },

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

	empty: { paddingVertical: 80, alignItems: "center" },
	emptyText: { color: "#999", fontSize: 14 },

	starFull: { color: "#FFB800", fontSize: 18, marginRight: 2 },
	starHalf: { color: "#FFB800", fontSize: 18, marginRight: 2, opacity: 0.5 },
	starEmpty: { color: "#DADADA", fontSize: 18, marginRight: 2 },
});
