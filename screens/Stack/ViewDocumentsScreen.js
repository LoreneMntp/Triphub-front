import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewDocumentsScreen({ route }) {
  const { documentUris } = route.params; // Assurez-vous que documentUris est un tableau d'URIs

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {documentUris.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    // Définir le style du conteneur d'image pour aligner correctement les images
    width: '90%', // ajustez la largeur selon vos besoins
    marginVertical: 10, // espace entre les images
  },
  image: {
    // Définir le style de l'image pour l'afficher correctement
    width: '100%', // utiliser 100% de la largeur du conteneur
    height: 200, // définir une hauteur fixe ou dynamique selon vos besoins
    resizeMode: 'contain', // s'assurer que l'image est entièrement visible
  },
});
