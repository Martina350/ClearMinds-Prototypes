import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReportList({ reports }) {
  if (reports.length === 0) {
    return <Text>No hay informes aún.</Text>;
  }

  return (
    <View>
      {reports.map((report) => (
        <View key={report.id} style={styles.card}>
          <Text style={styles.title}>{report.cliente} - {report.local}</Text>
          <Text>{report.fecha} | {report.horaEntrada} - {report.horaSalida}</Text>
          <Text>{report.descripcion}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: "#f8f8f8", borderRadius: 10, marginVertical: 5, elevation: 2 },
  title: { fontWeight: "bold" },
});
