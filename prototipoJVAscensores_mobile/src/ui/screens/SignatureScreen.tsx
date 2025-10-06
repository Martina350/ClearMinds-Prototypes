import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Signature from 'react-native-signature-canvas';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppState } from '../state/AppState';
import { Screen } from '../components/Screen';
import { Title, AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { Input } from '../components/Input';
import { Icon } from '../components/Icon';
import { getTheme } from '../theme/tokens';

export function SignatureScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { otId } = route.params ?? {};
  const { dispatchEvent, isDark } = useAppState();
  const [name, setName] = useState('');
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const ref = useRef<any>(null);
  const theme = getTheme(isDark ? 'dark' : 'light');

  const handleOK = (sig: string) => {
    setPngDataUrl(sig);
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
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
        {/* Instrucciones */}
        <AppText style={{ 
          fontSize: theme.typography.body, 
          textAlign: 'center',
          marginBottom: theme.spacing.xl,
          color: theme.colors.textSecondary
        }}>
          Por favor, firma en el área designada a continuación para confirmar la finalización del trabajo.
        </AppText>

        {/* Área de firma */}
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
          ...theme.shadows.sm
        }}>
          <View style={{ 
            height: 200, 
            borderWidth: 1, 
            borderColor: theme.colors.border, 
            borderRadius: theme.radii.md, 
            overflow: 'hidden',
            backgroundColor: theme.colors.card,
            position: 'relative'
          }}>
            <Signature
              ref={ref}
              onOK={handleOK}
              descriptionText=""
              clearText="Limpiar"
              confirmText=""
              webStyle=".m-signature-pad--footer { display: none; margin: 0px; }"
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: theme.spacing.sm,
                right: theme.spacing.sm,
                backgroundColor: theme.colors.bg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.radii.sm,
                borderWidth: 1,
                borderColor: theme.colors.border
              }}
              onPress={() => ref.current?.clearSignature()}
            >
              <AppText style={{ fontSize: theme.typography.caption }}>Limpiar</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input del nombre */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <AppText style={{ 
            fontSize: theme.typography.body, 
            marginBottom: theme.spacing.sm,
            color: theme.colors.text
          }}>
            Nombre del Cliente
          </AppText>
          <Input 
            placeholder="Ingresa el nombre del cliente" 
            value={name} 
            onChangeText={setName} 
          />
        </View>
      </View>

      {/* Botón guardar */}
      <View style={{ 
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border
      }}>
        <AppButton
          title="Guardar Firma"
          onPress={() => {
            if (pngDataUrl) {
              dispatchEvent({ type: 'SIGNATURE_SAVE', otId, name, dataUrl: pngDataUrl });
            }
            navigation.navigate('Checkout', { otId });
          }}
          variant={name && pngDataUrl ? 'primary' : 'outline'}
          style={{ width: '100%' }}
        />
      </View>
    </Screen>
  );
}


