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
import { LinearGradient } from "expo-linear-gradient";
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
							{t("accessibility")}
						</Text>
					</View>

					<View style={styles.content}>
						{/* Dark Mode Option */}
						<View
							style={[
								styles.settingItem,
								{
									backgroundColor: theme.card,
									borderWidth: isDarkMode ? 0.5 : 0,
									borderColor: theme.border,
									shadowColor: theme.cardShadow,
								},
							]}
						>
							<View style={styles.settingLeft}>
								<View
									style={[
										styles.iconContainer,
										{
											backgroundColor: isDarkMode ? "#334155" : "#F0F0F0",
										},
									]}
								>
									<Ionicons
										name={isDarkMode ? "moon" : "moon-outline"}
										size={22}
										color={isDarkMode ? "#FFB347" : theme.primary}
									/>
								</View>
								<View style={styles.settingInfo}>
									<Text style={[styles.settingTitle, { color: theme.text }]}>
										{t("darkMode")}
									</Text>
									<Text
										style={[
											styles.settingDescription,
											{ color: theme.textSecondary },
										]}
									>
										{isDarkMode ? t("darkModeEnabled") : t("darkModeDisabled")}
									</Text>
								</View>
							</View>
							<Switch
								value={isDarkMode}
								onValueChange={handleDarkModePress}
								trackColor={{ false: "#CBD5E1", true: theme.primary }}
								thumbColor="#FFFFFF"
								ios_backgroundColor="#CBD5E1"
							/>
						</View>

						{/* Additional Accessibility Options */}
						<View style={styles.infoSection}>
							<View
								style={[
									styles.infoCard,
									{
										backgroundColor: theme.card,
										borderWidth: isDarkMode ? 0.5 : 0,
										borderColor: theme.border,
									},
								]}
							>
								<Ionicons
									name="information-circle-outline"
									size={22}
									color={isDarkMode ? "#FFB347" : theme.primary}
								/>
								<Text style={[styles.infoText, { color: theme.textSecondary }]}>
									Mode gelap mengurangi ketegangan mata dan lebih nyaman
									digunakan di malam hari
								</Text>
							</View>
						</View>

						{/* Additional Settings Placeholder */}
						<View style={styles.placeholderSection}>
							<Text
								style={[
									styles.placeholderTitle,
									{ color: theme.textSecondary },
								]}
							>
								Pengaturan Lainnya
							</Text>
							<View
								style={[
									styles.placeholderCard,
									{
										backgroundColor: theme.card,
										borderWidth: isDarkMode ? 0.5 : 0,
										borderColor: theme.border,
									},
								]}
							>
								<Ionicons
									name="construct-outline"
									size={24}
									color={theme.textTertiary}
								/>
								<Text
									style={[
										styles.placeholderText,
										{ color: theme.textTertiary },
									]}
								>
									Fitur akan segera hadir
								</Text>
							</View>
						</View>
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
				<View
					style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
				>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: theme.card,
								borderWidth: isDarkMode ? 0.5 : 0,
								borderColor: theme.border,
							},
						]}
					>
						<View
							style={[
								styles.iconPlaceholder,
								{
									backgroundColor: isDarkMode ? "#334155" : "#F0F0F0",
								},
							]}
						>
							<Ionicons
								name={isDarkMode ? "sunny-outline" : "moon-outline"}
								size={48}
								color={isDarkMode ? "#FFB347" : theme.primary}
							/>
						</View>

						<Text style={[styles.modalTitle, { color: theme.text }]}>
							{isDarkMode ? "Nonaktifkan Mode Gelap?" : "Aktifkan Mode Gelap?"}
						</Text>

						<Text
							style={[styles.modalDescription, { color: theme.textSecondary }]}
						>
							{isDarkMode
								? "Tampilan akan berubah menjadi mode terang yang lebih cerah"
								: "Tampilan akan berubah menjadi mode gelap yang lebih nyaman di mata"}
						</Text>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.modalButton}
								onPress={confirmDarkMode}
							>
								<LinearGradient
									colors={[theme.primary, theme.primaryDark]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={styles.buttonGradient}
								>
									<Text style={styles.confirmButtonText}>Ya, Terapkan</Text>
								</LinearGradient>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.cancelButton,
									{
										borderColor: theme.border,
										backgroundColor: isDarkMode
											? "transparent"
											: theme.cancelButton,
									},
								]}
								onPress={cancelDarkMode}
							>
								<Text
									style={[
										styles.cancelButtonText,
										{ color: theme.textSecondary },
									]}
								>
									Batal
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
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 28,
	},
	backButton: {
		marginRight: 16,
		padding: 8,
		borderRadius: 12,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: "700",
		letterSpacing: -0.7,
	},
	content: {
		paddingHorizontal: 20,
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderRadius: 24,
		marginBottom: 20,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	settingLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	settingInfo: {
		marginLeft: 16,
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 4,
		letterSpacing: -0.3,
	},
	settingDescription: {
		fontSize: 13,
		lineHeight: 18,
		letterSpacing: -0.2,
	},
	infoSection: {
		marginBottom: 24,
	},
	infoCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 20,
		gap: 12,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.03,
		shadowRadius: 4,
		elevation: 1,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
		letterSpacing: -0.2,
	},
	placeholderSection: {
		marginTop: 8,
	},
	placeholderTitle: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 12,
		marginLeft: 4,
		letterSpacing: -0.3,
	},
	placeholderCard: {
		padding: 20,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.03,
		shadowRadius: 4,
		elevation: 1,
	},
	placeholderText: {
		fontSize: 14,
		fontWeight: "500",
		letterSpacing: -0.2,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	modalContent: {
		borderRadius: 32,
		padding: 24,
		width: "100%",
		maxWidth: 340,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 10,
	},
	iconPlaceholder: {
		width: 88,
		height: 88,
		borderRadius: 44,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 8,
		textAlign: "center",
		letterSpacing: -0.5,
	},
	modalDescription: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: "center",
		marginBottom: 28,
		paddingHorizontal: 12,
		letterSpacing: -0.2,
	},
	modalButtons: {
		width: "100%",
		gap: 12,
	},
	modalButton: {
		width: "100%",
		borderRadius: 16,
		overflow: "hidden",
	},
	buttonGradient: {
		paddingVertical: 14,
		alignItems: "center",
	},
	confirmButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: -0.3,
	},
	cancelButton: {
		borderWidth: 1,
		paddingVertical: 13,
		alignItems: "center",
		borderRadius: 16,
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: "600",
		letterSpacing: -0.3,
	},
});

export default Accessibility;
