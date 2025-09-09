### Estimación de tiempo y esfuerzo — Prototipo EcoSolution

**Supuestos clave**
- **Stack**: React Native (Expo), TypeScript; Backend Node.js (Express/TS); DB PostgreSQL; Pasarela de pagos (Stripe/Mercado Pago); Push (Expo Notifications).
- **Equipo**: 1 desarrollador/a full‑stack.
- **Jornada**: 6 h/día, 5 días/semana → 30 h/semana.
- **Alcance**: App móvil (iOS/Android) + API + BD + deployment + pruebas.

### Pantallas y funcionalidades (alcance)
Basado en la estructura actual del proyecto (`src/screens`):
- **Auth**
  - `LoginScreen`: Inicio de sesión.
  - `RegisterScreen`: Registro de clientes.
  - `AdminLoginScreen`: Acceso administrativo con rol.
- **Cliente**
  - `ServicesScreen`: Catálogo de servicios (listar/filtrar/detalle básico).
  - `BookingScreen`: Flujo de reserva (selección servicio, fecha/hora, zona, confirmación).
  - `PaymentScreen`: Pago de reservas (checkout, recibo).
  - `MyServicesScreen`: Historial y estado de reservas.
  - `ProfileScreen`: Perfil, datos y preferencias del usuario.
- **Admin**
  - `AdminDashboard`: Métricas básicas (reservas, ingresos, servicios más vendidos).
  - `AdminServices`: CRUD de servicios (nombre, descripción, precio base, duración).
  - `AdminZones`: CRUD de zonas/cobertura.
  - `AdminPrices`: Gestión de precios/tarifas (por zona, servicio, promociones).
  - `AdminStaff`: Gestión de personal/asignaciones (opcional v1: listado simple).
  - `AdminPayments`: Visor de pagos/conciliación.

### Tabla de estimación por pantalla

| Característica de la Pantalla | Complejidad Estimada | Tiempo de Desarrollo (horas) | Notas del desarrollador |
| --- | --- | --- | --- |
| LoginScreen | Media | 10 | Autenticación con validación y manejo de errores |
| RegisterScreen | Media | 12 | Formulario con validaciones y alta de usuario |
| AdminLoginScreen | Media | 8 | Flujo de login con rol admin |
| ServicesScreen | Media | 16 | Listado/filtrado, detalle básico y estados de carga |
| BookingScreen | Alta | 40 | Selección servicio/fecha/hora/zona, reglas y validaciones |
| PaymentScreen | Alta | 20 | UI de checkout, estados, confirmación |
| ProfileScreen | Baja | 14 | Edición de datos y validaciones simples |
| AdminDashboard | Media | 28 | KPIs básicos y gráficas simples |
| AdminServices | Media | 32 | CRUD completo con formularios y listado |
| AdminZones | Baja | 20 | CRUD sencillo |
| AdminPrices | Alta | 32 | Reglas de precios por zona/servicio/promos |
| AdminStaff | Baja | 16 | Listado/asignaciones simples (v1) |
| AdminPayments | Media | 20 | Listado y detalle de pagos |
| Testing | Alta | 72 | Unit, integración y E2E de flujos críticos |
| Deployment | Media | 56 | API en cloud + mobile builds (EAS) |
| APIs REST | Alta | 324 | BD, endpoints, lógica, pagos+webhook, seguridad, notificaciones, observabilidad |

> Total horas de la tabla: 720 h (coherente con el total estimado general).

### APIs y Base de Datos (resumen)
- **Entidades**: `users`, `roles`, `services`, `zones`, `prices`, `bookings`, `payments`, `staff` (opcional), `promotions` (opcional).
- **Endpoints principales** (REST):
  - Auth: `/auth/register`, `/auth/login`, `/auth/refresh`.
  - Servicios/Zonas/Precios: `/services`, `/zones`, `/prices` (CRUD).
  - Reservas: `/bookings` (crear, listar por usuario/admin, cambiar estado).
  - Pagos: `/payments/checkout`, `/payments/webhook`.
  - Admin: endpoints con protección por rol.
- **BD**: PostgreSQL con migraciones (Prisma/Knex), índices básicos para reservas y pagos.

