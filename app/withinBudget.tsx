import React,{useState} from "react";
import {View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet} from "react-native";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* GST RULES */

const gstRates:any={
Vegetables:0,
Fruits:0,
Dairy:5,
Grains:0,
Pulses:0,
Oils:5,
Spices:5,
Snacks:12,
Beverages:12,
Household:18,
PersonalCare:18
};

/* CATEGORY PRIORITY */

const categoryPriority=[
"Vegetables","Fruits","Dairy","Grains","Pulses","Oils","Spices","Snacks","Beverages","Household","PersonalCare"
];

/* SIMPLE GROCERY DATA */
const groceryData:any={

Vegetables:{
Tomato:{price:40,unit:"kg"},
Potato:{price:30,unit:"kg"},
Onion:{price:35,unit:"kg"},
Carrot:{price:50,unit:"kg"},
Cabbage:{price:45,unit:"kg"},
Spinach:{price:25,unit:"bunch"},
Capsicum:{price:60,unit:"kg"},
Pumpkin:{price:30,unit:"kg"},
Brinjal:{price:40,unit:"kg"},
Beetroot:{price:45,unit:"kg"},
Beans:{price:60,unit:"kg"},
Cauliflower:{price:50,unit:"kg"},
Garlic:{price:200,unit:"kg"},
Ginger:{price:180,unit:"kg"},
GreenChilli:{price:90,unit:"kg"}
},

Fruits:{
Apple:{price:120,unit:"kg"},
Banana:{price:60,unit:"dozen"},
Orange:{price:90,unit:"kg"},
Mango:{price:150,unit:"kg"},
Grapes:{price:110,unit:"kg"},
Papaya:{price:45,unit:"kg"},
Pineapple:{price:70,unit:"piece"},
Guava:{price:80,unit:"kg"},
Watermelon:{price:30,unit:"kg"},
Pomegranate:{price:160,unit:"kg"}
},

Dairy:{
Milk:{price:55,unit:"L"},
Curd:{price:40,unit:"L"},
Butter:{price:120,unit:"500g"},
Paneer:{price:350,unit:"kg"},
Cheese:{price:450,unit:"kg"},
Ghee:{price:650,unit:"L"},
Cream:{price:90,unit:"200g"},
Buttermilk:{price:30,unit:"L"}
},

Grains:{
Rice:{price:70,unit:"kg"},
Wheat:{price:45,unit:"kg"},
Rava:{price:60,unit:"kg"},
Oats:{price:120,unit:"kg"},
CornFlour:{price:80,unit:"kg"},
Barley:{price:90,unit:"kg"},
Quinoa:{price:300,unit:"kg"}
},

Pulses:{
"Toor Dal":{price:140,unit:"kg"},
"Moong Dal":{price:120,unit:"kg"},
"Chana Dal":{price:110,unit:"kg"},
"Urad Dal":{price:150,unit:"kg"},
Rajma:{price:130,unit:"kg"},
Chickpeas:{price:100,unit:"kg"},
BlackGram:{price:140,unit:"kg"}
},

Oils:{
"Sunflower Oil":{price:160,unit:"L"},
"Coconut Oil":{price:200,unit:"L"},
"Groundnut Oil":{price:190,unit:"L"},
OliveOil:{price:700,unit:"L"},
MustardOil:{price:180,unit:"L"}
},

Spices:{
Turmeric:{price:300,unit:"kg"},
Pepper:{price:900,unit:"kg"},
Cumin:{price:450,unit:"kg"},
Coriander:{price:300,unit:"kg"},
ChilliPowder:{price:500,unit:"kg"},
GaramMasala:{price:600,unit:"kg"},
Cardamom:{price:1500,unit:"kg"},
Cloves:{price:1200,unit:"kg"}
},

Snacks:{
Biscuits:{price:30,unit:"packet"},
Chips:{price:20,unit:"packet"},
Chocolate:{price:50,unit:"piece"},
Popcorn:{price:40,unit:"packet"},
Namkeen:{price:60,unit:"packet"},
Cookies:{price:80,unit:"packet"}
},

Beverages:{
Tea:{price:180,unit:"250g"},
Coffee:{price:220,unit:"250g"},
Juice:{price:40,unit:"bottle"},
SoftDrink:{price:45,unit:"bottle"},
EnergyDrink:{price:110,unit:"can"},
MilkShake:{price:90,unit:"bottle"}
},

Household:{
Detergent:{price:120,unit:"kg"},
Dishwash:{price:60,unit:"bottle"},
FloorCleaner:{price:150,unit:"L"},
GarbageBags:{price:90,unit:"pack"},
ToiletCleaner:{price:120,unit:"bottle"}
},

PersonalCare:{
Soap:{price:35,unit:"bar"},
Shampoo:{price:120,unit:"bottle"},
Toothpaste:{price:90,unit:"tube"},
Facewash:{price:150,unit:"tube"},
Handwash:{price:80,unit:"bottle"},
BodyLotion:{price:200,unit:"bottle"}
}
};

