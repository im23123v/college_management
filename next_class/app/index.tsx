import { View, Text, Button, ScrollView } from "react-native";
import { useRouter } from "expo-router";



export default function Index() {
  const router = useRouter();

  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ScrollView>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Home</Text>
    <Button title="Go to Login" onPress={() => router.push("/login")} />
    
    </ScrollView>
    </View>
  );
}
