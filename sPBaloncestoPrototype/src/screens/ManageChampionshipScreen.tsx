// Pantalla de Gestión de Campeonato para Administradores
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Match } from '../types';

interface ManageChampionshipScreenProps {
  navigation: any;
  route: any;
}

export const ManageChampionshipScreen: React.FC<ManageChampionshipScreenProps> = ({ navigation, route }) => {
  const { championship } = route.params;
  const { addMatchToChampionship, updateMatchInChampionship, removeMatchFromChampionship, championships } = useApp();
  // Nombre del club local y rivales conocidos (fuente institucional)
  const sanPedroName = 'San Pedro';
  const knownOpponents = [
    'San Antonio',
    'San Pedro Rojo',
    'Borregos 1',
    'San Pedro Blanco',
    'Escuela Municipal Tena A',
    'Borregos 2',
    'Escuela Municipal Tena B',
    'VO4',
    'Santa María',
  ];

  const [homeTeam, setHomeTeam] = useState(sanPedroName);
  const [awayTeam, setAwayTeam] = useState(knownOpponents[0]);
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [opponentPickerVisible, setOpponentPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  const currentChampionship = useMemo(() => championships.find(c => c.id === championship.id) || championship, [championship, championships]);
  const allMatches = Array.isArray(currentChampionship?.matches) ? currentChampionship.matches : [];
  const scheduledMatches = allMatches.filter((m: any) => m.status === 'scheduled');

  const finishedMatches = allMatches.filter((m: any) => m.status === 'completed');

  const handleSaveMatch = () => {
    if (!matchDate || !matchTime) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (editingMatchId) {
      updateMatchInChampionship(currentChampionship.id, editingMatchId, {
        awayTeam,
        date: matchDate,
        time: matchTime,
      });
      setEditingMatchId(null);
      Alert.alert('Éxito', 'Partido actualizado');
    } else {
      const newMatch: Match = {
        id: Date.now().toString(),
        championshipId: currentChampionship.id,
        homeTeam: sanPedroName,
        awayTeam,
        date: matchDate,
        time: matchTime,
        category: currentChampionship.category,
        gender: currentChampionship.gender,
        status: 'scheduled',
      };
      addMatchToChampionship(currentChampionship.id, newMatch);
      Alert.alert('Éxito', 'Partido guardado correctamente');
    }
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
        <Text style={styles.matchStatus}>{match.date} • {match.time}</Text>
      </View>
      <View style={styles.matchDateTime}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            setAwayTeam(match.awayTeam);
            setMatchDate(match.date);
            setMatchTime(match.time);
            setEditingMatchId(match.id);
          }}>
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { marginLeft: 8 }]} onPress={() => removeMatchFromChampionship(currentChampionship.id, match.id)}>
            <Ionicons name="trash" size={18} color="#E62026" />
          </TouchableOpacity>
        </View>
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
                <TouchableOpacity onPress={() => setOpponentPickerVisible(true)}>
                  <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fecha del Partido</Text>
              <TouchableOpacity style={styles.inputField} onPress={() => setDatePickerVisible(true)}>
                <Text style={styles.inputText}>{matchDate || 'dd/mm/aaaa'}</Text>
                <Ionicons name="calendar-outline" size={20} color="#B3B3B3" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hora del Partido</Text>
              <TouchableOpacity style={styles.inputField} onPress={() => setTimePickerVisible(true)}>
                <Text style={styles.inputText}>{matchTime || '--:--'}</Text>
                <Ionicons name="time-outline" size={20} color="#B3B3B3" />
              </TouchableOpacity>
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
      <Modal
        visible={opponentPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOpponentPickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpponentPickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona equipo visitante</Text>
            <FlatList
              data={knownOpponents}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setAwayTeam(item);
                    setOpponentPickerVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDatePickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona fecha</Text>
            <FlatList
              data={Array.from({ length: 30 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
              })}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => { setMatchDate(item); setDatePickerVisible(false); }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTimePickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona hora</Text>
            <FlatList
              data={Array.from({ length: 24 * 2 }).map((_, i) => {
                const hours = Math.floor(i / 2);
                const mins = i % 2 === 0 ? '00' : '30';
                const hh = String(hours).padStart(2, '0');
                return `${hh}:${mins}`;
              })}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => { setMatchTime(item); setTimePickerVisible(false); }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  iconButton: {
    backgroundColor: '#2A2D34',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D34',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

// fin de estilos
