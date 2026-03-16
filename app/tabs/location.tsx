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
  TextInput,
} from "react-native";

export default function LocationScreen() {

  const [loading,setLoading] = useState(false);
  const [stores,setStores] = useState<any[]>([]);
  const [locationText,setLocationText] = useState("");
  const [suggestions,setSuggestions] = useState<any[]>([]);
  const [selectedLocation,setSelectedLocation] = useState<any>(null);

  /* DISTANCE CALCULATION */

  const calculateDistance = (
    lat1:number,
    lon1:number,
    lat2:number,
    lon2:number
  ) => {

    const R = 6371;

    const dLat = ((lat2-lat1)*Math.PI)/180;
    const dLon = ((lon2-lon1)*Math.PI)/180;

    const a =
      Math.sin(dLat/2)*Math.sin(dLat/2) +
      Math.cos((lat1*Math.PI)/180) *
      Math.cos((lat2*Math.PI)/180) *
      Math.sin(dLon/2)*Math.sin(dLon/2);

    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

    return R*c;

  };

  /* OPEN GOOGLE MAPS */

  const openMaps = (lat:number,lon:number) => {

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;

    Linking.openURL(url);

  };

  /* SAFE JSON PARSER */

  const parseJSONSafe = async (response:any) => {

    const text = await response.text();

    try{
      return JSON.parse(text);
    }
    catch{
      console.log("Invalid JSON:",text);
      Alert.alert("Server error. Try again.");
      return null;
    }

  };

  /* SEARCH SUPERMARKETS */

  const searchStores = async (latitude:number,longitude:number) => {

    try{

      const query = `
        [out:json];
        node["shop"="supermarket"](around:3000,${latitude},${longitude});
        out;
      `;

      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        
        {
          method:"POST",
          headers:{
            "Content-Type":"application/x-www-form-urlencoded"
          },
          body:query
        }
      );

      const data = await parseJSONSafe(response);

      if(!data) return;

      if(data.elements){

        const updatedStores = data.elements.map((store:any)=>{

          const distance = calculateDistance(
            latitude,
            longitude,
            store.lat,
            store.lon
          );

          return{
            ...store,
            distance: distance.toFixed(2)
          };

        });

        updatedStores.sort(
          (a:any,b:any)=>parseFloat(a.distance)-parseFloat(b.distance)
        );

        setStores(updatedStores);

      }

    }
    catch(error){

      console.log(error);
      Alert.alert("Unable to fetch supermarkets");

    }

  };

  /* LOCATION AUTOCOMPLETE */

  const fetchLocationSuggestions = async (text:string) => {

    setLocationText(text);

    if(text.length < 3){
      setSuggestions([]);
      return;
    }

    try{

      const url =
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`;

      const response = await fetch(url,{
        headers:{
          "User-Agent":"basket-planner-app"
        }
      });

      const data = await parseJSONSafe(response);

      if(!data) return;

      setSuggestions(data);

    }
    catch(error){
      console.log(error);
    }

  };

  /* SELECT LOCATION */

  const selectLocation = (item:any) => {

    setLocationText(item.display_name);
    setSuggestions([]);
    setSelectedLocation(item);

  };

  /* SEARCH BUTTON */

  const searchLocation = async () => {

    if(!selectedLocation){
      Alert.alert("Please select a location from suggestions");
      return;
    }

    const latitude = parseFloat(selectedLocation.lat);
    const longitude = parseFloat(selectedLocation.lon);

    setLoading(true);

    await searchStores(latitude,longitude);

    setLoading(false);

  };

  /* CLEAR SEARCH */

  const clearSearch = () => {

    setLocationText("");
    setSuggestions([]);
    setStores([]);
    setSelectedLocation(null);

  };

  /* USE CURRENT LOCATION */

  const useCurrentLocation = async () => {

    try{

      setLoading(true);

      const {status} =
        await Location.requestForegroundPermissionsAsync();

      if(status !== "granted"){
        Alert.alert("Permission denied");
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      const {latitude,longitude} = location.coords;

      await searchStores(latitude,longitude);

    }
    catch{
      Alert.alert("Failed to get location");
    }
    finally{
      setLoading(false);
    }

  };

  return(

    <View style={styles.container}>

      <Text style={styles.title}>Nearby Supermarkets</Text>

      {/* CURRENT LOCATION */}

      <TouchableOpacity
        style={styles.button}
        onPress={useCurrentLocation}
      >
        <Text style={styles.buttonText}>
          Use Current Location
        </Text>
      </TouchableOpacity>

      {/* LOCATION INPUT */}

      <TextInput
        placeholder="Enter location (Example: Anna Nagar)"
        value={locationText}
        onChangeText={fetchLocationSuggestions}
        style={styles.input}
      />

      {/* SUGGESTIONS */}

      {suggestions.map((item,index)=>(
        <TouchableOpacity
          key={index}
          style={styles.suggestion}
          onPress={()=>selectLocation(item)}
        >
          <Text>{item.display_name}</Text>
        </TouchableOpacity>
      ))}

      {/* SEARCH BUTTON */}

      <TouchableOpacity
        style={styles.button}
        onPress={searchLocation}
      >
        <Text style={styles.buttonText}>
          Search Stores
        </Text>
      </TouchableOpacity>

      {/* CLEAR BUTTON */}

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearSearch}
      >
        <Text style={styles.buttonText}>
          Clear Search
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large"/>}

      {/* STORE LIST */}

      <FlatList
        data={stores}
        keyExtractor={(item)=>item.id.toString()}
        renderItem={({item})=>(

          <TouchableOpacity
            style={styles.storeCard}
            onPress={()=>openMaps(item.lat,item.lon)}
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

container:{
  flex:1,
  backgroundColor:"#f4f6f8",
  padding:20
},

title:{
  fontSize:22,
  fontWeight:"bold",
  textAlign:"center",
  marginBottom:20
},

button:{
  backgroundColor:"#4CAF50",
  padding:15,
  borderRadius:12,
  alignItems:"center",
  marginBottom:10
},

clearButton:{
  backgroundColor:"#e74c3c",
  padding:15,
  borderRadius:12,
  alignItems:"center",
  marginBottom:15
},

buttonText:{
  color:"#fff",
  fontWeight:"bold"
},

input:{
  backgroundColor:"#fff",
  padding:12,
  borderRadius:10,
  marginBottom:10
},

suggestion:{
  backgroundColor:"#fff",
  padding:10,
  borderBottomWidth:0.5,
  borderColor:"#ddd"
},

storeCard:{
  backgroundColor:"#fff",
  padding:15,
  borderRadius:12,
  marginBottom:10,
  elevation:2
},

storeName:{
  fontSize:16,
  fontWeight:"bold"
},

distance:{
  marginTop:5,
  color:"#666"
}

});