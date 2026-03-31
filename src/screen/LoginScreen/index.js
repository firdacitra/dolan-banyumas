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

export default function LoginScreen({ navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async () => {
		const user = await AsyncStorage.getItem("user");

		if (!user) {
			Alert.alert("Error", "Belum ada akun");
			return;
		}

		const data = JSON.parse(user);

		if (username === data.username && password === data.password) {
			// ✅ set login
			await AsyncStorage.setItem("isLogin", "true");
			await AsyncStorage.setItem("currentUser", data.username);

			// ✅ ambil data user
			const favorites = await AsyncStorage.getItem(
				`user_${data.username}_favorites`,
			);
			const history = await AsyncStorage.getItem(
				`user_${data.username}_history`,
			);

			// ✅ masukin ke session
			await AsyncStorage.setItem("favorites", favorites || JSON.stringify([]));
			await AsyncStorage.setItem("history", history || JSON.stringify([]));

			navigation.replace("MainTab");
		} else {
			Alert.alert("Error", "Username atau password salah");
		}
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
						<Text style={styles.title}>LOGIN</Text>

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

						<TouchableOpacity style={styles.button} onPress={handleLogin}>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>
						<View style={styles.row}>
							<Text>Belum punya akun? </Text>

							<TouchableOpacity onPress={() => navigation.navigate("Register")}>
								<Text style={styles.link}>Register</Text>
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
		marginBottom: 30,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		color: "#333",
	},
	input: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingHorizontal: 16,
		marginBottom: 15,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	textInput: {
		flex: 1,
		height: 48,
		marginLeft: 10,
		color: "#333",
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
		fontSize: 16,
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
	},
	link: {
		color: "#2196F3",
		fontWeight: "bold",
	},
});
