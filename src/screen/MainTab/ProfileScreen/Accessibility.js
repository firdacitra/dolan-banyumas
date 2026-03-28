import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

const Accessibility = ({ navigation }) => {
  const { t } = useLanguage();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const [showDarkModeModal, setShowDarkModeModal] = useState(false);

  const handleDarkModePress = () => {
    setShowDarkModeModal(true);
  };

  const confirmDarkMode = () => {
    toggleTheme();
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
              {t('accessibility')}
            </Text>
          </View>

          <View style={styles.content}>
            {/* Dark Mode Option */}
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: theme.card }]}
              onPress={handleDarkModePress}
            >
              <View style={styles.settingLeft}>
                <Ionicons 
                  name={isDarkMode ? "moon" : "moon-outline"} 
                  size={20} 
                  color={theme.text} 
                />
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    {t('darkMode')}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    {isDarkMode ? t('darkModeEnabled') : t('darkModeDisabled')}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleDarkModePress}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor={isDarkMode ? "#f4f3f4" : "#f4f3f4"}
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
            <View style={[styles.iconPlaceholder, { backgroundColor: theme.background }]}>
              <Ionicons name="moon" size={48} color={theme.textSecondary} />
            </View>
            
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {isDarkMode ? t('disableDarkMode') : t('enableDarkMode')}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDarkMode}
              >
                <LinearGradient
                  colors={theme.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.confirmButtonText, { color: theme.text }]}>
                    {t('yes')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.cancelButton,
                  { borderColor: theme.border }
                ]}
                onPress={cancelDarkMode}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                  {t('no')}
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
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelButtonText: { 
    fontSize: 15, 
    fontWeight: "500" 
  },
});

export default Accessibility;