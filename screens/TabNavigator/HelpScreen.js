import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text} from "react-native";

export default function HelpScreen() {
    return (
        <SafeAreaView>
            <Text className="text-2xl text-teal-700 font-bold ">
                Help Screen
            </Text>
        </SafeAreaView>
    );
}