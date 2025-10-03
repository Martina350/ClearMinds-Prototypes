Objetivos del proyecto

Planificación inteligente de mantenimientos (preventivos/correctivos) con rutas optimizadas por zona y restricciones.

Reprogramación ágil ante cancelaciones y atención de emergencias sin desordenar toda la agenda.

Ejecución en campo desde una app móvil: checklist por cliente, control de llegada/salida con geolocalización, firma del cliente y cierre de OT.

Trazabilidad y evidencia: tiempos en sitio, técnico asignado, actividades realizadas, observaciones y firma.

Reportes y tablero para decisiones: cumplimientos, cancelaciones, emergencias, causas frecuentes, etc.

Entrega digital de reportes en PDF y envío por email al cliente (sin papel).

Alcance y roles

Web Admin (Operaciones/Coordinador): define clientes/edificios, restricciones, agenda, rutas, reprograma, genera plantillas de actividades, revisa y exporta reportes.

App Móvil (Técnico): recibe ruta/OT del día, navega, marca llegada/salida (geo-timestamp), completa checklist, añade observaciones, recoge firma y cierra OT.

Cliente (receptor): recibe por email el PDF del servicio realizado (opcional portal de solo lectura futuro; fuera de este alcance inicial).

Requerimientos funcionales
A. Web Admin (operaciones)

Maestro de clientes/edificios

Dirección geocodificada.

Datos de contacto y correo para envío de reportes.

Restricciones: días/horas permitidas, ventanas de tiempo, tiempo estimado por visita, periodicidad del preventivo.

Agenda y rutas

Asignar técnicos (mín. 6) y generar rutas por zona/distancia cumpliendo restricciones.

Botón “Optimizar ruta” (respetando ventanas, duración y zonas).

Reprogramación por:

Cancelación/postergación.

Emergencia (prioridad alta): suspende OT en curso, marca tiempo pendiente y propone reubicación.

Huecos de agenda: sugerencia de clientes “candidatos” (sin cronograma fijo) priorizados por cercanía y criterios definidos (ver Reglas de negocio).

Plantillas de actividades (checklists)

Constructor de plantillas (CRUD) con pasos/ítems por cliente/contrato.

Asignación de plantilla por cliente (pueden coexistir varias plantillas; p. ej. Ministerio vs. privados).

Gestión de OTs

Estado: Programada → En curso → Suspendida (emergencia) → Reprogramada → Completada.

Ver tiempos reales (llegada/salida), ubicación validada, técnico responsable y firma del cliente.

Reportes y dashboard

KPIs: % cumplimiento, # cancelaciones, # emergencias, tiempo promedio en sitio, reprocesos, causas/ítems más frecuentes en checklist.

Filtros por rango de fechas, técnico, cliente, zona.

Exportación: CSV/XLSX y PDF por OT.

Entrega de reportes

Generación automática de PDF con firma + checklist + sello de tiempo y ubicación.

Envío por email al cliente y descarga desde la web.

Usuarios y permisos

Rol Administrador/Operaciones (total).

Rol Supervisor (lectura/descarga, sin editar plantillas ni reglas).

B. App móvil (técnico)

Inicio de jornada

Ver rutas/OTs del día en orden propuesto (con mapa y estimaciones).

Modo offline con sincronización posterior.

En sitio

Llegué: botón que registra timestamp + ubicación (validación de cercanía a la dirección).

Checklist dinámico según plantilla del cliente (checks, texto, fotos opcionales).

Observaciones libres.

Firma del cliente en pantalla.

Salí: registra timestamp + ubicación; calcula tiempo en sitio.

Cierre y envío

Cierra OT → genera evidencia → dispara generación de PDF y notifica a web admin.

Interrupción por emergencia

App notifica nueva OT de emergencia con prioridad; marca la OT actual como “pendiente X minutos” para reprogramar.

UX práctica

Botón “Abrir en mapas”.

Historial de OTs del día y estado.

Notificaciones push de reprogramaciones.

Reglas de negocio (clave)

Optimización de ruta respeta:

Zonas/vecindarios cercanos; minimizar desplazamientos.

Ventanas de atención por edificio.

Duración mínima por mantenimiento.

Candidatos para llenar huecos (cuando hay cancelación):

(1) Clientes elegibles “última hora”.

(2) Cercanía geográfica a la posición/agenda del técnico.

(3) Otros criterios asignables (p. ej., flexibilidad del cliente, SLA, prioridad contractual).

Emergencias

Tienen prioridad absoluta.

La OT interrumpida conserva minutos pendientes y queda marcada para reubicación según restricciones del cliente.

Validación de presencia

