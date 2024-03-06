import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Trash2 } from 'lucide-react-native'; 


export default function ViewDocumentsScreen({ route }) {
  const { documentData: initialDocumentData } = route.params;
  const [documentData, setDocumentData] = useState(initialDocumentData);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [documentToDeleteUri, setDocumentToDeleteUri] = useState('');

  const openPDF = async (uri) => {
    try {
      let documentUri = uri;
      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        const destinationUri = `${FileSystem.documentDirectory}${uri.substring(uri.lastIndexOf('/') + 1)}`;
        await FileSystem.copyAsync({ from: uri, to: destinationUri });
        documentUri = destinationUri;
      }
      await Print.printAsync({ uri: documentUri });
    } catch (error) {
      }
  };

  const viewImage = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  const deleteDocument = (uri) => {
    setDocumentData(documentData.filter(doc => doc.uri !== uri));
    setConfirmModalVisible(false);
  };

  const groupedDocuments = documentData.reduce((acc, curr) => {
    (acc[curr.category] = acc[curr.category] || []).push(curr);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {Object.entries(groupedDocuments).map(([category, documents]) => (
          <View key={category}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {documents.map((doc, index) => (
              <View key={index} style={styles.documentRow}>
                <TouchableOpacity onPress={() => doc.uri.toLowerCase().endsWith('.pdf') ? openPDF(doc.uri) : viewImage(doc.uri)} style={styles.documentContainer}>
                  <Text>{doc.fileName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteIcon} onPress={() => {
                  setDocumentToDeleteUri(doc.uri);
                  setConfirmModalVisible(true);
                }}>
                  <Trash2 name="delete" size={24} color="red"/>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      {/* Modale pour la suppression */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textDelete}>Êtes-vous sûr de vouloir supprimer ce document ?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={[styles.button, styles.buttonConfirm]} onPress={() => deleteDocument(documentToDeleteUri)}>
                <Text style={styles.textStyle}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.textStyle}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modale pour l'affichage de l'image reste inchangée */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#FFF3E0', 
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  documentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: 'transparent', 
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buttonConfirm: {
    backgroundColor: '#E53935', 
    marginRight: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  },
  categoryHeader: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    color: '#FF7043', 
    paddingVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#FF7043', 
  },
  textStyle: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textDelete: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FF7043', 
  },fullImage: {
    width: 300, // Vous pouvez ajuster cette taille selon les besoins
    height: 400, // Ajustez en fonction de l'aspect ratio souhaité
    marginBottom: 15,
    resizeMode: 'contain', // Assurez-vous que l'image est entièrement visible
  },
});
