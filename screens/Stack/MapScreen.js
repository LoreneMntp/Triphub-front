import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const { trips, selectedTripId } = useSelector((state) => state.user.value);
  const selectedTrip = trips.find((trip) => trip._id === selectedTripId);
  const consulates = selectedTrip?.sos_infos?.consulate || [];
  const [currentPosition, setCurrentPosition] = useState(null);

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setCurrentPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    fitAllMarkers();
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (currentPosition || selectedTrip) {
      fitAllMarkers();
    }
  }, [currentPosition, selectedTrip]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      0.5 - Math.cos(dLat) / 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  const fitAllMarkers = () => {
    const markers = [];

    if (selectedTrip?.sos_infos?.embassy) {
      markers.push({
        latitude: parseFloat(selectedTrip.sos_infos.embassy.latitude),
        longitude: parseFloat(selectedTrip.sos_infos.embassy.longitude),
      });
    }

    consulates.forEach(consulate => {
      if (consulate.latitude && consulate.longitude) {
        markers.push({
          latitude: parseFloat(consulate.latitude),
          longitude: parseFloat(consulate.longitude),
        });
      }
    });

    if (markers.length > 0) {
      if (currentPosition) {
        // Calculating the center of the markers
        const latitudes = markers.map(marker => marker.latitude);
        const longitudes = markers.map(marker => marker.longitude);
        const centerLatitude = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
        const centerLongitude = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
        const distanceToCenter = calculateDistance(currentPosition.latitude, currentPosition.longitude, centerLatitude, centerLongitude);
        
        // If the user is too far from the center of other markers, do not include their position in the zoom
        if (distanceToCenter > 10) { // 10 km threshold, adjust as necessary
          mapRef.current.fitToCoordinates(markers, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        } else {
          markers.push(currentPosition);
          mapRef.current.fitToCoordinates(markers, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } else {
        mapRef.current.fitToCoordinates(markers, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  };

  // Définir une région initiale basée sur l'emplacement de l'ambassade ou un emplacement par défaut
  const initialRegion = {
    latitude: selectedTrip?.sos_infos?.embassy ? parseFloat(selectedTrip.sos_infos.embassy.latitude) : 0,
    longitude: selectedTrip?.sos_infos?.embassy ? parseFloat(selectedTrip.sos_infos.embassy.longitude) : 0,
    latitudeDelta: 5,
    longitudeDelta: 5,
  };

  return (
    <View style={styles.container}>
       
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {selectedTrip?.sos_infos?.embassy && (
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
        {currentPosition && (
          <Marker
            identifier="currentLocation"
            coordinate={currentPosition}
            title="Ma position"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.addressOverlay}>
        <ScrollView horizontal={true} style={styles.addressList} showsHorizontalScrollIndicator={false}>
          {selectedTrip?.sos_infos?.embassy && (
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