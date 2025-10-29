// Pantalla para crear campeonato
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  //Picker,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChampionshipForm {
  name: string;
  category: string;
  gender: string;
  startDate: string;
  endDate: string;
  maxTeams: string;
  description: string;
  location: string;
  entryFee: string;
}

const categories = ['Sub-13', 'Sub-15', 'Sub-17', 'Sub-19', 'Senior'];
const genders = ['Masculino', 'Femenino', 'Mixto'];

interface CreateChampionshipScreenProps {
  navigation: any;
}

export const CreateChampionshipScreen: React.FC<CreateChampionshipScreenProps> = ({ navigation }) => {
  const [form, setForm] = useState<ChampionshipForm>({
    name: '',
    category: 'Sub-15',
    gender: 'Masculino',
    startDate: '',
    endDate: '',
    maxTeams: '8',
    description: '',
    location: '',
    entryFee: '0',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof ChampionshipForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'El nombre del campeonato es requerido');
      return false;
    }
    if (!form.startDate) {
      Alert.alert('Error', 'La fecha de inicio es requerida');
      return false;
    }
    if (!form.endDate) {
      Alert.alert('Error', 'La fecha de fin es requerida');
      return false;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      Alert.alert('Error', 'La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
    if (!form.location.trim()) {
      Alert.alert('Error', 'La ubicación es requerida');
      return false;
    }
    return true;
  };

  const handleCreateChampionship = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Aquí iría la lógica para crear el campeonato
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      
      Alert.alert(
        'Éxito', 
        'Campeonato creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el campeonato');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: keyof ChampionshipForm,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={form[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#B3B3B3"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const renderPicker = (
    label: string,
    field: keyof ChampionshipForm,
    options: string[]
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerText}>{form[field]}</Text>
        <Ionicons name="chevron-down" size={20} color="#B3B3B3" />
      </View>
      {/* En una implementación real, aquí iría un picker modal */}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear Nuevo Campeonato</Text>
        <Text style={styles.headerSubtitle}>
          Completa la información para crear un nuevo campeonato
        </Text>
      </View>

      <View style={styles.formContainer}>
        {renderInput(
          'Nombre del Campeonato *',
          'name',
          'Ej: Torneo de Verano 2024'
        )}

        <View style={styles.rowContainer}>
          {renderPicker('Categoría *', 'category', categories)}
          {renderPicker('Género *', 'gender', genders)}
        </View>

        <View style={styles.rowContainer}>
          {renderInput(
            'Fecha de Inicio *',
            'startDate',
            'YYYY-MM-DD',
            'default'
          )}
          {renderInput(
            'Fecha de Fin *',
            'endDate',
            'YYYY-MM-DD',
            'default'
          )}
        </View>

        <View style={styles.rowContainer}>
          {renderInput(
            'Máximo de Equipos',
            'maxTeams',
            '8',
            'numeric'
          )}
          {renderInput(
            'Costo de Inscripción',
            'entryFee',
            '0',
            'numeric'
          )}
        </View>

        {renderInput(
          'Ubicación *',
          'location',
          'Ej: Coliseo Municipal de San Pedro'
        )}

        {renderInput(
          'Descripción',
          'description',
          'Información adicional sobre el campeonato...',
          'default',
          true
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreateChampionship}
            disabled={loading}
          >
            <Ionicons 
              name={loading ? "hourglass" : "add-circle"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.createButtonText}>
              {loading ? 'Creando...' : 'Crear Campeonato'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2D34', // Fondo oscuro
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerContainer: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pickerText: {
    fontSize: 16,
    color: '#FFFFFF',
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
  createButton: {
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
  createButtonDisabled: {
    backgroundColor: '#B3B3B3',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
