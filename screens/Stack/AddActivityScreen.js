import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, MinusCircle, Navigation } from 'lucide-react-native';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')
import { initTrips } from '../../reducers/users';

export default function AddActivityScreen( {navigation}) {
    const selectedDay = useSelector((state) => state.user.value.selectedDay.day)
    const selectedDate = useSelector((state) => state.user.value.selectedDay.date)
    const selectedTrip = useSelector((state) => state.user.value.selectedTripId)
    const token = useSelector((state) => state.user.value.user.token)

    const [title, setTitle] = useState('')
    const [hour, setHour] = useState('Heure')
    const [address, setAddress] = useState('')
    const [note, setNote] = useState([''])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [hourSelected, setHourSelected] = useState(false)
    const [date, setDate] = useState(null)
    const [showAlertTitle, setShowAlertTitle] = useState(false)
    const [showAlertHour, setShowAlertHour] = useState(false)
    const [showAlertAddress, setShowAlertAddress] = useState(false)

    const allFieldsFilled = title !== '' && hour !== 'Heure' && address !== ''

    const dispatch = useDispatch()

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        setDate(date)
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

    const removeInput = (index) => {
        const newNote = [...note]
        newNote.splice(index, 1)
        setNote(newNote)
    }

    const displayNotes = note.map((value, i) => {
        return (
            <View key={i} className='flex-row w-full items-center mb-4'>
                <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] rounded-lg pl-4 w-5/6 mr-4'
                placeholder={`Note ${i + 1} (opt.)`}
                onChangeText={(text) => handleInputChange(text, i)}
                value={value}
                />
                <Pressable onPress={() => removeInput(i)}>
                    <MinusCircle size={25} color={'black'}/>
                </Pressable>
            </View>
        )
    })

    const handleSaveActivity = () => {
        if(allFieldsFilled) {
            const bodyData = {
                tripId: selectedTrip,
                title, 
                plannedAt: date,
                token,
                note,
                address
            }
            const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/addActivity`
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
                //console.log('reponse addActivity', data)
                if(data.result) {
                    console.log(bodyData)
                    dispatch(initTrips(data.data))
                    navigation.navigate('TabNavigator')
                }
            })
        } else {
            if(title === '') {
                setShowAlertTitle(true)
            }
            else {
                setShowAlertTitle(false)
            }

            if(hour === 'Heure') {
                setShowAlertHour(true)
            }
            else {
                setShowAlertHour(false)
            }

            if(address === '') {
                setShowAlertAddress(true)
            }
            else {
                setShowAlertAddress(false)
            }
        }
    }

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
            <ScrollView className='w-4/6 h-5/6'>
                <View title='Input-container' className='justify-center items-center mt-10'>
                    <View className='w-full'>
                        {showAlertTitle && <Text className='text-red-600'>Veuillez remplir ce champ</Text>}
                        <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8' 
                        placeholder='Titre *' 
                        onChangeText={(value) => setTitle(value)}
                        value={title}/>
                        {showAlertHour && <Text className='text-red-600'>Veuillez remplir ce champ</Text>}
                    </View>
                    <View className='w-full'>
                        <Pressable className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8 justify-center' onPress={showDatePicker}>
                            {!hourSelected ? <Text className='text-[#8e8e8e]'>Heure *</Text> : <Text>{hour}</Text> }
                        </Pressable>
                        <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode='time'
                        date={new Date(moment(selectedDate))}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}/>
                        {showAlertAddress && <Text className='text-red-600'>Veuillez remplir ce champ</Text>}
                    </View>
                    <View className='w-full'>
                        <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] w-full rounded-lg pl-4 mb-8' 
                        placeholder='Adresse *'
                        onChangeText={(value) => setAddress(value)}
                        value={address}/>
                    </View>
                    {displayNotes}
                </View>
                <View title='New-Note' className='items-center'>
                    <Pressable className='flex-row items-center' onPress={addInput}>
                        <Text className='font-bold mr-4'>Ajouter une autre note</Text>
                        <PlusCircle size={30} color={'black'}></PlusCircle>
                    </Pressable>
                    <View title='Save-BTN' className='mt-10 w-4/6'>
                        <Pressable className='bg-[#585123] items-center h-14 justify-center rounded-2xl' onPress={() => handleSaveActivity()}>
                            <Text className='text-lg text-white'>Sauvegarder</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}