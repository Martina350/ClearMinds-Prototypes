import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { 
  MaterialIcons, 
  MaterialCommunityIcons, 
  Ionicons, 
  Feather,
  AntDesign,
  FontAwesome5
} from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
  library?: 'MaterialIcons' | 'MaterialCommunityIcons' | 'Ionicons' | 'Feather' | 'AntDesign' | 'FontAwesome5';
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#2C3E50',
  style,
  library = 'MaterialIcons'
}) => {
  const iconProps = {
    name: name as any,
    size,
    color,
    style: [styles.icon, style]
  };

  switch (library) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'Ionicons':
      return <Ionicons {...iconProps} />;
    case 'Feather':
      return <Feather {...iconProps} />;
    case 'AntDesign':
      return <AntDesign {...iconProps} />;
    case 'FontAwesome5':
      return <FontAwesome5 {...iconProps} />;
    default:
      return <MaterialIcons {...iconProps} />;
  }
};

// Iconos específicos para la aplicación
export const AppIcons = {
  // Navegación
  services: (size = 24, color = '#7F8C8D') => <Icon name="list" size={size} color={color} />,
  myServices: (size = 24, color = '#7F8C8D') => <Icon name="event" size={size} color={color} />,
  myServicesActive: (size = 24, color = '#5CB85C') => <Icon name="check-circle" size={size} color={color} />,
  profile: (size = 24, color = '#7F8C8D') => <Icon name="person" size={size} color={color} />,
  profileActive: (size = 24, color = '#5CB85C') => <Icon name="person" size={size} color={color} />,
  
  // Servicios
  toilet: (size = 48, color = '#FFFFFF') => <Icon name="wc" size={size} color={color} library="MaterialIcons" />,
  septic: (size = 48, color = '#FFFFFF') => <Icon name="home" size={size} color={color} library="MaterialIcons" />,
  grease: (size = 48, color = '#FFFFFF') => <Icon name="local-gas-station" size={size} color={color} library="MaterialIcons" />,
  trash: (size = 48, color = '#FFFFFF') => <Icon name="delete" size={size} color={color} library="MaterialIcons" />,
  debris: (size = 48, color = '#FFFFFF') => <Icon name="construction" size={size} color={color} library="MaterialIcons" />,
  
  // Acciones
  edit: (size = 20, color = '#5CB85C') => <Icon name="edit" size={size} color={color} library="Feather" />,
  logout: (size = 20, color = '#5CB85C') => <Icon name="log-out" size={size} color={color} library="Feather" />,
  phone: (size = 16, color = '#FFFFFF') => <Icon name="phone" size={size} color={color} library="Feather" />,
  bell: (size = 20, color = '#2C3E50') => <Icon name="bell" size={size} color={color} library="Feather" />,
  user: (size = 20, color = '#2C3E50') => <Icon name="user" size={size} color={color} library="Feather" />,
  
  // Formularios
  email: (size = 16, color = '#7F8C8D') => <Icon name="mail" size={size} color={color} library="Feather" />,
  lock: (size = 16, color = '#7F8C8D') => <Icon name="lock" size={size} color={color} library="Feather" />,
  eye: (size = 16, color = '#7F8C8D') => <Icon name="eye" size={size} color={color} library="Feather" />,
  eyeOff: (size = 16, color = '#7F8C8D') => <Icon name="eye-off" size={size} color={color} library="Feather" />,
  globe: (size = 16, color = '#7F8C8D') => <Icon name="globe" size={size} color={color} library="Feather" />,
  mapPin: (size = 16, color = '#7F8C8D') => <Icon name="map-pin" size={size} color={color} library="Feather" />,
  building: (size = 16, color = '#7F8C8D') => <Icon name="home" size={size} color={color} library="Feather" />,
  flag: (size = 16, color = '#7F8C8D') => <Icon name="flag" size={size} color={color} library="Feather" />,
  chevronDown: (size = 16, color = '#7F8C8D') => <Icon name="chevron-down" size={size} color={color} library="Feather" />,
  
  // Pagos
  creditCard: (size = 24, color = '#2C3E50') => <Icon name="credit-card" size={size} color={color} library="Feather" />,
  bank: (size = 24, color = '#2C3E50') => <Icon name="bank" size={size} color={color} library="MaterialCommunityIcons" />,
  upload: (size = 16, color = '#5CB85C') => <Icon name="upload" size={size} color={color} library="Feather" />,
  
  // Admin
  gear: (size = 20, color = '#FFFFFF') => <Icon name="settings" size={size} color={color} library="Feather" />,
  refresh: (size = 20, color = '#FFFFFF') => <Icon name="refresh-cw" size={size} color={color} library="Feather" />,
  mobile: (size = 16, color = '#FFFFFF') => <Icon name="smartphone" size={size} color={color} library="Feather" />,
  dashboard: (size = 16, color = '#FFFFFF') => <Icon name="grid" size={size} color={color} library="Feather" />,
  calendar: (size = 16, color = '#FFFFFF') => <Icon name="calendar" size={size} color={color} library="Feather" />,
  check: (size = 16, color = '#FFFFFF') => <Icon name="check" size={size} color={color} library="Feather" />,
  plus: (size = 16, color = '#FFFFFF') => <Icon name="plus" size={size} color={color} library="Feather" />,
  users: (size = 16, color = '#FFFFFF') => <Icon name="users" size={size} color={color} library="Feather" />,
  
  // Estados
  warning: (size = 20, color = '#F39C12') => <Icon name="alert-triangle" size={size} color={color} library="Feather" />,
  success: (size = 20, color = '#5CB85C') => <Icon name="check-circle" size={size} color={color} library="Feather" />,
  error: (size = 20, color = '#E74C3C') => <Icon name="x-circle" size={size} color={color} library="Feather" />,
  info: (size = 20, color = '#3498DB') => <Icon name="info" size={size} color={color} library="Feather" />,
  
  // Leaf para logo
  leaf: (size = 48, color = '#5CB85C') => <Icon name="leaf" size={size} color={color} library="MaterialCommunityIcons" />,
  
  // Status indicators
  phoneStatus: (size = 12, color = '#FFFFFF') => <Icon name="phone" size={size} color={color} library="Feather" />,
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
