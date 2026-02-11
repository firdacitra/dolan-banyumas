import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  // Mock i18n function untuk terjemahan
  const i18n = {
    t: (key) => {
      const translations = {
        'lastSeen': 'Terakhir Dilihat',
        'myFavorites': 'Favorit Saya',
        'language': 'Bahasa',
        'accessibility': 'Aksesibilitas',
        'rating': 'Penilaian',
        'account': 'Akun',
        'activity': 'Aktivitas',
        'appSettings': 'Pengaturan Aplikasi',
        'others': 'Lainnya',
        'username': 'Username',
        'editProfile': 'Edit Profil',
        'changePhoto': 'Ubah Foto Profil',
        'takePhoto': 'Ambil Foto',
        'chooseFromGallery': 'Pilih dari Galeri',
        'deletePhoto': 'Hapus Foto'
      };
      return translations[key] || key;
    }
  };

  // Default theme (light theme)
  const theme = {
    gradientColors: ['#FFFFFF', '#F0F8FF', '#E6F2FF'],
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#007AFF'
  };

  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/70");
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Fungsi untuk meminta permission
  const requestPermission = async (type) => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Maaf, kami memerlukan izin kamera!');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Maaf, kami memerlukan izin akses galeri!');
        return false;
      }
    }
    return true;
  };

  // Fungsi untuk mengambil foto dari kamera
  const takePhoto = async () => {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;

    setShowImageOptions(false);
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Fungsi untuk memilih foto dari galeri
  const pickImage = async () => {
    const hasPermission = await requestPermission('gallery');
    if (!hasPermission) return;

    setShowImageOptions(false);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const menuItems = [
    { 
      id: 1, 
      title: i18n.t('lastSeen'), 
      icon: "time-outline",
      section: i18n.t('activity'),
      onPress: () => navigation.navigate('LastSeen')
    },
    { 
      id: 2, 
      title: i18n.t('myFavorites'), 
      icon: "heart-outline",
      section: i18n.t('activity'),
      onPress: () => navigation.navigate('Favorites')
    },
    { 
      id: 3, 
      title: i18n.t('language'), 
      icon: "globe-outline",
      section: i18n.t('appSettings'),
      // ✅ DIPERBAIKI: Sekarang navigate ke halaman Language
      onPress: () => {
        if (navigation && navigation.navigate) {
          navigation.navigate('Language');
        } else {
          console.log('Navigation not available');
        }
      }
    },
    { 
      id: 4, 
      title: i18n.t('accessibility'), 
      icon: "accessibility-outline",
      section: i18n.t('appSettings'),
      // ✅ DIPERBAIKI: Sekarang navigate ke halaman Accessibility
      onPress: () => {
        if (navigation && navigation.navigate) {
          navigation.navigate('Accessibility');
        } else {
          console.log('Navigation not available');
        }
      }
    },
    { 
      id: 5, 
      title: i18n.t('rating'), 
      icon: "star-outline",
      section: i18n.t('others'),
      onPress: () => navigation.navigate('Rating')
    },
    { 
      id: 6, 
      title: i18n.t('account'), 
      icon: "person-outline",
      section: i18n.t('others'),
      onPress: () => navigation.navigate('Account')
    },
  ];

  const renderMenuSection = (sectionTitle, items) => {
    if (items.length === 0) return null;
    
    return (
      <View key={sectionTitle} style={styles.sectionWrapper}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{sectionTitle}</Text>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={20} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.text} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const aktivitasItems = menuItems.filter(item => item.section === i18n.t('activity'));
  const pengaturanItems = menuItems.filter(item => item.section === i18n.t('appSettings'));
  const lainnyaItems = menuItems.filter(item => item.section === i18n.t('others'));

  return (
    <LinearGradient
      colors={theme.gradientColors}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <View style={styles.profileContent}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={() => setShowImageOptions(true)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: profileImage }}
                  style={styles.avatar}
                />
                <View style={styles.cameraIconOverlay}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={[styles.username, { color: theme.text }]}>{i18n.t('username')}</Text>
                <Text style={[styles.phone, { color: theme.textSecondary }]}>08123456789</Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>username@gmail.com</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.editProfileButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowImageOptions(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.editProfileText}>{i18n.t('editProfile')}</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            {renderMenuSection(i18n.t('activity'), aktivitasItems)}
            {renderMenuSection(i18n.t('appSettings'), pengaturanItems)}
            {renderMenuSection(i18n.t('others'), lainnyaItems)}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal untuk pilihan foto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageOptions}
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{i18n.t('changePhoto')}</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>{i18n.t('takePhoto')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>{i18n.t('chooseFromGallery')}</Text>
            </TouchableOpacity>

            {profileImage !== "https://via.placeholder.com/70" && (
              <TouchableOpacity 
                style={[styles.modalOption, styles.modalOptionDanger]}
                onPress={() => {
                  setProfileImage("https://via.placeholder.com/70");
                  setShowImageOptions(false);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>
                  {i18n.t('deletePhoto')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#5BA3D0",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e0e0e0",
  },
  cameraIconOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  phone: {
    fontSize: 12,
    marginBottom: 1,
  },
  email: {
    fontSize: 11,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  editProfileText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sectionWrapper: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    marginLeft: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  modalOptionDanger: {
    borderBottomWidth: 0,
  },
  modalOptionTextDanger: {
    color: "#FF3B30",
  },
});

export default ProfileScreen;