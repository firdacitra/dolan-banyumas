import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../../i18n/LanguageContext"; 
import { useTheme } from "../../../context/ThemeContext"; // TAMBAHKAN IMPORT INI

const EditProfile = ({ navigation, route }) => {
  const { t } = useLanguage(); // GUNAKAN useLanguage()
  const { theme } = useTheme(); // GANTI hardcoded theme dengan useTheme()

  // Ambil data dari ProfileScreen
  const { 
    currentImage = "https://via.placeholder.com/100",
    currentUsername = t('username'),
    currentPhone = "08123456789",
    currentEmail = "username@gmail.com"
  } = route.params || {};

  const [profileImage, setProfileImage] = useState(currentImage);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUsername,
    phoneNumber: currentPhone,
    email: currentEmail
  });

  // Minta permission saat komponen dimount (khusus mobile)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
          Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin kamera dan galeri untuk mengakses foto.');
        }
      })();
    }
  }, []);

  // Fungsi untuk mengambil foto dari kamera
  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        // Untuk web/laptop — buka kamera langsung via input capture
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'user'; // 'user' = kamera depan, 'environment' = belakang

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            setProfileImage(event.target.result);
            setShowImageOptions(false);
          };
          reader.readAsDataURL(file);
        };

        input.click();
      } else {
        // Untuk mobile — buka kamera native
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin kamera.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
          setShowImageOptions(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil foto');
    }
  };

  // Fungsi untuk memilih foto dari galeri
  const pickImage = async () => {
    try {
      let result;
      
      if (Platform.OS === 'web') {
        // Untuk web/laptop
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          
          reader.onload = (event) => {
            setProfileImage(event.target.result);
            setShowImageOptions(false);
          };
          
          reader.readAsDataURL(file);
        };
        
        input.click();
      } else {
        // Untuk mobile
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
          setShowImageOptions(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih foto');
    }
  };

  const handleSave = async () => {
		// Validasi
		if (!formData.username.trim()) {
			Alert.alert("Peringatan", "Nama pengguna tidak boleh kosong");
			return;
		}
		if (!formData.phoneNumber.trim()) {
			Alert.alert("Peringatan", "Nomor handphone tidak boleh kosong");
			return;
		}
		if (!formData.email.trim()) {
			Alert.alert("Peringatan", "Email tidak boleh kosong");
			return;
		}

		try {
			const username = await AsyncStorage.getItem("currentUser");

			const updatedProfile = {
				image: profileImage,
				username: formData.username,
				phone: formData.phoneNumber,
				email: formData.email,
			};

			// ✅ SIMPAN KE USER LOGIN
			if (username) {
				await AsyncStorage.setItem(
					`user_${username}_profile`,
					JSON.stringify(updatedProfile),
				);
			}

			// ✅ kirim ke ProfileScreen juga (biar langsung update)
			navigation.navigate("MainTab", {
				screen: "Profile",
				params: {
					updatedProfile: updatedProfile,
				},
			});
		} catch (error) {
			Alert.alert("Error", "Gagal menyimpan profile");
		}
	};

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
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {t('editProfile')}
          </Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={[styles.saveButtonText, { color: theme.primary }]}>{t('save')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Photo Section - TANPA ICON KAMERA */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowImageOptions(true)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.changePhotoText}
              onPress={() => setShowImageOptions(true)}
            >
              <Text style={[styles.changePhotoText, { color: theme.primary }]}>
                {t('changePhoto')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('username')}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                  placeholder="Masukkan nama pengguna"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            {/* Phone Number Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('phoneNumber')}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                  placeholder="Masukkan nomor handphone"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>
                {t('email')}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  placeholder="Masukkan email"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
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
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{t('choosePhoto')}</Text>
              <TouchableOpacity onPress={() => setShowImageOptions(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>{t('takePhoto')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={24} color={theme.primary} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>{t('chooseFromGallery')}</Text>
            </TouchableOpacity>

            {profileImage !== "https://via.placeholder.com/100" && (
              <TouchableOpacity 
                style={[styles.modalOption, styles.modalOptionDanger]}
                onPress={() => {
                  setProfileImage("https://via.placeholder.com/100");
                  setShowImageOptions(false);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>
                  {t('deletePhoto')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#fff',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
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

export default EditProfile;