# 🚀 Instrucciones de Instalación y Ejecución

## ✅ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene con Node.js)
- **Git** (para clonar el repositorio)
- **Expo Go** en tu dispositivo móvil:
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/app/expo-go/id982107779)

### Opcional (para desarrollo avanzado):
- **Android Studio** (para emulador Android)
- **Xcode** (para emulador iOS, solo en Mac)

## 📦 Instalación

### Paso 1: Instalar las dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias definidas en `package.json`.

### Paso 2: Verificar la instalación

```bash
npm start
```

Deberías ver algo como:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## 📱 Ejecutar la Aplicación

### Opción 1: En tu dispositivo físico (Recomendado para empezar)

1. Instala **Expo Go** en tu teléfono (links arriba)
2. Ejecuta `npm start` en la terminal
3. Escanea el código QR que aparece:
   - **Android**: Usa la app Expo Go
   - **iOS**: Usa la cámara del iPhone

### Opción 2: En un emulador Android

1. Asegúrate de tener Android Studio instalado
2. Ejecuta:
   ```bash
   npm run android
   ```

### Opción 3: En un emulador iOS (solo Mac)

1. Asegúrate de tener Xcode instalado
2. Ejecuta:
   ```bash
   npm run ios
   ```

### Opción 4: En el navegador web

```bash
npm run web
```

**Nota**: Algunas funcionalidades (GPS, impresión) no funcionarán en web.

## 🛠️ Scripts Disponibles

```bash
# Iniciar el servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en navegador
npm run web
```

## 📂 Estructura del Proyecto

```
prototipoCajaAhorro/
├── src/
│   ├── domain/              # Lógica de negocio pura
│   │   ├── entities/       # Cliente, Cuenta, Transacción, etc.
│   │   ├── repositories/   # Interfaces de repositorios
│   │   └── services/       # Interfaces de servicios
│   │
│   ├── application/        # Casos de uso
│   │   └── use-cases/     # CrearCliente, AbrirCuenta, etc.
│   │
│   ├── infrastructure/     # Implementaciones técnicas
│   │   ├── persistence/   # AsyncStorage
│   │   ├── location/      # Expo Location
│   │   └── printing/      # Expo Print
│   │
│   ├── presentation/       # UI (React Native)
│   │   ├── screens/       # Pantallas
│   │   ├── components/    # Componentes reutilizables
│   │   ├── navigation/    # Navegación
│   │   └── context/       # Context API
│   │
│   └── shared/            # Código compartido
│       ├── types/        # Tipos y enums
│       ├── utils/        # Utilidades
│       └── di/           # Inyección de dependencias
│
├── App.tsx                # Punto de entrada
├── package.json          # Dependencias
├── tsconfig.json        # Configuración TypeScript
└── README.md           # Documentación
```

## 🎯 Estado Actual del Proyecto

### ✅ Completado

- [x] Estructura de carpetas siguiendo Clean Architecture
- [x] Entidades del dominio (Cliente, Cuenta, Transacción, Cobranza, Agente)
- [x] Interfaces de repositorios y servicios
- [x] Casos de uso principales
- [x] Implementaciones de infraestructura básicas
- [x] Componentes UI reutilizables (Button, Card, Input)
- [x] Pantallas principales (Home, Dashboard)
- [x] Navegación configurada
- [x] Sistema de inyección de dependencias

### 🔨 Pendiente de Implementación

#### 1. Repositorios Faltantes
- [ ] `CuentaRepositoryImpl`
- [ ] `TransaccionRepositoryImpl`
- [ ] `CobranzaRepositoryImpl`
- [ ] `AgenteRepositoryImpl`
- [ ] `ReferenciaPersonalRepositoryImpl`

#### 2. Pantallas Faltantes
- [ ] `LoginScreen` - Autenticación de agentes
- [ ] `CrearCuentaScreen` - Formulario para abrir cuentas
- [ ] `DepositoScreen` - Realizar depósitos
- [ ] `CobroScreen` - Gestionar cobros
- [ ] `ConsultaScreen` - Buscar clientes y cuentas

#### 3. Funcionalidades Adicionales
- [ ] Autenticación de usuarios
- [ ] Sincronización con backend
- [ ] Impresión física de recibos
- [ ] Gestión de permisos (cámara, ubicación)
- [ ] Tests unitarios
- [ ] Tests de integración

## 📖 Próximos Pasos Sugeridos

### Para comenzar a desarrollar:

1. **Implementar repositorios faltantes**
   - Copia el patrón de `ClienteRepositoryImpl.ts`
   - Adapta para cada entidad

2. **Crear pantalla de Login**
   - Formulario de usuario/contraseña
   - Validación
   - Navegación después del login

3. **Crear pantalla de Apertura de Cuentas**
   - Formulario con todos los campos necesarios
   - Integración con GPS para obtener ubicación
   - Uso de `AbrirCuentaUseCase`

4. **Agregar validaciones visuales**
   - Usar los validators de `src/shared/utils/validators.ts`
   - Mostrar errores en tiempo real

## 🐛 Solución de Problemas Comunes

### Error: "Module not found"
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error: "Metro bundler not running"
```bash
# Reinicia el servidor
npm start -- --reset-cache
```

### Error de permisos en Android
- Verifica que hayas aceptado los permisos en la app
- Revisa `app.json` para los permisos necesarios

### La app no carga en Expo Go
- Verifica que estés en la misma red WiFi
- Intenta escanear el QR nuevamente
- Reinicia Expo Go

## 📚 Recursos de Aprendizaje

### Para entender el proyecto:
- Lee `ARQUITECTURA.md` - Diagrama y explicación de capas
- Lee `GUIA_DESARROLLO.md` - Guía paso a paso para desarrolladores
- Lee `README.md` - Visión general del proyecto

### Para aprender más:
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 💡 Consejos

1. **Empieza con lo básico**: Implementa una funcionalidad completa antes de pasar a la siguiente
2. **Usa TypeScript**: Te ayudará a evitar errores
3. **Sigue la arquitectura**: Respeta las capas y sus responsabilidades
4. **Prueba frecuentemente**: Ejecuta la app después de cada cambio importante
5. **Lee el código existente**: Es la mejor forma de aprender el patrón

## 🤝 Necesitas Ayuda?

Si encuentras problemas:
1. Revisa la documentación en los archivos `.md`
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de estar usando las versiones correctas de Node.js y npm
4. Consulta los logs en la terminal para ver errores específicos

---

**¡Listo para empezar! 🚀**

Ejecuta `npm start` y comienza a desarrollar tu aplicación móvil profesional.

