import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      const storedReports = await AsyncStorage.getItem('reports');
      if (storedReports) setReports(JSON.parse(storedReports));
    };
    loadReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Informes Recibidos</Text>
      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.createdAt}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <Text style={styles.subtitle}>Antes:</Text>
            <FlatList
              horizontal
              data={item.photosBefore}
              keyExtractor={(uri, index) => index.toString()}
              renderItem={({ item: uri }) => <Image source={{ uri }} style={styles.thumbnail} />}
            />

            <Text style={styles.subtitle}>Después:</Text>
            <FlatList
              horizontal
              data={item.photosAfter}
              keyExtractor={(uri, index) => index.toString()}
              renderItem={({ item: uri }) => <Image source={{ uri }} style={styles.thumbnail} />}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, elevation: 3 },
  date: { fontSize: 12, color: '#555', marginBottom: 4 },
  description: { fontSize: 16, marginBottom: 8 },
  subtitle: { fontWeight: 'bold', marginTop: 6 },
  thumbnail: { width: 70, height: 70, borderRadius: 8, marginRight: 6, marginTop: 4 },
});
