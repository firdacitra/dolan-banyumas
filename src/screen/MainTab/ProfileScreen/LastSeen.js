// src/screen/MainTab/ProfileScreen/LastSeen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
	Image,
	Dimensions,
	Alert,
} from "react-native";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useLastSeen } from "../../../context/LastSeenContext";
import { useTheme } from "../../../context/ThemeContext"; // TAMBAHKAN IMPORT INI

const { width } = Dimensions.get("window");

const LastSeen = ({ navigation }) => {
	const { t } = useLanguage();
	const { theme } = useTheme(); // GANTI hardcoded theme dengan useTheme()
	const { lastSeenItems, getLastSeenByFilter } = useLastSeen();

	const [showFilterModal, setShowFilterModal] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [tempSelectedFilter, setTempSelectedFilter] = useState("all");
	const [filteredItems, setFilteredItems] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedStartDate, setSelectedStartDate] = useState(null);
	const [selectedEndDate, setSelectedEndDate] = useState(null);
	const [tempStartDate, setTempStartDate] = useState(null);
	const [tempEndDate, setTempEndDate] = useState(null);

	// Filter options — ikut bahasa aktif via t()
	const filterOptions = [
		{ label: t("allDates"), value: "all" },
		{ label: t("today"), value: "today" },
		{ label: t("yesterday"), value: "yesterday" },
		{ label: t("lastWeek"), value: "lastweek" },
		{ label: t("lastMonth"), value: "lastmonth" },
		{ label: t("dateRange"), value: "range", hasArrow: true },
	];

	const monthNames = t("monthNames").split(",");
	const dayNames = t("dayNames").split(",");

	// FILTER: Update ketika selectedFilter berubah atau data berubah
	useEffect(() => {
		applyFilterData();
	}, [selectedFilter, selectedStartDate, selectedEndDate, lastSeenItems]);

	const applyFilterData = () => {
		if (!lastSeenItems || lastSeenItems.length === 0) {
			setFilteredItems([]);
			return;
		}

		// Helper local date string (sama dengan di context, hindari bug UTC)
		const toLocalStr = (date) => {
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, "0");
			const d = String(date.getDate()).padStart(2, "0");
			return `${y}-${m}-${d}`;
		};

		let hasil = [];

		if (selectedFilter === "range" && selectedStartDate && selectedEndDate) {
			const startStr = toLocalStr(selectedStartDate);
			const endStr = toLocalStr(selectedEndDate);
			hasil = lastSeenItems.filter(
				(item) => item.lastSeenDate >= startStr && item.lastSeenDate <= endStr,
			);
		} else {
			switch (selectedFilter) {
				case "today": {
					const todayStr = toLocalStr(new Date());
					hasil = lastSeenItems.filter(
						(item) => item.lastSeenDate === todayStr,
					);
					break;
				}
				case "yesterday": {
					const yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					hasil = lastSeenItems.filter(
						(item) => item.lastSeenDate === toLocalStr(yesterday),
					);
					break;
				}
				case "lastweek": {
					const today = new Date();
					const lastWeek = new Date(today);
					lastWeek.setDate(lastWeek.getDate() - 7);
					hasil = lastSeenItems.filter(
						(item) =>
							item.lastSeenDate >= toLocalStr(lastWeek) &&
							item.lastSeenDate < toLocalStr(today),
					);
					break;
				}
				case "lastmonth": {
					const today = new Date();
					const lastMonth = new Date(today);
					lastMonth.setMonth(lastMonth.getMonth() - 1);
					hasil = lastSeenItems.filter(
						(item) =>
							item.lastSeenDate >= toLocalStr(lastMonth) &&
							item.lastSeenDate < toLocalStr(today),
					);
					break;
				}
				default: // 'all'
					hasil = [...lastSeenItems];
			}
		}

		hasil.sort((a, b) => new Date(b.lastSeenTime) - new Date(a.lastSeenTime));
		setFilteredItems(hasil);
	};

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= rating) {
				stars.push(
					<Text key={i} style={styles.starFull}>
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

	const formatTanggal = (dateString) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return t("today");
		} else if (date.toDateString() === yesterday.toDateString()) {
			return t("yesterday");
		} else {
			return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
		}
	};

	const renderCard = (item) => (
		<TouchableOpacity
			key={item.id}
			style={[styles.card, { backgroundColor: theme.card }]}
			onPress={() => navigation.navigate("Detail", { item })}
			activeOpacity={0.7}
		>
			<Image
				source={
					typeof item.image === "string" ? { uri: item.image } : item.image
				}
				style={styles.cardImage}
				resizeMode="cover"
			/>

			<View style={styles.cardContent}>
				<View
					style={[
						styles.categoryBadge,
						{ backgroundColor: getCategoryBadgeColor(item.category) },
					]}
				>
					<Text style={styles.categoryText}>{item.category}</Text>
				</View>

				<Text
					style={[styles.cardTitle, { color: theme.text }]}
					numberOfLines={1}
				>
					{item.name}
				</Text>
				<Text
					style={[styles.cardAddress, { color: theme.textSecondary }]}
					numberOfLines={1}
				>
					{item.address || ""}
				</Text>

				<View style={styles.cardFooter}>
					<View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

					<Text style={[styles.viewedDate, { color: theme.textSecondary }]}>
						{formatTanggal(item.lastSeenDate)}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		return { firstDay, daysInMonth };
	};

	const handleDateSelect = (day) => {
		const selectedDate = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			day,
		);

		if (!tempStartDate || (tempStartDate && tempEndDate)) {
			// Pilih tanggal mulai
			setTempStartDate(selectedDate);
			setTempEndDate(null);
		} else if (selectedDate < tempStartDate) {
			// Jika tanggal yang dipilih lebih kecil dari tanggal mulai, jadikan sebagai tanggal mulai baru
			setTempStartDate(selectedDate);
		} else {
			// Pilih tanggal akhir
			setTempEndDate(selectedDate);
		}
	};

	const formatDateRange = (start, end) => {
		if (!start) return "";
		const startStr = `${start.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
		if (!end) return startStr;
		const endStr = `${end.getDate()} ${monthNames[end.getMonth()]} ${end.getFullYear()}`;
		return `${startStr} - ${endStr}`;
	};

	const applyFilter = () => {
		// Kalau user lagi di date picker, otomatis filter-nya 'range'
		const activeFilter = showDatePicker ? "range" : tempSelectedFilter;

		if (activeFilter === "range") {
			if (tempStartDate && tempEndDate) {
				setSelectedFilter("range");
				setTempSelectedFilter("range");
				setSelectedStartDate(tempStartDate);
				setSelectedEndDate(tempEndDate);
			} else {
				Alert.alert(t("warningTitle"), t("warningSelectDate"));
				return;
			}
		} else {
			setSelectedFilter(activeFilter);
			setSelectedStartDate(null);
			setSelectedEndDate(null);
		}
		setShowFilterModal(false);
		setShowDatePicker(false);
	};

	const resetFilter = () => {
		setTempSelectedFilter("all");
		setTempStartDate(null);
		setTempEndDate(null);
		setShowDatePicker(false);
	};

	const renderDatePicker = () => {
		const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
		const days = [];

		// Tambahkan hari kosong untuk menyesuaikan hari pertama bulan
		for (let i = 0; i < firstDay; i++) {
			days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
		}

		// Buat tombol untuk setiap tanggal
		for (let day = 1; day <= daysInMonth; day++) {
			const date = new Date(
				currentMonth.getFullYear(),
				currentMonth.getMonth(),
				day,
			);
			const dateStr = date.toISOString().split("T")[0];

			const isSelected =
				(tempStartDate &&
					dateStr === tempStartDate.toISOString().split("T")[0]) ||
				(tempEndDate && dateStr === tempEndDate.toISOString().split("T")[0]);

			const isInRange =
				tempStartDate &&
				tempEndDate &&
				date > tempStartDate &&
				date < tempEndDate;

			days.push(
				<TouchableOpacity
					key={day}
					style={[
						styles.dayButton,
						isSelected && styles.selectedDay,
						isInRange && styles.rangeDay,
					]}
					onPress={() => handleDateSelect(day)}
				>
					<Text
						style={[
							styles.dayText,
							{ color: theme.text },
							isSelected && styles.selectedDayText,
						]}
					>
						{day}
					</Text>
				</TouchableOpacity>,
			);
		}

		return days;
	};

	const getJudulFilter = () => {
		const option = filterOptions.find((opt) => opt.value === selectedFilter);
		if (selectedFilter === "range" && selectedStartDate && selectedEndDate) {
			return formatDateRange(selectedStartDate, selectedEndDate);
		}
		return option?.label || t("allDates");
	};

	// Debug: lihat data
	useEffect(() => {
		console.log("LastSeenItems:", lastSeenItems.length);
		console.log("FilteredItems:", filteredItems.length);
	}, [lastSeenItems, filteredItems]);

	return (
		<LinearGradient
			colors={theme.gradientColors}
			locations={[0, 0.3, 1]}
			style={styles.container}
		>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<Ionicons name="arrow-back" size={24} color={theme.text} />
					</TouchableOpacity>
					<Text style={[styles.headerTitle, { color: theme.text }]}>
						{t("lastSeenTitle")}
					</Text>
					<View style={{ width: 24 }} />
				</View>

				{/* Tombol Filter */}
				<View style={styles.filterContainer}>
					<TouchableOpacity
						style={[
							styles.filterButton,
							{ backgroundColor: theme.card, borderColor: theme.border },
						]}
						onPress={() => {
							setTempSelectedFilter(selectedFilter);
							setTempStartDate(selectedStartDate);
							setTempEndDate(selectedEndDate);
							setShowFilterModal(true);
						}}
					>
						<Text style={[styles.filterText, { color: theme.text }]}>
							{getJudulFilter()}
						</Text>
						<Ionicons name="chevron-down" size={18} color={theme.text} />
					</TouchableOpacity>
				</View>

				{/* Jumlah Item */}
				<View style={styles.countContainer}>
					<Text style={[styles.countText, { color: theme.textSecondary }]}>
						{filteredItems.length} {t("itemSeen")}
					</Text>
				</View>

				{/* Daftar Last Seen */}
				{filteredItems.length > 0 ? (
					<ScrollView
						style={styles.contentContainer}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>
						{filteredItems.map((item) => renderCard(item))}
					</ScrollView>
				) : (
					<View style={styles.emptyContainer}>
						<Ionicons
							name="eye-off-outline"
							size={60}
							color={theme.textSecondary}
						/>
						<Text style={[styles.emptyTitle, { color: theme.text }]}>
							{t("noItemSeen")}
						</Text>
						<Text style={[styles.emptyText, { color: theme.textSecondary }]}>
							{t("noItemSeenDesc")}
						</Text>
						<TouchableOpacity
							style={[
								styles.jelajahiButton,
								{ backgroundColor: theme.primary },
							]}
							onPress={() => navigation.navigate("MainTab")}
						>
							<Text style={styles.jelajahiButtonText}>
								{t("exploreWisata")}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</SafeAreaView>

			{/* Modal Filter */}
			<Modal
				visible={showFilterModal}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowFilterModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent, { backgroundColor: theme.card }]}>
						<View
							style={[styles.modalHeader, { borderBottomColor: theme.border }]}
						>
							<TouchableOpacity onPress={() => setShowFilterModal(false)}>
								<Ionicons name="close" size={24} color={theme.text} />
							</TouchableOpacity>
							<Text style={[styles.modalTitle, { color: theme.text }]}>
								{t("filterDate")}
							</Text>
							<TouchableOpacity onPress={applyFilter}>
								<Ionicons name="checkmark" size={24} color={theme.primary} />
							</TouchableOpacity>
						</View>

						{!showDatePicker ? (
							<View style={styles.filterOptions}>
								{filterOptions.map((option) => (
									<TouchableOpacity
										key={option.value}
										style={[
											styles.filterOption,
											{ borderBottomColor: theme.border },
										]}
										onPress={() => {
											if (option.value === "range") {
												setShowDatePicker(true);
											} else {
												setTempSelectedFilter(option.value);
											}
										}}
									>
										<Text
											style={[styles.filterOptionText, { color: theme.text }]}
										>
											{option.label}
										</Text>
										<View style={styles.filterOptionRight}>
											{tempSelectedFilter === option.value &&
												!option.hasArrow && (
													<View
														style={[
															styles.radioSelected,
															{ borderColor: theme.primary },
														]}
													/>
												)}
											{option.hasArrow && (
												<Ionicons
													name="chevron-forward"
													size={20}
													color={theme.textSecondary}
												/>
											)}
											{tempSelectedFilter !== option.value &&
												!option.hasArrow && (
													<View
														style={[
															styles.radioUnselected,
															{ borderColor: theme.border },
														]}
													/>
												)}
										</View>
									</TouchableOpacity>
								))}

								<TouchableOpacity
									style={[
										styles.resetFilterButton,
										{ backgroundColor: theme.background },
									]}
									onPress={resetFilter}
								>
									<Text
										style={[
											styles.resetFilterText,
											{ color: theme.textSecondary },
										]}
									>
										{t("resetFilter")}
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<View style={styles.datePickerContainer}>
								<View style={styles.monthNavigation}>
									<TouchableOpacity
										onPress={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() - 1,
												),
											)
										}
									>
										<Ionicons
											name="chevron-back"
											size={24}
											color={theme.text}
										/>
									</TouchableOpacity>
									<Text style={[styles.monthYear, { color: theme.text }]}>
										{monthNames[currentMonth.getMonth()]}{" "}
										{currentMonth.getFullYear()}
									</Text>
									<TouchableOpacity
										onPress={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() + 1,
												),
											)
										}
									>
										<Ionicons
											name="chevron-forward"
											size={24}
											color={theme.text}
										/>
									</TouchableOpacity>
								</View>

								<View style={styles.calendar}>
									<View style={styles.weekDays}>
										{dayNames.map((day, index) => (
											<Text
												key={index}
												style={[
													styles.weekDayText,
													{ color: theme.textSecondary },
												]}
											>
												{day}
											</Text>
										))}
									</View>
									<View style={styles.daysGrid}>{renderDatePicker()}</View>
								</View>

								{(tempStartDate || tempEndDate) && (
									<View
										style={[
											styles.selectedDateRange,
											{ backgroundColor: theme.background },
										]}
									>
										<Text
											style={[
												styles.selectedDateRangeText,
												{ color: theme.text },
											]}
										>
											{formatDateRange(tempStartDate, tempEndDate)}
										</Text>
									</View>
								)}

								<View style={styles.datePickerActions}>
									<TouchableOpacity
										style={[
											styles.datePickerBackButton,
											{ backgroundColor: theme.primary },
										]}
										onPress={() => setShowDatePicker(false)}
									>
										<Text style={styles.datePickerBackButtonText}>
											{t("backToFilter")}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)}
					</View>
				</View>
			</Modal>
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
		backgroundColor: "transparent",
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#000",
	},
	filterContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	filterText: {
		fontSize: 14,
		color: "#000",
		fontWeight: "400",
	},
	countContainer: {
		paddingHorizontal: 16,
		paddingVertical: 4,
	},
	countText: {
		fontSize: 12,
		color: "#666",
	},
	contentContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},

	// Card Styles
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
	starEmpty: {
		fontSize: 18,
		color: "#E0E0E0",
	},
	viewedDate: {
		fontSize: 10,
		color: "#999",
		fontStyle: "italic",
	},

	// Empty State
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
		paddingTop: 100,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginTop: 16,
		marginBottom: 8,
	},
	emptyText: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
		marginBottom: 24,
	},
	jelajahiButton: {
		backgroundColor: "#0066FF",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 25,
	},
	jelajahiButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},

	// Modal Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 40,
		maxHeight: "80%",
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	modalTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#000",
	},
	filterOptions: {
		padding: 16,
	},
	filterOption: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F0F0F0",
	},
	filterOptionText: {
		fontSize: 15,
		color: "#000",
	},
	filterOptionRight: {
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	radioSelected: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 6,
		borderColor: "#0066FF",
	},
	radioUnselected: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#CCC",
	},
	resetFilterButton: {
		marginTop: 20,
		paddingVertical: 12,
		alignItems: "center",
		backgroundColor: "#F0F0F0",
		borderRadius: 8,
	},
	resetFilterText: {
		fontSize: 14,
		color: "#666",
		fontWeight: "500",
	},
	datePickerContainer: {
		padding: 16,
	},
	monthNavigation: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	monthYear: {
		fontSize: 16,
		fontWeight: "600",
		color: "#000",
	},
	calendar: {
		marginBottom: 16,
	},
	weekDays: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
	},
	weekDayText: {
		width: width / 8,
		textAlign: "center",
		fontSize: 12,
		color: "#666",
		fontWeight: "500",
	},
	daysGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	emptyDay: {
		width: width / 8,
		height: 40,
	},
	dayButton: {
		width: width / 8,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedDay: {
		backgroundColor: "#0066FF",
		borderRadius: 20,
	},
	rangeDay: {
		backgroundColor: "#E3F2FF",
	},
	dayText: {
		fontSize: 14,
		color: "#000",
	},
	selectedDayText: {
		color: "#fff",
		fontWeight: "600",
	},
	selectedDateRange: {
		backgroundColor: "#F0F0F0",
		padding: 12,
		borderRadius: 8,
		marginTop: 16,
	},
	selectedDateRangeText: {
		fontSize: 14,
		color: "#000",
		textAlign: "center",
	},
	datePickerActions: {
		marginTop: 16,
	},
	datePickerBackButton: {
		backgroundColor: "#0066FF",
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	datePickerBackButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
});

export default LastSeen;
