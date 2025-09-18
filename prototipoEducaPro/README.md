# Fivoduc — Prototipo (HTML/CSS/JS)

Prototipo funcional front-end para demostrar los flujos principales de una plataforma académica (roles: Administrador, Docente, Estudiante, Padre, Finanzas). No requiere backend; usa datos mock en `localStorage` y `data.json` de referencia.

## Ejecutar
- Descarga o clona esta carpeta.
- Abre `index.html` en tu navegador (doble clic). No necesita servidor.

Si el navegador bloquea lectura local de `data.json`, no hay problema: el prototipo inicializa datos mock automáticamente en `localStorage`.

## Credenciales mock
- Administrador: `admin@fivoduc.test` / `admin`
- Docente: `docente@fivoduc.test` / `docente`
- Estudiante: `alumno1@fivoduc.test` / `alumno`
- Padre: `padre1@fivoduc.test` / `padre`
- Finanzas: `finanzas@fivoduc.test` / `finanzas`

## Flujos y vistas
- Login con selección de rol y redirección al panel del rol.
- Panel por rol con sidebar, header y dashboard con KPIs.
- Administrador: gestión de estudiantes (crear/editar/eliminar), vista de asistencias, calificaciones y finanzas.
- Docente: registro de asistencias y calificaciones, creación de prácticas.
- Estudiante: ver calificaciones/asistencia, enviar URL de tareas, acceder a link de clase virtual.
- Padre: ver progreso, pagos y enviar feedback privado.
- Finanzas: marcar pagos y ver alertas.

## Persistencia
- Cambios guardados en `localStorage` bajo la clave `fivoduc.mock.v1`.
- Para reiniciar el demo, limpia el almacenamiento local del sitio.

## Diseño/UI
- Paleta vibrante (azul, verde lima, naranja, morado, amarillo), degradados en headers y modales.
- Layout responsivo con sidebar plegable en móvil.
- Componentes: cards, tablas zebra, modales, toasts.

## Notas
- Validaciones básicas de formularios.
- Para conectar con una API real, reemplazar accesos a `localStorage` por peticiones HTTP.
