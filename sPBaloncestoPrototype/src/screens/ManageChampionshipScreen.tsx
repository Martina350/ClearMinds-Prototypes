// Pantalla de Gestión de Campeonato para Administradores
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ManageChampionshipScreenProps {
  navigation: any;
  route: any;
}

export const ManageChampionshipScreen: React.FC<ManageChampionshipScreenProps> = ({ navigation, route }) => {
  const { championship } = route.params;
  const [homeTeam, setHomeTeam] = useState('Dragones');
  const [awayTeam, setAwayTeam] = useState('Tigres');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');

  const scheduledMatches = [
    {
      id: '1',
      homeTeam: 'Dragones',
      awayTeam: 'Tigres',
      date: '25 Oct',
      time: '18:00',
      status: 'Programado'
    },
    {
      id: '2',
      homeTeam: 'Águilas',
      awayTeam: 'Leones',
      date: '26 Oct',
      time: '20:00',
      status: 'Programado'
    }
  ];

  const finishedMatches = [
    {
      id: '1',
      homeTeam: 'Halcones',
      awayTeam: 'Cobras',
      date: '20 Oct, 19:00',
      homeScore: 85,
      awayScore: 78
    }
  ];

  const handleSaveMatch = () => {
    if (!matchDate || !matchTime) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    Alert.alert('Éxito', 'Partido guardado correctamente');
    setMatchDate('');
    setMatchTime('');
  };

  const renderScheduledMatch = (match: any) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchIconContainer}>
        <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.matchTeams}>{match.homeTeam} vs {match.awayTeam}</Text>
        <Text style={styles.matchStatus}>{match.status}</Text>
      </View>
      <View style={styles.matchDateTime}>
        <Text style={styles.matchDate}>{match.date}</Text>
        <Text style={styles.matchTime}>{match.time}</Text>
      </View>
    </View>
  );

  const renderFinishedMatch = (match: any) => (
    <View key={match.id} style={styles.matchCard}>
      <View style={styles.matchIconContainer}>
        <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.matchTeams}>{match.homeTeam} vs {match.awayTeam}</Text>
        <Text style={styles.matchStatus}>{match.date}</Text>
      </View>
      <View style={styles.matchScoreContainer}>
        <Text style={styles.matchScore}>{match.homeScore} - {match.awayScore}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#B3B3B3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>

      {/* Información del Campeonato */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Información del Campeonato</Text>
          <Text style={styles.cardDescription}>
            Gestiona los partidos y resultados del torneo actual.
          </Text>
          <Text style={styles.cardDetails}>
            Fechas: 15 Oct - 20 Nov | Equipos: 8
          </Text>
        </View>
      </View>

      {/* Añadir Nuevo Partido */}
      <View style={styles.section}>
        <View style={styles.addMatchCard}>
          <Text style={styles.cardTitle}>Añadir Nuevo Partido</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Equipo Local</Text>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{homeTeam}</Text>
                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Equipo Visitante</Text>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{awayTeam}</Text>
                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fecha del Partido</Text>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.inputText}
                  placeholder="dd/mm/aaaa"
                  placeholderTextColor="#B3B3B3"
                  value={matchDate}
                  onChangeText={setMatchDate}
                />
                <Ionicons name="calendar-outline" size={20} color="#B3B3B3" />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hora del Partido</Text>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.inputText}
                  placeholder="--:--"
                  placeholderTextColor="#B3B3B3"
                  value={matchTime}
                  onChangeText={setMatchTime}
                />
                <Ionicons name="time-outline" size={20} color="#B3B3B3" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveMatch}>
            <Text style={styles.saveButtonText}>Guardar Partido</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Partidos Programados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partidos Programados</Text>
        {scheduledMatches.map(renderScheduledMatch)}
      </View>

      {/* Partidos Finalizados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partidos Finalizados</Text>
        {finishedMatches.map(renderFinishedMatch)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#1A1D24', // Gris oscuro para tarjetas
    borderRadius: 12,
    padding: 20,
  },
  addMatchCard: {
    backgroundColor: '#1A1D24', // Gris oscuro para tarjetas
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#E62026', // Rojo competitivo
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: '#1A1D24', // Gris oscuro para tarjetas
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  matchStatus: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  matchDateTime: {
    alignItems: 'flex-end',
  },
  matchDate: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  matchTime: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  matchScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  editButton: {
    padding: 4,
  },
});