### Complejidad por módulo
- **Baja**: Perfil, listado de servicios, zonas, CRUD simple.
- **Media**: Autenticación con roles, dashboard simple, historial de reservas.
- **Alta**: Flujo de reservas (reglas/validaciones), integración de pagos y webhooks, precios condicionados.

### Estimación de horas por bloque
- Definición de requisitos y arquitectura: **20 h**
- Diseño UI/UX base (componentes y 12–15 pantallas): **30 h**
- Configuración proyecto, navegación y estado (Expo/React Navigation): **16 h**
- Autenticación (registro, login, roles admin, protección de rutas): **24 h**
- Backend base (Express TS, estructura, middlewares, auth JWT): **60 h**
- Diseño de BD y migraciones (esquema inicial y relaciones): **24 h**
- Admin — Servicios/Zonas/Precios (CRUDs): **64 h**
- Integración de pagos (checkout, estados, webhook): **40 h**
- Reservas — flujo completo (disponibilidad, validaciones, estados): **56 h**
- Cliente — Mis servicios/Historial: **16 h**
- Cliente — Perfil: **12 h**
- Cliente — Pago y comprobante: **16 h**
- Admin — Dashboard (métricas básicas): **24 h**
- Notificaciones (push/email básicos): **20 h**
- Observabilidad y manejo de errores: **10 h**
- Seguridad básica (roles, rate limiting, CORS): **16 h**
- Testing unitario (FE+BE) con Jest/RTL/Supertest: **40 h**
- Testing E2E (Detox) y pruebas manuales guiadas: **32 h**
- QA y estabilización (bugs, refinamientos): **32 h**
- DevOps — API en cloud (Docker, CI/CD básico): **32 h**
- Mobile — builds y publicación (EAS, Play Store/TestFlight): **24 h**
- Documentación técnica y de uso: **16 h**

**Subtotal**: 624 h

**Buffer de riesgos (15%)**: ~94 h

**Total estimado**: **≈ 718–720 h**

### Conversión a semanas y meses (6h x 5d = 30 h/semana)
- Semanas: 720 h / 30 h/semana = **24 semanas**
- Meses (promedio 4.33 sem/mes): 24 / 4.33 ≈ **5.5–6 meses**

### Testing (alcance resumido)
- **Unitario**: lógica de vistas y hooks (React Native Testing Library), servicios FE, controladores y repositorios BE (Jest/Supertest).
- **Integración**: endpoints críticos (reservas, pagos, auth), flujos de reserva y checkout.
- **E2E**: escenarios clave en móvil con Detox (login, reservar, pagar, ver historial).
- **Cobertura objetivo**: 60–70% en módulos críticos.

### Deployment
- **Backend**: Docker + proveedor cloud (Railway/Render/AWS Lightsail), variables de entorno, dominio y HTTPS, webhook de pagos publicado.
- **Base de datos**: PostgreSQL gestionado (Neon/ElephantSQL/RDS), backups automáticos.
- **Móvil**: Expo EAS para builds; Play Console (AAB) y App Store Connect (TestFlight/Review). Listados y cumplimiento básico de tiendas.

### Riesgos y consideraciones
- Integración de pasarela de pagos y webhooks (dependencias externas) — complejidad alta.
- Reglas de negocio de reservas y precios — acordar desde el inicio para evitar retrabajo.
- Aprobación en tiendas puede añadir tiempo no controlable (1–2 semanas extra).

### Cronograma sugerido (alto nivel)
- Semanas 1–2: Requisitos, arquitectura, diseño, setup FE/BE/DB.
- Semanas 3–6: Auth, servicios/zonas/precios (CRUD), base de reservas.
- Semanas 7–9: Flujo de reservas, perfil, historial.
- Semanas 10–11: Pagos + webhooks, dashboard admin.
- Semanas 12–14: Testing unitario/E2E, QA, observabilidad, seguridad.
- Semanas 15–16: DevOps/CI-CD, publicación móvil, documentación, cierre.

### Entregables
- App móvil (iOS/Android) funcional con reservas y pagos.
- API REST documentada y desplegada + BD PostgreSQL.
- Panel admin para gestión de servicios/zonas/precios y visor de pagos.
- Suite de tests y pipelines básicos de CI/CD.

—
Esta es una estimación orientativa para planificación. Cambios en alcance, integraciones o diseño pueden ajustar las horas.
