import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { DataContext } from "../store/DataContext";

export default function ReportForm() {
  const { addReport } = useContext(DataContext);
  const [form, setForm] = useState({
    cliente: "",
    local: "",
    fecha: "",
    horaEntrada: "",
    horaSalida: "",
    descripcion: "",
  });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSubmit = () => {
    if (Object.values(form).some((v) => v === "")) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    addReport(form);
    Alert.alert("Éxito", "Informe enviado");
    setForm({ cliente: "", local: "", fecha: "", horaEntrada: "", horaSalida: "", descripcion: "" });
  };

  return (
    <View>
      {["cliente", "local", "fecha", "horaEntrada", "horaSalida", "descripcion"].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChangeText={(v) => handleChange(field, v)}
        />
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adjuntar Foto Antes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adjuntar Foto Después</Text>
      </TouchableOpacity>

      <View style={styles.signature}>
        <Text>Firma del cliente (espacio reservado)</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Informe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginVertical: 5 },
  button: { backgroundColor: "#2a4d69", padding: 12, borderRadius: 8, marginVertical: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  signature: { borderWidth: 1, borderColor: "#aaa", padding: 30, borderRadius: 10, marginVertical: 10, alignItems: "center" },
});
