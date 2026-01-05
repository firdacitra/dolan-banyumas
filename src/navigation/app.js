import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screen/MainTab/HomeScreen";
import SearchScreen from "../screen/MainTab/SearchScreen";
import ProfileScreen from "../screen/MainTab/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: "#2B7FFF",
				tabBarIcon: ({ color, size }) => {
					let icon;
					if (route.name === "Home") icon = "home";
					if (route.name === "Search") icon = "search";
					if (route.name === "Profile") icon = "person";
					return <Ionicons name={icon} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Search" component={SearchScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}