Los eventos Llegué/Salí requieren geolocalización dentro de un radio configurable (p. ej., 100 m) de la dirección del edificio.

Cierre de OT

Requiere: checklist completo, firma del cliente, y registros de llegada/salida válidos.

Plantillas

Múltiples plantillas por cliente; versionado simple (fecha de vigencia).

Cambios en plantilla impactan OTs futuras; nunca alteran OTs ya ejecutadas.

PDF y correo

Generación inmediata al cierre; envío al correo del cliente configurado. Copia opcional al admin.

Flujo de la app (alto nivel)
1) Planificación (web)

Carga/edita clientes y restricciones → genera agenda mensual → Optimiza rutas por técnico → publica OTs del día.

2) Ejecución (móvil)

Técnico abre app → ve OTs del día → Navega al primer sitio → pulsa Llegué (geo OK) → ejecuta checklist → firma del cliente → Salí → cierra OT (PDF y email automáticos) → continúa con la siguiente.

3) Cancelación en el día (web)

Marca OT como cancelada → sistema propone lista priorizada de candidatos cercanos → admin elige y rellena hueco → se envía nueva OT al técnico.

4) Emergencia (web + móvil)

Llega emergencia → sistema interrumpe OT en curso (marca minutos pendientes) → inserta emergencia en la ruta del técnico más cercano/con disponibilidad → técnico atiende, cierra → web sugiere reprogramación de los pendientes respetando restricciones.

5) Reporte y cierre (web)

Admin revisa tablero: cumplimientos, cancelaciones, emergencias, tiempos → exporta CSV/PDF → auditoría por técnico/cliente.

Puntos clave de diseño

Check-in/out con geofence para control real.

Plantillas flexibles por cliente (p. ej., formato Ministerio vs. privados).

Sin papel: firma digital en móvil + PDF al correo del cliente.

Reprogramación guiada (candidatos por cercanía + criterios).

Estados claros de OT y bitácora de eventos.

Modo offline en móvil (zonas sin señal).

Seguridad: sesiones por rol, cifrado en tránsito, logs.

Requerimientos no funcionales

Disponibilidad: ≥ 99% horario laboral.

Rendimiento: carga de ruta del día < 2 s; sincronización < 5 s por OT.

Geo-precisión: validar dentro de 50–150 m (configurable).

Trazabilidad: logs por OT (creación, asignación, llegada, salida, cierre, reprogramaciones).

Privacidad: geodatos solo en eventos de OT; no rastreo continuo fuera de OT.

Soporte offline: cachear OTs del día y subir evidencias cuando haya red.

Datos principales (modelo lógico)

Cliente(id, nombre, contacto, email, …)

Edificio(id, clienteId, dirección, geoPoint, restricciones: días/horas/ventanas, duraciónEstimada)

Plantilla(id, nombre, clienteId?, ítems[])

Técnico(id, nombre, teléfono, activo)

OT(id, tipo: preventivo|correctivo|emergencia, edificioId, plantillaId, técnicoId, fecha/hora planificada, estado, minutosPendientes)

EventoOT(id, otId, tipo: asignación|llegada|salida|suspendida|reprogramada|cerrada, timestamp, geoPoint)

ChecklistRespuesta(id, otId, itemId, valor, observación, fotoUrl?)

Firma(id, otId, imagen, nombreFirmante, fecha)

PDFReporte(id, otId, url, enviadoA)

Criterios de aceptación (muestras)

Validación geográfica: al pulsar Llegué, si la distancia > radio configurado, la app alerta y no permite continuar (override solo con motivo y aprobación del admin).

Cierre de OT: si falta firma o algún ítem obligatorio del checklist, no se puede cerrar.

Emergencia: al crear una emergencia, el sistema sugiere el técnico más cercano y con ventana disponible; la OT interrumpida queda con minutosPendientes > 0.

PDF: al cerrar OT, se genera PDF con hora real de llegada/salida, ubicación, checklist y firma; se envía al correo del cliente y queda descargable en web.

Lista de candidatos: ante cancelación, la web muestra mín. 5 clientes cercanos elegibles, ordenados por distancia y criterios definidos.

Fuera de alcance (explícito)

Inventario/Bodega (entregas, consumos, existencias, costos): excluido de esta fase.

Notas técnicas (sugerencias cortas)

App móvil: React Native/Expo, permisos de ubicación en foreground; almacenamiento local para modo offline; firmas con canvas.

Web admin: React/Vite; mapa (OSM/Google); generación de PDF server-side; colas de correo.

Backend: NestJS + PostgreSQL; endpoints para ruteo/optimización (se puede integrar motor de rutas y reglas).

Geocodificación y distancias: servicios de mapas + heurística de ventanas de tiempo.