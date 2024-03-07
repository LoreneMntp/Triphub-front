import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable, Image, ScrollView} from "react-native";
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { UserPlus, ArrowLeft, ArrowRight, CalendarDays, PlusCircle, SquarePen, Trash2 } from 'lucide-react-native';
import moment from 'moment'
import 'moment/locale/fr'
import { useEffect, useState } from 'react';
moment.locale('fr')

export default function TripScreen({ navigation, route}) {

    const [activityPresent, setActivityPresent] = useState(false)
    const [selectedDay, setSelectedDay] = useState(1)
    const [daysTable, setDaysTable] = useState([])
    const [groupedActivities, setGroupedActivities] = useState({})
    const [activityForDay, setActivityForDay] = useState([])
    const [loading, setLoading] = useState(true)

    const mockActivityData = [{
        title: 'Restaurant - Les Petites Fleurs',
        plannedAt: new Date('2024-08-10T21:30:00.000'),
        address: '123 rue des Lilas', 
        notes: ['Table n°12', 'Guillaume en retard, lui commander le poulet']
    }, 
    {
        title: `Retour à l'hotel`,
        plannedAt: new Date('2024-08-10T23:30:00.000'),
        address: '123 avenue Jean Raida',
        notes: ['Chambre 210', 'Aymeric a oublier sa clé']
    },
    {
        title: `Visite au musée`,
        plannedAt: new Date('2024-08-11T09:30:00.000'),
        address: '123 avenue Jean Adrien',
        notes: []
    },
]

    const selectedTrip = useSelector((state) => state.user.value.selectedTripId)
    const tripsTable = useSelector((state) => state.user.value.trips)

    const tripData = tripsTable.filter((e) => e._id === selectedTrip)

    let tripDuration;

    if (!tripData || tripData.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No trip data found</Text>
            </View>
        );
    }
    else {
        const startDate = moment(tripData[0].start_at)
        const endDate = moment(tripData[0].end_at)
        tripDuration = Math.ceil((moment(endDate) - moment(startDate)) / (1000 * 60 * 60 * 24))
    
        //Function to find all the timestamps of the trip for each days
        const findTripTimestamps = () => {
            const tempArray = []
    
            for (let i = 0; i < tripDuration; i++) {
                const timeStampOfDay = startDate.clone().add(i, 'days').valueOf()
                tempArray.push(timeStampOfDay)
            }
            setDaysTable([...tempArray])
        }
    
        //Function to group activities depending on their plannedAt
        const groupActivitiesByDays = () => {
            const groupedData = mockActivityData.reduce((acc, item) => {
                const date = moment(item.plannedAt).format('YYYY-MM-DD')
                acc[date] = acc[date] || []
                acc[date].push(item)
                return acc
            }, {})
            setGroupedActivities(groupedData)
            setLoading(false)
            //console.log(groupedActivities)
        }
    
        //Function to display activity when updating the state selected Day
        const displayActivityByDay = () => {
            const date = moment(daysTable[selectedDay - 1]).format('YYYY-MM-DD')
            if(!groupedActivities || !groupedActivities[date])
            {
                setActivityPresent(false)
                setActivityForDay([])
            }
            else {
                setActivityPresent(true)
                setActivityForDay([...groupedActivities[date]])
            }
        }
    
        useEffect(()=>{
            findTripTimestamps()
            groupActivitiesByDays()
            displayActivityByDay()
            //console.log(activityForDay)
        }, [selectedDay])
    }


    let activities = []
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>)
    }

    if(activityForDay) {
        activities = activityForDay.map((data, i) => {
            const notes = data.notes.map((note, i) => {
                return <Text key={i} className='text-slate-600'>• {note} {'\n'}</Text>
            })
    
            return (
                <View key={i}>
                    <View className='flex-row items-center justify-between mb-1 ml-2 mt-2'  style={{width: '90%'}}>
                        <View title='Activity-content' className='justify-around'>
                            <Text className='font-bold'>{data.title}</Text>
                            <Text>Heure : {moment(data.plannedAt).format('HH:mm')}</Text>
                            <Text>Adresse : {data.address}</Text>
                            <Text>Notes : {'\n'}{notes}</Text>
                        </View>
                        <Pressable>
                            <Trash2 size={20} color={'black'}/>
                        </Pressable>
                    </View>
                    <View className='border-b-2 border-slate-300 w-full mb-2'>
    
                    </View>
                </View>
            )
        })
    }
    //console.log(tripData)
    //console.log(tripData[0].background_url)
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View title='header' className='items-center mt-4 mb-6'>
                <Text className='text-xl font-bold mb-2'>{tripData[0].title}</Text>
                <View title='dates'>
                    <Text>Du : {moment(tripData[0].start_at).calendar()}</Text>
                    <Text>Au : {moment(tripData[0].end_at).calendar()}</Text>
                </View>
            </View>
            <View title='invite-bar' className='items-center flex-row just ml-10'>
                <UserPlus size={30} color={'black'} className='mr-4 ' fill={'black'}/>
                <Pressable className='border-2 border-black p-2 rounded-lg'>
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
                    <View title='calendar-bar' className='flex-row bg-slate-300 w-full h-10 p-2'>
                        <View title='calender-left' className='flex-row items-center mr-8'>
                            {selectedDay > 1 ? 
                            <> 
                                <Pressable title='arrow-left' className='mr-2' onPress={() => setSelectedDay(selectedDay - 1)}>
                                    <ArrowLeft size={25} color={'black'}/>
                                </Pressable>
                                <Text>Jour {selectedDay - 1}</Text>
                            </> : <View style={{width: 76}}></View>}
                        </View>
                        <View title='calendar-center' className='flex-row items-center mr-8'>
                            <View title='selected-day' className='flex-row items-center bg-white h-8 pr-2 pl-2 border-slate-100 border-2 rounded-md'>
                                <Text className='mr-2'>Jour {selectedDay}</Text>
                                <Pressable>
                                    <CalendarDays size={25} color={'black'}/>
                                </Pressable>
                            </View>
                        </View>
                        <View title='calendar-right' className='flex-row items-center'>
                            {selectedDay < tripDuration ?
                            <>
                                <Text className='mr-2'>Jour {selectedDay + 1}</Text>
                                <Pressable  onPress={() => setSelectedDay(selectedDay + 1)}>
                                    <ArrowRight size={25} color={'black'}/>
                                </Pressable>
                            </> : <></>}
                        </View>
                    </View>
                    <ScrollView title='activity-container'>
                        {activityPresent && activities.length > 0 ? activities : <View title='activity-absent' className=' items-center mt-16'>
                        <Pressable>
                            <PlusCircle size={100} color={'#F2A65A'}/>
                        </Pressable>
                    </View>}
                    </ScrollView>

                </View>
            </View>
        </SafeAreaView>
    );
}