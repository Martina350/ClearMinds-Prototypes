# 🛠️ Comandos Útiles - Recaudadora Móvil

## 📦 Gestión de Dependencias

```bash
# Instalar todas las dependencias
npm install

# Actualizar dependencias
npm update

# Ver dependencias instaladas
npm list --depth=0

# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Agregar una nueva dependencia
npm install nombre-paquete

# Agregar dependencia de desarrollo
npm install -D nombre-paquete
```

## 🚀 Ejecutar la Aplicación

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar con caché limpio
npm start -- --reset-cache

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo Mac)
npm run ios

# Ejecutar en navegador web
npm run web

# Ejecutar con tunnel (para compartir)
npx expo start --tunnel
```

## 🔍 Desarrollo y Depuración

```bash
# Ver logs en tiempo real (Android)
npx react-native log-android

# Ver logs en tiempo real (iOS)
npx react-native log-ios

# Limpiar build de Android
cd android && ./gradlew clean && cd ..

# Limpiar build de iOS
cd ios && xcodebuild clean && cd ..

# Verificar TypeScript
npx tsc --noEmit

# Formatear código (si tienes Prettier)
npx prettier --write "src/**/*.{ts,tsx}"
```

## 📱 Gestión de Expo

```bash
# Actualizar Expo CLI
npm install -g expo-cli

# Verificar versión de Expo
npx expo --version

# Ver configuración del proyecto
npx expo config

# Publicar en Expo (para compartir)
npx expo publish

# Generar build para Android
npx expo build:android

# Generar build para iOS
npx expo build:ios
```

## 🧪 Testing (cuando implementes tests)

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar un test específico
npm test -- NombreDelTest
```

## 📊 Análisis de Código

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Analizar tamaño del bundle
npx expo-cli customize:web

# Ver estadísticas del proyecto
npx cloc src/
```

## 🔧 Comandos de Desarrollo Personalizados

Puedes agregar estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clean": "rm -rf node_modules package-lock.json && npm install",
    "type-check": "tsc --noEmit",
    "reset-cache": "npm start -- --reset-cache"
  }
}
```

## 🐛 Solución de Problemas

```bash
# Problema: Metro bundler no responde
# Solución: Reiniciar con caché limpio
npm start -- --reset-cache

# Problema: Errores de dependencias
# Solución: Reinstalar desde cero
rm -rf node_modules package-lock.json
npm install

# Problema: App no carga en dispositivo
# Solución: Usar tunnel
npx expo start --tunnel

# Problema: Errores de tipos TypeScript
# Solución: Verificar tipos
npx tsc --noEmit

# Problema: Build fallido en Android
# Solución: Limpiar y rebuilder
cd android && ./gradlew clean && cd ..
npm run android
```

## 📱 Comandos de Dispositivo

```bash
# Listar dispositivos Android conectados
adb devices

# Instalar APK manualmente
adb install ruta/al/archivo.apk

# Ver logs de Android
adb logcat

# Reiniciar servidor ADB
adb kill-server
adb start-server

# Listar simuladores iOS
xcrun simctl list devices

# Abrir simulador iOS
open -a Simulator
```

## 🔐 Permisos (Android)

```bash
# Otorgar permisos manualmente vía ADB
adb shell pm grant com.tu.app android.permission.ACCESS_FINE_LOCATION
adb shell pm grant com.tu.app android.permission.CAMERA
```

## 📦 Generar APK/IPA

```bash
# Generar APK de desarrollo (Android)
cd android
./gradlew assembleRelease
# APK estará en: android/app/build/outputs/apk/release/

# Generar bundle de Android
./gradlew bundleRelease

# Build para iOS (requiere Mac)
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp archive
```

## 🌐 Compartir la App

```bash
# Publicar en Expo para compartir con otros
npx expo publish

# Generar QR para compartir
npx expo start --tunnel

# Ver builds publicados
npx expo build:list
```

## 📂 Gestión de Archivos

```bash
# Ver estructura del proyecto
tree -I 'node_modules|.expo'

# Contar líneas de código
find src -name '*.ts' -o -name '*.tsx' | xargs wc -l

# Buscar en archivos
grep -r "texto a buscar" src/

# Buscar archivos por nombre
find src -name "*nombre*"
```

## 🎨 Desarrollo UI

```bash
# Iniciar Storybook (si lo instalas)
npm run storybook

# Ver componentes aislados
npx expo start --web
```

## 💾 Gestión de Datos

```bash
# Limpiar AsyncStorage (en desarrollo)
# Agregar este código temporal en App.tsx:
# import AsyncStorage from '@react-native-async-storage/async-storage';
# AsyncStorage.clear();

# Ver datos de AsyncStorage
# Usa React Native Debugger o Flipper
```

## 🚀 Optimización

```bash
# Analizar tamaño del bundle
npx expo-cli customize:web

# Optimizar imágenes
# Instala: npm install -g imagemin-cli
imagemin assets/**/*.{jpg,png} --out-dir=assets/optimized

# Verificar uso de memoria
# En Chrome DevTools cuando uses web
```

## 📝 Git (Control de Versiones)

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push origin main

# Ver historial
git log --oneline

# Crear nueva rama
git checkout -b nombre-rama

# Cambiar de rama
git checkout nombre-rama

# Ver diferencias
git diff
```

## 🔄 Actualizar Expo

```bash
# Actualizar SDK de Expo
npx expo upgrade

# Actualizar CLI de Expo
npm install -g expo-cli@latest

# Ver versión actual
npx expo --version
```

## 📚 Documentación

```bash
# Generar documentación de código (si instalas TypeDoc)
npx typedoc --out docs src/

# Ver documentación de Expo
npx expo docs
```

## ⚡ Atajos de Teclado en Expo Dev Server

Cuando ejecutes `npm start`, puedes usar:

- `a` - Abrir en Android
- `i` - Abrir en iOS
- `w` - Abrir en Web
- `r` - Recargar app
- `m` - Toggle menu
- `d` - Abrir DevTools
- `Shift + d` - Cambiar modo de desarrollo
- `c` - Limpiar consola

---

**💡 Tip**: Guarda este archivo como referencia rápida durante el desarrollo!

