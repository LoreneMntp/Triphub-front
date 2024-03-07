import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react-native";

export default function SettingsScreen() {
  // const { username, email } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  const [modalInfo, setModalInfo] = useState(false);
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false); // État pour suivre si l'utilisateur est en train de changer de mot de passe
  const [inputValue1, setInputValue1] = useState(""); // Ancien mot de passe
  const [inputValue2, setInputValue2] = useState(""); // Nouveau mot de passe
  const [inputValue3, setInputValue3] = useState(""); // Confirmer le nouveau mot de passe

  // Affiche la modal au clic sur "Informations Personnelles"
  const handlePersonalInfoPress = () => {
    setModalInfo(true);
    console.log("Infos ok");
    setIsChangingPassword(false); // la modifi du mot de passe n'est pas activée lorsqu'on ouvre la modal
  };

  const handleDeleteAccountPress = () => {
    setModalDeleteAccount(true);
    console.log("Delete ok");
  };

  // Ferme la modal
  const closeModal = () => {
    setModalInfo(false);
    setModalDeleteAccount(false);
    setIsChangingPassword(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réglages</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonInfo} onPress={handlePersonalInfoPress}>
          <Text style={styles.buttonText}>Informations Personnelles</Text>
        </Pressable>
        <View>
          <Pressable
            style={styles.deleteButton}
            onPress={handleDeleteAccountPress}
          >
            <Text style={styles.buttonText}>Supprimer mon compte</Text>
          </Pressable>
        </View>
      </View>

      {/* Modal pour les informations personnelles */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalInfo}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <Pressable onPress={() => Keyboard.dismiss()}>
            <View style={styles.modalContent}>
              {/* Contenu de la modal */}
              <View style={styles.modalHeader}>
                <Pressable onPress={closeModal}>
                  <X size={25} strokeWidth={4} color="black" />
                </Pressable>
              </View>
              <View>
                <Text style={styles.titleModal}>Informations personnelles</Text>
                <Text style={styles.textModal}>Username :</Text>
                <Text style={styles.textModal}>Email :</Text>
                <Pressable
                  style={styles.buttonModal}
                  onPress={() => {
                    setIsChangingPassword(!isChangingPassword); // Inverse l'état de modification du mot de passe
                  }}
                >
                  <Text style={styles.buttonText}>
                    {isChangingPassword
                      ? "Annuler"
                      : "Modifier le mot de passe"}
                  </Text>
                </Pressable>
                {isChangingPassword && (
                  <>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setInputValue1(text)}
                      value={inputValue1}
                      placeholder="Ancien mot de passe"
                      placeholderTextColor="grey"
                      secureTextEntry={true} // Pour masquer le txt
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setInputValue2(text)}
                      value={inputValue2}
                      placeholder="Nouveau mot de passe"
                      placeholderTextColor="grey"
                      secureTextEntry={true} // Pour masquer le texte entré
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => setInputValue3(text)}
                      value={inputValue3}
                      placeholder="Confirmer le nouveau mot de passe"
                      placeholderTextColor="grey"
                      secureTextEntry={true} // Pour masquer le txt
                    />
                  </>
                )}
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal pour supprimer son compte */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDeleteAccount}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Contenu de la modal */}
            <View style={styles.modalHeader}>
              <Pressable onPress={closeModal}>
                <X size={25} strokeWidth={4} color="black" />
              </Pressable>
            </View>
            <View>
              <Text style={styles.titleModal}>Supprimer son compte</Text>
              <Text style={styles.textModalAccount}>
                Êtes-vous sûr de vouloir supprimer votre compte ?
              </Text>
              <Pressable style={styles.buttonModalAccount}>
                <Text style={styles.buttonText}>Oui</Text>
              </Pressable>
              <Pressable style={styles.buttonModalAccount}>
                <Text style={styles.buttonText}>Non</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    padding: 30,
    marginBottom: "10%",
  },
  buttonContainer: {
    width: "90%",
  },
  buttonInfo: {
    margin: "10%",
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "8%",
    alignSelf: "center",
    width: "100%",
    elevation: 5, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  deleteButton: {
    margin: "10%",
    backgroundColor: "#C10000",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "8%",
    alignSelf: "center",
    width: "100%",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    borderWidth: 2,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    height: "80%",
    padding: "5%",
    marginTop: "25%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end", // Pour aligner l'icône à droite
    padding: "5%",
  },
  titleModal: {
    alignSelf: "center",
    fontSize: 20,
    paddingHorizontal: "2%",
    fontWeight: "bold",
  },
  textModal: {
    fontSize: 15,
    marginTop: "8%",
    padding: "3%",
    borderColor: "#CCCCCC", // Couleur de la bordure
    borderRadius: 15,
    borderWidth: 1,
  },
  buttonModal: {
    alignSelf: "center",
    marginTop: "15%",
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "8%",
    alignSelf: "center",
    width: "80%",
    elevation: 5, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    margin: "1%",
    marginTop: "10%",
    padding: "3%",
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
  },
  buttonModalAccount: {
    alignSelf: "center",
    marginTop: "15%",
    backgroundColor: "#F2A65A",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "8%",
    alignSelf: "center",
    width: "50%",
    elevation: 5, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textModalAccount: {
    fontSize: 15,
    marginTop: "5%",
    padding: "5%",
    alignSelf: "center",
    textAlign: "center",
  },
});
