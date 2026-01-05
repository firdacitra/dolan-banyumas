import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
	return (
		<ImageBackground
			source={require("../../assets/logo.png")} // ganti sesuai assets kamu
			style={styles.container}
		>
			<Text style={styles.appTitle}>Dolan Banyumas</Text>

			<View style={styles.card}>
				<Text style={styles.loginTitle}>LOGIN</Text>

				<View style={styles.input}>
					<TextInput placeholder="Username" style={styles.textInput} />
					<Ionicons name="person-outline" size={20} color="#555" />
				</View>

				<View style={styles.input}>
					<TextInput
						placeholder="Password"
						secureTextEntry
						style={styles.textInput}
					/>
					<Ionicons name="lock-closed-outline" size={20} color="#555" />
				</View>

				<Text style={styles.forgot}>Lupa Password ?</Text>

				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.replace("MainTab")}
				>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<Text style={styles.register}>
					Belum punya akun ? <Text style={styles.link}>daftar sini</Text>
				</Text>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
	},
	appTitle: {
		color: "#000",
		fontSize: 18,
		marginTop: 50,
	},
	card: {
		backgroundColor: "rgba(255,255,255,0.9)",
		borderRadius: 20,
		padding: 24,
		marginTop: "auto",
	},
	loginTitle: {
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
		marginBottom: 12,
	},
	textInput: {
		flex: 1,
		height: 48,
	},
	forgot: {
		color: "#1E88E5",
		fontSize: 12,
		marginBottom: 16,
	},
	button: {
		backgroundColor: "#6C8EE5",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	register: {
		textAlign: "center",
		marginTop: 14,
		fontSize: 12,
	},
	link: {
		color: "#1E88E5",
		fontWeight: "bold",
	},
});
