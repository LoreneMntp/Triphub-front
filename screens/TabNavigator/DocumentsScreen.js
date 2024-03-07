import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import ViewDocumentsScreen from "../Stack/ViewDocumentsScreen";
import { useSelector, useDispatch } from "react-redux";
import { initDocuments } from "../../reducers/users";
import { PlusCircle, Eye, Trash2, Filter } from "lucide-react-native";

export default function DocumentsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  //const [documentUris, setDocumentUris] = useState([]);
  //console.log("docuri", documentUris);
  const navigation = useNavigation();
  const userInfos = useSelector((state) => state.user.value);
  let dataBilletsTransport = [];
  if (userInfos.documents) {
    dataBilletsTransport = userInfos.documents.filter(
      (billet) => (billet.category = "Billets de transport")
    );
  }

  console.log("userInfosDoc", userInfos.documents);
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
            serial_phone: "123456789",
          }),
        });

        const data = await res.json();

        dispatch(initDocuments(data.documents));
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du fichier:", error);
    }
  };

  const handleViewDocument = () => {
    navigation.navigate("ViewDocuments", { documentData: userInfos.documents });
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
      //console.log("datadoc", data.documents);
      if (data.result) {
        // console.log("datadoc", data.documents);
        dispatch(initDocuments(data.documents));
      }
    };

    fetchData();
  }, []);

  const renderDocumentItem = ({ item }) => (
    <View style={styles.documentItem}>
      <Text style={styles.documentText}>{item.fileName}</Text>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => handleViewDocument(item)}>
          <Eye color="#4A90E2" size={24} />
        </Pressable>
        <Pressable onPress={() => handleDeleteDocument(item.link_doc)}>
          <Trash2 color="#E53935" size={24} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Gestion des documents</Text>
        <View style={styles.docs}>
          <View style={styles.buttonContainer}>
            <Text style={styles.selectedDocumentText}>
              Billets de transport
            </Text>
            <Pressable
              onPress={() => handleAddDocument("Billets de transport")}
            >
              <PlusCircle color="#4A90E2" size={24} />
            </Pressable>
          </View>
          {dataBilletsTransport && (
            <FlatList
              data={dataBilletsTransport} // Utilisez mockData directement ici
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
    padding: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
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
  },
  docs: {
    backgroundColor: "white",
    paddingVertical: 15,
    marginTop: 10,
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
    marginRight: 10, // Assure un espacement entre le texte et l'icône
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 100, // Assure un espacement suffisant entre les icônes
  },
});
