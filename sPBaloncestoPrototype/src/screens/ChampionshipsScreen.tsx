// Pantalla de lista de Campeonatos
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Championship } from '../types';

interface ChampionshipsScreenProps {
  navigation: any;
}

export const ChampionshipsScreen: React.FC<ChampionshipsScreenProps> = ({ navigation }) => {
  const { championships } = useApp();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Sub-10', 'Sub-12', 'Sub-13', 'Sub-15'];
  const genders = ['masculino', 'femenino'];

  const filteredChampionships = championships.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || championship.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderChampionship = ({ item }: { item: Championship }) => (
    <TouchableOpacity
      style={styles.championshipCard}
      onPress={() => navigation.navigate('ChampionshipDetail', { championship: item })}
    >
      <View style={styles.championshipHeader}>
        <Text style={styles.championshipName}>{item.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Finalizado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.championshipInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="trophy-outline" size={16} color="#e74c3c" />
          <Text style={styles.infoText}>{item.category}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#e74c3c" />
          <Text style={styles.infoText}>{item.gender}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#e74c3c" />
          <Text style={styles.infoText}>
            {item.matches.length} partido{item.matches.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.matchesPreview}>
        {item.matches.slice(0, 2).map((match) => (
          <View key={match.id} style={styles.matchPreview}>
            <Text style={styles.matchText}>
              {match.homeTeam} vs {match.awayTeam}
            </Text>
            <Text style={styles.matchStatus}>
              {match.status === 'completed' 
                ? `${match.homeScore} - ${match.awayScore}`
                : `${match.date} ${match.time}`
              }
            </Text>
          </View>
        ))}
        {item.matches.length > 2 && (
          <Text style={styles.moreMatches}>
            +{item.matches.length - 2} partidos más
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#7f8c8d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar campeonatos..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Filtrar por categoría:</Text>
        <View style={styles.categoryButtons}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryButtonText,
              !selectedCategory && styles.categoryButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredChampionships}
        renderItem={renderChampionship}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#e74c3c',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  championshipCard: {
    backgroundColor: 'white',
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
  championshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  championshipName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  championshipInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#7f8c8d',
  },
  matchesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  matchPreview: {
    marginBottom: 5,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  matchStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 10,
  },
  moreMatches: {
    fontSize: 12,
    color: '#e74c3c',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
