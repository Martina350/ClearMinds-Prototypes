# 🎯 Guía Rápida de Uso - Nuevas Funcionalidades

## 🚀 Inicio Rápido

### 1. Instalar y Ejecutar

```bash
cd "C:\Users\Martina Leon\Desktop\ClearMinds-Prototypes\sPBaloncestoPrototype"
npm install  # Ya ejecutado ✅
npm start
```

### 2. Credenciales de Prueba

**Padre de Familia**:
- Usuario: `padre1`
- Contraseña: `123456`

**Administrador**:
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📱 Funcionalidades por Pantalla

### 🏠 PANTALLA DE INICIO (HomeScreen)

#### Ver al iniciar sesión como padre:

**1. Notificaciones Automáticas** (parte superior)
- Aparecen automáticamente
- Tipos: Pagos vencidos, próximos partidos, recordatorios
- Auto-desaparición en 5 segundos
- Click en X para cerrar manualmente

**2. Widget de Próximos Partidos**
- Lista horizontal de partidos de la próxima semana
- Scroll horizontal para ver más
- Click en un partido → navega al detalle del campeonato
- Muestra: equipos, fecha, hora, días restantes

**3. WebView del Sitio Institucional**
- Navegación completa del sitio web
- Botón de refresco si falla la carga

---

### 💳 PANTALLA DE PAGOS

#### Badges en el Tab (visible siempre)
- Número rojo indica pagos pendientes
- Se actualiza automáticamente

#### En la Lista de Deportistas
1. Click en tarjeta del deportista
2. Ver estado general (😊 al día / 😢 pendientes)

---

### 📊 PANTALLA DE DETALLE DE PAGOS

#### Acciones Rápidas (sección superior)

**📄 Exportar PDF**
1. Click en botón "Exportar PDF"
2. Esperar generación (loading)
3. Se abre menú de compartir del dispositivo
4. Elegir dónde compartir/guardar

**Contenido del PDF**:
- Header con logo de la escuela
- Información del deportista
- Resumen (total pagos, pagados, monto)
- Tabla detallada de todos los pagos
- Footer con fecha de generación

**✉️ Enviar Email**
1. Click en botón "Enviar Email"
2. Se abre app de correo del dispositivo
3. Email prellenado con:
   - Asunto: "Reporte de Pagos - [Nombre]"
   - Cuerpo: Resumen de pagos
   - PDF adjunto
4. Solo agregar destinatario y enviar

**📥 Descargar CSV**
1. Click en botón "Descargar CSV"
2. Se genera archivo CSV
3. Se abre menú de compartir
4. Puede abrirse en Excel, Google Sheets, etc.

**Datos del CSV**:
- Descripción del pago
- Monto
- Fecha de vencimiento
- Estado
- Método de pago
- Fecha de pago

#### Compartir Comprobantes Individuales

**En cada pago PAGADO**:
1. Buscar botón "Compartir Comprobante" (azul)
2. Click en el botón
3. Se genera PDF del comprobante
4. Se abre menú de compartir

**Contenido del Comprobante**:
- Número de comprobante único
- Deportista y categoría
- Concepto del pago
- Monto pagado
- Método y fecha de pago
- Sello de "PAGO VERIFICADO"

---

### 🏆 PANTALLA DE CAMPEONATOS

#### Badge en el Tab
- Muestra número de partidos próximos (7 días)

#### En la Lista de Campeonatos
- Filtros por categoría
- Búsqueda por nombre
- Click → ver detalle con resultados y próximos partidos

---

### ⏰ PANTALLA DE RECORDATORIOS

#### Acceder a Recordatorios
```javascript
// Desde código:
navigation.navigate('Reminders')
```

#### Crear Nuevo Recordatorio
1. Click en botón "Nuevo Recordatorio"
2. Seleccionar tipo: PAGO o PARTIDO
3. Llenar campos:
   - Título: Nombre del recordatorio
   - Mensaje: Descripción
   - Fecha: Fecha objetivo (YYYY-MM-DD)
4. Click en "Crear Recordatorio"

#### Gestionar Recordatorios

**Activar/Desactivar**:
- Toggle switch a la derecha
- Verde = activo, Gris = desactivado

**Eliminar**:
- Click en botón "Eliminar" (rojo)
- Confirmar en el diálogo

---

## 🎨 Elementos Visuales

### Badges (Círculos Rojos)
- **Ubicación**: Tabs de navegación inferior
- **Significado**:
  - Número = cantidad de items pendientes/nuevos
  - "9+" = más de 9 items

### Notificaciones (Banner Superior)

**Colores por Tipo**:
- 🔴 Rojo: Pagos vencidos/urgentes
- 🔵 Azul: Próximos partidos
- 🟡 Amarillo: Recordatorios
- 🟢 Verde: Éxito/confirmación
- 🟣 Morado: Información general

**Interacción**:
- Click en X: Cerrar
- Auto-cierre: 5 segundos
- Puede tener botón de acción

### Widget de Próximos Partidos

