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
} from "react-native";

const RatingScreen = ({ navigation }) => {
  // Mock i18n function untuk terjemahan
  const i18n = {
    t: (key) => {
      const translations = {
        'rating': 'Penilaian',
        'yourRating': 'Penilaian Anda',
        'averageRating': 'Rata-rata Penilaian',
        'totalReviews': 'Total Ulasan',
        'writeReview': 'Tulis Ulasan',
        'submit': 'Kirim',
        'cancel': 'Batal',
        'veryBad': 'Sangat Buruk',
        'bad': 'Buruk',
        'average': 'Cukup',
        'good': 'Baik',
        'excellent': 'Sangat Baik'
      };
      return translations[key] || key;
    }
  };

  // Default theme (light theme)
  const theme = {
		gradientColors: ["#72b8f6", "#a7d4fc", "#E6F2FF"],
		card: "#FFFFFF",
		text: "#000000",
		textSecondary: "#666666",
		primary: "#007AFF",
	};

  const [rating, setRating] = useState(0);
  const [averageRating] = useState(4.5);
  const [totalReviews] = useState(128);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"} 
            size={32} 
            color={i <= rating ? "#FFD700" : "#CCCCCC"} 
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const getRatingLabel = (rating) => {
    if (rating === 0) return '';
    if (rating <= 1) return i18n.t('veryBad');
    if (rating <= 2) return i18n.t('bad');
    if (rating <= 3) return i18n.t('average');
    if (rating <= 4) return i18n.t('good');
    return i18n.t('excellent');
  };

  return (
    <LinearGradient
      colors={theme.gradientColors}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header dengan tombol back */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {i18n.t('rating')}
            </Text>
          </View>

          {/* Konten Rating */}
          <View style={styles.content}>
            {/* Statistik Rating */}
            <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
              <View style={styles.averageRatingContainer}>
                <Text style={[styles.averageRating, { color: theme.text }]}>
                  {averageRating}
                </Text>
                <Text style={[styles.totalReviews, { color: theme.textSecondary }]}>
                  {totalReviews} {i18n.t('totalReviews')}
                </Text>
              </View>
              <View style={styles.starsContainer}>
                {renderStars(Math.round(averageRating))}
              </View>
            </View>

            {/* Rating Anda */}
            <View style={[styles.yourRatingCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {i18n.t('yourRating')}
              </Text>
              
              <View style={styles.yourRatingStars}>
                {renderStars(rating)}
              </View>
              
              {rating > 0 && (
                <Text style={[styles.ratingLabel, { color: theme.primary }]}>
                  {getRatingLabel(rating)}
                </Text>
              )}

              {rating > 0 && (
                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    alert(`Terima kasih! Rating Anda: ${rating} bintang`);
                    setRating(0);
                  }}
                >
                  <Text style={styles.submitButtonText}>{i18n.t('submit')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
  },
  statsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  averageRatingContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  totalReviews: {
    fontSize: 14,
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  yourRatingCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  yourRatingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RatingScreen;