import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable} from "react-native";
import { useDispatch, useSelector } from 'react-redux';

//Moment
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

import { SquarePen } from 'lucide-react-native';

import { selectDay } from '../../reducers/users';

export default function ShowActivityScreen({navigation}) {
    const activity = useSelector((state) => state.user.value.selectedActivity)
    const selectedDay = useSelector((state) => state.user.value.selectedDay.day)
    const selectedDate = useSelector((state) => state.user.value.selectedDay.date)
    const dispatch = useDispatch()

    //console.log('selectedDay', selectedDay)
    //console.log('selectedDate', selectedDate)
    //console.log(activity.content)

    const notes = activity.content.notes.map((data, i) => {
        return (
            <View key={i}>
                <Text className='mb-4 text-base italic'>• {data}</Text>
            </View>
        )
    })

    const handleEditActivity = () => {
        dispatch(
            selectDay({ day: selectedDay, date: selectedDate })
          );
        navigation.navigate('EditActivity')
    }
    
    return (
        <SafeAreaView className='flex-1 items-center'>
            <Text className='text-3xl mt-10 items-center'>Activité</Text>
            <View title='container' className='border-slate-300 border-2 w-5/6 h-4/6 mt-10 p-4'>
                <Pressable className='mb-4 items-end' onPress={() => handleEditActivity()}>
                    <SquarePen size={20} color={'black'}/>
                </Pressable>
                <Text className='text-xl text-center mb-10 font-semibold'>{activity.content.title}</Text>
                <View className='flex-row mb-6 justify-between'>
                    <Text className='text-lg'>Heure </Text>
                    <Text className='text-lg'>{moment(activity.content.plannedAt).format('LT')}</Text>
                </View>
                <View className='flex-row mb-20 justify-between'>
                    <Text className='text-lg'>Adresse </Text>
                    <Text className='text-lg'>{activity.content.address}</Text>
                </View>
                <View title='note-container mb-6'>
                    <Text className='text-lg'>Notes</Text>
                    {notes}
                </View>
            </View>

        </SafeAreaView>
    );
}