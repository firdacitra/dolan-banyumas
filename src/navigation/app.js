// src/navigation/app.js
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; // TAMBAHKAN INI

// Import screen components
import HomeScreen from "../screen/MainTab/HomeScreen/index";
import SearchScreen from "../screen/MainTab/SearchScreen/index";
import ProfileScreen from "../screen/MainTab/ProfileScreen/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme } = useTheme(); // TAMBAHKAN INI

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,       // GANTI: ikut theme
        tabBarInactiveTintColor: theme.icon,         // TAMBAHKAN INI
        tabBarStyle: {                               // TAMBAHKAN INI
          backgroundColor: theme.header,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}