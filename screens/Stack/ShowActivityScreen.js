import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";

//Moment
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

import { Clock, SquarePen, MapPin } from "lucide-react-native";

import { selectDay } from "../../reducers/users";

export default function ShowActivityScreen({ navigation }) {
  const activity = useSelector((state) => state.user.value.selectedActivity);
  const selectedDay = useSelector((state) => state.user.value.selectedDay.day);
  const selectedDate = useSelector(
    (state) => state.user.value.selectedDay.date
  );
  const dispatch = useDispatch();

  const openReminders = async () => {
    const url = "App-Prefs:REMINDERS";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("L'application Rappels n'est pas installée");
    }
  };

  //console.log('selectedDay', selectedDay)
  //console.log('selectedDate', selectedDate)
  //console.log(activity.content)

  const addNotification = async (minBeforeActivity) => {
    //console.log("addNotification");

    const notificationTime = moment(activity.content.plannedAt).subtract(
      minBeforeActivity,
      "minutes"
    );

    //verif si l'heure de l'activité est déjà passée

    if (moment().isAfter(notificationTime)) {
      alert("L'heure de l'activité est déjà passée");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to send notifications denied");
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel",
        body: `Rappel pour l'activité ${activity.content.title} à ${moment(
          activity.content.plannedAt
        ).format("LT")}`,
      },
      trigger: notificationTime.toDate(),
    });
  };

  const notes = activity.content.notes.map((data, i) => {
    return (
      <View
        key={i}
        className="px-5 rounded-xl flex-col justify-center items-start my-2"
      >
        <Text className="text-base italic">• {data}</Text>
      </View>
    );
  });

  const handleEditActivity = () => {
    dispatch(selectDay({ day: selectedDay, date: selectedDate }));
    navigation.navigate("EditActivity");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F4F5', alignItems: 'center', justifyContent: 'center' }}>
  <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
    <View style={{ width: '90%', backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
      <Pressable
        onPress={handleEditActivity}
        style={{
          alignSelf: 'flex-end',
          padding: 10,
          borderRadius: 20,
          backgroundColor: '#EEC170',
        }}
      >
        <SquarePen size={20} color="#FFF" strokeWidth={2} />
      </Pressable>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 24 }}>
        Votre aventure
      </Text>
      <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 16 }}>
        {activity.content.title}
      </Text>
      <Text style={{ fontSize: 56, textAlign: 'center', marginTop: 16 }}>
        {moment(activity.content.plannedAt).format("LT")}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <MapPin size={30} color="#000" />
        <Text style={{ fontSize: 20, marginLeft: 8 }}>{activity.content.address}</Text>
      </View>
      {
  activity.content.notes.length > 0 ? (
    <View style={{ elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22, paddingHorizontal: 20, marginTop: 16, backgroundColor: '#EEC170', padding: 10, borderRadius: 15 }}>
      {notes}
    </View>
  ) : (
    <View style={{ paddingHorizontal: 20, marginTop: 16, backgroundColor: '#FFF7E0', padding: 15, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, textAlign: 'center', fontStyle: 'italic' }}>
        Aucune note pour cette aventure.
      </Text>
    </View>
  )
}

      <View style={{
        backgroundColor: '#EEC170',
        borderRadius: 15,
        padding: 20,
        marginTop: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      }}>
        <Text style={{ marginBottom: 16, fontWeight: 'bold' }}>
          Ajouter un rappel pour l'aventure :
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Pressable
            onPress={() => addNotification(5)}
            style={{
              backgroundColor: '#F58549',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: '500' }}>5 min</Text>
          </Pressable>
          <Pressable
            onPress={() => addNotification(30)}
            style={{
              backgroundColor: '#F58549',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: '500' }}>30 min</Text>
          </Pressable>
          <Pressable
            onPress={() => addNotification(60)}
            style={{
              backgroundColor: '#F58549',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: '500' }}>1 h</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </ScrollView>
</SafeAreaView>

  );
}
