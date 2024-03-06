import React, { useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Circle } from "lucide-react-native";

// J'ai pris une image libre de droit sur pixabay
const myImage = require("../../assets/van.jpg");

export default function LandingFinalScreen() {
  const navigation = useNavigation();
  const [buttonText, setButtonText] = useState("Start the Adventure");

  // Naviguer vers la page login
  function handleNavigateToLogin() {
    navigation.navigate("Login");
  }

  // Modifie la couleur à l'appui sur le bouton
  const logPress = (pressType) => {
    console.log(pressType);
  };

  const handlePress = () => {
    setButtonText("Adventure Started!");
    setTimeout(() => {
      setButtonText("Start the Adventure");
      handleNavigateToLogin(); // Naviguer vers la page login après le délai
    }, 2000); // Attendre 2 secondes avant de réinitialiser le texte du bouton
    // Autres actions à effectuer lors de l'appui sur le bouton
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}></View>
      {/* Cercles en arrière-plan */}
      <View style={styles.circleBackground}>
        <Circle
          strokeWidth={0}
          absoluteStrokeWidth
          style={styles.circle1}
          fill="#F58549"
          size={300}
        />

        <Circle
          style={styles.circle2}
          strokeWidth={0}
          absoluteStrokeWidth
          fill="white"
          size={50}
        />
        <Circle
          style={styles.circle3}
          strokeWidth={0}
          absoluteStrokeWidth
          fill="white"
          size={180}
        />
        <Circle
          style={styles.circle4}
          strokeWidth={0}
          absoluteStrokeWidth
          fill="#F58549"
          size={600}
        />
        <Circle
          style={styles.circle5}
          strokeWidth={0}
          absoluteStrokeWidth
          fill="#FFA6CC"
          size={600}
        />
      </View>

      {/* Contenu de l'écran */}
      <Text style={styles.title}>TripHub</Text>
      <Image style={styles.image} source={myImage} />
      <Text style={styles.text}>
        Explore the World with TripHub by your side
      </Text>
      <Pressable
        onPress={() => {
          logPress("onPress");
          handlePress(); // Appel de la fonction handlePress lors de l'appui sur le bouton
        }}
        onPressIn={() => logPress("onPressIn")}
        onPressOut={() => logPress("onPressOut")}
        onLongPress={() => logPress("onLongPress")}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.5 : 1 }, // Ajout opacité en fonction de l'état "pressed"
        ]}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    position: "relative",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFC27C",
    zIndex: -2, // Place le fond en-dessous des cercles
    opacity: 0.7,
  },
  circleBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1, // permet que les cercles soient derrière les autres éléments
  },
  circle1: {
    position: "absolute",
    bottom: "65%",
    right: "75%",
    strokeWidth: 0,
    opacity: 0.8,
  },

  circle2: {
    position: "absolute",
    top: "10%",
    right: "10%",
  },
  circle3: {
    position: "absolute",
    top: "70%",
    right: "50%",
    opacity: 0.9,
  },
  circle4: {
    position: "absolute",
    top: "65%",
    left: "5%",
    opacity: 0.8,
  },
  circle5: {
    position: "absolute",
    top: "80%",
    left: "5%",
    opacity: 0.6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 60,
    marginTop: "30%",
  },

  image: {
    width: "130%",
    height: "40%",
    resizeMode: "contain", // Empêche que l'image soit coupée
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: "20%",
    paddingBottom: "10%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "60%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
