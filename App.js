import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Plane } from "lucide-react-native";
export default function App() {
    return (
        <View style={styles.container}>
            <Text className="text-2xl text-teal-700 font-bold ">
                Welcome to Triphub project ! 🚀
            </Text>
            <Plane size={24} color="#000" />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
