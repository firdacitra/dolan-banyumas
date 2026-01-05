import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screen/MainTab/HomeScreen";
import LoginScreen from "../screen/LoginScreen";
import ProfileScreen from "../screen/MainTab/ProfileScreen";
import SearchScreen from "../screen/MainTab/SearchScreen";
import SplashScreen from "../screen/SplashScreen";
import MainTab from "../screen/MainTab";
import MenuList from "../screen/MenuListScreen"
import Detail from "../screen/Detail"


const Stack = createNativeStackNavigator();

export default function RootNavigation() {
	return (
		<Stack.Navigator
			initialRouteName="Splash"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Splash" component={SplashScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Search" component={SearchScreen} />
			<Stack.Screen name="MainTab" component={MainTab} />
			<Stack.Screen name="MenuList" component={MenuList} />
			<Stack.Screen name="Detail" component={Detail} />
		</Stack.Navigator>
	);
}
