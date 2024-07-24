import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomBottomSheet from './bottomSheet';

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface CustomMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  type: 'restaurant' | 'shop' | 'park'; // Add more types as needed
}

const mockLocations: CustomMarker[] = [
  {
    id: '1',
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    title: "Delicious Restaurant",
    description: "Best food in town",
    type: 'restaurant'
  },
  {
    id: '2',
    coordinate: { latitude: 37.78925, longitude: -122.4344 },
    title: "Fashion Boutique",
    description: "Trendy clothes and accessories",
    type: 'shop'
  },
  {
    id: '3',
    coordinate: { latitude: 37.78725, longitude: -122.4304 },
    title: "City Park",
    description: "Green space for relaxation",
    type: 'park'
  },
];

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const initialRegion: Region | undefined = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : undefined;

  const getMarkerColor = (type: CustomMarker['type']) => {
    switch (type) {
      case 'restaurant':
        return '#FF9800';
      case 'shop':
        return '#2196F3';
      case 'park':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const CustomMarkerView: React.FC<{ marker: CustomMarker }> = ({ marker }) => (
    <View style={styles.markerContainer}>
      <View style={[styles.markerBubble, { backgroundColor: getMarkerColor(marker.type) }]}>
        <Text style={styles.markerText}>{marker.type.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.markerArrow} />
    </View>
  );

  return (
    <View style={styles.container}>
      {location && (
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          showsCompass={false}
          showsScale={false}
          zoomEnabled={true}
          zoomTapEnabled={false}
          rotateEnabled={false}
          scrollEnabled={true}
          pitchEnabled={false}
          userInterfaceStyle='dark'
        >
          {mockLocations.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
            >
              <CustomMarkerView marker={marker} />
            </Marker>
          ))}
        </MapView>
      )}
      <CustomBottomSheet />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    ...StyleSheet.absoluteFillObject,

  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 20,
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerArrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007AFF',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
});

export default MapComponent;