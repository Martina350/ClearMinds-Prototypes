// Pantalla de lista de Campeonatos
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = ['Sub-8', 'Sub-9', 'Sub-10', 'Sub-11', 'Sub-12', 'Sub-13', 'Sub-14', 'Sub-15', 'Sub-16', 'Sub-17'];

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

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
        <View style={styles.championshipTitleContainer}>
          <Text style={styles.championshipName}>{item.name}</Text>
          <View style={styles.tournamentTypeBadge}>
            <Text style={styles.tournamentTypeText}>{item.tournamentType}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Finalizado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.championshipInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="trophy-outline" size={16} color="#E62026" />
          <Text style={styles.infoText}>{item.category} - {item.gender}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#E62026" />
          <Text style={styles.infoText}>
            Comienza el {formatDate(item.startDate)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="flag-outline" size={16} color="#E62026" />
          <Text style={styles.infoText}>{item.currentPhase}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="basketball-outline" size={16} color="#E62026" />
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
                : `${formatDate(match.date)} ${match.time}`
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

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsButtonText}>Ver detalles y resultados</Text>
        <Ionicons name="chevron-forward" size={18} color="#E62026" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#B3B3B3" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar campeonatos..."
            placeholderTextColor="#B3B3B3"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.singleFilterRow}>
          <View style={styles.categoryDropdownContainer}>
            <TouchableOpacity 
              style={styles.categoryDropdownButton}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={styles.categoryDropdownLabel}>Filtrar por categoría:</Text>
              <View style={styles.categoryDropdownValue}>
                <Text style={styles.categoryDropdownValueText}>
                  {selectedCategory || 'Todas las categorías'}
                </Text>
                <Ionicons 
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#E62026" 
                />
              </View>
            </TouchableOpacity>
            
            {showCategoryDropdown && (
              <>
                <TouchableOpacity 
                  style={styles.dropdownOverlay}
                  activeOpacity={1}
                  onPress={() => setShowCategoryDropdown(false)}
                />
                <View style={styles.categoryDropdownList}>
                  <ScrollView 
                    style={styles.dropdownScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    <TouchableOpacity
                      style={styles.categoryDropdownOption}
                      onPress={() => {
                        setSelectedCategory(null);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={styles.categoryDropdownOptionText}>Todas las categorías</Text>
                    </TouchableOpacity>
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryDropdownOption,
                          index === categories.length - 1 && styles.lastDropdownOption
                        ]}
                        onPress={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <Text style={styles.categoryDropdownOptionText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={() => {
              setSelectedCategory(null);
              setShowCategoryDropdown(false);
            }}
          >
            <Ionicons name="refresh" size={20} color="#E62026" />
          </TouchableOpacity>
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
    backgroundColor: '#0A0D14',
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
    color: '#FFFFFF', // Blanco
  },
  filtersContainer: {
    backgroundColor: '#0A0D14',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  singleFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryDropdownContainer: {
    flex: 1,
    marginRight: 12,
    position: 'relative',
    zIndex: 9999,
  },
  categoryDropdownButton: {
    backgroundColor: '#1A1D24',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryDropdownLabel: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 6,
    fontWeight: '500',
  },
  categoryDropdownValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryDropdownValueText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  categoryDropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1A1D24',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    maxHeight: 180,
    marginBottom: 20,
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  categoryDropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D34',
  },
  categoryDropdownOptionText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  clearFilterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1D24',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E62026',
    width: 50,
    height: 50,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: -50,
    left: -15,
    right: -15,
    bottom: -300,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  championshipTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  championshipName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E62026', // Rojo competitivo
    marginRight: 8,
  },
  tournamentTypeBadge: {
    backgroundColor: '#2A2D34',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E62026',
  },
  tournamentTypeText: {
    color: '#E62026',
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#F2AB16', // Amarillo alerta suave
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#0A0D14',
    fontSize: 12,
    fontWeight: 'bold',
  },
  championshipInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  matchesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 10,
    marginBottom: 10,
  },
  matchPreview: {
    marginBottom: 8,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  matchStatus: {
    fontSize: 12,
    color: '#B3B3B3',
    marginLeft: 10,
  },
  moreMatches: {
    fontSize: 12,
    color: '#E62026',
    fontStyle: 'italic',
    marginTop: 5,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 5,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E62026',
    marginRight: 5,
  },
});
