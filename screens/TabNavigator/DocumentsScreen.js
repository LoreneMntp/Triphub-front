import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import ViewDocumentsScreen from "../Stack/ViewDocumentsScreen";
import { useSelector, useDispatch } from "react-redux";
import { initDocuments } from "../../reducers/users";
import ButtonOpenPDF from "../../components/ButtonOpenPDF";
import {
  PlusCircle,
  Eye,
  Trash2,
  Filter,
  ChevronLeft,
} from "lucide-react-native";
import Constants from "expo-constants";

export default function DocumentsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const navigation = useNavigation();
  const userInfos = useSelector((state) => state.user.value);
  const installationId = Constants.installationId;

  const openModal = (document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };
  const dispatch = useDispatch();

  const handleAddDocument = async (category) => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
      });

      if (document.assets[0].uri) {
        const fileUri = document.assets[0].uri;
        const fileName = document.assets[0].name;

        const destinationUri = `${FileSystem.documentDirectory}${fileName}`; // Store in documentDirectory
        await FileSystem.copyAsync({
          from: fileUri,
          to: destinationUri,
        });

        const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addDocument`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: userInfos.user.token,
            title: category,
            fileName: fileName,
            category: category,
            link_doc: fileUri,
            serial_phone: installationId,
          }),
        });

        const data = await res.json();

        dispatch(initDocuments(data.documents));
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du fichier:", error);
    }
  };

  const handleDeleteDocument = async (id) => {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/deleteDocument`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: userInfos.user.token,
        documentId: id,
      }),
    });

    const data = await res.json();

    dispatch(initDocuments(data.documents));
  };

  // const disabledModalButtonStyle = {
  //   ...modalButtonStyle,
  //   backgroundColor: "grey", // Changez la couleur pour griser le bouton
  // };

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/documents/${userInfos.user.token}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.result) {
        dispatch(initDocuments(data.documents));
      }
    };

    fetchData();
  }, []);

  const handlePress = () => {
    navigation.goBack();
  };

  const renderDocumentItem = ({ item }) => (
    <View style={styles.documentItem}>
      <Text style={styles.documentText}>{item.fileName}</Text>
      <View style={styles.iconContainer}>
        <ButtonOpenPDF fileName={item.fileName} url={item.link_doc} />
        <Pressable onPress={() => handleDeleteDocument(item._id)}>
          <Trash2 color="#E53935" size={24} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressableContainer} onPress={handlePress}>
        <ChevronLeft style={styles.arrow} />
      </Pressable>
      <Text style={styles.header}>Gestion des documents</Text>
      <View style={styles.docs}>
        <View style={styles.buttonContainer}>
          <Text style={styles.selectedDocumentText}>Billets de transport</Text>
          <Pressable onPress={() => handleAddDocument("transport")}>
            <PlusCircle color="#F58549" size={24} />
          </Pressable>
        </View>
        {userInfos.documents && (
          <FlatList
            data={userInfos.documents.filter(
              (billet) =>
                billet.category === "transport" &&
                billet.serial_phone === installationId
            )} // Utilisez mockData directement ici
            keyExtractor={(item) => item._id}
            renderItem={renderDocumentItem}
          />
        )}
      </View>
      <View style={styles.docs}>
        <View style={styles.buttonContainer}>
          <Text style={styles.selectedDocumentText}>Réservation</Text>
          <Pressable onPress={() => handleAddDocument("reservation ")}>
            <PlusCircle color="#F58549" size={24} />
          </Pressable>
        </View>
        {userInfos.documents && (
          <FlatList
            data={userInfos.documents.filter(
              (billet) =>
                billet.category === "reservation" &&
                billet.serial_phone === installationId
            )} // Utilisez mockData directement ici
            keyExtractor={(item) => item._id}
            renderItem={renderDocumentItem}
          />
        )}
      </View>
      <View style={styles.docs}>
        <View style={styles.buttonContainer}>
          <Text style={styles.selectedDocumentText}>Identité</Text>
          <Pressable onPress={() => handleAddDocument("identity")}>
            <PlusCircle color="#F58549" size={24} />
          </Pressable>
        </View>
        {userInfos.documents && (
          <FlatList
            data={userInfos.documents.filter(
              (billet) =>
                billet.category === "identity" &&
                billet.serial_phone === installationId
            )} // Utilisez mockData directement ici
            keyExtractor={(item) => item._id}
            renderItem={renderDocumentItem}
          />
        )}
      </View>
      <View style={styles.docs}>
        <View style={styles.buttonContainer}>
          <Text style={styles.selectedDocumentText}>Autres documents</Text>
          <Pressable onPress={() => handleAddDocument("others")}>
            <PlusCircle color="#F58549" size={24} />
          </Pressable>
        </View>
        {userInfos.documents && (
          <FlatList
            data={userInfos.documents.filter(
              (billet) =>
                billet.category === "others" &&
                billet.serial_phone === installationId
            )} // Utilisez mockData directement ici
            keyExtractor={(item) => item._id}
            renderItem={renderDocumentItem}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 70,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
    elevation: 3, // Ajoute une ombre sous Android
    shadowColor: "#000", // Ajoute une ombre sous iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: "#EEC170",
  },
  docs: {
    backgroundColor: "white",
    paddingVertical: 15,
    marginTop: 10,
    elevation: 3, // Ajoute une ombre sous Android
    shadowColor: "#000", // Ajoute une ombre sous iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  documentItem: {
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  documentText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedDocumentText: {
    fontSize: 16,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 100,
  },
});
