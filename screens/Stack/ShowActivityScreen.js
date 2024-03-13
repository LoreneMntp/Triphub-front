import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";

//Moment
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

import { SquarePen, MapPin } from "lucide-react-native";

import { selectDay } from "../../reducers/users";

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export default function ShowActivityScreen({ navigation }) {
  const activity = useSelector((state) => state.user.value.selectedActivity);
  const selectedDay = useSelector((state) => state.user.value.selectedDay.day);
  const selectedDate = useSelector(
    (state) => state.user.value.selectedDay.date
  );

  const [isConnected, setIsConnected] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, [])

  //inutilisée ?
  const openReminders = async () => {
    const url = "App-Prefs:REMINDERS";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("L'application Rappels n'est pas installée");
    }
  };


  const addNotification = async (minBeforeActivity) => {

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
        className="bg-slate-200 px-5 rounded-xl flex-col justify-center items-start mt-4"
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
    <View className="bg-white flex-1 h-screen">
      <View className="flex mt-4 px-5">
        {isConnected ? <Pressable
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F2A65A]"
          onPress={() => handleEditActivity()}
          disabled={!isConnected}
        >
          <SquarePen size={20} color="#FFF" strokeWidth={3} />
        </Pressable> : <Pressable
          className="absolute top-4 right-4 p-2 rounded-full bg-[#BABABA]"
          onPress={() => handleEditActivity()}
          disabled={!isConnected}
        >
          <SquarePen size={20} color="#595959" strokeWidth={3} />
        </Pressable>}
        <Text className="text-xl font-bold text-center mt-24">Activité</Text>
        <Text className="text-5xl font-bold text-center mt-4">
          {activity.content.title}
        </Text>
        <View className="flex flex-row justify-center items-center">
          <Text className="text-7xl text-center mt-4">
            {moment(activity.content.plannedAt).format("LT")}
          </Text>
        </View>
        <View className="flex flex-row justify-center items-center">
          <MapPin size={30} color="#000" />
          <Text className="text-xl ml-2">{activity.content.address}</Text>
        </View>
        {activity.content.notes.length > 0 ? (
          <View className="px-5">{notes}</View>
        ) : (
          <Text className="text-base text-center mt-4">
            Pas de notes pour cette activité.
          </Text>
        )}
        <View className="flex flex-col bg-slate-200 rounded-lg p-2 mt-4 ">
          <Text className="mb-2">
            Ajouter une notification de rappel: (avant l'heure de l'activité)
          </Text>
          <View className="flex flex-row justify-around">
            <Pressable
              onPress={() => addNotification(5)}
              className="bg-[#F2A65A] p-2 rounded-lg"
            >
              <Text className="text-base text-white font-medium ">5 mins</Text>
            </Pressable>

            <Pressable
              onPress={() => addNotification(30)}
              className="bg-[#F2A65A] p-2 rounded-lg"
            >
              <Text className="text-base text-white font-medium ">30 mins</Text>
            </Pressable>
            <Pressable
              onPress={() => addNotification(60)}
              className="bg-[#F2A65A] p-2 rounded-lg"
            >
              <Text className="text-base text-white font-medium ">1 heure</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
