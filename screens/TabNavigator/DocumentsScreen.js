import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import ViewDocumentsScreen from '../Stack/ViewDocumentsScreen';

export default function DocumentsScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState('');
    const [documentUris, setDocumentUris] = useState([]);
    const navigation = useNavigation();

    const openModal = (document) => {
        setSelectedDocument(document);
        setModalVisible(true);
    };

    const handleAddDocument = async () => {
        try {
            const document = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: false
            });
    
            console.log('Document sélectionné:', document);
    
            if (document.assets[0].uri) {
                const fileUri = document.assets[0].uri;
                const fileName = document.assets[0].name;
                console.log('Nom du fichier:', fileName);
    
                const destinationUri = `${FileSystem.documentDirectory}${fileName}`; // Store in documentDirectory
    
                console.log('URI de destination:', destinationUri);
    
                await FileSystem.copyAsync({
                    from: fileUri,
                    to: destinationUri
                });
    
                console.log('Fichier copié avec succès');
                setDocumentUris([...documentUris, destinationUri]);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du fichier:', error);
        }
    };
    
    const handleViewDocument = () => {
        navigation.navigate('ViewDocuments', { documentUris: documentUris });
    };
    

    return (
        <View style={{ padding: 40 }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                    View Documents Screen
                </Text>
                <Pressable
                    style={buttonStyle}
                    onPress={() => openModal('Billets de transport')}>
                    <Text style={buttonTextStyle}>Billets de transport</Text>
                </Pressable>
                <Pressable
                    style={buttonStyle}
                    onPress={() => openModal('Réservations')}>
                    <Text style={buttonTextStyle}>Réservations</Text>
                </Pressable>
                <Pressable
                    style={buttonStyle}
                    onPress={() => openModal('Identité')}>
                    <Text style={buttonTextStyle}>Identité</Text>
                </Pressable>
                <Pressable
                    style={buttonStyle}
                    onPress={() => openModal('Autres documents')}>
                    <Text style={buttonTextStyle}>Autres documents</Text>
                </Pressable>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, marginBottom: 20 }}>Que voulez-vous faire avec {selectedDocument}?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable
                                style={modalButtonStyle}
                                onPress={() => handleAddDocument()}>
                                <Text style={modalButtonTextStyle}>Ajouter</Text>
                            </Pressable>
                            <Pressable
                                style={modalButtonStyle}
                                onPress={() => {
                                    setModalVisible(false);
                                    handleViewDocument(); // Adjusted to no longer need a specific document URI
                                }}>
                                <Text style={modalButtonTextStyle}>Lire</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const buttonStyle = {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
};

const buttonTextStyle = {
    color: 'white',
    fontWeight: 'bold',
};

const modalButtonStyle = {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
};

const modalButtonTextStyle = {
    color: 'white',
    fontWeight: 'bold',
};
