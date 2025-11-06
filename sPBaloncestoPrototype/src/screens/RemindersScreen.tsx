// Pantalla de Recordatorios
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Reminder } from '../types';

export const RemindersScreen: React.FC = () => {
  const { reminders, addReminder, removeReminder, toggleReminder, payments, championships } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderType, setReminderType] = useState<'payment' | 'match'>('payment');

  const handleCreateReminder = (title: string, message: string, targetDate: string, targetId: string) => {
    addReminder({
      type: reminderType,
      title,
      message,
      targetDate,
      targetId,
      enabled: true,
    });
    setModalVisible(false);
    Alert.alert('Éxito', 'Recordatorio creado exitosamente');
  };

  const handleDeleteReminder = (reminderId: string) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeReminder(reminderId),
        },
      ]
    );
  };

  const renderReminderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View style={styles.reminderTitleContainer}>
          <Ionicons
            name={item.type === 'payment' ? 'card-outline' : 'trophy-outline'}
            size={20}
            color="#E62026"
          />
          <View style={styles.reminderTitleText}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Text style={styles.reminderMessage}>{item.message}</Text>
          </View>
        </View>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleReminder(item.id)}
          trackColor={{ false: '#767577', true: '#E62026' }}
          thumbColor={item.enabled ? '#FFFFFF' : '#f4f3f4'}
        />
      </View>

      <View style={styles.reminderDetails}>
        <View style={styles.reminderInfo}>
          <Ionicons name="calendar-outline" size={14} color="#B3B3B3" />
          <Text style={styles.reminderDate}>
            {new Date(item.targetDate).toLocaleDateString('es-ES')}
          </Text>
        </View>
        <View style={styles.reminderInfo}>
          <View style={[styles.typeBadge, { backgroundColor: item.type === 'payment' ? '#3498db' : '#27ae60' }]}>
            <Text style={styles.typeText}>
              {item.type === 'payment' ? 'Pago' : 'Partido'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteReminder(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  const CreateReminderModal = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [targetId, setTargetId] = useState('');

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, reminderType === 'payment' && styles.typeButtonActive]}
                onPress={() => setReminderType('payment')}
              >
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={reminderType === 'payment' ? '#FFFFFF' : '#B3B3B3'}
                />
                <Text
                  style={[styles.typeButtonText, reminderType === 'payment' && styles.typeButtonTextActive]}
                >
                  Pago
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeButton, reminderType === 'match' && styles.typeButtonActive]}
                onPress={() => setReminderType('match')}
              >
                <Ionicons
                  name="trophy-outline"
                  size={20}
                  color={reminderType === 'match' ? '#FFFFFF' : '#B3B3B3'}
                />
                <Text
                  style={[styles.typeButtonText, reminderType === 'match' && styles.typeButtonTextActive]}
                >
                  Partido
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Título del recordatorio"
              placeholderTextColor="#B3B3B3"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mensaje del recordatorio"
              placeholderTextColor="#B3B3B3"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha (YYYY-MM-DD)"
              placeholderTextColor="#B3B3B3"
              value={targetDate}
              onChangeText={setTargetDate}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                if (!title || !message || !targetDate) {
                  Alert.alert('Error', 'Por favor completa todos los campos');
                  return;
                }
                handleCreateReminder(title, message, targetDate, targetId || Date.now().toString());
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Crear Recordatorio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Recordatorios</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus recordatorios de pagos y partidos</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Nuevo Recordatorio</Text>
      </TouchableOpacity>

      {reminders.length > 0 ? (
        <FlatList
          data={reminders}
          renderItem={renderReminderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={60} color="#B3B3B3" />
          <Text style={styles.emptyTitle}>Sin Recordatorios</Text>
          <Text style={styles.emptyText}>
            Crea tu primer recordatorio para no olvidar pagos o partidos importantes
          </Text>
        </View>
      )}

      <CreateReminderModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  header: {
    backgroundColor: '#1A1D24',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D34',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E62026',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#E62026',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    padding: 15,
  },
  reminderCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderTitleText: {
    marginLeft: 10,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reminderMessage: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderDate: {
    fontSize: 12,
    color: '#B3B3B3',
    marginLeft: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 10,
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A1D24',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2D34',
    padding: 12,
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: '#E62026',
  },
  typeButtonText: {
    color: '#B3B3B3',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E62026',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

