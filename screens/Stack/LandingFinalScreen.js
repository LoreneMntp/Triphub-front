import React, { useState, useRef } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Circle } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import ConfettiCannon from "react-native-confetti-cannon";

export default function LandingScreen() {
  const logo = require("../../assets/logo.png");
  const backgroundImage = require("../../assets/background.jpg");
  const [buttonText, setButtonText] = useState("Commencer l'aventure !");
  const navigation = useNavigation();
  const confettiRef = useRef(null);

  function handleNavigateToLogin() {
    navigation.navigate("Login");
  }

  const handlePress = () => {
    if (confettiRef.current) {
      confettiRef.current.start();
    }
    setButtonText("L'aventure commence !");
    setTimeout(() => {
      handleNavigateToLogin();
    }, 5000);
    setTimeout(() => {
      setButtonText("Commencer l'aventure !");
    }, 7000);
  };

  const glowAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.1, { duration: 900, easing: Easing.linear }),
            withTiming(1.2, { duration: 900, easing: Easing.linear }),
            withTiming(1, { duration: 1800, easing: Easing.linear })
          ),
          -1,
          true
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Image source={backgroundImage} style={styles.backgroundImage} />
      </View>
      <View style={styles.overlay} />
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

      <View style={styles.content}>
        <View style={styles.appName}>
          <View style={styles.logoContainer}>
            <Animatable.Image
              animation="fadeIn"
              duration={1000}
              delay={500}
              style={styles.logo}
              source={logo}
            />
            <Animatable.Text
              animation="fadeIn"
              duration={1000}
              delay={1000}
              style={styles.title}
            >
              TripHub
            </Animatable.Text>
          </View>
          <Text style={styles.text}>
            Explorez le monde avec Triphub à vos côtés.
          </Text>
        </View>
      </View>

      <Animated.View
        animation="fadeIn"
        duration={1000}
        style={[styles.button, styles.glowContainer, glowAnimation]}
      >
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      </Animated.View>

      <ConfettiCannon
        ref={confettiRef}
        count={500}
        origin={{ x: 180, y: -15 }}
        explosionSpeed={500}
        fadeOut={true}
        autoStart={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    position: "relative",
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "110%",
    zIndex: -2,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    opacity: 0.9,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },
  circleBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  circle1: {
    position: "absolute",
    bottom: "65%",
    right: "55%",
    strokeWidth: 0,
    opacity: 0.4,
  },
  circle2: {
    position: "absolute",
    top: "10%",
    right: "10%",
  },
  circle4: {
    position: "absolute",
    top: "65%",
    left: "5%",
    opacity: 0.5,
  },
  circle5: {
    position: "absolute",
    top: "80%",
    left: "5%",
    opacity: 0.3,
  },
  content: {
    flex: 1,
    padding: 50,
  },
  logoContainer: {
    bottom: 10,
    left: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    flexWrap: "wrap",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: 400,
    top: "20%",
  },
  button: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    bottom: "10%",
    width: "auto",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  glowContainer: {
    borderRadius: 20,
    backgroundColor: "rgba(242, 166, 90, 0.1)",
  },
});
