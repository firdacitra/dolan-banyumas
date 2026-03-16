import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "./app";
import { FavoritesProvider } from "../context/FavoriteContext";
import LoginScreen from "../screen/LoginScreen";
import RegisterScreen from "../screen/RegisterScreen";
import SplashScreen from "../screen/SplashScreen";
import LastSeen from "../screen/MainTab/ProfileScreen/LastSeen";
import Favorites from "../screen/MainTab/ProfileScreen/Favorites";
import Language from "../screen/MainTab/ProfileScreen/Language";
import Accessibility from "../screen/MainTab/ProfileScreen/Accessibility";
import Rating from "../screen/MainTab/ProfileScreen/Rating";
import Account from "../screen/MainTab/ProfileScreen/Account";
import EditProfile from "../screen/MainTab/ProfileScreen/EditProfile";
import MenuList from "../screen/MenuListScreen";
import Detail from "../screen/Detail";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
	return (
		<FavoritesProvider>
			{" "}
			<Stack.Navigator
				initialRouteName="Splash"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="Splash" component={SplashScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />

				{/* Main Tab = home screen */}
				<Stack.Screen name="MainTab" component={AppNavigator} />

				{/* Profile stack screen */}
				<Stack.Screen name="LastSeen" component={LastSeen} />
				<Stack.Screen name="Favorites" component={Favorites} />
				<Stack.Screen name="Language" component={Language} />
				<Stack.Screen name="Accessibility" component={Accessibility} />
				<Stack.Screen name="Rating" component={Rating} />
				<Stack.Screen name="Account" component={Account} />
				<Stack.Screen name="EditProfile" component={EditProfile} />

				<Stack.Screen name="MenuList" component={MenuList} />
				<Stack.Screen name="Detail" component={Detail} />
			</Stack.Navigator>
		</FavoritesProvider>
	);
}