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
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
  },
  searchContainer: {
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Gris claro
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D24', // Card oscuro
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#0A0D14', // Negro profundo
  },
  filtersContainer: {
    backgroundColor: '#0A0D14', // Negro profundo/azul marino oscuro
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5', // Gris claro
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // Blanco neutro
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
    backgroundColor: '#E5E5E5', // Gris claro
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#E62026', // Rojo competitivo
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#B3B3B3', // Gris medio
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF', // Blanco neutro
  },
  listContainer: {
    padding: 15,
  },
  championshipCard: {
    backgroundColor: '#1A1D24', // Card oscuro
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
  championshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  championshipName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E62026', // Rojo competitivo
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#F2AB16', // Amarillo alerta suave
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#0A0D14', // Negro profundo
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
    color: '#FFFFFF', // Blanco
    fontWeight: '600',
  },
  matchesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5', // Gris claro
    paddingTop: 10,
  },
  matchPreview: {
    marginBottom: 5,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF', // Blanco
  },
  matchStatus: {
    fontSize: 12,
    color: '#B3B3B3', // Gris medio
    marginLeft: 10,
  },
  moreMatches: {
    fontSize: 12,
    color: '#E62026', // Rojo competitivo
    fontStyle: 'italic',
    marginTop: 5,
  },
});
