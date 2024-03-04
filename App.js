//import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";


// Import all the stacks screens
import LandingScreen from "./screens/Stack/LandingScreen";
import LoginScreen from "./screens/Stack/LoginScreen";
import RegisterScreen from "./screens/Stack/RegisterScreen";
import SettingsScreen from "./screens/Stack/SettingsScreen";
import AddActivityScreen from "./screens/Stack/AddActivityScreen";
import CreateTripScreen from "./screens/Stack/CreateTripScreen";
import ViewDocumentsScreen from "./screens/Stack/ViewDocumentsScreen";
import ShowActivityScreen from "./screens/Stack/ShowActivityScreen";
import HomeScreen from "./screens/Stack/HomeScreen";
// Import bottom tab navigator screens
import TripScreen from "./screens/TabNavigator/TripScreen";
import HelpScreen from "./screens/TabNavigator/HelpScreen";
import DocumentsScreen from "./screens/TabNavigator/DocumentsScreen";

//Import icons
import { FileText, Plane, LifeBuoy } from "lucide-react-native";

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size, focused }) => {
                if(route.name === 'Trip') {
                    return <Plane stroke={color} size={size} />
                }
                if(route.name === 'Docs') {
                    return <FileText stroke={color}  size={size} />
                }
                if(route.name === 'Help') {
                    return <LifeBuoy stroke={color}  size={size} />
                }
            },
            tabBarActiveTintColor: '#F58549',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}>
            <Tab.Screen name="Trip" component={TripScreen} />
            <Tab.Screen name="Docs" component={DocumentsScreen} />
            <Tab.Screen name="Help" component={HelpScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false}}>
                <Stack.Screen name="Landing" component={LandingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Home" component={HomeScreen}
                <Stack.Screen name="AddActivity" component={AddActivityScreen} />
                <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
                <Stack.Screen name="ViewDocuments" component={ViewDocumentsScreen} />
                <Stack.Screen name="ShowActivity" component={ShowActivityScreen} />
                <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}