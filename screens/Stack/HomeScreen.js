import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable, Image, ScrollView, Modal, TouchableWithoutFeedback, TextInput} from "react-native";
import {LogOut, Settings, SquarePen, WifiOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo'
import { useSelector } from 'react-redux';

export default function HomeScreen({navigation}) {
    const [modalInviteVisible, setModalInviteVisible] = useState(false)
    const [modalLogoutVisible, setModalLogoutVisible] = useState(false)
    const [invitationLink, setInvitationLink] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const [isAlertVisible, setAlertVisible] = useState(false)
    const [isConnected, setIsConnected] = useState(null)

    const user = useSelector((state) => state.user.user)

useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected)
    })
    return () => unsubscribe()
}, [])

useEffect(() => {
    /* if(isConnected) {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/getTrips`
        const res = await fetch(url, {
            method: 'GET', 
            headers: {'Content-Type': 'application/json'},
            body: user.token
        })
    } */
}, [])

const mockUserData = {
    username: 'JohnD123',
    email: 'john.doe@gmail.com',
    password: 'test123',
    token: '12345',
    trips: [{
        title: 'Las Vegas',
        background_url: 'https://www.civitatis.com/f/estados-unidos/las-vegas/tour-privado-nocturno-las-vegas-589x392.jpg',
        country: 'United States of America',
        start_at: new Date('2025-06-21'),
        end_at: new Date('2025-07-03'),
        createdBy: '0123456789',
        sharedWith: [],
        activities: [{
            title: 'Restaurant',
            plannedAt: new Date('2025-06-22T21:00:00'),
            address: '312 main street',
            notes: ['Table n°12']
        }],
        sos_infos: [{
            country: 'United States of America',
            embassy: {
                address: '122 Example Street',
                phone: '500-123-456-789',
                email: 'france-ambassade@americanmail.com',
                emergency_phone: '500-123-123-123',
            },
            consulate: [{
                address: '123 Example Street',
                phone: '500-123-456-789',
                email: 'france-consulat@americanmail.com',
                emergency_phone: '500-123-123-123',
            }],
            emergency_number: '911',
            police_number: '911',
            firefighter_number: '911',
            member_112: true
        }]
    },
    {
        title: 'Pékin',
        background_url: 'https://www.autigrevanille.ch/wp-content/uploads/2020/07/pekin-cite-interdite-empereur-chine.jpg',
        country: 'China',
        start_at: new Date('2025-06-21'),
        end_at: new Date('2025-07-03'),
        createdBy: '0123456789',
        sharedWith: [],
        activities: [{
            title: 'Restaurant',
            plannedAt: new Date('2025-06-22T21:00:00'),
            address: '312 chinese street',
            notes: ['Table n°12']
        }],
        sos_infos: [{
            country: 'China',
            embassy: {
                address: '122 Example chinese Street',
                phone: '500-123-456-789',
                email: 'france-ambassade@chinesemail.com',
                emergency_phone: '500-123-123-123',
            },
            consulate: [{
                address: '123 Example chinese Street',
                phone: '500-123-456-789',
                email: 'france-consulat@chinesemail.com',
                emergency_phone: '500-123-123-123',
            }],
            emergency_number: '911',
            police_number: '911',
            firefighter_number: '911',
            member_112: true
        }]
    }],
    documents: [{
        title: 'Plane Ticket Flight 122',
        link_doc: 'file://...',
        linked_trip: '123456789',
        serial_phone: '0000-0000'
    }]
}

