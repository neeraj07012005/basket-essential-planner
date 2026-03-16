import React,{useState} from "react";
import {View,Text,FlatList,TouchableOpacity,StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

export default function NotesScreen(){

const [notes,setNotes]=useState<string[]>([]);

const loadNotes=async()=>{

const saved=await AsyncStorage.getItem("notes");

if(saved) setNotes(JSON.parse(saved));

};

const deleteNote=async(index:number)=>{

const updated=[...notes];

updated.splice(index,1);

setNotes(updated);

await AsyncStorage.setItem("notes",JSON.stringify(updated));

};

useFocusEffect(
React.useCallback(()=>{
loadNotes();
},[])
);

return(

<View style={styles.container}>

<Text style={styles.title}>Saved Notes</Text>

<FlatList
data={notes}
keyExtractor={(item,index)=>index.toString()}
renderItem={({item,index})=>(
<View style={styles.noteBox}>

<Text style={styles.noteText}>{item}</Text>

<TouchableOpacity
style={styles.deleteButton}
onPress={()=>deleteNote(index)}
>
<Text style={styles.deleteText}>Delete</Text>
</TouchableOpacity>

</View>
)}
/>

</View>
);
}

const styles=StyleSheet.create({
container:{flex:1,padding:20,backgroundColor:"#f4f6f8"},
title:{fontSize:22,fontWeight:"bold",marginBottom:10},
noteBox:{backgroundColor:"#fff",padding:15,borderRadius:10,marginBottom:10},
noteText:{marginBottom:10},
deleteButton:{backgroundColor:"#ff4d4d",padding:8,borderRadius:6},
deleteText:{color:"#fff"}
});