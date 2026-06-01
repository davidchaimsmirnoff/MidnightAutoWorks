
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";

type Props = {
  location: { latitude: number; longitude: number } | null;
};

export default function MapComponent({ location }: Props) {
  const region = location
    ? { ...location, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.5, longitudeDelta: 0.5 };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      customMapStyle={darkMapStyle}
      region={region}
      showsUserLocation
      showsMyLocationButton
    >
      {location && (
        <Marker
          coordinate={location}
          title="You are here"
          pinColor="#ff6a00"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { flex: 1 } });

const darkMapStyle = [
  { elementType: "geometry",           stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill",   stylers: [{ color: "#888" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#111" }] },
  { featureType: "road",               elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road.arterial",      elementType: "labels.text.fill", stylers: [{ color: "#555" }] },
  { featureType: "water",              elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "poi",                stylers: [{ visibility: "off" }] },
];

