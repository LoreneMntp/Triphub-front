import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react-native';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

export default function AddActivityScreen() {
    const selectedDay = useSelector((state) => state.user.value.selectedDay)
    const selectedTrip = useSelector((state) => state.user.value.selectedTripId)

    const [title, setTitle] = useState('')
    const [hour, setHour] = useState('Heure')
    const [address, setAddress] = useState('')
    const [note, setNote] = useState([''])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [hourSelected, setHourSelected] = useState(false)

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        const formattedDate = moment(date).format('LT')
        setHour(formattedDate)
        setHourSelected(true)
        hideDatePicker();
    }

    const handleInputChange = (text, index) => {
        const newNote = [...note]
        newNote[index] = text
        setNote(newNote)
    }

    const addInput = () => {
        setNote([...note, ''])
    }

    //const displayNotes = note.map((value, index))

    return (
        <SafeAreaView className='items-center mt-8 bg-white h-full'>
            <Text className="text-3xl font-bold">
                Activité
            </Text>
            <View title='Day-container' className='mt-10 border-slate-200 border-8 w-5/6 justify-center items-center h-12'>
                <Text className='text-lg'>Jour {selectedDay}</Text>
            </View>
            <KeyboardAvoidingView
                className='w-full items-center'
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
            <ScrollView className='w-4/6'>
                <View title='Input-container' className='justify-center items-center mt-10'>
                    <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8' 
                    placeholder='Titre' 
                    onChangeText={(value) => setTitle(value)}
                    value={title}/>
                    <Pressable className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8 justify-center' onPress={showDatePicker}>
                        {!hourSelected ? <Text className='text-[#8e8e8e]'>Heure</Text> : <Text>{hour}</Text> }
                    </Pressable>
                    <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode='time'
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}/>
                    <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8' 
                    placeholder='Adresse'
                    onChangeText={(value) => setAddress(value)}
                    value={address}/>
                    {/*<TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-4' 
                    placeholder='Note'
                    onChangeText={(value) => setNote(value)}
                    value={note}/>*/}
                </View>
                <View title='New-Note' className='items-center'>
                    <Pressable className='flex-row items-center'>
                        <Text className='font-bold mr-4'>Ajouter une autre note</Text>
                        <PlusCircle size={30} color={'black'}></PlusCircle>
                    </Pressable>
                    <View title='Save-BTN' className='mt-10 w-4/6'>
                        <Pressable className='bg-[#585123] items-center h-14 justify-center rounded-2xl'>
                            <Text className='text-lg text-white'>Sauvegarder</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}