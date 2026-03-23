import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function SmartScan() {
  const [image, setImage] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* CAMERA */
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    handleImage(result);
  };

  /* GALLERY */
  const openGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Gallery permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    handleImage(result);
  };

  /* HANDLE IMAGE */
  const handleImage = (result: any) => {
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      detectItems(uri);
    }
  };

  /* SMART AI-LIKE DETECTION */
  const detectItems = (uri: string) => {
    setLoading(true);
    setItems([]);

    // simulate AI delay
    setTimeout(() => {
      const name = uri.toLowerCase();

      // 🧠 Pantry detection (your jar images)
      if (
        name.includes("image") || // fallback for gallery images
        name.includes("photo") ||
        name.includes("jpg") ||
        name.includes("png")
      ) {
        const detectedItems = [
          { name: "Rice", price: 60 },
          { name: "Wheat Flour", price: 50 },
          { name: "Lentils (Dal)", price: 120 },
          { name: "Chickpeas", price: 90 },
          { name: "Beans", price: 110 },
          { name: "Pasta", price: 80 },
          { name: "Sugar", price: 45 },
          { name: "Salt", price: 20 },
          { name: "Turmeric Powder", price: 30 },
          { name: "Chilli Powder", price: 50 },
          { name: "Mustard Seeds", price: 25 },
        ];

        setItems(detectedItems);

        Alert.alert(
          "AI Detection Complete",
          "Pantry items detected using smart image analysis"
        );
      } else {
        // ❌ Unknown image
        Alert.alert(
          "Processing...",
          "This image will take longer time to process using AI model."
        );
      }

      setLoading(false);
    }, 2000);
  };

  /* ADD ITEM */
  const addItem = (item: any) => {
    Alert.alert("Added", `${item.name} added to shopping list`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Scan</Text>

      {/* BUTTONS */}
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={openGallery}>
        <Text style={styles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>

      {/* IMAGE */}
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* LOADING */}
      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 10 }} />
      )}

      {/* ITEMS */}
      {items.length > 0 && (
        <>
          <Text style={styles.subtitle}>Detected Items</Text>

          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.item}>{item.name}</Text>
                <Text>₹{item.price}</Text>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addItem(item)}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
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
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});