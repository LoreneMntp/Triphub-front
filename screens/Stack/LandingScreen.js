import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, Pressable, ScrollView } from "react-native";

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView className="flex flex-col items-center justify-center gap-2">
      <Text className="text-2xl text-teal-700 font-bold ">
        Welcome to Triphub project ! 🚀
      </Text>
      <ScrollView>
        <View className="flex flex-col items-center justify-center gap-2">
          <Text className="text-lg font-medium">Stack screens</Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            
            <Text className="text-xl text-white font-bold ">Login</Text>
            </Pressable>
            <Pressable
            onPress={() => navigation.navigate("Map")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Map</Text>
            </Pressable>
          
          <Pressable
            onPress={() => navigation.navigate("LandingFinal")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">
              LandingFinalScreen
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Register</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Home</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("AddActivity")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Add Activity</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("CreateTrip")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Create Trip</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("ViewDocuments")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">
              View Documents
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("ShowActivity")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">ShowActivity</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Settings")}
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Settings</Text>
          </Pressable>
          <Text className="text-lg font-medium">Tab screens</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("TabNavigator", { screen: "Trip" })
            }
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Trip</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("TabNavigator", { screen: "Docs" })
            }
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Docs</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("TabNavigator", { screen: "Help" })
            }
            className="bg-[#F2A65A] px-6 py-2 rounded-2xl"
          >
            <Text className="text-xl text-white font-bold ">Help</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