**Elementos**:
- Badge amarillo: "EN X DÍAS"
- Badge rojo: "HOY" (partidos del día)
- Badge verde: "MAÑANA"
- Información completa del partido
- Scroll horizontal

---

## 🎯 Casos de Uso Recomendados para Demostración

### Demo 1: Flujo Completo de Padre (5 min)

1. **Login** como padre1
2. **Ver notificaciones** en HomeScreen
3. **Ver próximos partidos** y navegar a uno
4. **Ir a Pagos** y ver badge con pendientes
5. **Entrar a detalle** de un deportista
6. **Exportar PDF** y mostrar el diseño
7. **Compartir comprobante** de un pago pagado
8. **Enviar email** con el reporte

### Demo 2: Gestión de Recordatorios (3 min)

1. **Navegar a Recordatorios**
2. **Crear recordatorio** de pago
3. **Crear recordatorio** de partido
4. **Activar/desactivar** con switch
5. **Eliminar** un recordatorio

### Demo 3: Notificaciones y Badges (2 min)

1. **Mostrar badges** en tabs
2. **Esperar notificación** automática
3. **Interactuar con notificación**
4. **Ver widget** de próximos partidos

---

## 🔍 Detalles Técnicos para Presentación

### Tecnologías Destacables

- **React Native + Expo**: Desarrollo multiplataforma
- **TypeScript**: Tipado fuerte, menos errores
- **expo-print**: Generación de PDFs nativos
- **expo-sharing**: Compartir archivos nativamente
- **expo-mail-composer**: Integración con email nativo
- **Animaciones nativas**: Performance óptima

### Datos de Demostración

**Deportistas Mock**:
- Juan Pérez (Sub-15, masculino)
- María García (Sub-13, femenino)

**Pagos Mock**:
- 13 pagos de ejemplo
- Estados: pagado, pendiente, vencido, en revisión
- Tipos: mensualidad, inscripción torneo, inscripción evento

**Campeonatos Mock**:
- 20 campeonatos (Sub-8 a Sub-17)
- Masculino y femenino
- Regional y Nacional
- Con partidos programados

---

## 💡 Tips para la Presentación

### Preparación

1. **Iniciar app** 5 minutos antes
2. **Hacer login** previamente para calentar la app
3. **Tener dispositivo cargado** al 100%
4. **Modo avión** para evitar llamadas
5. **Brillo al máximo** para mejor visibilidad

### Durante la Demo

1. **Hablar mientras se navega**: Explicar qué se está haciendo
2. **Mostrar badges primero**: Son visuales y llamativos
3. **Generar PDF en vivo**: Impresiona ver el resultado
4. **Mostrar notificaciones**: Son automáticas y llamativas
5. **Interactuar con widget**: Deslizar y hacer click

### Frases Clave

- "Como pueden ver, el sistema notifica automáticamente..."
- "Los badges muestran en tiempo real..."
- "Con un click, generamos un PDF profesional..."
- "El sistema está integrado con el email nativo..."
- "Los próximos partidos se muestran automáticamente..."

---

## ❓ Solución de Problemas

### Si no aparecen notificaciones:
- Esperar 1 minuto (se generan automáticamente)
- Verificar que hay pagos vencidos en mockData.ts

### Si los badges no muestran números:
- Verificar que estás logueado como padre1
- Los badges se actualizan al navegar entre tabs

### Si falla la generación de PDF:
- Verificar que npm install se ejecutó correctamente
- Reiniciar expo (Ctrl+C y npm start)

### Si el email no se abre:
- Dispositivo debe tener app de correo configurada
- En emulador puede no funcionar (usar dispositivo real)

---

## 📸 Puntos Fotogénicos para Screenshots

1. **HomeScreen con notificación activa**
2. **Widget de próximos partidos**
3. **Badges en tabs**
4. **PDF generado abierto**
5. **Pantalla de recordatorios completa**
6. **Comprobante de pago**
7. **Email prellenado**

---

## 🎬 Cierre de la Presentación

### Resumen de Valor

"Como han visto, el prototipo ahora incluye:

✅ **Notificaciones automáticas** que mantienen informados a los padres
✅ **Badges visuales** que muestran información en tiempo real
✅ **Widget de partidos** para no perderse ningún evento
✅ **Recordatorios personalizables** para gestionar mejor el tiempo
✅ **Exportación a PDF** con diseño profesional
✅ **Compartición de comprobantes** instantánea
✅ **Integración con email** para facilitar la comunicación
✅ **Descarga de estadísticas** para análisis personal

Todo esto sin comprometer la funcionalidad existente y manteniendo un diseño profesional y atractivo."

---

## 📞 Para Más Información

- **Documentación completa**: Ver `NUEVAS_FUNCIONALIDADES.md`
- **Resumen técnico**: Ver `RESUMEN_IMPLEMENTACION.md`
- **Código fuente**: Completamente documentado con comentarios

---

**¡El prototipo está listo para impresionar!** 🚀

Fecha: ${new Date().toLocaleDateString('es-ES')}

