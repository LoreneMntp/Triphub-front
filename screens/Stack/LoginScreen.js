import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { login } from "../../reducers/users";
import { Chrome, Facebook } from "lucide-react-native";
import { ChevronLeft } from "lucide-react-native";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/;

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function handleSubmitSignIn() {
    if (!isEmailValid) {
      alert("Please enter a valid email address.");
      return;
    }

    if (email && password) {
      try {
        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/login`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const data = await res.json();
        if (data.result === true) {
          //console.log('data:', data);
          dispatch(
            login({
              email: data.user.email,
              token: data.user.token,
              username: data.user.username,
            })
          );
          setPassword("");
          setEmail("");
          navigation.navigate("Home"); // Naviguer vers HomePage après la connexion réussie ?
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la connexion :",
          error
        );
        alert("Une erreur s'est produite lors de la connexion. Réessayez.");
      }
    } else {
      alert("E-mail ou mot de passe invalide.");
    }
  }

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailValid(EMAIL_REGEX.test(text));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Connexion</Text>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Email"
              onChangeText={handleEmailChange}
              inputMode="email"
              style={[styles.input, { color: isEmailValid ? "black" : "grey" }]}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                autoCapitalize="none"
                value={password}
                placeholder="Mot de passe"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
              />
              <Pressable
                onPress={togglePasswordVisibility}
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

          <View style={styles.buttonContainer}>
            <Pressable onPress={handleSubmitSignIn} style={styles.button}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </Pressable>
            <Text style={styles.or}>OU</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.google}>
              <Chrome style={styles.googleIcon} />
              <Text style={styles.google_text}>Continuer avec Google</Text>
            </Pressable>
            <Pressable style={styles.facebook}>
              <Facebook style={styles.facebookIcon} />
              <Text style={styles.facebook_text}>Continuer avec Facebook</Text>
            </Pressable>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pas encore de compte ?</Text>
            <Pressable
              onPress={handleNavigateToRegister}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    textAlign: "center",
    fontSize: 40,
    marginBottom: 20,
  },
  arrow: {
    color: "black",
    paddingTop: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: 20,
  },
  inputContainer: {
    width: "100%",
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
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    alignSelf: "center",
    width: "100%",
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
    fontSize: 20,
  },
  or: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  google: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  googleIcon: {
    marginRight: 10,
    color: "#F2A65A",
  },
  google_text: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  facebook: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  facebookIcon: {
    marginRight: 10,
    color: "#1877F2",
  },
  facebook_text: {
    color: "black",
    fontSize: 15,
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
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    elevation: 5,
    shadowColor: "#000",
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

export default LoginScreen;
