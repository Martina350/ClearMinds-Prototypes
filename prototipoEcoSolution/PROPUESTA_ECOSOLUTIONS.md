### Propuesta de Plataforma Interna — EcoSolutions

#### 1. Introducción
Nos complace presentar esta propuesta para el desarrollo de una plataforma interna integrada al ecosistema de EcoSolutions, orientada a optimizar la gestión de servicio de mantenimiento y las operaciones en terreno. La solución permitirá que los clientes agenden los servicios a solicitar, mientras que los administradores podrán gestionar usuarios, programar y asignar servicios, supervisar los comprobantes de pago recibidos y mantener un control eficiente de las operaciones.
El objetivo es ofrecer una herramienta moderna, funcional y práctica, que unifique el flujo completo: desde la reserva del servicio por parte del cliente (módulo ya contemplado en EcoSolutions) hasta el cierre administrativo (control y pago), mejorando la eficiencia operativa.

#### 2. Alcance del Proyecto
El proyecto contempla:
- Desarrollo y acoplamiento de un módulo móvil para Clientes basado en el prototipo actual de EcoSolutions, afinándolo según requerimientos del Administrador.
- Inclusión de roles principales con permisos diferenciados: Administrador y Cliente.
- Integración con los módulos existentes: Servicios, Zonas, Precios, Reservas, Pagos y Panel de Administración.
- Recepción y gestión de pagos dentro del Panel Admin, vinculados a reservas/órdenes de trabajo.

#### 3. Funcionalidad General
- Administrador (App/Admin Web — extendido en EcoSolutions):
  - Gestiona clientes/empresas y empleados disponibles.
  - Gestionar catálogo de servicios, zonas de cobertura y precios (ya existente en EcoSolutions).
  - Recibir, revisar y aprobar comprobantes de pago enviados por los técnicos (con fotos, tiempos y materiales si aplica).
  - Consultar métricas en `AdminDashboard` (volumen de servicios, estados, ingresos por servicios pagados) y realizar exportaciones básicas.

- Cliente (App móvil — nuevo módulo integrado):
  - Iniciar sesión con credenciales personales.
  - Visualizar servicios a agendar por día/semana con detalles del servicio y fecha disponible.
  - Completar el pago en dos metodos, por tarjeta de debito o credito y transferencia.
  - Marcar llegada y cierre (timestamps); opcional: geolocalización y firma del cliente.
  - Recibir notificaciones de nuevas asignaciones o cambios de agenda.

Esta funcionalidad será validada y afinada en la primera reunión posterior a la firma del contrato para garantizar su alineación con los procesos internos y expectativas del cliente.

#### 4. Acoplamiento con el Proyecto EcoSolutions (mapeo)
- App Cliente (existente): `ServicesScreen`, `BookingScreen`, `PaymentScreen`, `MyServicesScreen`.
  - Flujo: cliente reserva y paga → se genera una orden de trabajo.
- Admin (existente): `AdminServices`, `AdminZones`, `AdminPrices`, `AdminPayments`, `AdminDashboard`.
  - Se amplía con: gestión de técnicos, agenda y bandeja de informes.
- Técnico (nuevo): módulo móvil en Expo/React Native bajo la misma base de código, con navegación y almacenamiento seguros.
- API/BD: reuso y ampliación del esquema actual con entidades `work_orders` e `reports` vinculadas a `bookings` y `users` (rol técnico); webhooks de pago permanecen sin cambios.

#### 5. Beneficios esperados
- Trazabilidad completa del servicio (reserva → asignación → ejecución → cierre/pago).
- Reducción de tiempos administrativos y mejor visibilidad para decisiones operativas.
- Mejor experiencia para el cliente (flujos claros y móviles) y para el administrador (control y métricas).

—
Documento orientativo. Los detalles finales se cerrarán en la fase de levantamiento y diseño funcional.
