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

const Accessibility = ({ navigation }) => {
  // Mock i18n function untuk terjemahan
  const i18n = {
    t: (key) => {
      const translations = {
        'accessibility': 'Aksesibilitas',
        'darkMode': 'Mode gelap',
        'darkModeDesc': 'Tampilan yang lebih nyaman untuk mata',
        'enableDarkMode': 'Mode gelap',
        'yes': 'Ya mau',
        'no': 'Gak dulu'
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
		modalOverlay: "rgba(0, 0, 0, 0.5)",
		cancelButton: "#f0f0f0",
		cancelButtonText: "#666",
		buttonText: "#fff",
	};

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDarkModeModal, setShowDarkModeModal] = useState(false);

  const handleDarkModePress = () => {
    setShowDarkModeModal(true);
  };

  const confirmDarkMode = () => {
    setIsDarkMode(true);
    setShowDarkModeModal(false);
  };

  const cancelDarkMode = () => {
    setShowDarkModeModal(false);
  };

  return (
    <LinearGradient
      colors={theme.gradientColors}
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
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {i18n.t('accessibility')}
            </Text>
          </View>

          <View style={styles.content}>
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: theme.card }]}
              onPress={handleDarkModePress}
            >
              <View style={styles.settingLeft}>
                <Ionicons 
                  name="moon-outline" 
                  size={20} 
                  color={theme.text} 
                />
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    {i18n.t('darkMode')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    {i18n.t('darkModeDesc')}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Dark Mode Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDarkModeModal}
        onRequestClose={() => setShowDarkModeModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {/* Placeholder for icon/image */}
            <View style={styles.iconPlaceholder}>
              <Ionicons name="moon" size={48} color="#999" />
            </View>
            
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {i18n.t('enableDarkMode')}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDarkMode}
              >
                <LinearGradient
                  colors={['#B3E5FC', '#81D4FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.confirmButtonText, { color: theme.text }]}>
                    {i18n.t('yes')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDarkMode}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                  {i18n.t('no')}
                </Text>
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
    fontWeight: "600" 
  },
  content: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: { 
    width: '100%',
    gap: 10,
  },
  modalButton: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButton: {
    marginBottom: 0,
  },
  confirmButtonText: { 
    fontSize: 15, 
    fontWeight: "600" 
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelButtonText: { 
    fontSize: 15, 
    fontWeight: "500" 
  },
});

export default Accessibility;