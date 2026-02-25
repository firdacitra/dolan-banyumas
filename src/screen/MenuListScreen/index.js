// src/screen/MenuListScreen/index.js
import React, { useState, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	objekWisataData,
	kulinerData,
	penginapanData,
	olehOlehData,
	desaWisataData,
	biroPerjalananData,
} from "../../constant/dataMenu";

const MenuListScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { category } = route.params;

	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("Rating");

	// Get data based on category
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getCategoryData = () => {
		const dataMap = {
			objekWisata: objekWisataData,
			kuliner: kulinerData,
			penginapan: penginapanData,
			olehOleh: olehOlehData,
			desaWisata: desaWisataData,
			biroPerjalanan: biroPerjalananData,
		};
		return dataMap[category] || [];
	};

	const getCategoryTitle = () => {
		const titleMap = {
			objekWisata: "Objek Wisata",
			kuliner: "Kuliner",
			penginapan: "Penginapan",
			olehOleh: "Oleh-oleh",
			desaWisata: "Desa Wisata",
			biroPerjalanan: "Biro Perjalanan",
		};
		return titleMap[category] || "Menu";
	};

	// Filter and sort data
	const filteredData = useMemo(() => {
		let data = getCategoryData();

		// Search filter
		if (searchQuery) {
			data = data.filter(
				(item) =>
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.address.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		// Sort filter
		if (activeFilter === "Rating") {
			data = [...data].sort((a, b) => b.rating - a.rating);
		} else if (activeFilter === "Terpopuler") {
			data = [...data].sort((a, b) => b.rating - a.rating);
		} else if (activeFilter === "Termurah") {
			data = [...data].sort((a, b) => (a.price || 0) - (b.price || 0));
		}

		return data;
	}, [getCategoryData, searchQuery, activeFilter]);

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

	const getCategoryBadgeColor = (categoryName) => {
		const colors = {
			"Wisata Alam": "#FF5757",
			"Wisata Buatan": "#FF5757",
			"Wisata alam": "#FF5757",
			"Wisata buatan": "#FF5757",
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
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.backIcon}>←</Text>
				</TouchableOpacity>

				<View style={styles.searchContainer}>
					<Text style={styles.searchIcon}></Text>
					<TextInput
						style={styles.searchInput}
						placeholder={`Cari ${getCategoryTitle()}`}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{/* Filter Buttons */}
			<View style={styles.filterContainer}>
				{["Rating", "Terpopuler", "Termurah"].map((filter) => (
					<TouchableOpacity
						key={filter}
						style={[
							styles.filterChip,
							activeFilter === filter && styles.filterChipActive,
						]}
						onPress={() => setActiveFilter(filter)}
					>
						<Text
							style={[
								styles.filterChipText,
								activeFilter === filter && styles.filterChipTextActive,
							]}
						>
							{filter}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* List */}
			<ScrollView
				style={styles.listContainer}
				showsVerticalScrollIndicator={false}
			>
				{filteredData.length > 0 ? (
					filteredData.map((item) => (
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
								<Text style={styles.cardAddress}>Alamat: {item.address}</Text>

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
					))
				) : (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>Tidak ada data ditemukan</Text>
					</View>
				)}
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
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
		gap: 10,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	backIcon: {
		fontSize: 24,
		color: "#333",
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 15,
		height: 40,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	searchIcon: {
		fontSize: 18,
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		color: "#333",
	},
	filterButton: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	filterIcon: {
		fontSize: 20,
		color: "#333",
	},
	filterContainer: {
		flexDirection: "row",
		paddingHorizontal: 15,
		paddingVertical: 15,
		gap: 10,
	},
	filterChip: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: "#E0E0E0",
	},
	filterChipActive: {
		backgroundColor: "#2196F3",
	},
	filterChipText: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},
	filterChipTextActive: {
		color: "#fff",
		fontWeight: "600",
	},
	listContainer: {
		flex: 1,
		paddingHorizontal: 15,
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
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 50,
	},
	emptyText: {
		fontSize: 16,
		color: "#999",
		textAlign: "center",
	},
});

export default MenuListScreen;
