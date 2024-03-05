import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable} from "react-native";
import { useRoute } from '@react-navigation/native';

export default function TripScreen({ navigation, route}) {

    //console.log(route)
    if (!route.params) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center'>
                <Text>No params provided</Text>
            </SafeAreaView>
        )
    }
    const dataParsed = JSON.parse(route.params.stringifiedData)
    //console.log(dataParsed)

    return (
        <SafeAreaView className='flex-1 items-center'>
            <Text>{dataParsed.title}</Text>
        </SafeAreaView>
    );
}