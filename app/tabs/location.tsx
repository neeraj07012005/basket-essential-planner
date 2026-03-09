import * as Location from "expo-location";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LocationScreen() {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<any[]>([]);

  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Open Google Maps navigation
  const openMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
    Linking.openURL(url);
  };

  const getNearbySupermarkets = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied");
        setLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      const query = `
        [out:json];
        node["shop"="supermarket"](around:3000,${latitude},${longitude});
        out;
      `;

      const url =
        "https://overpass-api.de/api/interpreter?data=" +
        encodeURIComponent(query);

      const response = await fetch(url);
      const data = await response.json();

      if (data.elements) {
        const updatedStores = data.elements.map((store: any) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            store.lat,
            store.lon
          );

          return {
            ...store,
            distance: distance.toFixed(2),
          };
        });

        updatedStores.sort(
          (a: any, b: any) =>
            parseFloat(a.distance) - parseFloat(b.distance)
        );

        setStores(updatedStores);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load stores.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Supermarkets</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={getNearbySupermarkets}
      >
        <Text style={styles.buttonText}>
          Find Nearest Supermarkets
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" />}

      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storeCard}
            onPress={() => openMaps(item.lat, item.lon)}
          >
            <Text style={styles.storeName}>
              {item.tags?.name || "Unnamed Store"}
            </Text>

            <Text style={styles.distance}>
              Distance: {item.distance} km
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  storeCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  distance: {
    marginTop: 5,
    color: "#666",
  },
});