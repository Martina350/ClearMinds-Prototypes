# Propuesta de Desarrollo - App Móvil "Caja de Ahorro Santa Teresita"

## 1. Introducción

Nos complace presentar la presente propuesta para el desarrollo de la app móvil **"Caja de Ahorro Santa Teresita"**, una aplicación de gestión financiera diseñada específicamente para recaudadores en campo, que permite administrar cuentas de ahorro, realizar transacciones, gestionar cobros y préstamos de manera eficiente desde cualquier ubicación. El objetivo es digitalizar y optimizar el proceso de recaudación, permitiendo a los recaudadores registrar operaciones en tiempo real, consultar información de clientes, generar recibos y sincronizar datos con el sistema central, mejorando así la productividad operativa y la calidad del servicio ofrecido a los clientes.

---

## 2. Alcance del Proyecto

El proyecto contempla:

- **Gestión completa de cuentas de ahorro** con tres tipos diferentes (Básica, Infantil y Ahorro Futuro), incluyendo apertura de cuentas, consulta de saldos y estados.

- **Sistema de transacciones robusto** que permite realizar depósitos, cobros, y aperturas con generación automática de recibos y comprobantes imprimibles.

- **Módulo de gestión de clientes** con búsqueda avanzada, registro de información completa (datos personales, referencias, coordenadas de ubicación) y consulta del historial de operaciones.

- **Control de préstamos y cobranzas** con seguimiento de cuotas, cálculo automático de mora e intereses, y gestión del estado de pagos pendientes.

- **Sistema de autenticación** con login seguro y gestión de sesión para recaudadores.

- **Funcionalidad offline-first** con sincronización automática de datos cuando hay conexión disponible.

- **Generación e impresión de recibos** con formato profesional y compartición vía diferentes medios.

- **Capacitación básica** para uso de la app y gestión de operaciones en campo.

---

## 3. Funcionalidad General

### Para Recaudadores:

- **Apertura de cuentas**: Crea cuentas de ahorro de tres tipos diferentes:
  - **Ahorro Básica**: Cuenta estándar con depósitos y retiros flexibles.
  - **Ahorro Infantil**: Cuenta especial con registro de menor y responsable adulto.
  - **Ahorro Futuro**: Cuenta a plazo fijo (30, 60 o 90 días) con monto objetivo opcional.

- **Depósitos**: Realiza depósitos en cuentas existentes con registro automático de transacción, actualización de saldo y generación de recibo.

- **Cobros y cobranzas**: Gestiona el pago de préstamos, cuotas y deudas pendientes con cálculo automático de mora e intereses, actualización del estado de cobranza y emisión de comprobante.

- **Consultas de clientes**: Busca clientes por cédula, nombre o apellido; visualiza información completa del cliente incluyendo cuentas activas, historial de transacciones, préstamos pendientes y referencias personales.

- **Impresión de recibos**: Genera recibos profesionales con logo de la institución, detalles de la transacción y opción de compartir por WhatsApp, email o imprimir físicamente.

- **Geolocalización**: Captura automáticamente las coordenadas GPS al registrar clientes o realizar operaciones en campo.

- **Modo offline**: Trabaja sin conexión a internet, todas las operaciones se almacenan localmente y se sincronizan automáticamente cuando hay conexión.

- **Perfil y actividad**: Revisa su actividad diaria, transacciones realizadas y configuración personal.

- **Dashboard personal**: Visualiza métricas clave del día, resumen de transacciones realizadas y estado general de sus operaciones.

---

## 4. Arquitectura Técnica

### Estructura del Proyecto:

El proyecto implementa una **Arquitectura Limpia (Clean Architecture)** con separación clara de responsabilidades:

#### **Domain (Dominio):**
- **Entities**: Cliente, Cuenta, Agente, Transacción, Préstamo, Cobranza, Referencias Personales.
- **Repositories Interfaces**: Contratos para acceso a datos.
- **Services Interfaces**: Servicios de autenticación, ubicación, impresión y sincronización.

#### **Application (Casos de Uso):**
- `AbrirCuentaUseCase`: Lógica de negocio para apertura de cuentas.
- `RealizarDepositoUseCase`: Procesamiento de depósitos.
- `RealizarCobroUseCase`: Gestión de cobros y pagos.
- `BuscarClienteUseCase`: Búsqueda y consulta de clientes.
- `CrearClienteUseCase`: Registro de nuevos clientes.
- `ObtenerDashboardUseCase`: Métricas y estadísticas.

