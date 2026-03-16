import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
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
} from "react-native";

const { width } = Dimensions.get('window');

const LastSeen = ({ navigation }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Semua tanggal');
  const [tempSelectedFilter, setTempSelectedFilter] = useState('Semua tanggal');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);

  const filterOptions = [
    { label: 'Semua tanggal', value: 'all' },
    { label: 'Kemarin', value: 'yesterday' },
    { label: 'Minggu Lalu', value: 'lastweek' },
    { label: 'Bulan Lalu', value: 'lastmonth' },
    { label: 'Rentang Tanggal', value: 'range', hasArrow: true },
  ];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Sample hotel data
  const hotels = [
    {
      id: 1,
      name: 'Curug Cipendok',
      location: 'Desa Karangtengah, Cilongok',
      category: 'Wisata Alam',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 2,
      name: 'Baturraden',
      location: 'Banyumas, Jawa Tengah',
      category: 'Wisata Alam',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 3,
      name: 'Hotel Santika',
      location: 'Purwokerto, Jawa Tengah',
      category: 'Penginapan',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 4,
      name: 'Sate Buntel',
      location: 'Purwokerto, Jawa Tengah',
      category: 'Kuliner',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 5,
      name: 'Desa Wisata Karangbanjar',
      location: 'Banyumas, Jawa Tengah',
      category: 'Desa Wisata',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Text key={i} style={styles.starFull}>★</Text>
        );
      } else {
        stars.push(
          <Text key={i} style={styles.starEmpty}>★</Text>
        );
      }
    }
    return stars;
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      "Wisata Alam": "#FF5757",
      "Wisata Buatan": "#FF5757",
      "Kuliner": "#FF8C42",
      "Penginapan": "#4CAF50",
      "Oleh-oleh": "#9C27B0",
      "Desa Wisata": "#2196F3",
      "Biro Perjalanan": "#FF6B9D",
    };
    return colors[category] || "#FF5757";
  };

  const renderCard = (hotel) => (
    <View key={hotel.id} style={styles.card}>
      <Image 
        source={{ uri: hotel.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryBadgeColor(hotel.category) },
          ]}
        >
          <Text style={styles.categoryText}>{hotel.category}</Text>
        </View>

        <Text style={styles.cardTitle}>{hotel.name}</Text>
        <Text style={styles.cardAddress}>{hotel.location}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            {renderStars(hotel.rating)}
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate("Detail", { item: hotel })}
          >
            <Text style={styles.detailButtonText}>Lihat selengkapnya</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.favoriteButton}>
        <Text style={styles.favoriteIcon}>♡</Text>
      </TouchableOpacity>
    </View>
  );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(selectedDate);
      setTempEndDate(null);
    } else if (selectedDate < tempStartDate) {
      setTempStartDate(selectedDate);
    } else {
      setTempEndDate(selectedDate);
    }
  };

  const formatDateRange = (start, end) => {
    if (!start) return '';
    const startStr = `${start.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    if (!end) return startStr;
    const endStr = `${end.getDate()} ${monthNames[end.getMonth()]} ${end.getFullYear()}`;
    return `${startStr} - ${endStr}`;
  };

  const applyFilter = () => {
    setSelectedFilter(tempSelectedFilter);
    if (tempSelectedFilter === 'Rentang Tanggal') {
      setSelectedStartDate(tempStartDate);
      setSelectedEndDate(tempEndDate);
    }
    setShowFilterModal(false);
    setShowDatePicker(false);
  };

  const renderDatePicker = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = (tempStartDate && date.toDateString() === tempStartDate.toDateString()) ||
                        (tempEndDate && date.toDateString() === tempEndDate.toDateString());
      const isInRange = tempStartDate && tempEndDate && date > tempStartDate && date < tempEndDate;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            isSelected && styles.selectedDay,
            isInRange && styles.rangeDay
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
		<LinearGradient
			colors={["#72b8f6", "#a7d4fc", "#E6F2FF"]}
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
						<Ionicons name="arrow-back" size={24} color="#000" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Terakhir dilihat</Text>
					<TouchableOpacity style={styles.searchButton}>
						<Ionicons name="search" size={24} color="#000" />
					</TouchableOpacity>
				</View>

				{/* Filter Button */}
				<View style={styles.filterContainer}>
					<TouchableOpacity
						style={styles.filterButton}
						onPress={() => {
							setTempSelectedFilter(selectedFilter);
							setShowFilterModal(true);
						}}
					>
						<Text style={styles.filterText}>Filter berdasarkan tanggal</Text>
						<Ionicons name="chevron-down" size={18} color="#000" />
					</TouchableOpacity>
				</View>

				{/* Hotel List */}
				<ScrollView
					style={styles.contentContainer}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					{hotels.map((hotel) => renderCard(hotel))}
				</ScrollView>
			</SafeAreaView>

			{/* Filter Modal */}
			<Modal
				visible={showFilterModal}
				transparent={true}
				animationType="slide"
				onRequestClose={() => setShowFilterModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<TouchableOpacity onPress={() => setShowFilterModal(false)}>
								<Ionicons name="close" size={24} color="#000" />
							</TouchableOpacity>
							<Text style={styles.modalTitle}>Filter berdasarkan tanggal</Text>
							<TouchableOpacity onPress={applyFilter}>
								<Ionicons name="checkmark" size={24} color="#000" />
							</TouchableOpacity>
						</View>

						{!showDatePicker ? (
							<View style={styles.filterOptions}>
								{filterOptions.map((option, index) => (
									<TouchableOpacity
										key={index}
										style={styles.filterOption}
										onPress={() => {
											if (option.value === "range") {
												setShowDatePicker(true);
											} else {
												setTempSelectedFilter(option.label);
											}
										}}
									>
										<Text style={styles.filterOptionText}>{option.label}</Text>
										<View style={styles.filterOptionRight}>
											{tempSelectedFilter === option.label &&
												!option.hasArrow && (
													<View style={styles.radioSelected} />
												)}
											{option.hasArrow && (
												<Ionicons
													name="chevron-forward"
													size={20}
													color="#666"
												/>
											)}
											{tempSelectedFilter !== option.label &&
												!option.hasArrow && (
													<View style={styles.radioUnselected} />
												)}
										</View>
									</TouchableOpacity>
								))}
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
										<Ionicons name="chevron-back" size={24} color="#000" />
									</TouchableOpacity>
									<Text style={styles.monthYear}>
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
										<Ionicons name="chevron-forward" size={24} color="#000" />
									</TouchableOpacity>
								</View>

								<View style={styles.calendar}>
									<View style={styles.weekDays}>
										{dayNames.map((day, index) => (
											<Text key={index} style={styles.weekDayText}>
												{day}
											</Text>
										))}
									</View>
									<View style={styles.daysGrid}>{renderDatePicker()}</View>
								</View>

								{(tempStartDate || tempEndDate) && (
									<View style={styles.selectedDateRange}>
										<Text style={styles.selectedDateRangeText}>
											{formatDateRange(tempStartDate, tempEndDate)}
										</Text>
									</View>
								)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  searchButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Card Styles - SAMA SEPERTI DI HOME SCREEN
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
    fontSize: 20,
    color: "#333",
  },
  
  // Modal Styles (tetap sama)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  filterOptions: {
    padding: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterOptionText: {
    fontSize: 15,
    color: '#000',
  },
  filterOptionRight: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#0066FF',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
  },
  datePickerContainer: {
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  calendar: {
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    width: width / 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDay: {
    width: width / 8,
    height: 40,
  },
  dayButton: {
    width: width / 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDay: {
    backgroundColor: '#0066FF',
    borderRadius: 20,
  },
  rangeDay: {
    backgroundColor: '#E3F2FF',
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedDateRange: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  selectedDateRangeText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default LastSeen;