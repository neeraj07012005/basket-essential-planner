import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="shopping" options={{ title: "Shopping" }} />
      <Tabs.Screen name="smartscan" options={{ title: "Smart Scan" }} />
      <Tabs.Screen name="location" options={{ title: "Location" }} />
    </Tabs>
  );
}