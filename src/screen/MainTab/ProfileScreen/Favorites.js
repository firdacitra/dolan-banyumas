import React, { useState } from "react";
import {
  SafeAreaView,
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

const { width } = Dimensions.get('window');

const Favorites = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const [favorites, setFavorites] = useState({
    'Objek Wisata': [
      {
        id: 1,
        name: 'Curug Cipendok',
        location: 'Banyumas, Jawa Tengah',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      },
      {
        id: 11,
        name: 'Baturraden',
        location: 'Banyumas, Jawa Tengah',
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
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        isFavorite: true,
      }
    ],
  });

  // Kategori dengan icon yang sesuai gambar
  const categories = [
    { name: 'Semua', icon: 'apps', iconColor: '#4CAF50' },
    { name: 'Objek Wisata', icon: 'image', iconColor: '#2196F3' },
    { name: 'Kuliner', icon: 'restaurant', iconColor: '#FF9800' },
    { name: 'Penginapan', icon: 'bed', iconColor: '#00BCD4' },
    { name: 'Oleh-oleh', icon: 'gift', iconColor: '#E91E63' },
    { name: 'Desa Wisata', icon: 'home', iconColor: '#8BC34A' },
    { name: 'Biro Perjalanan', icon: 'car', iconColor: '#FFC107' },
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

  const renderHotelCard = (item, category) => (
    <View key={item.id} style={styles.hotelCard}>
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: item.image }}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.hotelInfo}>
          <View style={styles.hotelHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.tagContainer}>
                <LinearGradient
                  colors={['#FF4D4D', '#CC0000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.discountTag}
                >
                  <Text style={styles.discountText}>25% OFF</Text>
                </LinearGradient>
              </View>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.hotelLocation} numberOfLines={2}>
                {item.location}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(category, item.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.isFavorite ? "heart" : "heart-outline"} 
                size={22} 
                color={item.isFavorite ? "#FF4D4D" : "#000"} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.hotelFooter}>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name={star <= Math.floor(item.rating) ? "star" : "star-outline"}
                  size={14} 
                  color="#FFB800" 
                  style={styles.starIcon}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.availabilityButton}>
              <Text style={styles.availabilityText}>Lihat Detail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
          isSelected && styles.categoryItemActive
        ]}
        onPress={() => setSelectedCategory(category.name)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.categoryIconContainer,
          { backgroundColor: isSelected ? category.iconColor : '#E3F2FD' }
        ]}>
          <Ionicons 
            name={category.icon} 
            size={22} // Diperkecil dari 28
            color={isSelected ? '#FFF' : category.iconColor}
          />
        </View>
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
                {items.map(item => renderHotelCard(item, category))}
              </View>
            )
          ))}
        </ScrollView>

        {/* Floating Download Button */}
        <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
          <View style={styles.downloadButtonInner}>
            <Ionicons name="arrow-down-circle-outline" size={24} color="#000" />
          </View>
        </TouchableOpacity>
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
    marginRight: 32,
  },
  headerRight: {
    width: 32,
  },
  
  // Horizontal Category Scroll Styles
  categoryScrollContainer: {
    height: 110, // Diperkecil dari 230
    paddingVertical: 12,
    paddingLeft: 16,
    marginBottom: 8,
  },
  categoryScroll: {
    height: 110,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 12, // Spasi antara item
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minWidth: 80, // Lebar minimum untuk setiap item
    height: 86, // Tinggi tetap
  },
  categoryItemActive: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#0066FF',
  },
  categoryIconContainer: {
    width: 44, // Diperkecil dari 56
    height: 44, // Diperkecil dari 56
    borderRadius: 22, // Diperkecil dari 28
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6, // Diperkecil dari 8
  },
  categoryItemText: {
    fontSize: 10, // Diperkecil dari 11
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    maxWidth: 70, // Membatasi lebar teks
  },
  categoryItemTextActive: {
    color: '#0066FF',
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
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  hotelImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  hotelInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  tagContainer: {
    marginBottom: 4,
  },
  discountTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  hotelLocation: {
    fontSize: 11,
    color: '#666',
    lineHeight: 14,
  },
  favoriteButton: {
    padding: 4,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  availabilityButton: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  downloadButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Favorites;