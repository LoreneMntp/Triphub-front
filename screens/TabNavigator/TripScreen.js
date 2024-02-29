import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable} from "react-native";

export default function TripScreen({ navigation}) {
    return (
        <SafeAreaView>
            <Text className="text-2xl text-teal-700 font-bold ">
                Trip Screen
            </Text>

        </SafeAreaView>
    );
}