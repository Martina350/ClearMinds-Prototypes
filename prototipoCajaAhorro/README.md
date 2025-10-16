# Recaudadora Móvil - Prototipo

Aplicación móvil para facilitar el proceso de recaudación y gestión de cuentas bancarias de forma remota.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** (Arquitectura Limpia), separando el código en capas con responsabilidades bien definidas:

### Estructura de Capas

```
src/
├── domain/              # Capa de Dominio (Lógica de Negocio)
│   ├── entities/       # Entidades del negocio
│   ├── repositories/   # Interfaces de repositorios
│   └── services/       # Interfaces de servicios
│
├── application/        # Capa de Aplicación (Casos de Uso)
│   └── use-cases/     # Casos de uso de la aplicación
│
├── infrastructure/     # Capa de Infraestructura (Implementaciones)
│   ├── persistence/   # Almacenamiento local (AsyncStorage)
│   ├── location/      # Servicios de GPS
│   └── printing/      # Servicios de impresión
│
├── presentation/       # Capa de Presentación (UI)
│   ├── screens/       # Pantallas de la app
│   ├── components/    # Componentes reutilizables
│   ├── navigation/    # Configuración de navegación
│   └── hooks/         # Custom hooks
│
└── shared/            # Código compartido
    ├── types/        # Tipos y enums
    └── utils/        # Utilidades
```

## 📋 Principios Arquitectónicos

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad única y bien definida
2. **Independencia de Frameworks**: La capa de dominio no depende de React Native ni Supabase
3. **Dependencias Dirigidas Hacia Adentro**: Las capas externas dependen de las internas, nunca al revés
4. **Principios SOLID**: Código siguiendo Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, y Dependency Inversion
5. **Código Limpio**: Código modular, legible, reutilizable y testeable

## 🚀 Funcionalidades Principales

- ✅ Creación de cuentas (básicas, infantiles, ahorro futuro)
- ✅ Búsqueda de clientes por cédula, nombre o número de cuenta
- ✅ Gestión de depósitos
- ✅ Gestión de cobros/cobranzas
- ✅ Dashboard con resumen de actividades diarias
- ✅ Generación e impresión de recibos
- ✅ Geolocalización GPS para direcciones
- ✅ Almacenamiento local y sincronización

## 🛠️ Tecnologías Utilizadas

- **React Native** con **Expo** - Framework de desarrollo móvil
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación entre pantallas
- **AsyncStorage** - Almacenamiento local
- **Expo Location** - Servicios de geolocalización
- **Expo Print** - Generación e impresión de recibos

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar la aplicación:
```bash
npm start
```

3. Ejecutar en un emulador o dispositivo:
```bash
# Android
npm run android

# iOS
npm run ios
```

## 📱 Flujo de la Aplicación

### 1. Menú Principal
- Apertura de cuentas
- Depósitos
- Cobros
- Consultas de clientes
- Dashboard

### 2. Creación de Cuentas
- **Cuenta de Ahorro Básica**: Datos del cliente + referencias
- **Cuenta Infantil**: Datos del menor + responsable
- **Cuenta de Ahorro Futuro**: Cliente + plazo (30, 60 o 90 días)

### 3. Depósitos
- Búsqueda de cuenta
- Ingreso de monto
- Generación de recibo

### 4. Cobros
- Búsqueda de cliente
- Visualización de deudas pendientes
- Registro de pago
- Generación de recibo

### 5. Dashboard
- Resumen diario de actividades
- Cuentas aperturadas
- Total de depósitos y cobros
- Monto total recaudado
- Historial detallado

## 🔐 Seguridad

- Cifrado de datos sensibles
- Autenticación robusta
- Validación de datos en múltiples capas

## 📄 Entidades del Dominio

### Cliente
Representa un cliente del sistema con sus datos personales, dirección GPS y referencias.

### Cuenta
Representa una cuenta bancaria (básica, infantil o ahorro futuro) con su saldo y estado.

### Transacción
Representa una operación financiera (depósito, cobro, apertura) con su monto y estado.

### Cobranza
Representa una deuda pendiente de un cliente con su monto y fecha de vencimiento.

### Agente
Representa un agente/usuario del sistema que realiza las operaciones.

## 🔄 Casos de Uso Implementados

- `CrearClienteUseCase` - Crear un nuevo cliente con referencias
- `AbrirCuentaUseCase` - Abrir una cuenta (básica, infantil o ahorro futuro)
- `RealizarDepositoUseCase` - Realizar un depósito en una cuenta
- `RealizarCobroUseCase` - Registrar el pago de una cobranza
- `BuscarClienteUseCase` - Buscar clientes por cédula o nombre
- `ObtenerDashboardUseCase` - Obtener resumen de actividades del día

## 📝 Próximos Pasos

1. Implementar pantallas de apertura de cuentas
2. Implementar pantallas de depósitos y cobros
3. Implementar pantalla de consultas/búsqueda
4. Agregar autenticación de agentes
5. Implementar sincronización con backend
6. Agregar tests unitarios
7. Agregar tests de integración
8. Implementar impresión física de recibos

## 👥 Desarrollo

Este es un proyecto educativo diseñado para demostrar arquitectura limpia en React Native.

---

**Desarrollado con ❤️ siguiendo Clean Architecture**

