import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable} from "react-native";

export default function ShowActivityScreen() {
    return (
        <SafeAreaView>
            <Text className="text-2xl text-teal-700 font-bold ">
                Show activity screen
            </Text>

        </SafeAreaView>
    );
}