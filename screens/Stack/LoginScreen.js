import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Pressable,
  Platform,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false); // État pour suivre si l'adresse mail est valide
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  async function handleSubmitSignIn() {
    if (!isEmailValid) {
      alert("Please enter a valid email address.");
      return;
    }

    if (email && password) {
      try {
        const login = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await login.json();
        if (data.result === true) {
          dispatch(
            login({
              email: email,
              token: data.token,
              name: data.name,
            })
          );
          setPassword("");
          setEmail("");
          navigation.navigate("HomePage"); // Naviguer vers HomePage après la connexion réussie ?
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Error occurred while logging in:", error);
        alert("An error occurred while logging in. Please try again later.");
      }
    } else {
      alert("Invalid email or password.");
    }
  }
  //"error occurred while logging in" avec le code ci-dessus, je trouve pas pourquoi

  // Vérifie si l'e-mail est valide lors de chaque changement
  function handleEmailChange(text) {
    setEmail(text);
    setIsEmailValid(EMAIL_REGEX.test(text));
  }

  //Rend le password invisible
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Naviguer vers la page d'inscription
  function handleNavigateToRegister() {
    navigation.navigate("Register");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          {/* Input Email */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              onChangeText={handleEmailChange}
              style={[
                styles.input,
                { color: isEmailValid ? "black" : "grey" }, // Condition pour la couleur du texte quand valid ou non
              ]}
            />
          </View>

          {/* Input Password */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible} // permet de masquer le mdp quand on écrit
                style={styles.passwordInput}
              />
              <Pressable
                onPress={togglePasswordVisibility} // permet d'afficher le mdp quand on appuie sur l'icône
                style={styles.eyeIconContainer}
              >
                <FontAwesome5
                  name={isPasswordVisible ? "eye-slash" : "eye"}
                  size={14}
                  color="grey"
                />
              </Pressable>
            </View>
          </View>

          {/* Button Login */}
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleSubmitSignIn} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                fontWeight: "bold",
                padding: 10,
              }}
            >
              OR
            </Text>
          </View>

          {/* Button Google */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                // Action à effectuer lors du clic sur le bouton Google
              }}
              style={styles.googleButton}
            >
              <FontAwesome5
                name="google"
                size={24}
                color="red"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </Pressable>
          </View>

          {/* Button Facebook */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                // Action à effectuer lors du clic sur le bouton Facebook
              }}
              style={styles.facebookButton}
            >
              <FontAwesome5
                name="facebook"
                size={24}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Continue with Facebook
              </Text>
            </Pressable>
          </View>

          {/* Button Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>No Account yet ?</Text>
            <Pressable
              onPress={handleNavigateToRegister}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 30,
  },
  inputContainer: {
    width: "80%",
    maxWidth: 500,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#F2F4F5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: "#000",
    marginBottom: 20,
    width: "100%",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F4F5",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  eyeIconContainer: {
    padding: 10,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#EEC170",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    alignSelf: "center",
    width: "60%",
    marginBottom: 50,
    elevation: 5, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
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
  googleButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 30,
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "80%",
  },
  facebookButton: {
    flexDirection: "row",
    backgroundColor: "#3b5998",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "80%",
  },
  socialButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    fontWeight: "bold",
    padding: 30,
  },
  registerButton: {
    backgroundColor: "#EEC170",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    elevation: 5, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
