import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login", { role: "admin" })}
      >
        <Text style={styles.buttonText}>Ingresar como Administrador</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login", { role: "technician" })}
      >
        <Text style={styles.buttonText}>Ingresar como Técnico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  button: { backgroundColor: "#2a4d69", padding: 15, marginVertical: 10, borderRadius: 10, width: "80%" },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
