# 🔧 Solución de Problemas - WebView

## ❌ Error Común: `RNCWebViewModule.default.shouldStartLoadWithLockIdentifier is not a function`

Este error es común en React Native con WebView. Aquí están las soluciones:

## 🛠️ Soluciones Implementadas

### 1. **Versión Compatible de WebView**
```json
"react-native-webview": "13.6.4"
```
- Cambiamos de la versión 13.8.1 a 13.6.4 que es más estable

### 2. **Configuración Mejorada del WebView**
- Agregamos propiedades adicionales para mejor compatibilidad
- Configuración centralizada en `src/config/webviewConfig.ts`
- Manejo de errores más robusto

### 3. **URL de Prueba**
- Usamos Google.com como URL de prueba (funciona siempre)
- Puedes cambiar la URL real en `src/config/webviewConfig.ts`

## 🚀 Pasos para Solucionar

### Paso 1: Limpiar e Instalar
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules
# En Windows: rmdir /s node_modules

# Reinstalar dependencias
npm install
```

### Paso 2: Limpiar Caché de Expo
```bash
npx expo start --clear
```

### Paso 3: Si Persiste el Error

#### Opción A: Usar Versión Más Antigua
```bash
npm install react-native-webview@13.2.2
```

#### Opción B: Usar WebView de Expo
```bash
npm install expo-web-browser
```

## 🔄 Alternativa: Pantalla de Inicio Sin WebView

Si el WebView sigue dando problemas, puedes usar esta alternativa:

```typescript
// src/screens/HomeScreenAlternative.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreenAlternative: React.FC = () => {
  const handleOpenWebsite = () => {
    Linking.openURL('https://www.sanpedrobaloncesto.edu.co');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="globe-outline" size={80} color="#e74c3c" />
        <Text style={styles.title}>Sitio Web Institucional</Text>
        <Text style={styles.subtitle}>
          Toca el botón para abrir el sitio web en tu navegador
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleOpenWebsite}>
          <Ionicons name="open-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Abrir Sitio Web</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## 📱 Configuración por Plataforma

### Android
- Asegúrate de tener Android SDK actualizado
- Verifica permisos de internet en `android/app/src/main/AndroidManifest.xml`

### iOS
- Verifica que `ios/Podfile` tenga las dependencias correctas
- Ejecuta `cd ios && pod install`

## 🔍 Debugging

### Ver Logs Detallados
```bash
npx expo start --dev-client
```

### Verificar Versiones
```bash
npx expo doctor
```

## ✅ Verificación

Una vez solucionado, deberías ver:
- ✅ WebView carga correctamente
- ✅ No hay errores en la consola
- ✅ Navegación funciona dentro del WebView
- ✅ Manejo de errores funciona

## 📞 Si el Problema Persiste

1. **Verifica la versión de Expo**: `npx expo --version`
2. **Actualiza Expo CLI**: `npm install -g @expo/cli@latest`
3. **Usa la alternativa sin WebView** temporalmente
4. **Reporta el error** con detalles de tu entorno

---

**Nota**: El WebView es una funcionalidad compleja que puede tener problemas de compatibilidad. La alternativa de abrir en navegador externo es una solución válida y funcional.
