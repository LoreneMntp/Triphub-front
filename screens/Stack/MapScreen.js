import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const { trips, selectedTripId } = useSelector((state) => state.user.value);
  const selectedTrip = trips.find((trip) => trip._id === selectedTripId);
  const consulates = selectedTrip && selectedTrip.sos_infos && selectedTrip.sos_infos.consulate ? selectedTrip.sos_infos.consulate : [];

  // Définir une région initiale basée sur l'emplacement de l'ambassade ou un emplacement par défaut
  const initialRegion = {
    latitude: selectedTrip && selectedTrip.sos_infos && selectedTrip.sos_infos.embassy ? parseFloat(selectedTrip.sos_infos.embassy.latitude) : 0, // Remplacer par une latitude par défaut si nécessaire
    longitude: selectedTrip && selectedTrip.sos_infos && selectedTrip.sos_infos.embassy ? parseFloat(selectedTrip.sos_infos.embassy.longitude) : 0, // Remplacer par une longitude par défaut si nécessaire
    latitudeDelta: 5, // Ajuster selon la taille du pays
    longitudeDelta: 5, // Ajuster selon la taille du pays
  };

  
  const zoomToMarker = (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {selectedTrip && selectedTrip.sos_infos && selectedTrip.sos_infos.embassy && (
          <Marker
            identifier="embassy"
            coordinate={{
              latitude: parseFloat(selectedTrip.sos_infos.embassy.latitude),
              longitude: parseFloat(selectedTrip.sos_infos.embassy.longitude),
            }}
            title={`Ambassade en ${selectedTrip.country}`}
            description={selectedTrip.sos_infos.embassy.address}
            pinColor="red"
          />
        )}
        {consulates.map((consulate, index) => consulate.latitude && consulate.longitude ? (
          <Marker
            key={index}
            identifier={`consulate-${index}`}
            coordinate={{ latitude: parseFloat(consulate.latitude), longitude: parseFloat(consulate.longitude) }}
            title={`Consulat en ${selectedTrip.country}`}
            description={consulate.address}
            pinColor="red"
          />
        ) : null)}
      </MapView>
      <View style={styles.addressOverlay}>
        <ScrollView horizontal={true} style={styles.addressList} showsHorizontalScrollIndicator={false}>
          {selectedTrip && selectedTrip.sos_infos && selectedTrip.sos_infos.embassy && (
            <TouchableOpacity
              style={styles.addressContainer}
              onPress={() => zoomToMarker(parseFloat(selectedTrip.sos_infos.embassy.latitude), parseFloat(selectedTrip.sos_infos.embassy.longitude))}
            >
              <Text style={styles.addressText}>
                Ambassade de France : {selectedTrip.sos_infos.embassy.address}
              </Text>
            </TouchableOpacity>
          )}
          {consulates.map((consulate, index) => (
            <TouchableOpacity
              key={index}
              style={styles.addressContainer}
              onPress={() => zoomToMarker(parseFloat(consulate.latitude), parseFloat(consulate.longitude))}
            >
              <Text style={styles.addressText}>
                {consulate.address}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
  },
  addressList: {
    height: 150,
  },
  addressContainer: {
    alignItems: 'center',
    backgroundColor: '#EEC170',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: 20, // Bords arrondis pour un look moderne
    shadowColor: "#000", // Ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15, // Élévation pour Android (effet d'ombre)
  },
  addressText: {
    fontSize: 16,
    textAlign: "center",
    color: 'black',
    marginHorizontal: 10,
    flexWrap: 'wrap', 
    width: 300, // Largeur fixe pour assurer l'uniformité et le passage à la ligne
  },
});
