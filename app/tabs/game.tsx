import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const items = [
  { name: "🍎 Apple (1kg)", price: 120 },
  { name: "🥛 Milk (1L)", price: 60 },
  { name: "🍞 Bread", price: 40 },
  { name: "🥚 Eggs (12)", price: 90 },
  { name: "🍌 Banana (1 dozen)", price: 70 }
];

export default function Game() {

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const nextItem = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const guess = (guessPrice:number) => {

    const real = items[index].price;

    if (guessPrice === real) {
      setScore(score + 1);
      setMessage("✅ Correct!");
    } else if (guessPrice > real) {
      setMessage("📉 Too High!");
    } else {
      setMessage("📈 Too Low!");
    }

    animate();

    setTimeout(() => {
      setMessage("");
      nextItem();
    }, 1200);
  };

  const current = items[index];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Guess The Grocery Price 🛒</Text>

      <Text style={styles.score}>Score: {score}</Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={styles.item}>{current.name}</Text>
      </Animated.View>

      <Text style={styles.question}>What is the price?</Text>

      <View style={styles.options}>

        <TouchableOpacity style={styles.button} onPress={() => guess(40)}>
          <Text style={styles.btnText}>₹40</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => guess(60)}>
          <Text style={styles.btnText}>₹60</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => guess(90)}>
          <Text style={styles.btnText}>₹90</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => guess(120)}>
          <Text style={styles.btnText}>₹120</Text>
        </TouchableOpacity>

      </View>

      {message !== "" && <Text style={styles.message}>{message}</Text>}

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#f5f7fa",
    padding:20
  },

  title:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:10
  },

  score:{
    fontSize:18,
    marginBottom:20
  },

  item:{
    fontSize:40,
    marginBottom:15
  },

  question:{
    fontSize:18,
    marginBottom:15
  },

  options:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center"
  },

  button:{
    backgroundColor:"#333",
    padding:12,
    margin:8,
    borderRadius:8
  },

  btnText:{
    color:"white",
    fontSize:16
  },

  message:{
    marginTop:20,
    fontSize:20,
    fontWeight:"bold"
  }

});