
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapComponent from "../../components/MapComponent";

export default function HomeScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLeft}>
          <View style={styles.logoMark} />
          <Text style={styles.title}>MIDNIGHT<Text style={styles.titleAccent}>AUTO</Text></Text>
        </View>
        <Text style={styles.subtitle}>WORKS</Text>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {error ?? (location ? "📍 Location found" : "📍 Finding your location...")}
        </Text>
        <View style={[styles.statusDot, { backgroundColor: error ? "#f00" : "#ff6a00" }]} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapComponent location={location} />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomLabel}>🔧 Mechanics</Text>
        <Text style={styles.bottomLabel}>🚗 My Cars</Text>
        <Text style={styles.bottomLabel}>📞 Contact</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#0a0a0a" },
  navbar:       { height: 60, backgroundColor: "#111", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#ff6a00" },
  navLeft:      { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMark:     { width: 10, height: 10, backgroundColor: "#ff6a00", borderRadius: 2, transform: [{ rotate: "45deg" }] },
  title:        { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 3 },
  titleAccent:  { color: "#ff6a00" },
  subtitle:     { color: "#444", fontSize: 12, fontWeight: "600", letterSpacing: 4 },
  statusBar:    { height: 32, backgroundColor: "#161616", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 },
  statusText:   { color: "#888", fontSize: 11, letterSpacing: 1 },
  statusDot:    { width: 6, height: 6, borderRadius: 3 },
  mapContainer: { flex: 1 },
  bottomBar:    { height: 60, backgroundColor: "#111", flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#222" },
  bottomLabel:  { color: "#777", fontSize: 12, letterSpacing: 1 },
});

