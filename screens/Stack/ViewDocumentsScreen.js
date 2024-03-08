import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, Platform, Alert } from "react-native";
import PDFReader from "rn-pdf-reader-js";
import * as Print from 'expo-print';

export default function ViewDocumentsScreen({ route }) {
  const { url } = route.params;
  console.log(url)
  // Fonction pour gérer l'impression sur Android avec gestion d'erreurs
  const printDocument = async () => {
    try {
      await Print.printAsync({
        uri: url,
       
      });
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      Alert.alert("Erreur", "Impossible d'imprimer le document. Veuillez réessayer.");
    }
    
  };

  if (Platform.OS === 'ios') {
    return (
      <PDFReader
        source={{
          uri: url,
        }}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable onPress={printDocument} style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Lire le document</Text>
        </Pressable>
      </View>
    );
  }
}
