// Pantalla de detalle de Campeonato
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Championship, Match } from '../types';

interface ChampionshipDetailScreenProps {
  navigation: any;
  route: any;
}

export const ChampionshipDetailScreen: React.FC<ChampionshipDetailScreenProps> = ({ route }) => {
  const { championship }: { championship: Championship } = route.params;
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');

  const recentMatches = championship.matches.filter(match => match.status === 'completed');
  const upcomingMatches = championship.matches.filter(match => match.status === 'scheduled');

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
          <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
          <Text style={styles.matchInfoText}>{item.date}</Text>
        </View>
        
        <View style={styles.matchInfo}>
          <Ionicons name="time-outline" size={16} color="#7f8c8d" />
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
        <View style={styles.upcomingBadge}>
          <Ionicons name="clock-outline" size={16} color="#e74c3c" />
          <Text style={styles.upcomingText}>Próximo partido</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.championshipTitle}>{championship.name}</Text>
        <View style={styles.championshipMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="trophy-outline" size={20} color="#e74c3c" />
            <Text style={styles.metaText}>{championship.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color="#e74c3c" />
            <Text style={styles.metaText}>{championship.gender}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={20} color="#e74c3c" />
            <Text style={styles.metaText}>
              {championship.matches.length} partidos
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Resultados Recientes ({recentMatches.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Próximos Partidos ({upcomingMatches.length})
          </Text>
        </TouchableOpacity>
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
              <Ionicons name="trophy-outline" size={60} color="#bdc3c7" />
              <Text style={styles.emptyTitle}>Sin resultados aún</Text>
              <Text style={styles.emptyText}>
                Los resultados aparecerán aquí una vez que se jueguen los partidos.
              </Text>
            </View>
          )
        ) : (
          upcomingMatches.length > 0 ? (
            <FlatList
              data={upcomingMatches}
              renderItem={renderMatch}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color="#bdc3c7" />
              <Text style={styles.emptyTitle}>Sin partidos programados</Text>
              <Text style={styles.emptyText}>
                Los próximos partidos aparecerán aquí cuando se programen.
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
    fontSize: 14,
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
  },
  upcomingText: {
    marginLeft: 5,
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
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
