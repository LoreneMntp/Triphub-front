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
import { FontAwesome5 } from "@expo/vector-icons";
import { ChevronLeft, Chrome, Facebook } from "lucide-react-native";
import React, { useState, useRef, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false); // État pour suivre si l'adresse mail est valide
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Pressable style={{ padding: 20, backgroundColor: "#fff" }}>
        <ChevronLeft style={styles.arrow} />
      </Pressable>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Créer un nouveau voyage</Text>

          {/* Input Email */}
          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              value={title}
              placeholder="Alger"
              inputMode="text"
              style={styles.input}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Créer un voyage</Text>
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
    padding: 40,
    textAlign: "center",
    fontSize: 40,
    marginBottom: 20,
  },
  arrow: {
    color: "black",
  },
  title: {
    fontSize: 28,
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
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    alignSelf: "center",
    width: "60%",
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
