# 🏀 Escuela de Baloncesto San Pedro - Prototipo Móvil

## Descripción General

Prototipo de aplicación móvil para la Escuela de Baloncesto San Pedro, diseñado para padres de familia y administradores. La aplicación permite consultar el estado de pagos, realizar pagos escolares, y mantenerse informados sobre resultados y próximos partidos de campeonatos deportivos.

## 🎯 Objetivos Principales

- **Para Padres de Familia**: Consulta de pagos, realización de pagos, información de campeonatos
- **Para Administradores**: Gestión de campeonatos, aprobación de pagos, control de cartera
- **Integración Web**: Visualización del sitio web institucional dentro de la app

## 🏗️ Arquitectura Técnica

### Tecnologías Utilizadas
- **React Native** con Expo
- **TypeScript** para tipado estático
- **React Navigation** para navegación
- **AsyncStorage** para persistencia local
- **WebView** para integración web
- **Expo Image Picker** para manejo de imágenes
- **Expo Document Picker** para documentos

### Estructura del Proyecto
```
src/
├── types/           # Definiciones de tipos TypeScript
├── context/         # Contextos de React (Auth, App)
├── data/           # Datos mock para desarrollo
├── navigation/     # Configuración de navegación
├── screens/        # Pantallas de la aplicación
└── components/      # Componentes reutilizables (futuro)
```

## 📱 Funcionalidades Implementadas

### 1. Sistema de Autenticación
- **Login** con usuario y contraseña
- **Persistencia de sesión** local
- **Roles diferenciados** (padre/admin)
- **Credenciales de prueba** incluidas

### 2. Navegación Principal (Bottom Tabs)
- **Inicio**: WebView del sitio institucional
- **Campeonatos**: Lista y detalle de campeonatos
- **Pagos**: Estado y gestión de pagos
- **Admin**: Panel administrativo (solo para admins)

### 3. Sección Inicio
- **WebView integrado** del sitio web institucional
- **Manejo de errores** de conexión
- **Información offline** cuando no hay conexión
- **Navegación completa** dentro del sitio web

### 4. Sección Campeonatos/Partidos
- **Lista de campeonatos** con filtros por categoría
- **Búsqueda** de campeonatos
- **Detalle de campeonato** con resultados y próximos partidos
- **Información de partidos**: equipos, fechas, resultados
- **Estados de partidos**: programados y completados

### 5. Sección Pagos
- **Estado general** de pagos por estudiante
- **Tarjetas por hijo** con indicadores visuales (😊/😢)
- **Detalle de pagos** por estudiante
- **Historial de pagos** realizados
- **Métodos de pago**:
  - Tarjeta de crédito/débito (simulado)
  - Transferencia bancaria con comprobante

### 6. Panel Administrativo
- **Dashboard** con métricas clave:
  - Total de estudiantes
  - Estudiantes al día
  - Estudiantes en mora
  - Deuda total
- **Gestión de transferencias** pendientes
- **Control de cartera** con lista de deudores
- **Gestión de campeonatos** (básico)

## 🔐 Consideraciones de Seguridad

- **Autenticación local** con validación de credenciales
- **Separación de roles** (padre/admin)
- **Acceso restringido** a información por usuario
- **Persistencia segura** de sesiones

## 📊 Modelos de Datos

### Usuario
```typescript
interface User {
  id: string;
  username: string;
  password: string;
  role: 'parent' | 'admin';
  children?: Student[];
}
```

### Estudiante
```typescript
interface Student {
  id: string;
  name: string;
  parentId: string;
  category: 'Sub-10' | 'Sub-12' | 'Sub-13' | 'Sub-15';
  gender: 'masculino' | 'femenino';
}
```

### Campeonato
```typescript
interface Championship {
  id: string;
  name: string;
  category: string;
  gender: 'masculino' | 'femenino';
  matches: Match[];
  isActive: boolean;
}
```

### Pago
```typescript
interface Payment {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'under_review';
  paymentMethod?: 'card' | 'transfer';
  paymentDate?: string;
  receiptImage?: string;
  createdAt: string;
}
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil con Expo Go o emulador

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd sPBaloncestoPrototype
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Si hay problemas con WebView, limpiar caché**
```bash
npm cache clean --force
npx expo start --clear
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

5. **Ejecutar en dispositivo**
- Escanear QR con Expo Go (Android/iOS)
- O usar emulador: `npm run android` / `npm run ios`

### ⚠️ Solución de Problemas con WebView

Si encuentras el error `RNCWebViewModule.default.shouldStartLoadWithLockIdentifier is not a function`:

1. **Verificar versión de WebView**: Usamos `react-native-webview@13.6.4`
2. **Limpiar caché**: `npm cache clean --force`
3. **Reinstalar**: `rm -rf node_modules && npm install`
4. **Alternativa**: Usar `HomeScreenAlternative.tsx` que abre el sitio en navegador externo

