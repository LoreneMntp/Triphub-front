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

export default function HelpScreen({ navigation }) {
  const handlePress = () => {
    navigation.goBack();
  };

  const CountryData = {
    sos_infos: [
      {
        country: "United States of America",
        embassy: {
          address: "122 Example Street",
          phone: "500-123-456-789",
          email: "france-ambassade@americanmail.com",
          emergency_phone: "500-123-123-123",
        },
        consulate: [
          {
            address: "123 Example Street",
            phone: "500-123-456-789",
            email: "france-consulat@americanmail.com",
            emergency_phone: "500-123-123-123",
          },
        ],
        emergency_number: "911",
        police_number: "911",
        firefighter_number: "911",
        member_112: true,
      },
    ],
  };

  const handleCallPress = () => {
    const emergencyNumber = CountryData.sos_infos[0].emergency_number;
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
          {CountryData.sos_infos.map((countryInfo, index) => (
            <View key={index}>
              <Text style={styles.nameText}>Numéro d'urgence</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoText}>
                  <Text>{countryInfo.emergency_number}</Text>
                  <Pressable onPress={handleCallPress}>
                    <Phone style={styles.icon} />
                  </Pressable>
                </View>
              </View>

              {/* Affichage des informations sur l'ambassade */}
              <Text style={styles.nameText}>Ambassade</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoText}>
                  <Text>Adresse: {countryInfo.embassy.address}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text>Téléphone: {countryInfo.embassy.phone}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text>Email: {countryInfo.embassy.email}</Text>
                </View>
              </View>

              {/* Affichage des informations sur le consulat */}
              <Text style={styles.nameText}>Consulat</Text>
              {countryInfo.consulate.map((consulate, index) => (
                <View key={index} style={styles.infoContainer}>
                  <View style={styles.infoText}>
                    <Text>Adresse: {consulate.address}</Text>
                  </View>
                  <View style={styles.infoText}>
                    <Text>Téléphone: {consulate.phone}</Text>
                  </View>
                  <View style={styles.infoText}>
                    <Text>Email: {consulate.email}</Text>
                  </View>
                </View>
              ))}

              {/* Affichage des contacts utiles */}
              <Text style={styles.nameText}>Contacts utiles</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoText}>
                  <Text>Police : {countryInfo.police_number}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text>Urgences : {countryInfo.emergency_number}</Text>
                </View>
                <View style={styles.infoText}>
                  <Text>Pompiers : {countryInfo.firefighter_number}</Text>
                </View>
              </View>
            </View>
          ))}
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
    margin: 10,
  },
  arrow: {
    color: "black",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    padding: 30,
    alignItems: "center",
    textAlign: "center",
  },
  nameText: {
    textAlign: "left",
    fontWeight: "bold",
    paddingLeft: 30,
    marginTop: 40,
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginLeft: 10,
    color: "black",
  },
  infoContainer: {
    backgroundColor: "#E3E5E5",
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
