import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";

const Language = ({ navigation }) => {
  // Mock i18n function untuk terjemahan
  const i18n = {
    t: (key) => {
      const translations = {
        'chooseLanguage': 'Pilihan Bahasa',
        'mainLanguage': 'Bahasa Utama',
        'otherLanguages': 'Bahasa Lainnya',
        'indonesian': 'Indonesia',
        'english': 'English',
        'confirmation': 'Konfirmasi',
        'changeLanguageConfirm': 'Anda yakin ingin mengganti aturan bahasa menjadi English?',
        'cancel': 'Batal',
        'ok': 'Oke'
      };
      return translations[key] || key;
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState('id');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    { code: 'id', name: 'Indonesia (ID)', section: 'main' },
    { code: 'en', name: 'English (EN)', section: 'other' },
  ];

  const handleLanguagePress = (langCode) => {
    if (langCode === currentLanguage) return;
    
    setSelectedLanguage(langCode);
    setShowConfirmation(true);
  };

  const confirmLanguageChange = () => {
    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage);
      setShowConfirmation(false);
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const mainLanguages = languages.filter(lang => lang.section === 'main');
  const otherLanguages = languages.filter(lang => lang.section === 'other');

  return (
    <LinearGradient
      colors={['#C5E3F6', '#E5F2FA', '#FFFFFF']}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{i18n.t('chooseLanguage')}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t('mainLanguage')}</Text>
              {mainLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageItem}
                  onPress={() => handleLanguagePress(lang.code)}
                >
                  <Text style={styles.languageText}>{lang.name}</Text>
                  {currentLanguage === lang.code && (
                    <Ionicons name="checkmark" size={24} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t('otherLanguages')}</Text>
              {otherLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageItem}
                  onPress={() => handleLanguagePress(lang.code)}
                >
                  <Text style={styles.languageText}>{lang.name}</Text>
                  {currentLanguage === lang.code && (
                    <Ionicons name="checkmark" size={24} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('confirmation')}</Text>
            <Text style={styles.modalMessage}>
              {i18n.t('changeLanguageConfirm')}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>{i18n.t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={confirmLanguageChange}
              >
                <Text style={styles.confirmButtonText}>{i18n.t('ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
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
    color: "#000" 
  },
  content: {
    paddingHorizontal: 16,
  },
  section: { 
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  languageText: { 
    fontSize: 15, 
    color: "#000",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 340,
  },
  modalTitle: { 
    fontSize: 17, 
    fontWeight: "600", 
    color: "#000", 
    marginBottom: 10,
  },
  modalMessage: { 
    fontSize: 14, 
    color: "#000", 
    marginBottom: 24, 
    lineHeight: 20,
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "flex-end",
    gap: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: { 
    fontSize: 15, 
    color: "#000", 
    fontWeight: "400" 
  },
  confirmButtonText: { 
    fontSize: 15, 
    color: "#007AFF", 
    fontWeight: "500" 
  },
});

export default Language;