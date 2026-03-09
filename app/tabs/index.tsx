import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧺</Text>

      <Text style={styles.title}>Basket Essential Planner</Text>
      <Text style={styles.subtitle}>
        Smart grocery management made simple.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shopping Module</Text>
        <Text style={styles.cardText}>
          Add and manage your grocery items efficiently.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Smart Scan</Text>
        <Text style={styles.cardText}>
          Capture shelf images and estimate stock levels.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    marginTop: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});
