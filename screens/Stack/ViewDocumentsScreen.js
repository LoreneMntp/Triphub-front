import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print'; // Import du module Print pour l'impression
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import du module FileSystem pour la gestion des fichiers

export default function ViewDocumentsScreen({ route }) {
  const { documentUris } = route.params;

  // Fonction pour ouvrir et imprimer le fichier PDF
  const openPDF = async (uri) => {
    try {
      let documentUri = uri;
      // Vérifier si l'application s'exécute sur Android et si le chemin d'accès au fichier ne commence pas par 'file://'
      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        // Copier le fichier PDF dans le répertoire de documents
        const destinationUri = `${FileSystem.documentDirectory}${uri.substring(uri.lastIndexOf('/') + 1)}`;
        await FileSystem.copyAsync({ from: uri, to: destinationUri });
        documentUri = destinationUri; // Utiliser le nouveau chemin d'accès pour l'impression
      }
      await Print.printAsync({ uri: documentUri }); // Imprimer le fichier PDF
    } catch (error) {
      console.error('Erreur lors de l\'impression du document:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/* Parcourir la liste des URI de documents */}
        {documentUris.map((uri, index) => {
          // Vérifier si l'URI se termine par '.pdf'
          if (uri.toLowerCase().endsWith('.pdf')) {
            // Afficher un composant TouchableOpacity pour l'impression du PDF
            return (
              <TouchableOpacity key={index} onPress={() => openPDF(uri)} style={styles.pdfContainer}>
                <Text style={styles.pdfText}>PDF</Text>
              </TouchableOpacity>
            );
          } else {
            // Afficher une image pour les autres types de fichiers
            return (
              <View key={index} style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri }}
                />
              </View>
            );
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles CSS pour les composants
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '90%',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  pdfContainer: {
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#e1e4e8',
  },
  pdfText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
