import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen({ navigation }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.replace("MainTab");
		}, 2200);

		return () => clearTimeout(timer);
	}, [navigation]);

	return (
		<LinearGradient
			colors={["#0F2027", "#203A43", "#2C5364"]}
			style={styles.container}
		>
			<Image source={require("../../assets/logo.png")} style={styles.logo} />

			<Text style={styles.title}>Dolan Banyumas</Text>
			<Text style={styles.subtitle}>Explore • Culture • Nature</Text>

			<ActivityIndicator size="large" color="#fff" style={styles.loader} />
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	logo: {
		width: 120,
		height: 120,
		marginBottom: 24,
	},

	title: {
		fontSize: 30,
		fontWeight: "700",
		color: "#fff",
	},

	subtitle: {
		fontSize: 14,
		color: "#E0E0E0",
		marginTop: 6,
	},

	loader: {
		marginTop: 40,
	},
});