#### **Infrastructure (Infraestructura):**
- **Persistence**: Implementación de repositorios con AsyncStorage.
- **Location**: Servicio de geolocalización con Expo Location.
- **Printing**: Servicio de impresión con Expo Print.
- **Sync**: Servicio de sincronización de datos.
- **Storage**: Servicios especializados de almacenamiento.

#### **Presentation (Presentación):**
- **Screens**: Pantallas de la aplicación (Home, Aperturas, Depósitos, Cobros, Consultas, etc.).
- **Components**: Componentes reutilizables (Input, Button, Card, DatePicker, AddressPicker, etc.).
- **Navigation**: Navegación Stack y Tab con React Navigation.
- **Context**: Gestión de estado global (AuthContext, AppContext).
- **Theme**: Sistema de diseño unificado.

### Tecnologías Utilizadas:

- **Framework**: React Native 0.81.4 con Expo ~54.0
- **Lenguaje**: TypeScript ~5.9
- **Navegación**: React Navigation (Stack y Bottom Tabs)
- **Estado**: Context API de React
- **Almacenamiento**: AsyncStorage
- **Geolocalización**: Expo Location
- **Impresión**: Expo Print y Expo Sharing
- **UI**: React Native Gesture Handler, Reanimated, Safe Area Context

### Tipos de Cuenta:

1. **Ahorro Básica**: Cuenta estándar con saldo flexible.
2. **Ahorro Infantil**: Requiere menor y responsable adulto.
3. **Ahorro Futuro**: Plazo fijo de 30, 60 o 90 días con monto objetivo opcional.

### Tipos de Transacción:

- **Apertura**: Registro inicial de cuenta con depósito.
- **Depósito**: Ingreso de dinero a una cuenta.
- **Cobro**: Pago de préstamos, cuotas o deudas.

### Estados:

- **Cuentas**: Activa, Inactiva, Bloqueada.
- **Transacciones**: Pendiente, Completada, Cancelada, Sincronizada.
- **Cobranzas**: Pendiente, Pagada, Vencida, Cancelada.
- **Préstamos**: Activo, Vencido, Pagado, Cancelado, En Mora.

---

## 5. Beneficios del Sistema

✅ **Movilidad total**: Los recaudadores pueden trabajar desde cualquier ubicación en campo sin depender de una oficina física.

✅ **Eficiencia operativa**: Reducción de tiempos de registro y procesamiento de transacciones.

✅ **Trazabilidad completa**: Cada operación queda registrada con fecha, hora, recaudador responsable y ubicación GPS.

✅ **Reducción de errores**: Validaciones automáticas y cálculos precisos de intereses y moras.

✅ **Experiencia mejorada**: Recibos profesionales instantáneos y consultas en tiempo real.

✅ **Trabajo offline**: Continuidad operativa sin depender de conexión a internet constante.

✅ **Escalabilidad**: Arquitectura modular preparada para agregar nuevas funcionalidades.

✅ **Seguridad**: Sistema de autenticación robusto y protección de datos sensibles de clientes.

---

## 6. Próximos Pasos

1. **Capacitación inicial** del equipo de recaudadores en el uso de la aplicación.
2. **Implementación del backend** para sincronización centralizada de datos.
3. **Integración con sistemas existentes** de la institución financiera.
4. **Implementación de notificaciones push** para recordatorios de vencimientos y tareas pendientes.
5. **Desarrollo de app para clientes** con consulta de saldos y movimientos.
6. **Sistema de firmas digitales** para validación de operaciones en campo.
7. **Reportes y estadísticas avanzadas** dentro de la app móvil para cada recaudador.
8. **Sistema de mensajería interna** entre recaudadores y oficina central.

---

## 7. Conclusión

La app móvil **"Caja de Ahorro Santa Teresita"** representa una solución integral y moderna para la gestión de operaciones de recaudación financiera. Con una arquitectura robusta, funcionalidad offline-first y un enfoque centrado en la experiencia del recaudador, esta aplicación transforma digitalmente el proceso de gestión de ahorros, optimizando tiempos, reduciendo errores y mejorando la eficiencia operativa en campo, permitiendo a los recaudadores brindar un mejor servicio a los clientes de la institución.

---

**Fecha**: Octubre 2025  
**Versión**: 1.0.0  
**Plataformas**: Android / iOS

