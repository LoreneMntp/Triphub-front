import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { ChevronLeft, Phone } from "lucide-react-native";
import { useSelector } from "react-redux";

export default function HelpScreen({ navigation }) {
  const sosInfos = useSelector((state) => state.user.value);
  

  const handlePress = () => {
    navigation.goBack();
  };
  const { trips, selectedTripId} = useSelector((state) => state.user.value);

  const selectedTrip = trips.filter((trip) => trip._id === selectedTripId);
  

  const handleCallPress = () => {
    const emergencyNumber =
      selectedTrip[0].sos_infos.emergency_number;
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  return (
    <ScrollView>
      <View>
        <Pressable style={styles.pressableContainer} onPress={handlePress}>
          <ChevronLeft style={styles.arrow} />
        </Pressable>

        <View style={styles.container}>
          <Text style={styles.title}>SOS</Text>

          {/* Affichage du numéro d'urgence du pays */}

          <View>
            <Text style={styles.nameText}>Numéro d'urgence</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 15 }}>{selectedTrip[0].sos_infos.emergency_number}</Text>
                <Pressable onPress={handleCallPress}>
                  <Phone style={styles.icon} />
                </Pressable>
              </View>
            </View>

            {/* Affichage des informations sur l'ambassade */}
            <Text style={styles.nameText}>Ambassade</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <Text>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Adresse: </Text>{selectedTrip[0].sos_infos.embassy.address}
                </Text>
              </View>
              <View style={styles.infoText}>
                <Text>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Téléphone: </Text>{selectedTrip[0].sos_infos.embassy.phone}
                </Text>
              </View>
              <View style={styles.infoText}>
                <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Email: </Text>{selectedTrip[0].sos_infos.embassy.email}</Text>
              </View>
            </View>

            {/* Affichage des informations sur le consulat */}
            <Text style={styles.nameText}>Consulat(s)</Text>
            {selectedTrip[0].sos_infos.consulate.map((consulate, index) => (
              <View key={index} style={styles.infoContainer}>
                <View style={styles.infoText}>
                  <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Adresse: </Text>{consulate.address}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Téléphone: </Text>{consulate.phone}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Email: </Text>{consulate.email}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Numéro: </Text>{consulate.phone}</Text>
                </View>
              </View>
            ))}

            {/* Affichage des contacts utiles */}
            <Text style={styles.nameText}>Contacts utiles</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <Text><Text style={{ fontWeight: 'bold', color: 'black' }}>Police : </Text>{selectedTrip[0].sos_infos.police_number}</Text>
              </View>
              <View style={styles.infoText}>
                <Text>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Urgences : </Text>{selectedTrip[0].sos_infos.emergency_number}
                </Text>
              </View>
              <View style={styles.infoText}>
                <Text>
                <Text style={{ fontWeight: 'bold', color: 'black' }}>Pompiers : </Text>{selectedTrip[0].sos_infos.firefighter_number}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    paddingTop: 20,
  },
  container: {
    margin: 20,
    backgroundColor: "#F2F4F5"
  },
  arrow: {
    color: "black",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  nameText: {
    textAlign: "center",
    fontWeight: "bold",
    paddingLeft: 0,
    marginTop: 40,
    marginBottom: 10,
    fontSize: 20
  },
  icon: {
    fontSize: 24,
    marginLeft: 10,
    color: "green",
  },
  infoContainer: {
    backgroundColor: "#EEC170",
    borderRadius: 15,
    marginVertical: 5,
    padding: 20,
    margin: 10,
    flexWrap: "wrap", // Ajout de flexWrap pour permettre au contenu de passer à la ligne
    flexDirection: "column",
  },
  infoText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 3,
  },
});
