import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text} from "react-native";

export default function DocumentsScreen() {
    return (
        <SafeAreaView>
            <Text className="text-2xl text-teal-700 font-bold ">
               Docs Screen
            </Text>
        </SafeAreaView>
    );
}