// Pantalla de detalle de Campeonato
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
import { Championship, Match, Team } from '../types';

interface ChampionshipDetailScreenProps {
  navigation: any;
  route: any;
}

export const ChampionshipDetailScreen: React.FC<ChampionshipDetailScreenProps> = ({ route }) => {
  const { championship }: { championship: Championship } = route.params;
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'standings'>('recent');

  const recentMatches = championship.matches.filter(match => match.status === 'completed');
  const upcomingMatches = championship.matches.filter(match => match.status === 'scheduled');

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  // Función para formatear fecha corta
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Ordenar equipos por puntos
  const sortedTeams = championship.teams 
    ? [...championship.teams].sort((a, b) => b.points - a.points)
    : [];

  const handleAddToCalendar = (match: Match) => {
    Alert.alert(
      'Añadir al calendario',
      `¿Deseas añadir el partido ${match.homeTeam} vs ${match.awayTeam} a tu calendario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Añadir', 
          onPress: () => {
            Alert.alert('Éxito', 'Partido añadido al calendario');
          }
        }
      ]
    );
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTeams}>
          {item.homeTeam} vs {item.awayTeam}
        </Text>
        <Text style={styles.matchCategory}>
          {item.category} - {item.gender}
        </Text>
      </View>
      
      <View style={styles.matchDetails}>
        <View style={styles.matchInfo}>
          <Ionicons name="calendar-outline" size={16} color="#B3B3B3" />
          <Text style={styles.matchInfoText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.matchInfo}>
          <Ionicons name="time-outline" size={16} color="#B3B3B3" />
          <Text style={styles.matchInfoText}>{item.time}</Text>
        </View>
      </View>

      {item.status === 'completed' && (
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{item.homeScore}</Text>
            <Text style={styles.scoreLabel}>{item.homeTeam}</Text>
          </View>
          
          <View style={styles.scoreSeparator}>
            <Text style={styles.scoreSeparatorText}>-</Text>
          </View>
          
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{item.awayScore}</Text>
            <Text style={styles.scoreLabel}>{item.awayTeam}</Text>
          </View>
        </View>
      )}

      {item.status === 'scheduled' && (
        <>
          <View style={styles.upcomingBadge}>
            <Ionicons name="time-outline" size={16} color="#E62026" />
            <Text style={styles.upcomingText}>Próximo partido</Text>
          </View>
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={() => handleAddToCalendar(item)}
          >
            <Ionicons name="calendar-outline" size={18} color="#E62026" />
            <Text style={styles.calendarButtonText}>Añadir al calendario</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderStandingRow = ({ item, index }: { item: Team; index: number }) => (
    <View style={styles.standingRow}>
      <View style={styles.standingPosition}>
        <Text style={[
          styles.positionText,
          index === 0 && styles.firstPosition,
          index === 1 && styles.secondPosition,
          index === 2 && styles.thirdPosition
        ]}>
          {index + 1}
        </Text>
      </View>
      <View style={styles.standingTeamInfo}>
        <Text style={styles.standingTeamName}>{item.name}</Text>
      </View>
      <View style={styles.standingStats}>
        <Text style={styles.standingStat}>{item.points}</Text>
        <Text style={styles.standingStat}>{item.wins}</Text>
        <Text style={styles.standingStat}>{item.losses}</Text>
        <Text style={styles.standingStat}>{item.pointsFor}</Text>
        <Text style={styles.standingStat}>{item.pointsAgainst}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.championshipTitle}>{championship.name}</Text>
        <View style={styles.championshipMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="trophy-outline" size={20} color="#FFFFFF" />
            <Text style={styles.metaText}>{championship.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color="#FFFFFF" />
            <Text style={styles.metaText}>{championship.gender}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
            <Text style={styles.metaText}>{championship.tournamentType}</Text>
          </View>
        </View>
      </View>

      {/* Fase Actual */}
      <View style={styles.currentPhaseSection}>
        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Ionicons name="flag-outline" size={24} color="#E62026" />
            <Text style={styles.phaseTitle}>Fase Actual</Text>
          </View>
          <Text style={styles.phaseName}>{championship.currentPhase}</Text>
          <View style={styles.phaseDates}>
            <View style={styles.phaseDateItem}>
              <Ionicons name="calendar-outline" size={16} color="#B3B3B3" />
              <Text style={styles.phaseDateText}>
                Inicio: {formatDate(championship.startDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Resultados ({recentMatches.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Próximos ({upcomingMatches.length})
          </Text>
        </TouchableOpacity>

        {sortedTeams.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'standings' && styles.activeTab]}
            onPress={() => setActiveTab('standings')}
          >
            <Text style={[styles.tabText, activeTab === 'standings' && styles.activeTabText]}>
              Clasificación
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {activeTab === 'recent' ? (
          recentMatches.length > 0 ? (
            <FlatList
              data={recentMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={60} color="#B3B3B3" />
              <Text style={styles.emptyTitle}>Sin resultados aún</Text>
              <Text style={styles.emptyText}>
                Los resultados aparecerán aquí una vez que se jueguen los partidos.
              </Text>
            </View>
          )
        ) : activeTab === 'upcoming' ? (
          upcomingMatches.length > 0 ? (
            <FlatList
              data={upcomingMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color="#B3B3B3" />
              <Text style={styles.emptyTitle}>Sin partidos programados</Text>
              <Text style={styles.emptyText}>
                Los próximos partidos aparecerán aquí cuando se programen.
              </Text>
            </View>
          )
        ) : (
          sortedTeams.length > 0 ? (
            <View style={styles.standingsContainer}>
              <View style={styles.standingsHeader}>
                <View style={styles.standingsHeaderPosition}>
                  <Text style={styles.standingsHeaderText}>#</Text>
                </View>
                <View style={styles.standingsHeaderTeam}>
                  <Text style={styles.standingsHeaderText}>Equipo</Text>
                </View>
                <View style={styles.standingsHeaderStats}>
                  <Text style={styles.standingsHeaderTextSmall}>Pts</Text>
                  <Text style={styles.standingsHeaderTextSmall}>G</Text>
                  <Text style={styles.standingsHeaderTextSmall}>P</Text>
                  <Text style={styles.standingsHeaderTextSmall}>PF</Text>
                  <Text style={styles.standingsHeaderTextSmall}>PC</Text>
                </View>
              </View>
              <FlatList
                data={sortedTeams}
                renderItem={renderStandingRow}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={60} color="#B3B3B3" />
              <Text style={styles.emptyTitle}>Sin clasificación disponible</Text>
              <Text style={styles.emptyText}>
                La clasificación aparecerá aquí cuando haya datos disponibles.
              </Text>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  header: {
    backgroundColor: '#E62026',
    padding: 20,
    borderBottomWidth: 0,
  },
  championshipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  championshipMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaText: {
    marginTop: 5,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  currentPhaseSection: {
    padding: 15,
    backgroundColor: '#0A0D14',
  },
  phaseCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E62026',
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E62026',
    marginBottom: 10,
  },
  phaseDates: {
    marginTop: 5,
  },
  phaseDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseDateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#B3B3B3',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0D14',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#E62026',
  },
  tabText: {
    fontSize: 13,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#E62026',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  matchCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchHeader: {
    marginBottom: 10,
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  matchCategory: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  matchDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  matchInfoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#B3B3B3',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 15,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E62026',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 5,
  },
  scoreSeparator: {
    marginHorizontal: 20,
  },
  scoreSeparatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B3B3B3',
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  upcomingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#E62026',
    fontWeight: '600',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2D34',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E62026',
  },
  calendarButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#E62026',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B3B3B3',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  standingsContainer: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 10,
  },
  standingsHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 5,
  },
  standingsHeaderPosition: {
    width: 30,
    alignItems: 'center',
  },
  standingsHeaderTeam: {
    flex: 1,
    marginLeft: 10,
  },
  standingsHeaderStats: {
    flexDirection: 'row',
    width: 150,
    justifyContent: 'space-between',
  },
  standingsHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  standingsHeaderTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#B3B3B3',
    width: 25,
    textAlign: 'center',
  },
  standingRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D34',
    alignItems: 'center',
  },
  standingPosition: {
    width: 30,
    alignItems: 'center',
  },
  positionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  firstPosition: {
    color: '#F2AB16',
    fontSize: 16,
  },
  secondPosition: {
    color: '#B3B3B3',
  },
  thirdPosition: {
    color: '#CD7F32',
  },
  standingTeamInfo: {
    flex: 1,
    marginLeft: 10,
  },
  standingTeamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  standingStats: {
    flexDirection: 'row',
    width: 150,
    justifyContent: 'space-between',
  },
  standingStat: {
    fontSize: 12,
    color: '#B3B3B3',
    width: 25,
    textAlign: 'center',
  },
});
