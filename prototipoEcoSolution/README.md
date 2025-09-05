# EcoSolution - Prototipo de Aplicación Móvil

## Descripción
Prototipo funcional de una aplicación móvil para servicios de sanidad ambiental, desarrollado con React Native + Expo + TypeScript. Incluye una aplicación móvil para clientes y un panel web administrativo.

## Características Principales

### Aplicación Móvil (Cliente)
- **Autenticación**: Login y registro con validación
- **Catálogo de Servicios**: Lista de servicios disponibles por país
- **Agendamiento**: Selección de fecha, hora y tipo de cliente
- **Pagos**: Integración con tarjeta de crédito y transferencias bancarias
- **Mis Servicios**: Gestión de servicios contratados
- **Perfil de Usuario**: Edición de datos personales

### Panel Administrativo
- **Dashboard**: Resumen de métricas clave
- **Gestión de Servicios**: Administración de solicitudes
- **Validación de Pagos**: Aprobación de transferencias
- **Gestión de Personal**: Administración de técnicos
- **Gestión de Zonas**: Control de cobertura geográfica
- **Gestión de Precios**: Configuración de tarifas

## Tecnologías Utilizadas
- **React Native** 0.79.6
- **Expo** ~53.0.22
- **TypeScript** ~5.8.3
- **React Navigation** 6.x
- **Zustand** para manejo de estado
- **Expo Linear Gradient** para gradientes

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu dispositivo móvil

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd prototipoEcoSolution
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   # o
   yarn start
   ```

4. **Ejecutar en dispositivo**
   - Escanea el código QR con Expo Go (Android/iOS)
   - O ejecuta en simulador:
     ```bash
     npm run android  # Android
     npm run ios      # iOS
     npm run web      # Web
     ```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── Input.tsx
│   └── BottomNavigation.tsx
├── data/               # Base de datos quemada
│   └── database.ts
├── navigation/         # Configuración de navegación
│   └── AppNavigator.tsx
├── screens/           # Pantallas de la aplicación
│   ├── auth/          # Autenticación
│   ├── client/        # Pantallas del cliente
│   └── admin/         # Panel administrativo
├── styles/            # Estilos globales
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
└── types/             # Definiciones de tipos TypeScript
```

## Base de Datos Quemada

El prototipo utiliza una base de datos simulada con datos de prueba:

### Usuarios de Prueba
- **Cliente Ecuador**: juan@test.com / 12345
- **Cliente USA**: john@test.com / 12345
- **Administrador**: admin@ecosolution.com / admin123

### Servicios Disponibles
- **Ecuador**: Baños Portátiles, Pozos Sépticos, Trampas de Grasa
- **USA**: Limpieza de Basureros, Recolección de Escombros, Baños Portátiles

## Flujo de Uso

### Para Clientes
1. **Registro/Login**: Crear cuenta o iniciar sesión
2. **Explorar Servicios**: Ver catálogo de servicios disponibles
3. **Agendar Servicio**: Seleccionar fecha, hora y tipo de cliente
4. **Realizar Pago**: Pagar con tarjeta o transferencia
5. **Gestionar Servicios**: Ver estado de servicios contratados

### Para Administradores
1. **Login Admin**: Acceder con credenciales de administrador
2. **Dashboard**: Revisar métricas y actividad reciente
3. **Gestionar Servicios**: Aprobar, asignar técnicos, reprogramar
4. **Validar Pagos**: Aprobar transferencias bancarias
5. **Configurar Sistema**: Gestionar personal, zonas y precios

## Reglas de Negocio Implementadas

- **Disponibilidad**: Solo se muestran horarios libres
- **Diferenciación**: Empresas tienen mayor duración de servicio
- **Cobertura**: Servicios solo disponibles en zonas habilitadas
- **Pagos**: Transferencias requieren validación manual
- **Precios**: Tarifas fijas por país y servicio

## Características de UI/UX

- **Diseño Mobile-First**: Optimizado para dispositivos móviles
- **Colores Vibrantes**: Paleta de colores moderna y profesional
- **Botones Táctiles**: Elementos de interacción grandes y accesibles
- **Tarjetas y Listas**: Organización clara de información
- **Transiciones Suaves**: Animaciones fluidas entre pantallas
- **Validaciones**: Mensajes de error amigables y claros

## Datos de Prueba por País

### Ecuador
- **Servicios**: Baños Portátiles ($100), Pozos Sépticos ($150), Trampas de Grasa ($200)
- **Zonas**: Pichincha, Guayas, Azuay (habilitadas)
- **Personal**: Carlos Mendoza, Ana García, Roberto Silva

### USA
- **Servicios**: Limpieza de Basureros ($80), Recolección de Escombros ($120), Baños Portátiles ($90)
- **Zonas**: NY, CA, TX (habilitadas)
- **Personal**: Mike Johnson, Sarah Wilson

## Funcionalidades Simuladas

- **Notificaciones**: Sistema de notificaciones interno
- **Validaciones**: Verificación de formularios en tiempo real
- **Estados**: Gestión de estados de servicios y pagos
- **Filtros**: Búsqueda y filtrado de servicios
- **Navegación**: Navegación fluida entre pantallas

## Escalabilidad

El prototipo está diseñado para ser escalable a producción:
- **Arquitectura Modular**: Componentes reutilizables
- **Tipado Fuerte**: TypeScript para mayor robustez
- **Base de Datos**: Fácil migración a base de datos real
- **API**: Estructura preparada para integración con backend
- **Autenticación**: Sistema de roles y permisos

## Próximos Pasos

1. **Integración Backend**: Conectar con API real
2. **Base de Datos**: Migrar a PostgreSQL/MongoDB
3. **Autenticación**: Implementar JWT y OAuth
4. **Notificaciones Push**: Integrar Firebase
5. **Pagos**: Conectar con Stripe/PayPal
6. **Mapas**: Integrar Google Maps para ubicaciones
7. **Testing**: Implementar tests unitarios y de integración

## Soporte

Para soporte técnico o consultas sobre el prototipo, contactar al equipo de desarrollo.

---

**Nota**: Este es un prototipo funcional para demostración. No utilizar en producción sin las debidas validaciones de seguridad y pruebas.
