import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

const Favorites = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const [favorites, setFavorites] = useState({
    'Objek Wisata': [
      {
        id: 1,
        name: 'Curug Cipendok',
        location: 'Desa Karangtengah, Cilongok',
        category: 'Wisata Alam',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      },
      {
        id: 11,
        name: 'Baturraden',
        location: 'Banyumas, Jawa Tengah',
        category: 'Wisata Alam',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
    'Penginapan': [
      {
        id: 2,
        name: 'Hotel Santika',
        location: 'Purwokerto, Jawa Tengah',
        category: 'Penginapan',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
    'Kuliner': [
      {
        id: 3,
        name: 'Sate Buntel',
        location: 'Purwokerto, Jawa Tengah',
        category: 'Kuliner',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
    'Oleh-oleh': [
      {
        id: 4,
        name: 'Getuk Goreng',
        location: 'Sokaraja, Banyumas',
        category: 'Oleh-oleh',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
    'Desa Wisata': [
      {
        id: 5,
        name: 'Desa Wisata Karangbanjar',
        location: 'Banyumas, Jawa Tengah',
        category: 'Desa Wisata',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
    'Biro Perjalanan': [
      {
        id: 6,
        name: 'Banyumas Tour',
        location: 'Purwokerto, Jawa Tengah',
        category: 'Biro Perjalanan',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
  });

  // Kategori dengan icon yang sesuai gambar
  const categories = [
    { name: 'Semua', icon: 'apps', iconColor: '#0a4914' },
    { name: 'Objek Wisata', icon: 'image', iconColor: '#FF5757' },
    { name: 'Kuliner', icon: 'restaurant', iconColor: '#FF8C42' },
    { name: 'Penginapan', icon: 'bed', iconColor: '#4CAF50' },
    { name: 'Oleh-oleh', icon: 'gift', iconColor: '#9C27B0' },
    { name: 'Desa Wisata', icon: 'home', iconColor: '#2196F3' },
    { name: 'Biro Perjalanan', icon: 'car', iconColor: '#FF6B9D' },
  ];

  const toggleFavorite = (category, itemId) => {
    setFavorites(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId 
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    }));
  };

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

  const renderCard = (item, category) => (
    <View key={item.id} style={styles.card}>
      <Image 
        source={{ uri: item.image }}
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

        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardAddress}>{item.location}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate("Detail", { item })}
          >
            <Text style={styles.detailButtonText}>Lihat selengkapnya</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(category, item.id)}
      >
        <Text style={[styles.favoriteIcon, item.isFavorite && styles.favoriteIconActive]}>
          {item.isFavorite ? "❤️" : "♡"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Filter data berdasarkan kategori yang dipilih
  const getFilteredFavorites = () => {
    if (selectedCategory === 'Semua') {
      return favorites;
    }
    return {
      [selectedCategory]: favorites[selectedCategory] || []
    };
  };

  // Render kategori item untuk scroll horizontal
  const renderCategoryItem = (category) => {
    const isSelected = selectedCategory === category.name;
    
    return (
      <TouchableOpacity
        key={category.name}
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: category.iconColor, borderColor: category.iconColor }
        ]}
        onPress={() => setSelectedCategory(category.name)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={category.icon} 
          size={14}
          color={isSelected ? '#FFF' : category.iconColor}
          style={{ marginRight: 5 }}
        />
        <Text style={[
          styles.categoryItemText,
          isSelected && styles.categoryItemTextActive
        ]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#C5E3F6', '#E5F2FA', '#FFFFFF']}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favorit Saya</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Horizontal Category Scroll */}
        <View style={styles.categoryScrollContainer}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
            style={styles.categoryScroll}
          >
            {categories.map((category) => renderCategoryItem(category))}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {Object.entries(getFilteredFavorites()).map(([category, items]) => (
            items.length > 0 && (
              <View key={category} style={styles.categorySection}>
                {selectedCategory === 'Semua' && (
                  <Text style={styles.categoryTitle}>{category}</Text>
                )}
                {items.map(item => renderCard(item, category))}
              </View>
            )
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  
  // Horizontal Category Scroll Styles
  categoryScrollContainer: {
    height: 52,
    paddingVertical: 8,
    paddingLeft: 16,
    marginBottom: 8,
  },
  categoryScroll: {
    height: 52,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItemText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  categoryItemTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
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
  favoriteIconActive: {
    color: "#FF4D4D",
  },
});

export default Favorites;