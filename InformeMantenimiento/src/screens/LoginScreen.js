import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { DataContext} from "../data/DataContext";

export default function LoginScreen({ route, navigation }) {
  const { role } = route.params;
  const { technicians } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (role === "admin" && username === "admin" && password === "admin123") {
      navigation.replace("Admin");
    } else if (
      role === "technician" &&
      technicians.some((t) => t.username === username && t.password === password)
    ) {
      navigation.replace("Technician", { username });
    } else {
      Alert.alert("Error", "Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login {role === "admin" ? "Administrador" : "Técnico"}</Text>
      <TextInput style={styles.input} placeholder="Usuario" onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginVertical: 10, width: "80%" },
  button: { backgroundColor: "#2a4d69", padding: 15, borderRadius: 8, marginTop: 10, width: "80%" },
  buttonText: { color: "#fff", textAlign: "center" },
});
