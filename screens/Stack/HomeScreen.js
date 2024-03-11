import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { LogOut, Settings, WifiOff, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useDispatch, useSelector } from "react-redux";
import { initTrips, selectTrip } from "../../reducers/users";
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const [modalInviteVisible, setModalInviteVisible] = useState(false);
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [tempSelectedTrip, setTempSelectedTrip] = useState(null);

  const user = useSelector((state) => state.user.value);
  const tripData = useSelector((state) => state.user.value.trips);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    if (isConnected) {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/getTrips/${user.user.token}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data.data)
          dispatch(initTrips(data.data));
        });
    }
    return () => unsubscribe();
  }, [isConnected]);

  /* const mockUserData = {
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
} */

  const handleSelectTrip = (id) => {
    dispatch(selectTrip({ tripId: id }));
    navigation.navigate("TabNavigator");
  };

  const handleShowDeleteTrip = (tripId) => {
    setModalDeleteVisible(true);
  };

  const handleDeleteTrip = (tripId) => {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/delete/`;
    const bodyData = {
      tripId,
      token: user.user.token,
    };
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(initTrips(data.data));
        setModalDeleteVisible(false);
      });
  };

  const trips = user.trips.map((data, i) => {
    const startDate = moment(data.start_at);
    const endDate = moment(data.end_at);

    return (
      <Pressable
        key={i}
        title="Trip"
        className="mb-8 w-80 h-40 items-between p-2 rounded-3xl"
        style={
          i % 2 === 0
            ? { backgroundColor: "#585123" }
            : { backgroundColor: "#EEC170" }
        }
        onPress={() => handleSelectTrip(data._id)}
      >
        <Pressable
          title="Delete BTN"
          onPress={() => {
            handleShowDeleteTrip();
            setTempSelectedTrip(data._id);
          }}
        >
          <Trash2
            size={20}
            style={i % 2 === 0 ? { color: "white" } : { color: "black" }}
          />
        </Pressable>
        <View title="Trip Content" className="flex-row mt-2 justify-center">
          <Image
            source={
              data.background_url
                ? { uri: data.background_url }
                : require("../../assets/palm-tree-icon.jpg")
            }
            style={{ width: 150, height: 100 }}
            className="mr-3 rounded-3xl"
          />
          <View title="Trip Infos">
            <Text
              title="Trip Title"
              className="text-lg font-bold"
              style={i % 2 === 0 ? { color: "white" } : { color: "black" }}
            >
              {data.title}
            </Text>
            <Text
              title="Start Date"
              style={i % 2 === 0 ? { color: "white" } : { color: "black" }}
            >
              {startDate.calendar()}
            </Text>
            <Text
              title="Trip length"
              style={i % 2 === 0 ? { color: "white" } : { color: "black" }}
            >
              {Math.ceil(
                (moment(endDate) - moment(startDate)) / (1000 * 60 * 60 * 24)
              ) + 1}{" "}
              jours
            </Text>
            <Text
              title="Departure In"
              className="text-xs"
              style={i % 2 === 0 ? { color: "white" } : { color: "black" }}
            >
              Départ {startDate.fromNow()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  });
  const handleJoinTrip = (link) => {
    if (!link) {
      setAlertMessage("Veuillez remplir le champ");
      setAlertVisible(true);
    } else {
      //lancer un fetch pour rejoindre le trip et vérifier que le lien est valide
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/join/${link}`;
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: user.user.token }),
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data)
          setModalInviteVisible(false);
        });
    }
  };

  const handleLogout = () => {
    setModalLogoutVisible(true);
  };

  return (
    <SafeAreaView
      title="Background"
      className="bg-white flex-1 items-center pt-8"
    >
      <Modal
        title="Invite Modal"
        visible={modalInviteVisible}
        animationType="fade"
        transparent
      >
        <View className="flex-1 justify-center items-center">
          <TouchableWithoutFeedback
            onPress={() => setModalInviteVisible(!modalInviteVisible)}
          >
            <View
              title="Background opaque"
              className="bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50"
            ></View>
          </TouchableWithoutFeedback>

          <View
            title="Centered view"
            className="bg-white w-5/6 h-3/6 pt-20 items-center"
          >
            <TextInput
              placeholder="Lien inviation"
              className="border-2 border-slate-200 rounded-md p-2 w-2/3"
              onChangeText={setInvitationLink}
              value={invitationLink}
            ></TextInput>
            {isAlertVisible && (
              <Text className="text-red-700">{alertMessage}</Text>
            )}
            <Pressable
              title="Join"
              className="bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-lg shadow-black mb-3 mt-10"
              onPress={() => handleJoinTrip(invitationLink)}
            >
              <Text className="text-white text-lg">Rejoindre</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        title="Logout Modal"
        visible={modalLogoutVisible}
        animationType="fade"
        transparent
      >
        <View className="flex-1 justify-center items-center">
          <TouchableWithoutFeedback
            onPress={() => setModalInviteVisible(!modalInviteVisible)}
          >
            <View
              title="Background opaque"
              className="bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50"
            ></View>
          </TouchableWithoutFeedback>

          <View
            title="Centered view"
            className="bg-white w-5/6 h-3/6 pt-20 items-center"
          >
            <Text className="text-2xl mb-3 text-center">
              Êtes-vous sûr(e) de vouloir vous déconnecter ?
            </Text>
            <Text className="mb-5 text-center">
              Si vous n'avez pas d'accès à internet vous ne pourrez plus
              utiliser l'application.
            </Text>
            <Pressable
              className="bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
              onPress={() => navigation.navigate("Landing")}
            >
              <Text className="text-white text-lg">Oui</Text>
            </Pressable>
            <Pressable
              className="bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
              onPress={() => setModalLogoutVisible(false)}
            >
              <Text className="text-white text-lg">Non</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        title="Delete Trip Modal"
        visible={modalDeleteVisible}
        animationType="fade"
        transparent
      >
        <View className="flex-1 justify-center items-center">
          <TouchableWithoutFeedback
            onPress={() => setModalDeleteVisible(!modalDeleteVisible)}
          >
            <View
              title="Background opaque"
              className="bg-slate-400 absolute top-0 left-0 w-full h-full opacity-50"
            ></View>
          </TouchableWithoutFeedback>

          <View
            title="Centered view"
            className="bg-white w-5/6 h-3/6 pt-20 items-center"
          >
            <Text className="text-2xl mb-3 text-center">
              Êtes-vous sûr(e) de vouloir supprimer ce Voyage ?
            </Text>
            <Pressable
              className="bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
              onPress={() => handleDeleteTrip(tempSelectedTrip)}
            >
              <Text className="text-white text-lg">Oui</Text>
            </Pressable>
            <Pressable
              className="bg-[#F2A65A] w-40 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
              onPress={() => setModalDeleteVisible(false)}
            >
              <Text className="text-white text-lg">Non</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View
        title="Header"
        className="flex-row items-center justify-around w-full mb-6"
      >
        <Text className="text-3xl font-bold">Bonjour {user.user.username}</Text>
      </View>
      <View
        title="CreateJoinTrips"
        className="items-center mb-3 justify-around"
      >
        <Pressable
          title="NewTrip"
          className="bg-[#F2A65A] w-60 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
          onPress={() => navigation.navigate("CreateTrip")}
          disabled={!isConnected}
          style={{ backgroundColor: isConnected ? "#F2A65A" : "gray" }}
        >
          <Text
            className="text-white text-lg"
            style={{ color: isConnected ? "white" : "black" }}
          >
            Créer un nouveau Voyage
          </Text>
          {!isConnected && <WifiOff color={"#ff0000"} size={14} />}
        </Pressable>
        <Pressable
          title="JoinTrip"
          className="bg-[#F2A65A] w-60 h-12 items-center justify-center rounded-xl shadow-xl shadow-black mb-3"
          onPress={() => setModalInviteVisible(true)}
          disabled={!isConnected}
          style={{ backgroundColor: isConnected ? "#F2A65A" : "gray" }}
        >
          <Text
            className="text-white text-lg"
            style={{ color: isConnected ? "white" : "black" }}
          >
            Rejoindre un voyage
          </Text>
          {!isConnected && <WifiOff color={"#ff0000"} size={14} />}
        </Pressable>
        <Text className="text-black text-lg">
          Commencer à préparer un nouveau voyage
        </Text>
      </View>
      <View
        title="Divider"
        className="border-b border-black w-80 mt-2 mb-2"
      ></View>
      <View title="YourTrips" className="items-center h-[70%]">
        <Text className="text-xl mb-3">Vos Voyages</Text>
        <ScrollView>{trips}</ScrollView>
      </View>
    </SafeAreaView>
  );
}
