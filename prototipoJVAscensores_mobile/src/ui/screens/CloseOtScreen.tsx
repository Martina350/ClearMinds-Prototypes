import React from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText, Caption } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CloseOt'>;

export function CloseOtScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<Nav>();
  const { otId } = route.params ?? {};
  const { getQueue, isDark } = useAppState();
  const theme = getTheme(isDark ? 'dark' : 'light');

  const generatePdf = async () => {
    const html = `<!doctype html><html><body><h1>OT ${otId}</h1><p>Resumen de evidencias.</p></body></html>`;
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('PDF generado', uri);
    }
    
    // Navegar automáticamente a HomeScreen después de cerrar la OT
    navigation.navigate('Home');
  };

  return (
    <Screen>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md
      }}>
        <TouchableOpacity style={{ marginRight: theme.spacing.md }}>
          <Icon name="close" color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Title style={{ flex: 1, textAlign: 'center' }}>Finalizar OT</Title>
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
        {/* Resumen de la OT */}
        <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.md }}>
          Resumen de la OT
        </Title>
        
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <Caption>Tiempo total</Caption>
            <AppText style={{ fontWeight: '600' }}>3h 15m</AppText>
          </View>
          
          <View style={{ 
            height: 1, 
            backgroundColor: theme.colors.border, 
            marginBottom: theme.spacing.md 
          }} />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <Caption>Evidencias</Caption>
            <AppText style={{ fontWeight: '600' }}>5 fotos, 2 videos</AppText>
          </View>
          
          <View style={{ 
            height: 1, 
            backgroundColor: theme.colors.border, 
            marginBottom: theme.spacing.md 
          }} />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Caption>Estado</Caption>
            <AppText style={{ fontWeight: '600' }}>En curso</AppText>
          </View>
        </Card>

        {/* Sincronización */}
        <Title style={{ fontSize: theme.typography.h2, marginBottom: theme.spacing.md }}>
          Sincronización
        </Title>
        
        <Card style={{ marginBottom: theme.spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: theme.colors.success + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md
            }}>
              <Icon name="check" color={theme.colors.success} size={16} />
            </View>
            <View>
              <AppText style={{ fontWeight: '600' }}>Estado</AppText>
              <Caption>Sincronizado</Caption>
            </View>
          </View>
          
          <View style={{ 
            height: 1, 
            backgroundColor: theme.colors.border, 
            marginBottom: theme.spacing.md 
          }} />
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: theme.colors.warning + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: theme.spacing.md
            }}>
              <Icon name="cloud-upload" color={theme.colors.warning} size={16} />
            </View>
            <View>
              <AppText style={{ fontWeight: '600' }}>Cola de envío</AppText>
              <Caption>{getQueue().length} pendientes</Caption>
            </View>
          </View>
        </Card>
      </View>

      {/* Botón finalizar */}
      <View style={{ 
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border
      }}>
        <AppButton
          title="Finalizar OT"
          onPress={generatePdf}
          variant="primary"
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}


