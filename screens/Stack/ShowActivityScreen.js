import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable} from "react-native";
import { useSelector } from 'react-redux';

export default function ShowActivityScreen() {
    const activity = useSelector((state) => state.user.value.selectedActivity)
    console.log(activity)
    
    return (
        <SafeAreaView>
            <Text className="text-2xl text-teal-700 font-bold ">
                Show activity screen
            </Text>

        </SafeAreaView>
    );
}