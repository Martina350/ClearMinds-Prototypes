# 🚀 Guía de Instalación - Escuela de Baloncesto San Pedro

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** o **yarn** (viene con Node.js)
- **Expo CLI** - Instalar con: `npm install -g @expo/cli`
- **Git** - [Descargar aquí](https://git-scm.com/)

## 📱 Dispositivo Móvil

Para probar la aplicación necesitas:

- **Android**: App "Expo Go" desde Google Play Store
- **iOS**: App "Expo Go" desde App Store
- **Emulador**: Android Studio (Android) o Xcode (iOS)

## 🛠️ Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd sPBaloncestoPrototype
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm start
```

### 4. Ejecutar en Dispositivo

#### Opción A: Dispositivo Físico
1. Abre la app **Expo Go** en tu teléfono
2. Escanea el código QR que aparece en la terminal
3. La app se cargará automáticamente

#### Opción B: Emulador
```bash
# Para Android
npm run android

# Para iOS (solo en Mac)
npm run ios

# Para Web (desarrollo)
npm run web
```

## 🔑 Credenciales de Prueba

### Padre de Familia
- **Usuario**: `padre1`
- **Contraseña**: `123456`

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 🐛 Solución de Problemas Comunes

### Error: "Expo CLI not found"
```bash
npm install -g @expo/cli
```

### Error: "Metro bundler not starting"
```bash
npx expo start --clear
```

### Error: "Cannot connect to development server"
- Verifica que tu teléfono y computadora estén en la misma red WiFi
- Desactiva el firewall temporalmente
- Usa el comando: `npx expo start --tunnel`

### Error: "Module not found"
```bash
npm install
# o
yarn install
```

## 📁 Estructura del Proyecto

```
sPBaloncestoPrototype/
├── src/
│   ├── types/           # Tipos TypeScript
│   ├── context/         # Contextos React
│   ├── data/           # Datos mock
│   ├── navigation/      # Navegación
│   ├── screens/        # Pantallas
│   └── config/         # Configuración
├── App.tsx             # Componente principal
├── package.json        # Dependencias
└── README.md          # Documentación
```

## 🔧 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Limpiar caché y reiniciar
npx expo start --clear

# Instalar nueva dependencia
npm install [nombre-paquete]

# Ver logs del dispositivo
npx expo logs

# Construir para producción
npx expo build:android
npx expo build:ios
```

## 📱 Funcionalidades Disponibles

### Para Padres de Familia
- ✅ Login con credenciales
- ✅ Navegación del sitio web institucional
- ✅ Consulta de campeonatos y partidos
- ✅ Estado de pagos por estudiante
- ✅ Realización de pagos (simulado)
- ✅ Subida de comprobantes de transferencia

### Para Administradores
- ✅ Dashboard con métricas
- ✅ Gestión de transferencias pendientes
- ✅ Control de cartera y deudores
- ✅ Gestión básica de campeonatos

## 🎨 Personalización

### Cambiar Colores
Edita el archivo `src/config/appConfig.ts`:
```typescript
COLORS: {
  PRIMARY: '#tu-color-primario',
  SECONDARY: '#tu-color-secundario',
  // ...
}
```

### Cambiar URL del Sitio Web
En el mismo archivo:
```typescript
WEBSITE_URL: 'https://tu-sitio-web.com'
```

## 📞 Soporte

Si encuentras problemas:

1. **Revisa la consola** para errores
2. **Verifica la conexión** a internet
3. **Reinicia el servidor** con `npx expo start --clear`
4. **Consulta la documentación** de Expo

## 🚀 Próximos Pasos

Una vez que tengas la app funcionando:

1. **Explora todas las pantallas** con las credenciales de prueba
2. **Prueba los diferentes flujos** de usuario
3. **Revisa el código** para entender la implementación
4. **Personaliza** según tus necesidades

---

¡Listo! Tu prototipo de la Escuela de Baloncesto San Pedro está funcionando. 🏀
