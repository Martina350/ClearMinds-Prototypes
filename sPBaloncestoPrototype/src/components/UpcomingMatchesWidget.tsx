// Widget de próximos partidos
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match, Championship } from '../types';

interface UpcomingMatchesWidgetProps {
  championships: Championship[];
  onMatchPress?: (match: Match, championship: Championship) => void;
}

export const UpcomingMatchesWidget: React.FC<UpcomingMatchesWidgetProps> = ({
  championships,
  onMatchPress,
}) => {
  const getUpcomingMatches = (): Array<{ match: Match; championship: Championship }> => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcoming: Array<{ match: Match; championship: Championship }> = [];

    championships.forEach(ch => {
      ch.matches.forEach(match => {
        const matchDate = new Date(match.date);
        if (matchDate >= today && matchDate <= nextWeek && match.status === 'scheduled') {
          upcoming.push({ match, championship: ch });
        }
      });
    });

    return upcoming.sort(
      (a, b) => new Date(a.match.date).getTime() - new Date(b.match.date).getTime()
    );
  };

  const upcomingMatches = getUpcomingMatches();

  if (upcomingMatches.length === 0) {
    return null;
  }

  const getDaysUntilMatch = (matchDate: string): string => {
    const today = new Date();
    const match = new Date(matchDate);
    const diffTime = match.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'HOY';
    if (diffDays === 1) return 'MAÑANA';
    return `EN ${diffDays} DÍAS`;
  };

  const renderMatchItem = ({ item }: { item: { match: Match; championship: Championship } }) => {
    const { match, championship } = item;
    const daysLabel = getDaysUntilMatch(match.date);

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => onMatchPress && onMatchPress(match, championship)}
      >
        <View style={styles.matchHeader}>
          <View style={[styles.daysBadge, daysLabel === 'HOY' ? styles.todayBadge : {}]}>
            <Text style={styles.daysText}>{daysLabel}</Text>
          </View>
          <Text style={styles.matchCategory}>{match.category}</Text>
        </View>

        <View style={styles.teamsContainer}>
          <Text style={styles.teamName}>{match.homeTeam}</Text>
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <Text style={styles.teamName}>{match.awayTeam}</Text>
        </View>

        <View style={styles.matchFooter}>
          <View style={styles.matchInfo}>
            <Ionicons name="calendar-outline" size={14} color="#B3B3B3" />
            <Text style={styles.matchDate}>{match.date}</Text>
          </View>
          <View style={styles.matchInfo}>
            <Ionicons name="time-outline" size={14} color="#B3B3B3" />
            <Text style={styles.matchTime}>{match.time}</Text>
          </View>
        </View>

        <View style={styles.championshipBadge}>
          <Ionicons name="trophy-outline" size={12} color="#E62026" />
          <Text style={styles.championshipName}>{championship.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={24} color="#E62026" />
          <Text style={styles.title}>Próximos Partidos</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{upcomingMatches.length}</Text>
        </View>
      </View>

      <FlatList
        data={upcomingMatches.slice(0, 5)}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.match.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1D24',
    marginVertical: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: '#E62026',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingRight: 15,
  },
  matchCard: {
    backgroundColor: '#2A2D34',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    width: 240,
    borderLeftWidth: 4,
    borderLeftColor: '#E62026',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  daysBadge: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  todayBadge: {
    backgroundColor: '#E62026',
  },
  daysText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchCategory: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  teamsContainer: {
    marginBottom: 12,
  },
  teamName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  vsText: {
    color: '#E62026',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchDate: {
    color: '#B3B3B3',
    fontSize: 11,
    marginLeft: 4,
  },
  matchTime: {
    color: '#B3B3B3',
    fontSize: 11,
    marginLeft: 4,
  },
  championshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 32, 38, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  championshipName: {
    color: '#E62026',
    fontSize: 10,
    marginLeft: 4,
  },
});

