import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MenuListScreen({ navigation, route }) {
	const { title = "Objek Wisata", type = "wisata" } = route.params || {};

	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState("rating");

	const DATA = {
		wisata: [
			{
				id: 1,
				name: "Depo Bay",
				category: "Wisata buatan",
				address: "Jl. Menteri Supeno No.10, Banyumas",
				image: require("../../assets/depo bay.jpg"),
				rating: 4,
				price: 25000,
				popular: true,
			},
			{
				id: 2,
				name: "Curug Bayan",
				category: "Wisata alam",
				address: "Desa Ketenger, Banyumas",
				image: require("../../assets/logo_wisata.png"),
				rating: 5,
				price: 15000,
				popular: true,
			},
		],

		kuliner: [
			{
				id: 3,
				name: "Soto Sokaraja",
				category: "Kuliner khas",
				address: "Sokaraja, Banyumas",
				image: require("../../assets/logo_kuliner.png"),
				rating: 5,
				price: 18000,
				popular: true,
			},
			{
				id: 4,
				name: "Mendoan Banyumas",
				category: "Kuliner khas",
				address: "Purwokerto",
				image: require("../../assets/logo_kuliner.png"),
				rating: 4,
				price: 10000,
				popular: true,
			},
		],

		penginapan: [
			{
				id: 5,
				name: "Hotel Java Heritage",
				category: "Hotel",
				address: "Purwokerto",
				image: require("../../assets/logo_penginapan.png"),
				rating: 4,
				price: 350000,
				popular: true,
			},
		],

		oleh2: [
			{
				id: 6,
				name: "Getuk Goreng Sokaraja",
				category: "Oleh-oleh",
				address: "Sokaraja",
				image: require("../../assets/logo_oleh2.png"),
				rating: 5,
				price: 25000,
				popular: true,
			},
		],

		desa: [
			{
				id: 7,
				name: "Desa Wisata Ketenger",
				category: "Desa Wisata",
				address: "Baturraden",
				image: require("../../assets/logo_desa.png"),
				rating: 4,
				price: 10000,
				popular: true,
			},
		],

		biro: [
			{
				id: 8,
				name: "Biro Travel Banyumas",
				category: "Biro perjalanan",
				address: "Purwokerto",
				image: require("../../assets/logo_biro.png"),
				rating: 4,
				price: 50000,
				popular: true,
			},
		],
	};

	const data = DATA[type] || [];

	/* ================= FILTER LOGIC ================= */
	const filteredData = data
		.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
		.sort((a, b) => {
			if (activeFilter === "rating") return b.rating - a.rating;
			if (activeFilter === "popular") return b.popular - a.popular;
			if (activeFilter === "cheap") return a.price - b.price;
			return 0;
		});

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#EAF6FF" }}>
			<ScrollView>
				{/* HEADER SEARCH */}
				<View style={styles.searchHeader}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="arrow-back" size={22} />
					</TouchableOpacity>

					<View style={styles.searchBox}>
						<Ionicons name="search" size={18} color="#999" />
						<TextInput
							placeholder={`Cari ${title}`}
							value={search}
							onChangeText={setSearch}
							style={styles.searchInput}
						/>
					</View>

					<Ionicons name="filter" size={22} />
				</View>

				{/* FILTER */}
				<View style={styles.filterRow}>
					{[
						{ key: "rating", label: "Rating" },
						{ key: "popular", label: "Terpopuler" },
						{ key: "cheap", label: "Termurah" },
					].map((item) => (
						<TouchableOpacity
							key={item.key}
							style={[
								styles.filterBtn,
								activeFilter === item.key && styles.filterActive,
							]}
							onPress={() => setActiveFilter(item.key)}
						>
							<Text
								style={
									activeFilter === item.key
										? styles.filterTextActive
										: styles.filterText
								}
							>
								{item.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* LIST */}
				{filteredData.map((item) => (
					<View key={item.id} style={styles.card}>
						<Image source={item.image} style={styles.image} />

						<View style={{ flex: 1 }}>
							<View style={styles.rowBetween}>
								<View style={styles.badge}>
									<Text style={styles.badgeText}>{item.category}</Text>
								</View>
								<Ionicons name="heart-outline" size={18} />
							</View>

							<Text style={styles.title}>{item.name}</Text>
							<Text style={styles.address}>Alamat: {item.address}</Text>

							<View style={styles.rowBetween}>
								<View style={{ flexDirection: "row" }}>
									{[1, 2, 3, 4, 5].map((i) => (
										<Ionicons
											key={i}
											name={i <= item.rating ? "star" : "star-outline"}
											size={16}
											color="#FFC107"
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
	searchHeader: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		gap: 10,
	},
	searchBox: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingHorizontal: 12,
	},
	searchInput: {
		flex: 1,
		marginLeft: 6,
	},

	filterRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
	},
	filterBtn: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		backgroundColor: "#E0E0E0",
		borderRadius: 20,
	},
	filterActive: {
		backgroundColor: "#1E88E5",
	},
	filterText: {
		fontSize: 12,
	},
	filterTextActive: {
		color: "#fff",
		fontSize: 12,
	},

	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		marginHorizontal: 16,
		marginBottom: 12,
		borderRadius: 16,
		padding: 10,
		elevation: 4,
	},
	image: {
		width: 110,
		height: 110,
		borderRadius: 12,
		marginRight: 10,
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

	title: {
		fontSize: 14,
		fontWeight: "bold",
		marginTop: 4,
	},
	address: {
		fontSize: 11,
		color: "#666",
		marginVertical: 4,
	},

	detailBtn: {
		backgroundColor: "#1E88E5",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
		margin: 15,
	},
	detailText: {
		color: "#fff",
		fontSize: 11,
	},
});
