import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { DataContext } from "../store/DataContext";

export default function UserManagement() {
  const { technicians, addTechnician, removeTechnician } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    if (username && password) {
        
      addTechnician(username, password);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Técnicos</Text>
      <TextInput placeholder="Usuario" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Contraseña" style={styles.input} value={password} secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar Técnico</Text>
      </TouchableOpacity>
      <FlatList
        data={technicians}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text>{item.username}</Text>
            <TouchableOpacity onPress={() => removeTechnician(item.id)}>
              <Text style={{ color: "red" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginVertical: 5 },
  button: { backgroundColor: "#2a4d69", padding: 10, borderRadius: 8, marginVertical: 10 },
  buttonText: { color: "#fff", textAlign: "center" },
  userRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
});
