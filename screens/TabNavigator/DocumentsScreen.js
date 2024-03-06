import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import ViewDocumentsScreen from "../Stack/ViewDocumentsScreen";
import { useSelector, useDispatch } from "react-redux";
import { initDocuments } from "../../reducers/users";
export default function DocumentsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  //const [documentUris, setDocumentUris] = useState([]);
  //console.log("docuri", documentUris);
  const navigation = useNavigation();
  const userInfos = useSelector((state) => state.user.value);
  console.log("userInfosDoc", userInfos.documents);
  const openModal = (document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };
  const dispatch = useDispatch();

  //   const handleAddDocument = async () => {
  //     try {
  //       const document = await DocumentPicker.getDocumentAsync({
  //         type: "*/*",
  //         copyToCacheDirectory: false,
  //       });

  //       if (document.assets[0].uri) {
  //         const fileUri = document.assets[0].uri;
  //         const fileName = document.assets[0].name;

  //         const destinationUri = `${FileSystem.documentDirectory}${fileName}`; // Store in documentDirectory

  //         await FileSystem.copyAsync({
  //           from: fileUri,
  //           to: destinationUri,
  //         });

  //         setDocumentUris([
  //           ...documentUris,
  //           {
  //             uri: destinationUri,
  //             category: selectedDocument,
  //             fileName: fileName,
  //           },
  //         ]);
  //       }
  //     } catch (error) {
  //       console.error("Erreur lors de l'ajout du fichier:", error);
  //     }
  //   };

  const handleViewDocument = () => {
    navigation.navigate("ViewDocuments", { documentData: userInfos.documents });
  };

  const disabledModalButtonStyle = {
    ...modalButtonStyle,
    backgroundColor: "grey", // Changez la couleur pour griser le bouton
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/documents/${userInfos.user.token}`;
      const res = await fetch(url);
      const data = await res.json();
      //console.log("datadoc", data.documents);
      if (data.result) {
        // console.log("datadoc", data.documents);
        dispatch(initDocuments(data.documents));
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ padding: 80 }}>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 80,
          }}
        >
          Mes documents
        </Text>
        <Pressable
          style={buttonStyle}
          onPress={() => openModal("Billets de transport")}
        >
          <Text style={buttonTextStyle}>Billets de transport</Text>
        </Pressable>
        <Pressable
          style={buttonStyle}
          onPress={() => openModal("Réservations")}
        >
          <Text style={buttonTextStyle}>Réservations</Text>
        </Pressable>
        <Pressable style={buttonStyle} onPress={() => openModal("Identité")}>
          <Text style={buttonTextStyle}>Identité</Text>
        </Pressable>
        <Pressable
          style={buttonStyle}
          onPress={() => openModal("Autres documents")}
        >
          <Text style={buttonTextStyle}>Autres documents</Text>
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}
            >
              Que voulez-vous faire avec {selectedDocument}?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={modalButtonStyle}
                onPress={() => handleAddDocument()}
              >
                <Text style={modalButtonTextStyle}>Ajouter</Text>
              </Pressable>
              <Pressable
                style={
                  userInfos.documents.length > 0
                    ? modalButtonStyle
                    : disabledModalButtonStyle
                }
                onPress={() => {
                  if (userInfos.documents.length > 0) {
                    setModalVisible(false);
                    handleViewDocument();
                  }
                }}
              >
                <Text style={modalButtonTextStyle}>Lire</Text>
              </Pressable>

              <Pressable
                style={modalButtonStyleClose}
                onPress={() => setModalVisible(false)}
              >
                <Text style={modalButtonTextStyle}>Fermer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const buttonStyle = {
  backgroundColor: "#F58549",
  padding: 10,
  borderRadius: 5,
  marginVertical: 10,
  width: 250,
  alignItems: "center",
};

const modalButtonStyleClose = {
  backgroundColor: "#585123",
  padding: 10,
  borderRadius: 5,
  width: "25%",
  alignItems: "center",
};
const buttonTextStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: 20,
  textAlign: "center",
};

const modalButtonStyle = {
  backgroundColor: "#F2A65A",
  padding: 10,
  borderRadius: 5,
  width: "25%",
  alignItems: "center",
};

const modalButtonTextStyle = {
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
};
