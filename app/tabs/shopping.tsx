import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WithinBudget from "../withinBudget";
import WithoutBudget from "../withoutBudget";

export default function Shopping() {

  const [screen, setScreen] = useState("within");

 return (
  <SafeAreaView style={{ flex: 1 }}>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen("within")}
        >
          <Text style={styles.buttonText}>Within Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen("without")}
        >
          <Text style={styles.buttonText}>Without Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Switch */}
      {screen === "within" ? <WithinBudget /> : <WithoutBudget />}

   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});