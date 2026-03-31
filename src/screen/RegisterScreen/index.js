import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
	Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleRegister = async () => {
		if (username === "" || password === "") {
			Alert.alert("Error", "Isi semua field");
			return;
		}

		if (password !== confirm) {
			Alert.alert("Error", "Password tidak sama");
			return;
		}

		const user = {
			username,
			password,
		};

		await AsyncStorage.setItem("user", JSON.stringify(user));

		Alert.alert("Berhasil", "Akun berhasil dibuat");

		navigation.navigate("Login");
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ImageBackground
					source={require("../../assets/logo.png")}
					style={styles.container}
				>
					<Text style={styles.appTitle}>Dolan Banyumas</Text>

					<View style={styles.card}>
						<Text style={styles.title}>REGISTER</Text>

						<View style={styles.input}>
							<Ionicons name="person-outline" size={20} color="#555" />

							<TextInput
								placeholder="Username"
								style={styles.textInput}
								onChangeText={setUsername}
							/>
						</View>

						<View style={styles.input}>
							<Ionicons name="lock-closed-outline" size={20} color="#555" />

							<TextInput
								placeholder="Password"
								secureTextEntry={!showPassword}
								style={styles.textInput}
								onChangeText={setPassword}
							/>

							<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
								<Ionicons
									name={showPassword ? "eye-outline" : "eye-off-outline"}
									size={20}
									color="#555"
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.input}>
							<Ionicons name="lock-closed-outline" size={20} color="#555" />

							<TextInput
								placeholder="Confirm Password"
								secureTextEntry={!showConfirm}
								style={styles.textInput}
								onChangeText={setConfirm}
							/>

							<TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
								<Ionicons
									name={showConfirm ? "eye-outline" : "eye-off-outline"}
									size={20}
									color="#555"
								/>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.button} onPress={handleRegister}>
							<Text style={styles.buttonText}>Register</Text>
						</TouchableOpacity>

						<View style={styles.row}>
							<Text>Sudah punya akun ?</Text>

							<TouchableOpacity onPress={() => navigation.navigate("Login")}>
								<Text style={styles.link}>login</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: "flex-end",
	},

	appTitle: {
		fontSize: 18,
		marginTop: 50,
		marginBottom: 20,
		color: "#333",
		fontWeight: "bold",
		textAlign: "center",
	},

	card: {
		backgroundColor: "rgba(255,255,255,0.95)",
		borderRadius: 20,
		padding: 24,
	},

	title: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},

	input: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingHorizontal: 16,
		marginBottom: 15,
		elevation: 3,
	},

	textInput: {
		flex: 1,
		height: 48,
		marginLeft: 10,
	},

	button: {
		backgroundColor: "#2196F3",
		padding: 15,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 10,
	},

	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},

	row: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},

	link: {
		color: "#1E88E5",
		fontWeight: "bold",
	},
});
