import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { useFavorites } from "../../../context/FavoriteContext";

const Account = ({ navigation }) => {
	const { t } = useLanguage();
	const { theme } = useTheme();
	const { clearFavoritesState } = useFavorites();

	const [isLogin, setIsLogin] = useState(false);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// 🔥 cek login
	useEffect(() => {
		checkLogin();

		const unsubscribe = navigation.addListener("focus", checkLogin);
		return unsubscribe;
	}, [navigation]);

	const checkLogin = async () => {
		const status = await AsyncStorage.getItem("isLogin");
		setIsLogin(status === "true");
	};

	// ================= LOGOUT =================
	const handleLogout = async () => {
		setShowLogoutModal(false);

		try {
			const username = await AsyncStorage.getItem("currentUser");

			if (username) {
				// ❌ hapus data profile user
				await AsyncStorage.removeItem(`user_${username}_profile`);
			}

			// ❌ hapus status login & user
			await AsyncStorage.removeItem("currentUser");
			await AsyncStorage.removeItem("isLogin");

			clearFavoritesState();

			// ✅ cukup balik ke screen sebelumnya / bebas
			navigation.replace("MainTab"); // atau Home
		} catch (error) {
			console.log("Logout error:", error);
		}
	};
	// ================= DELETE =================
	const handleDeleteAccount = async () => {
		setShowDeleteModal(false);

		const user = await AsyncStorage.getItem("user");

		if (user) {
			const parsed = JSON.parse(user);
			await AsyncStorage.removeItem(`favorites_${parsed.username}`);
		}

		await AsyncStorage.multiRemove(["user", "isLogin"]);

		clearFavoritesState();

		navigation.replace("Login");
	};

	return (
		<LinearGradient colors={theme.gradientColors} style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* HEADER */}
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Ionicons name="arrow-back" size={24} color={theme.text} />
						</TouchableOpacity>

						<Text style={[styles.headerTitle, { color: theme.text }]}>
							{t("account")}
						</Text>
					</View>

					{/* ================= BELUM LOGIN ================= */}
					{!isLogin ? (
						<View style={styles.notLoginContainer}>
							<Ionicons
								name="person-circle-outline"
								size={80}
								color={theme.textSecondary}
							/>

							<Text style={[styles.notLoginTitle, { color: theme.text }]}>
								Kamu belum login
							</Text>

							<Text
								style={[styles.notLoginDesc, { color: theme.textSecondary }]}
							>
								Login untuk menyimpan favorit dan data kamu
							</Text>

							<TouchableOpacity
								style={[styles.loginButton, { backgroundColor: theme.primary }]}
								onPress={() => navigation.navigate("Login")}
							>
								<Text style={styles.loginButtonText}>Login Sekarang</Text>
							</TouchableOpacity>
						</View>
					) : (
						/* ================= SUDAH LOGIN ================= */
						<View style={styles.section}>
							<Text style={[styles.sectionTitle, { color: theme.text }]}>
								{t("account")}
							</Text>

							{/* LOGOUT */}
							<TouchableOpacity
								style={[styles.menuItem, { backgroundColor: theme.card }]}
								onPress={() => setShowLogoutModal(true)}
							>
								<View style={styles.menuLeft}>
									<Ionicons name="log-out-outline" size={20} color="#FF3B30" />
									<Text style={[styles.menuText, { color: "#FF3B30" }]}>
										{t("logout")}
									</Text>
								</View>
								<Ionicons name="chevron-forward" size={18} color="#FF3B30" />
							</TouchableOpacity>

							{/* DELETE */}
							<TouchableOpacity
								style={[styles.menuItem, { backgroundColor: theme.card }]}
								onPress={() => setShowDeleteModal(true)}
							>
								<View style={styles.menuLeft}>
									<Ionicons name="trash-outline" size={20} color="#FF3B30" />
									<Text style={[styles.menuText, { color: "#FF3B30" }]}>
										{t("deleteAccount")}
									</Text>
								</View>
								<Ionicons name="chevron-forward" size={18} color="#FF3B30" />
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>
			</SafeAreaView>

			{/* MODAL LOGOUT */}
			<Modal transparent visible={showLogoutModal}>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent, { backgroundColor: theme.card }]}>
						<Text style={[styles.modalTitle, { color: theme.text }]}>
							{t("logoutConfirmation")}
						</Text>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setShowLogoutModal(false)}
							>
								<Text>{t("no")}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.modalButton, styles.confirmButton]}
								onPress={handleLogout}
							>
								<Text style={{ color: "#fff" }}>{t("yes")}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* MODAL DELETE */}
			<Modal transparent visible={showDeleteModal}>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent, { backgroundColor: theme.card }]}>
						<Text style={[styles.modalTitle, { color: theme.text }]}>
							{t("deleteAccountConfirmation")}
						</Text>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={() => setShowDeleteModal(false)}
							>
								<Text>{t("no")}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.modalButton, styles.confirmButton]}
								onPress={handleDeleteAccount}
							>
								<Text style={{ color: "#fff" }}>{t("yes")}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</LinearGradient>
	);
};

export default Account;

const styles = StyleSheet.create({
	container: { flex: 1 },
	safeArea: { flex: 1 },

	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
	},

	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		marginLeft: 10,
	},

	section: {
		paddingHorizontal: 16,
		marginTop: 16,
	},

	sectionTitle: {
		fontSize: 15,
		fontWeight: "600",
		marginBottom: 10,
	},

	menuItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 14,
		borderRadius: 10,
		marginBottom: 10,
	},

	menuLeft: {
		flexDirection: "row",
		alignItems: "center",
	},

	menuText: {
		marginLeft: 10,
	},

	// 🔥 NOT LOGIN UI
	notLoginContainer: {
		alignItems: "center",
		marginTop: 80,
		paddingHorizontal: 30,
	},

	notLoginTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
	},

	notLoginDesc: {
		fontSize: 13,
		textAlign: "center",
		marginVertical: 10,
	},

	loginButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		marginTop: 10,
	},

	loginButtonText: {
		color: "#fff",
		fontWeight: "600",
	},

	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
	},

	modalContent: {
		padding: 20,
		borderRadius: 12,
		width: "80%",
	},

	modalTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20,
	},

	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	modalButton: {
		padding: 10,
		flex: 1,
		alignItems: "center",
	},

	confirmButton: {
		backgroundColor: "#FF3B30",
		borderRadius: 8,
	},
});