export default function WithinBudget(){

const [budget,setBudget]=useState("");
const [category,setCategory]=useState("");
const [itemName,setItemName]=useState("");
const [price,setPrice]=useState("");
const [quantity,setQuantity]=useState("");
const [unit,setUnit]=useState("");
const [gst,setGst]=useState(0);

const [items,setItems]=useState<any[]>([]);
const [suggestions,setSuggestions]=useState<string[]>([]);

const totalSpent=items.reduce((sum,i)=>sum+i.total,0);
const remainingBudget=budget?parseFloat(budget)-totalSpent:0;
const progress=budget?totalSpent/parseFloat(budget):0;

/* ADD ITEM */

const addItem=()=>{

if(!category||!itemName||!price||!quantity){
alert("Fill all fields");
return;
}

const p=parseFloat(price);
const q=parseFloat(quantity);

const subtotal=p*q;
const gstAmount=subtotal*(gst/100);
const total=subtotal+gstAmount;

if(budget && totalSpent+total>parseFloat(budget)){
alert("Budget exceeded");
return;
}

setItems([...items,{
id:Date.now().toString(),
category,itemName,price:p,quantity:q,unit,gst,total
}]);

setItemName("");
setPrice("");
setQuantity("");
};

/* SUGGESTIONS */

const handleItemChange=(text:string)=>{
setItemName(text);

if(text.length>=2 && category){

const itemsInCategory=Object.keys(groceryData[category]||{});

setSuggestions(
itemsInCategory.filter(i=>i.toLowerCase().startsWith(text.toLowerCase()))
);

}else setSuggestions([]);
};

/* SAVE NOTE */

const saveNote=async()=>{

let sortedItems=[...items].sort((a,b)=>{

const aIndex=categoryPriority.indexOf(a.category);
const bIndex=categoryPriority.indexOf(b.category);

return aIndex-bIndex;

});

let note="Shopping List (Within Budget)\n\n";

sortedItems.forEach(item=>{
note+=`${item.category} - ${item.itemName} - ${item.quantity} ${item.unit} - ₹${item.total.toFixed(2)}\n`;
});

note+=`\nTotal: ₹${totalSpent.toFixed(2)}`;

const existing=await AsyncStorage.getItem("notes");

let notesArray=existing?JSON.parse(existing):[];

notesArray.push(note);

await AsyncStorage.setItem("notes",JSON.stringify(notesArray));

alert("Saved to Notes");
};

return(

<View style={styles.container}>

<Text style={styles.title}>Within Budget</Text>

<TextInput
placeholder="Enter Budget"
value={budget}
onChangeText={setBudget}
keyboardType="numeric"
style={styles.input}
/>

<Picker
selectedValue={category}
onValueChange={(v)=>{
setCategory(v);
setGst(gstRates[v]||0);
}}
style={styles.input}
>
<Picker.Item label="Select Category" value=""/>
<Picker.Item label="Vegetables" value="Vegetables"/>
<Picker.Item label="Fruits" value="Fruits"/>
<Picker.Item label="Dairy" value="Dairy"/>
<Picker.Item label="Grains" value="Grains"/>
<Picker.Item label="Pulses" value="Pulses"/>
<Picker.Item label="Oils" value="Oils"/>
<Picker.Item label="Spices" value="Spices"/>
<Picker.Item label="Snacks" value="Snacks"/>
<Picker.Item label="Beverages" value="Beverages"/>
<Picker.Item label="Household" value="Household"/>
<Picker.Item label="PersonalCare" value="PersonalCare"/>

</Picker>

<TextInput
placeholder="Item Name"
value={itemName}
onChangeText={handleItemChange}
style={styles.input}
/>

{suggestions.map((item,index)=>(
<TouchableOpacity
key={index}
onPress={()=>{
setItemName(item);
setPrice(groceryData[category][item].price.toString());
setUnit(groceryData[category][item].unit);
setSuggestions([]);
}}
>
<Text>{item}</Text>
</TouchableOpacity>
))}

<View style={styles.row}>
<TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={[styles.input,{flex:1}]}/>
<TextInput placeholder="Qty" value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={[styles.input,{flex:1}]}/>
</View>

<Text>Unit: {unit}</Text>
<Text>GST: {gst}%</Text>

<TouchableOpacity style={styles.button} onPress={addItem}>
<Text style={styles.buttonText}>Add Item</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button} onPress={saveNote}>
<Text style={styles.buttonText}>Save List</Text>
</TouchableOpacity>

<View style={styles.progressBackground}>
<View style={[styles.progressFill,{width:`${Math.min(progress*100,100)}%`}]} />
</View>

<Text>Spent: ₹{totalSpent}</Text>
<Text>Remaining Budget: ₹{remainingBudget.toFixed(2)}</Text>

</View>
);
}

const styles=StyleSheet.create({
container:{flex:1,padding:20,backgroundColor:"#f4f6f8"},
title:{fontSize:22,fontWeight:"bold",textAlign:"center"},
input:{backgroundColor:"#fff",padding:10,borderRadius:10,marginBottom:10},
row:{flexDirection:"row",gap:5},
button:{backgroundColor:"#4CAF50",padding:12,borderRadius:10,alignItems:"center"},
buttonText:{color:"#fff"},
progressBackground:{height:10,backgroundColor:"#ddd",borderRadius:10,marginVertical:10},
progressFill:{height:10,backgroundColor:"#4CAF50",borderRadius:10}
});