Ver archivo `WEBVIEW_TROUBLESHOOTING.md` para más detalles.

## 🔑 Credenciales de Prueba

### Padre de Familia
- **Usuario**: `padre1`
- **Contraseña**: `123456`

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 📱 Wireframes Descriptivos

### 1. Login (Padre de Familia)
- Logo de la escuela con emoji de baloncesto
- Campos de usuario y contraseña
- Botón de inicio de sesión
- Credenciales de prueba mostradas
- Diseño centrado con tarjeta de formulario

### 2. Inicio (WebView)
- WebView ocupando toda la pantalla
- Indicador de carga mientras carga el sitio
- Manejo de errores con opción de reintentar
- Información offline cuando no hay conexión

### 3. Lista de Campeonatos
- Barra de búsqueda en la parte superior
- Filtros por categoría (Sub-10, Sub-12, Sub-13, Sub-15)
- Tarjetas de campeonatos con:
  - Nombre del campeonato
  - Categoría y género
  - Número de partidos
  - Vista previa de partidos recientes

### 4. Detalle de Campeonato
- Header con información del campeonato
- Tabs para "Resultados Recientes" y "Próximos Partidos"
- Lista de partidos con:
  - Equipos enfrentados
  - Fecha y hora
  - Resultados (si está completado)
  - Estado del partido

### 5. Estado de Pagos
- Resumen general con estadísticas
- Tarjetas por estudiante con:
  - Nombre del estudiante
  - Categoría
  - Indicador visual de estado (😊/😢)
  - Número de pagos pendientes

### 6. Detalle de Pagos del Estudiante
- Header con información del estudiante
- Tabs para "Pendientes" e "Historial"
- Lista de pagos con:
  - Descripción del pago
  - Monto
  - Fecha de vencimiento
  - Estado del pago
  - Botón "Pagar Ahora" para pendientes

### 7. Método de Pago
- Información del pago a realizar
- Opciones de método de pago:
  - Tarjeta de crédito/débito
  - Transferencia bancaria
- Para transferencia:
  - Datos bancarios
  - Opción de subir comprobante
  - Botones de acción (cámara, galería, documento)

### 8. Panel Admin - Dashboard
- Métricas principales en tarjetas:
  - Total estudiantes
  - Al día
  - En mora
  - Deuda total
- Lista de transferencias pendientes
- Lista de estudiantes en mora

### 9. Panel Admin - Gestión de Pagos
- Botones de acción para gestión
- Lista detallada de transferencias pendientes
- Opciones de aprobar/rechazar

### 10. Panel Admin - Gestión de Campeonatos
- Botones para crear campeonatos y partidos
- Lista de campeonatos activos
- Opciones de edición

## 🔄 Flujos de Usuario

### Flujo Padre de Familia
1. **Login** → Ingreso con credenciales
2. **Inicio** → Navegación del sitio web institucional
3. **Campeonatos** → Consulta de resultados y próximos partidos
4. **Pagos** → Verificación de estado de pagos
5. **Pago** → Selección de método y procesamiento

### Flujo Administrador
1. **Login** → Ingreso con credenciales de admin
2. **Dashboard** → Revisión de métricas generales
3. **Gestión de Pagos** → Aprobación de transferencias
4. **Gestión de Campeonatos** → Creación y edición

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: #e74c3c (Rojo San Pedro)
- **Secundario**: #2c3e50 (Azul oscuro)
- **Éxito**: #27ae60 (Verde)
- **Advertencia**: #f39c12 (Naranja)
- **Texto**: #7f8c8d (Gris)
- **Fondo**: #f5f5f5 (Gris claro)

### Principios de Diseño
- **Consistencia visual** en toda la aplicación
- **Indicadores claros** de estado (emojis, colores)
- **Navegación intuitiva** con bottom tabs
- **Feedback visual** en todas las acciones
- **Manejo de errores** con mensajes claros

## 🔮 Próximas Mejoras

### Funcionalidades Adicionales
- [ ] Notificaciones push
- [ ] Chat con administración
- [ ] Calendario de eventos
- [ ] Galería de fotos de partidos
- [ ] Sistema de calificaciones
- [ ] Reportes avanzados

### Mejoras Técnicas
- [ ] Integración con API real
- [ ] Base de datos persistente
- [ ] Autenticación con tokens JWT
- [ ] Caché inteligente
- [ ] Optimización de rendimiento
- [ ] Tests unitarios y de integración

## 📞 Soporte y Contacto

Para consultas sobre el prototipo o implementación:
- **Desarrollador**: [Nombre del desarrollador]
- **Email**: [email@ejemplo.com]
- **Escuela**: Escuela de Baloncesto San Pedro

---

**Nota**: Este es un prototipo funcional para demostración. Para producción se requieren ajustes adicionales de seguridad, integración con sistemas reales y pruebas exhaustivas.
