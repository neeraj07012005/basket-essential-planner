import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const db = SQLite.openDatabaseSync("shopping.db");

export default function Shopping() {
  const [budget, setBudget] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  const [items, setItems] = useState<
    {
      id: number;
      name: string;
      price: number;
      quantity: number;
      total: number;
      date: string;
    }[]
  >([]);

  useEffect(() => {
    const setup = async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          quantity REAL,
          total REAL,
          date TEXT
        );
      `);

      loadItems();
    };

    setup();
  }, []);

  const loadItems = async () => {
    const result = await db.getAllAsync("SELECT * FROM items");
    setItems(result as any);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const remainingBudget =
    budget !== "" ? parseFloat(budget) - grandTotal : 0;

  const addItem = async () => {
    if (!itemName || !price || !quantity || !date) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    const unitPrice = parseFloat(price);
    const qty = parseFloat(quantity);
    const itemTotal = unitPrice * qty;

    const newGrandTotal = grandTotal + itemTotal;

    if (budget && newGrandTotal > parseFloat(budget)) {
      Alert.alert("Budget Exceeded", "You have exceeded your budget!");
      return;
    }

    await db.runAsync(
      "INSERT INTO items (name, price, quantity, total, date) VALUES (?, ?, ?, ?, ?)",
      itemName,
      unitPrice,
      qty,
      itemTotal,
      date
    );

    setItemName("");
    setPrice("");
    setQuantity("");
    setDate("");

    loadItems();
  };

  const removeItem = async (id: number) => {
    await db.runAsync("DELETE FROM items WHERE id = ?", id);
    loadItems();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Planner</Text>

      <TextInput
        placeholder="Enter Budget"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      
      
     <View style={styles.row}>
  <TextInput
    placeholder="Price"
    value={price}
    onChangeText={setPrice}
    keyboardType="numeric"
    style={[styles.input, { flex: 1, marginRight: 5 }]}
  />

  <TextInput
    placeholder="Qty"
    value={quantity}
    onChangeText={setQuantity}
    keyboardType="numeric"
    style={[styles.input, { flex: 1, marginLeft: 5 }]}
  />
</View>

      <TextInput
        placeholder="Purchase Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.checkText}>✓</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.itemText}>
                {item.name} ({item.quantity} × ₹{item.price})
              </Text>
              <Text style={styles.dateText}>
                Date: {item.date}
              </Text>
            </View>

            <Text style={styles.priceText}>₹ {item.total}</Text>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Spent: ₹ {grandTotal}
        </Text>

        {budget !== "" && (
          <Text
            style={[
              styles.remainingText,
              {
                color:
                  remainingBudget < 0 ? "red" : "green",
              },
            ]}
          >
            Remaining Budget: ₹ {remainingBudget}
          </Text>
        )}
      </View>
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
  row: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},
  input: {
  backgroundColor: "#ffffff",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  marginBottom: 10,
  fontSize: 14,
  elevation: 2,
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
    fontSize: 16,
  },
  listItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  remainingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
});