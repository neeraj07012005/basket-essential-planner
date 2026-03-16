import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WithinBudget from "../withinBudget";
import WithoutBudget from "../withoutBudget";

export default function Shopping() {

  const [screen, setScreen] = useState("within");

  return (
    <SafeAreaView style={styles.container}>

      {/* Top Buttons */}
      <View style={styles.buttonContainer}>
        
        <TouchableOpacity
          style={[
            styles.button,
            screen === "within" && styles.activeButton
          ]}
          onPress={() => setScreen("within")}
        >
          <Text style={styles.buttonText}>Within Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            screen === "without" && styles.activeButton
          ]}
          onPress={() => setScreen("without")}
        >
          <Text style={styles.buttonText}>Without Budget</Text>
        </TouchableOpacity>

      </View>

      {/* Screen Switch */}
      <View style={styles.screenContainer}>
        {screen === "within" ? <WithinBudget /> : <WithoutBudget />}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },

  activeButton: {
    backgroundColor: "#2E7D32",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  screenContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

});