// Pantalla para registrar resultado de partido
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  category: string;
  gender: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: 'scheduled' | 'in_progress' | 'completed';
}

interface MatchResult {
  homeScore: string;
  awayScore: string;
  homeFouls: string;
  awayFouls: string;
  homeTimeouts: string;
  awayTimeouts: string;
  notes: string;
  mvp: string;
}

const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'San Pedro',
    awayTeam: 'Santa María',
    category: 'Sub-15',
    gender: 'Masculino',
    scheduledDate: '2024-01-20',
    scheduledTime: '16:00',
    location: 'Coliseo Municipal',
    status: 'scheduled',
  },
  {
    id: '2',
    homeTeam: 'Los Pinos',
    awayTeam: 'San Pedro',
    category: 'Sub-17',
    gender: 'Femenino',
    scheduledDate: '2024-01-21',
    scheduledTime: '18:00',
    location: 'Coliseo Municipal',
    status: 'scheduled',
  },
  {
    id: '3',
    homeTeam: 'San Pedro',
    awayTeam: 'El Roble',
    category: 'Sub-13',
    gender: 'Masculino',
    scheduledDate: '2024-01-19',
    scheduledTime: '14:00',
    location: 'Coliseo Municipal',
    status: 'completed',
  },
];

interface RegisterResultScreenProps {
  navigation: any;
}

export const RegisterResultScreen: React.FC<RegisterResultScreenProps> = ({ navigation }) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [result, setResult] = useState<MatchResult>({
    homeScore: '',
    awayScore: '',
    homeFouls: '',
    awayFouls: '',
    homeTimeouts: '',
    awayTimeouts: '',
    notes: '',
    mvp: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof MatchResult, value: string) => {
    setResult(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateResult = () => {
    if (!selectedMatch) {
      Alert.alert('Error', 'Selecciona un partido');
      return false;
    }
    if (!result.homeScore || !result.awayScore) {
      Alert.alert('Error', 'Los puntajes son requeridos');
      return false;
    }
    const homeScore = parseInt(result.homeScore);
    const awayScore = parseInt(result.awayScore);
    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
      Alert.alert('Error', 'Los puntajes deben ser números válidos');
      return false;
    }
    return true;
  };

  const handleRegisterResult = async () => {
    if (!validateResult()) return;

    setLoading(true);
    try {
      // Aquí iría la lógica para registrar el resultado
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      
      Alert.alert(
        'Éxito', 
        'Resultado registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedMatch(null);
              setResult({
                homeScore: '',
                awayScore: '',
                homeFouls: '',
                awayFouls: '',
                homeTimeouts: '',
                awayTimeouts: '',
                notes: '',
                mvp: '',
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el resultado');
    } finally {
      setLoading(false);
    }
  };

  const renderMatchCard = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={[
        styles.matchCard,
        selectedMatch?.id === item.id && styles.matchCardSelected
      ]}
      onPress={() => setSelectedMatch(item)}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.matchTeams}>
          {item.homeTeam} vs {item.awayTeam}
        </Text>
        <View style={styles.matchStatus}>
          <Ionicons 
            name={item.status === 'completed' ? 'checkmark-circle' : 'time'} 
            size={16} 
            color={item.status === 'completed' ? '#24C36B' : '#F2AB16'} 
          />
          <Text style={[
            styles.statusText,
            { color: item.status === 'completed' ? '#24C36B' : '#F2AB16' }
          ]}>
            {item.status === 'completed' ? 'Finalizado' : 'Programado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.matchDetails}>
        <Text style={styles.matchInfo}>{item.category} - {item.gender}</Text>
        <Text style={styles.matchInfo}>{item.scheduledDate} a las {item.scheduledTime}</Text>
        <Text style={styles.matchInfo}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderInput = (
    label: string,
    field: keyof MatchResult,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={result[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#B3B3B3"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registrar Resultado</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona un partido y registra su resultado
        </Text>
      </View>

      {/* Lista de partidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partidos Disponibles</Text>
        <FlatList
          data={mockMatches}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Formulario de resultado */}
      {selectedMatch && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Resultado: {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
          </Text>
          
          <View style={styles.resultForm}>
            <View style={styles.scoreContainer}>
              <View style={styles.teamScore}>
                <Text style={styles.teamName}>{selectedMatch.homeTeam}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={result.homeScore}
                  onChangeText={(value) => handleInputChange('homeScore', value)}
                  placeholder="0"
                  placeholderTextColor="#B3B3B3"
                  keyboardType="numeric"
                />
              </View>
              
              <Text style={styles.vsText}>VS</Text>
              
              <View style={styles.teamScore}>
                <Text style={styles.teamName}>{selectedMatch.awayTeam}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={result.awayScore}
                  onChangeText={(value) => handleInputChange('awayScore', value)}
                  placeholder="0"
                  placeholderTextColor="#B3B3B3"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                {renderInput('Faltas (Local)', 'homeFouls', '0', 'numeric')}
                {renderInput('Faltas (Visitante)', 'awayFouls', '0', 'numeric')}
              </View>
              
              <View style={styles.statsRow}>
                {renderInput('Timeouts (Local)', 'homeTimeouts', '0', 'numeric')}
                {renderInput('Timeouts (Visitante)', 'awayTimeouts', '0', 'numeric')}
              </View>
            </View>

            {renderInput('Jugador Más Valioso', 'mvp', 'Nombre del MVP')}
            {renderInput('Notas', 'notes', 'Observaciones del partido...', 'default', true)}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedMatch(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegisterResult}
                disabled={loading}
              >
                <Ionicons 
                  name={loading ? "hourglass" : "checkmark-circle"} 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.registerButtonText}>
                  {loading ? 'Registrando...' : 'Registrar Resultado'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  header: {
    padding: 20,
    backgroundColor: '#1A1D24', // Card oscuro
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchCardSelected: {
    borderColor: '#E62026',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  matchStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchDetails: {
    gap: 4,
  },
  matchInfo: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  resultForm: {
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#2A2D34',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scoreInput: {
    backgroundColor: '#0A0D14',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E62026',
    textAlign: 'center',
    width: 60,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B3B3B3',
    marginHorizontal: 20,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    flex: 2,
    backgroundColor: '#E62026', // Rojo competitivo
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E62026',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: '#B3B3B3',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
