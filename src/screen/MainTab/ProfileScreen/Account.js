import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";

const Account = ({ navigation }) => {
  // Mock i18n function untuk terjemahan
  const i18n = {
    t: (key) => {
      const translations = {
        'account': 'Akun',
        'logout': 'Keluar',
        'deleteAccount': 'Hapus Akun',
        'logoutConfirmation': 'Konfirmasi Keluar',
        'deleteAccountConfirmation': 'Konfirmasi Hapus Akun',
        'logoutConfirm': 'Apakah Anda yakin ingin keluar?',
        'deleteAccountConfirm': 'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.',
        'no': 'Tidak',
        'yes': 'Ya',
        'ok': 'OK'
      };
      return translations[key] || key;
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Simulasi logout
    Alert.alert(
      i18n.t('logoutConfirmation'),
      i18n.t('logout'),
      [{ text: i18n.t('ok'), onPress: () => navigation.goBack() }]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // Simulasi hapus akun
    Alert.alert(
      i18n.t('deleteAccountConfirmation'),
      i18n.t('deleteAccount'),
      [{ text: i18n.t('ok'), onPress: () => navigation.goBack() }]
    );
  };

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
            <Text style={styles.headerTitle}>{i18n.t('account')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('account')}</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={[styles.menuText, { color: '#FF3B30' }]}>
                  {i18n.t('logout')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FF3B30" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowDeleteModal(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                <Text style={[styles.menuText, { color: '#FF3B30' }]}>
                  {i18n.t('deleteAccount')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modal Logout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('logoutConfirmation')}</Text>
            <Text style={styles.modalMessage}>
              {i18n.t('logoutConfirm')}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>{i18n.t('no')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>{i18n.t('yes')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Delete Account */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('deleteAccountConfirmation')}</Text>
            <Text style={styles.modalMessage}>
              {i18n.t('deleteAccountConfirm')}
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>{i18n.t('no')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.confirmButtonText}>{i18n.t('yes')}</Text>
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
    paddingBottom: 16,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    marginLeft: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
    color: "#000",
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
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 12 },
  modalMessage: { fontSize: 15, color: "#333", marginBottom: 24, lineHeight: 22 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: { 
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: { fontSize: 15, color: "#666", fontWeight: "500" },
  confirmButton: { 
    backgroundColor: "#FF3B30",
  },
  confirmButtonText: { fontSize: 15, color: "#fff", fontWeight: "600" },
});

export default Account;