const trips = mockUserData.trips.map((data, i) => {
    const dateWithoutHours = new Date(data.start_at.setHours(0,0,0,0))
    const stringifiedData = JSON.stringify(data)
    return (
        <View key={i} title="Trip" className='h-36 mb-8 w-80 items-between p-2 rounded-3xl' style={i % 2 === 0 ? {backgroundColor: '#585123'} : {backgroundColor: '#EEC170'}}>
            <Pressable title="EditBtn" onPress={() => navigation.navigate('TabNavigator', {params: {stringifiedData},screen: 'Trip'})}>
                <SquarePen size={20} style={i % 2 === 0 ? {color: 'white'} : {color: 'black'}}/>
            </Pressable>
            <View title="Trip Content" className='flex-row'>
                <Image source={{uri: data.background_url}} style={{width: 150, height: 100}} className='mr-2 rounded-3xl'/>
                <View title="Trip Infos">
                    <Text title="Trip Title" className='text-lg font-bold' style={i % 2 === 0 ? {color: 'white'} : {color: 'black'}}>{data.title}</Text>
                    <Text title="Start Date" style={i % 2 === 0 ? {color: 'white'} : {color: 'black'}}>{dateWithoutHours.toLocaleDateString().split('T')[0]}</Text>
                    <Text title="Trip length" style={i % 2 === 0 ? {color: 'white'} : {color: 'black'}}>{Math.floor((data.end_at.getTime() - data.start_at.getTime()) / (1000 * 60 * 60 * 24))} jours</Text>
                    <Text title="Departure In" className='text-xs' style={i % 2 === 0 ? {color: 'white'} : {color: 'black'}}>Départ dans : {Math.floor((data.start_at - Date.now()) / (1000 * 60 * 60 * 24))} jours</Text>
                </View>
            </View>
        </View>
    )
})
    const handleJoinTrip = (link) => {
        if(!link) {
            setAlertMessage('Veuillez remplir le champ')
            setAlertVisible(true)
        }
        else {
            //lancer un fetch pour rejoindre le trip et vérifier que le lien est valide
        }
    }

    const handleLogout = () => {
        setModalLogoutVisible(true)
    }

    return (
        <SafeAreaView title="Background" className='bg-white flex-1 items-center pt-8'>
            <Modal title="Invite Modal" visible={modalInviteVisible} animationType='fade' transparent>
                <View className='flex-1 justify-center items-center'>
                    <TouchableWithoutFeedback onPress={()=> setModalInviteVisible(!modalInviteVisible)}>
                        <View title="Background opaque" className='bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50'></View>
                    </TouchableWithoutFeedback>

                    <View title='Centered view' className='bg-white w-5/6 h-3/6 pt-20 items-center'>
                        <TextInput placeholder='Lien inviation' className='border-2 border-slate-200 rounded-md p-2 w-2/3' onChangeText={setInvitationLink} value={invitationLink}>
                        </TextInput>
                        {isAlertVisible && <Text className='text-red-700'>{alertMessage}</Text>}
                        <Pressable title="Join" className='bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3 mt-10' onPress={()=> handleJoinTrip(invitationLink)}>
                            <Text className='text-white text-lg'>Rejoindre</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
            <Modal title="Logout Modal" visible={modalLogoutVisible} animationType='fade' transparent>
                <View className='flex-1 justify-center items-center'>
                    <TouchableWithoutFeedback onPress={()=> setModalInviteVisible(!modalInviteVisible)}>
                        <View title="Background opaque" className='bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50'></View>
                    </TouchableWithoutFeedback>

                    <View title='Centered view' className='bg-white w-5/6 h-3/6 pt-20 items-center'>
                        <Text className='text-2xl mb-3 text-center'>Êtes-vous sûr(e) de vouloir vous déconnecter ?</Text>
                        <Text className='mb-5 text-center'>Si vous n'avez pas d'accès à internet vous ne pourrez plus utiliser l'application.</Text>
                        <Pressable className='bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3' onPress={()=> navigation.navigate('Landing')}>
                            <Text className='text-white text-lg'>Oui</Text>
                        </Pressable>
                        <Pressable className='bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3' onPress={() => setModalLogoutVisible(false)}>
                            <Text className='text-white text-lg'>Non</Text>
                        </Pressable>
                    </View>
                </View>

            </Modal>
            <View title="Header" className='flex-row items-center justify-around w-full mb-6'>
                <Pressable title="LogoutBtn" onPress={() => handleLogout()}>
                    <LogOut color={'black'} size={30}/>
                </Pressable>
                <Text className='text-3xl font-bold'>
                    Bonjour {mockUserData.username}
                </Text>
                <Pressable title="Settings" onPress={() => navigation.navigate('Settings')}>
                    <Settings color={'black'} size={30}/>
                </Pressable>
            </View>
            <View title="CreateJoinTrips" className='items-center mb-3 justify-around'>
                <Pressable title="NewTrip" className='bg-[#F2A65A] w-60 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3' 
                onPress={() => navigation.navigate('CreateTrip')}
                disabled={!isConnected}
                style={{backgroundColor: isConnected ? '#F2A65A' : 'gray'}}>
                    <Text className='text-white text-lg'
                    style={{color: isConnected ? 'white' : 'black'}}>Créer un nouveau Voyage</Text>
                    {!isConnected && <WifiOff color={'#ff0000'} size={14} />}
                </Pressable>
                <Pressable title="JoinTrip" className='bg-[#F2A65A] w-60 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3'
                onPress={()=> setModalInviteVisible(true)}
                disabled={!isConnected}
                style={{backgroundColor: isConnected ? '#F2A65A' : 'gray'}}>
                    <Text className='text-white text-lg'
                    style={{color: isConnected ? 'white' : 'black'}}>Rejoindre un voyage</Text>
                    {!isConnected && <WifiOff color={'#ff0000'} size={14} />}
                </Pressable>
                <Text className='text-black text-lg'>Commencer à préparer un nouveau voyage</Text>
            </View>
            <View title="Divider" className='border-b border-black w-80 mt-2 mb-2'>
            </View>
            <View title="YourTrips" className='items-center'>
                <Text className='text-xl mb-3'>Vos Voyages</Text>
                <ScrollView>
                    {trips}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}