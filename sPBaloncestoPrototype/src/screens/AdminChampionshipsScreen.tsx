// Pantalla de Campeonatos para Administradores
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Championship, Match } from '../types';

interface AdminChampionshipsScreenProps {
  navigation: any;
}

export const AdminChampionshipsScreen: React.FC<AdminChampionshipsScreenProps> = ({ navigation }) => {
  const { championships } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'manage'>('overview');

  // Cálculos para el resumen
  const totalChampionships = championships.length;
  const activeChampionships = championships.filter(c => c.isActive);
  const completedChampionships = championships.filter(c => !c.isActive);
  const totalMatches = championships.reduce((sum, c) => sum + c.matches.length, 0);
  const completedMatches = championships.reduce((sum, c) => 
    sum + c.matches.filter(m => m.status === 'completed').length, 0
  );

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Ionicons name="trophy-outline" size={30} color="#3498db" />
          <Text style={styles.summaryNumber}>{totalChampionships}</Text>
          <Text style={styles.summaryLabel}>Total Campeonatos</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="play-circle-outline" size={30} color="#27ae60" />
          <Text style={styles.summaryNumber}>{activeChampionships.length}</Text>
          <Text style={styles.summaryLabel}>Activos</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="checkmark-circle-outline" size={30} color="#f39c12" />
          <Text style={styles.summaryNumber}>{completedChampionships.length}</Text>
          <Text style={styles.summaryLabel}>Finalizados</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="basketball-outline" size={30} color="#e74c3c" />
          <Text style={styles.summaryNumber}>{totalMatches}</Text>
          <Text style={styles.summaryLabel}>Total Partidos</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateChampionship')}
        >
          <Ionicons name="add-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Crear Campeonato</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ManageChampionship', { championship: activeChampionships[0] })}
        >
          <Ionicons name="calendar-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Gestionar Campeonato</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('RegisterResult')}
        >
          <Ionicons name="trophy-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Registrar Resultado</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas de Partidos</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Partidos Completados</Text>
            <Text style={styles.statValue}>{completedMatches}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Partidos Restantes</Text>
            <Text style={styles.statValue}>{totalMatches - completedMatches}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progreso General</Text>
            <Text style={styles.statValue}>
              {totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0}%
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderActive = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campeonatos Activos</Text>
        {activeChampionships.length > 0 ? (
          <FlatList
            data={activeChampionships}
            renderItem={({ item }) => (
              <View style={styles.championshipCard}>
                <View style={styles.championshipHeader}>
                  <Text style={styles.championshipName}>{item.name}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Activo</Text>
                  </View>
                </View>
                <Text style={styles.championshipCategory}>
                  {item.category} - {item.gender}
                </Text>
                <Text style={styles.championshipPhase}>
                  Fase: {item.currentPhase}
                </Text>
                <Text style={styles.championshipMatches}>
                  {item.matches.length} partidos programados
                </Text>
                <View style={styles.championshipActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => navigation.navigate('ManageChampionship', { championship: item })}
                  >
                    <Text style={styles.editButtonText}>Gestionar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('ChampionshipDetail', { championship: item })}
                  >
                    <Text style={styles.viewButtonText}>Ver Detalle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay campeonatos activos</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderManage = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestión de Campeonatos</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateChampionship')}
        >
          <Ionicons name="add-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Crear Nuevo Campeonato</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ManageChampionship', { championship: activeChampionships[0] })}
        >
          <Ionicons name="calendar-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Gestionar Campeonato Activo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('RegisterResult')}
        >
          <Ionicons name="trophy-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Registrar Resultado de Partido</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todos los Campeonatos</Text>
        {championships.length > 0 ? (
          <FlatList
            data={championships}
            renderItem={({ item }) => (
              <View style={styles.championshipCard}>
                <View style={styles.championshipHeader}>
                  <Text style={styles.championshipName}>{item.name}</Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: item.isActive ? '#27ae60' : '#7f8c8d' }
                  ]}>
                    <Text style={styles.statusText}>
                      {item.isActive ? 'Activo' : 'Finalizado'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.championshipCategory}>
                  {item.category} - {item.gender}
                </Text>
                <Text style={styles.championshipPhase}>
                  Fase: {item.currentPhase}
                </Text>
                <Text style={styles.championshipMatches}>
                  {item.matches.length} partidos programados
                </Text>
                <View style={styles.championshipActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleChampionshipAction(item, 'edit')}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('ChampionshipDetail', { championship: item })}
                  >
                    <Text style={styles.viewButtonText}>Ver Detalle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay campeonatos registrados</Text>
        )}
      </View>
    </ScrollView>
  );

  const handleChampionshipAction = (championship: Championship, action: 'edit' | 'delete') => {
    if (action === 'edit') {
      navigation.navigate('ManageChampionship', { championship });
    } else {
      Alert.alert(
        'Eliminar Campeonato',
        `¿Estás seguro de eliminar "${championship.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Eliminar', 
            style: 'destructive',
            onPress: () => {
              Alert.alert('Campeonato Eliminado', 'El campeonato ha sido eliminado.');
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Campeonatos</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === 'overview' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Resumen
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Ionicons 
            name="play-circle-outline" 
            size={20} 
            color={activeTab === 'active' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Activos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manage' && styles.activeTab]}
          onPress={() => setActiveTab('manage')}
        >
          <Ionicons 
            name="settings-outline" 
            size={20} 
            color={activeTab === 'manage' ? '#e74c3c' : '#7f8c8d'} 
          />
          <Text style={[styles.tabText, activeTab === 'manage' && styles.activeTabText]}>
            Gestionar
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'active' && renderActive()}
      {activeTab === 'manage' && renderManage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0D14',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 34,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0D14',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E62026',
  },
  tabText: {
    fontSize: 14,
    color: '#B3B3B3',
    fontWeight: '500',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#E62026',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0D14',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E62026',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#E62026',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  championshipCard: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  championshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  championshipName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  championshipCategory: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  championshipPhase: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 5,
  },
  championshipMatches: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 10,
  },
  championshipActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#E62026',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#24C36B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3D44',
  },
  statLabel: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});
