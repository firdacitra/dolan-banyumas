// src/screen/MainTab/ProfileScreen/Language.js
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
import { useLanguage } from "../../../i18n/LanguageContext";
import { useTheme } from "../../../context/ThemeContext"; // TAMBAHKAN INI

const Language = ({ navigation }) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { theme } = useTheme(); // TAMBAHKAN INI

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    {
      code: 'id',
      name: 'Indonesia (ID)',
      flag: '🇮🇩',
      section: 'main',
    },
    {
      code: 'en',
      name: 'English (EN)',
      flag: '🇬🇧',
      section: 'other',
    },
  ];

  const handleLanguagePress = (langCode) => {
    if (langCode === currentLanguage) return;
    setSelectedLanguage(langCode);
    setShowConfirmation(true);
  };

  const confirmLanguageChange = () => {
    if (selectedLanguage) {
      changeLanguage(selectedLanguage);
      setShowConfirmation(false);
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    }
  };

  const mainLanguages = languages.filter(lang => lang.section === 'main');
  const otherLanguages = languages.filter(lang => lang.section === 'other');

  const selectedLang = languages.find(l => l.code === selectedLanguage);
  const confirmMessage = selectedLanguage === 'en'
    ? 'Are you sure you want to change the language to English?'
    : 'Anda yakin ingin mengganti bahasa menjadi Indonesia?';

  return (
    <LinearGradient
      colors={theme.gradientColors} // GANTI: ikut theme
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{t('chooseLanguage')}</Text>
          </View>

          <View style={styles.content}>
            {/* Bahasa Utama */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('mainLanguage')}</Text>
              {mainLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    { backgroundColor: theme.card, borderColor: 'transparent' },
                    currentLanguage === lang.code && [styles.languageItemActive, { borderColor: theme.primary, backgroundColor: theme.background }],
                  ]}
                  onPress={() => handleLanguagePress(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                    <Text style={[
                      styles.languageText,
                      { color: theme.text },
                      currentLanguage === lang.code && [styles.languageTextActive, { color: theme.primary }],
                    ]}>
                      {lang.name}
                    </Text>
                  </View>
                  {currentLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Bahasa Lainnya */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('otherLanguages')}</Text>
              {otherLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageItem,
                    { backgroundColor: theme.card, borderColor: 'transparent' },
                    currentLanguage === lang.code && [styles.languageItemActive, { borderColor: theme.primary, backgroundColor: theme.background }],
                  ]}
                  onPress={() => handleLanguagePress(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                    <Text style={[
                      styles.languageText,
                      { color: theme.text },
                      currentLanguage === lang.code && [styles.languageTextActive, { color: theme.primary }],
                    ]}>
                      {lang.name}
                    </Text>
                  </View>
                  {currentLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Info bahasa aktif */}
            <View style={[styles.activeInfo, { backgroundColor: theme.background }]}>
              <Ionicons name="globe-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.activeInfoText, { color: theme.textSecondary }]}>
                {t('mainLanguage')}: {languages.find(l => l.code === currentLanguage)?.flag}{' '}
                {languages.find(l => l.code === currentLanguage)?.name}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal Konfirmasi */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {/* Flag besar di modal */}
            <Text style={styles.modalFlag}>{selectedLang?.flag}</Text>

            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('confirmation')}</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{confirmMessage}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmLanguageChange}
              >
                <Text style={[styles.confirmButtonText, { color: theme.primary }]}>{t('ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
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
    color: "#000",
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
    color: "#555",
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  languageItemActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  languageText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "400",
  },
  languageTextActive: {
    fontWeight: '600',
  },
  activeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 4,
    gap: 6,
  },
  activeInfoText: {
    fontSize: 13,
    color: '#666',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: 'center',
  },
  modalFlag: {
    fontSize: 56,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#444",
    marginBottom: 24,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    width: '100%',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "400",
  },
  confirmButtonText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default Language;