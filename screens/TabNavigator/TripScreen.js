//React Native
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable, Image, ScrollView, Modal, TouchableWithoutFeedback} from "react-native";
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteActivity, selectActivity, selectDay } from '../../reducers/users';

//Lucide Icons
import { UserPlus, ArrowLeft, ArrowRight, CalendarDays, PlusCircle, Trash2, Copy } from 'lucide-react-native';

//Moment
import moment from 'moment'
import 'moment/locale/fr'
import { useCallback, useEffect, useState } from 'react';
moment.locale('fr')

//Invite Modal Clipboard/Popover
import * as Clipboard from 'expo-clipboard'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import {Calendar, CalendarUtils} from 'react-native-calendars';
import { element } from 'prop-types';

export default function TripScreen({ navigation, route}) {

    const [activityPresent, setActivityPresent] = useState(false)
    const [selectedDay, setSelectedDay] = useState(1)
    const [activityForDay, setActivityForDay] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalInviteVisible, setModalInviteVisible] = useState(false)
    const [popoverVisible, setPopoverVisible] = useState(false)
    const [modalCalendarVisible, setModalCalendarVisible] = useState(false)
    const [tripTimestamps, setTripTimestamps] = useState([])

    const selectedTrip = useSelector((state) => state.user.value.selectedTripId)
    const tripsTable = useSelector((state) => state.user.value.trips)
    const user = useSelector((state) => state.user.value.user)
    const dispatch = useDispatch()

    const tripData = tripsTable.filter((e) => e._id === selectedTrip)

    const allActivitiesForTrip = tripData[0].activities

    let tripDuration;

    //Safeguard to check if there is data inside the Trip
    if (!tripData || tripData.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No trip data found</Text>
            </View>
        );
    }
    //Variables for dates
    const startDate = moment(tripData[0].start_at)
    const endDate = moment(tripData[0].end_at)
    tripDuration = Math.ceil((moment(endDate) - moment(startDate)) / (1000 * 60 * 60 * 24)) + 1
    //console.log(tripData[0].createdBy)
    //console.log(user)

    //Function to Display Activities
    const displayActivityByDay = () => {
        //Find the timestamp of each day within the trip
        const tempArray = []

        for (let i = 0; i < tripDuration; i++) {
            const timeStampOfDay = startDate.clone().add(i, 'days').valueOf()
            tempArray.push(timeStampOfDay)
        }
        setTripTimestamps(tempArray)

        //Group the activities based on their plannedAT
        const groupedData = allActivitiesForTrip.reduce((acc, item) => {
            const date = moment(item.plannedAt).format('YYYY-MM-DD')
            acc[date] = acc[date] || []
            acc[date].push(item)
            return acc
        }, {})
        setLoading(false)

        //Display the activities based on the selected day
        const date = moment(tempArray[selectedDay - 1]).format('YYYY-MM-DD')
        if(!groupedData || !groupedData[date])
        {
            setActivityPresent(false)
            setActivityForDay([])
        }
        else {
            setActivityPresent(true)
            setActivityForDay(groupedData[date])
        }
    }

    useEffect(()=>{
        displayActivityByDay()
    }, [selectedDay, tripsTable])

    const handleDeleteActivity = (id) => {
        const bodyData = {
            tripId: tripData[0]._id,
            activityId: id,
            token: user.token
        }
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/deleteActivity/`
        fetch(url, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.result)
            {
                dispatch(deleteActivity(id))
            }
        })
    }

    const handleSelectActivity = (id) => {
        dispatch(selectActivity({activityId: id}))
        navigation.navigate('ShowActivity')
    }

    let activities = []
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chargement...</Text>
            </View>)
    }

    if(activityForDay) {
        const sortedArray = activityForDay.sort((a, b) => {
            return new Date(a.plannedAt).getTime() - new Date(b.plannedAt).getTime()
        })
        activities = sortedArray.map((data, i) => {
            const notes = data.notes.map((note, i) => {
                return <Text key={i} className='text-slate-600'>• {note} {'\n'}</Text>
            })
    
            return (
                <View key={i}>
                    <View className='flex-row items-center justify-between mb-1 ml-2 mt-2'  style={{width: '90%'}}>
                        <View title='Activity-content' className='justify-around'>
                            <Pressable onPress={() => handleSelectActivity(data._id)}>
                                <Text className='font-bold'>{data.title}</Text>
                            </Pressable>
                            <Text>Heure : {moment(data.plannedAt).format('HH:mm')}</Text>
                            <Text>Adresse : {data.address}</Text>
                            <Text>Notes : {'\n'}{notes}</Text>
                        </View>
                        <Pressable onPress={() => handleDeleteActivity(data._id)}>
                            <Trash2 size={20} color={'black'}/>
                        </Pressable>
                    </View>
                    <View className='border-b-2 border-slate-300 w-full mb-2'>
    
                    </View>
                </View>
            )
        })
    }

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(tripData[0].invitation_link)
    }

    const showPopover = () => {
        setPopoverVisible(true)
        setTimeout(() => {
            setPopoverVisible(false)
        }, 800)
    }
    const closePopover = () => {
        setPopoverVisible(false)
    }

    const INITIAL_DATE = moment(tripData[0].start_at).format('YYYY-MM-DD')
    //console.log(INITIAL_DATE)

    const handleDayPress = (day) => {
        const index = tripTimestamps.findIndex((element) => element === day.timestamp)
        setSelectedDay(index + 1)
        setModalCalendarVisible(false)
    }

    const handleAddActivity = () => {
        dispatch(selectDay({day: selectedDay, date: tripTimestamps[selectedDay - 1]}))
        //console.log('navigating', tripTimestamps[selectedDay - 1])
        navigation.navigate('AddActivity')
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <Modal title="Invite Modal" visible={modalInviteVisible} animationType='fade' transparent>
                <View className='flex-1 justify-center items-center'>
                    <TouchableWithoutFeedback onPress={()=> setModalInviteVisible(!modalInviteVisible)}>
                        <View title="Background opaque" className='bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50'></View>
                    </TouchableWithoutFeedback>

                    <View title='Centered view' className='bg-white w-5/6 h-2/6 pt-20 items-center'>
                        <Text className='text-center pr-4 pl-4'>Copiez ce lien, et envoyez le à vos proches pour qu'ils rejoignent votre voyage !</Text>
                        <View className='flex-row items-center justify-center mt-6'>
                            <Text className='font-bold  items-center mr-4' selectable={true}>{tripData[0].invitation_link}</Text>
                            <Popover
                            isVisible={popoverVisible}
                            placement={PopoverPlacement.TOP}
                            onRequestClose={closePopover}
                            from={(
                                <Pressable onPress={() => {copyToClipboard(); showPopover()}} className='flex-row items-center border-2 border-slate-300 p-2'>
                                    <Copy size={30} color={'black'} className='mr-2'/>
                                    <Text>Copier</Text>
                                </Pressable>
                            )}
                            animationConfig={{duration: 1000, timing:'linear'}}>
                                <Text>Lien copié !</Text>
                            </Popover>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal title="Calendar" visible={modalCalendarVisible} animationType='fade' transparent>
                <View className='flex-1 justify-center items-center'>
                    <TouchableWithoutFeedback onPress={()=> setModalCalendarVisible(!modalCalendarVisible)}>
                        <View title="Background opaque" className='bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50'></View>
                    </TouchableWithoutFeedback>

                    <View title='Centered view' className='bg-white w-5/6 h-3/6 items-center justify-center'>
                        <Calendar 
                        enableSwipeMonths 
                        current={INITIAL_DATE} 
                        minDate={INITIAL_DATE} 
                        maxDate={moment(tripData[0].end_at).format('YYYY-MM-DD')}
                        disableAllTouchEventsForDisabledDays
                        onDayPress={handleDayPress}
                        />
                    </View>
                </View>
            </Modal>


            <View title='header' className='items-center mt-4 mb-6'>
                <Text className='text-xl font-bold mb-2'>{tripData[0].title}</Text>
                <View title='dates'>
                    <Text>Du : {moment(tripData[0].start_at).calendar()}</Text>
                    <Text>Au : {moment(tripData[0].end_at).calendar()}</Text>
                </View>
            </View>
            <View title='invite-bar' className='items-center flex-row just ml-10'>
                <Pressable className='border-2 border-black p-2 rounded-lg flex-row justify-center items-center' onPress={() => setModalInviteVisible(true)}>
                <UserPlus size={30} color={'black'} className='mr-4 ' fill={'black'}/>
                    <Text>Inviter</Text>
                </Pressable>
            </View>
            <View title='image-view' className='items-center mt-4'>
                <Image source={{uri: tripData[0].background_url}} style={{width: '75%', height: 175}}/>
                <Pressable className='bg-[#F2A65A] w-16 h-8 items-center justify-center rounded-lg shadow-md shadow-black mt-2' style={{position: 'absolute', right: '15%'}}>
                    <Text className='text-white'>Choisir</Text>
                </Pressable>
            </View>
            <View title='calendar' className='items-center mt-6'>
                <Text className='text-lg'>Emploi du Temps</Text>
                <View title='calendar-view' className='border-slate-100 border-0 mt-2 drop-shadow-xl shadow-black rounded-b-3xl' style={{width: '80%', height: 300}}>
                    <View title='calendar-bar' className='flex-row bg-slate-300 w-full h-10 p-2 mb-2 items-center'>
                        <View title='calender-left ' className='mr-8'>
                            {selectedDay > 1 ? 
                            <> 
                                <Pressable title='arrow-left' className=' flex-row items-center' onPress={() => setSelectedDay(selectedDay - 1)}>
                                    <ArrowLeft size={25} color={'black'} className='mr-2'/>
                                    <Text>Jour {selectedDay - 1}</Text>
                                </Pressable>
                            </> : <View style={{width: 76}}></View>}
                        </View>
                        <View title='calendar-center' className='flex-row items-center bg-white h-8 pr-2 pl-2 border-slate-100 border-2 rounded-md mr-8'>
                            <Pressable onPress={() => setModalCalendarVisible(true)} className='flex-row items-center'>
                                <View title='selected-day' className='flex-row items-center'>
                                    <Text className='mr-2'>Jour {selectedDay}</Text>
                                    <CalendarDays size={25} color={'black'}/>
                                </View>
                            </Pressable>
                        </View>
                        <View title='calendar-right' >
                            {selectedDay < tripDuration ?
                            <>
                                <Pressable  onPress={() => setSelectedDay(selectedDay + 1)} className='flex-row items-center'>
                                    <Text className='mr-2'>Jour {selectedDay + 1}</Text>
                                    <ArrowRight size={25} color={'black'}/>
                                </Pressable>
                            </> : <></>}
                        </View>
                    </View>
                    <ScrollView title='activity-container'>
                        {activities}
                        <View title='activity-absent' className=' items-center'>
                        <Pressable onPress={() => handleAddActivity()}>
                            <PlusCircle size={100} color={'#F2A65A'}/>
                        </Pressable>
                    </View>
                    </ScrollView>

                </View>
            </View>
        </SafeAreaView>
    );
}