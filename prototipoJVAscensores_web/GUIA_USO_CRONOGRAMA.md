# 🎯 Guía Rápida de Uso - Sistema de Cronograma

## 📱 Cómo Usar el Sistema Mejorado

### 1️⃣ **Cambiar entre Vistas del Calendario**

Al entrar a la página de cronograma, verás 4 pestañas en la parte superior:

```
┌─────────────────────────────────────────────┐
│  Vista Diaria | Vista Semanal | Vista Mensual | Vista Anual  │
└─────────────────────────────────────────────┘
```

**Haz clic** en cualquier pestaña para cambiar la vista.

---

### 2️⃣ **Agregar una Nueva Actividad**

#### Paso a Paso:

1. **Clic en "Nueva Actividad"** (botón azul en la esquina superior derecha)
2. Se abrirá un formulario con los siguientes campos:
   - **Técnico Asignado**: Selecciona quién hará el trabajo
   - **Nombre de la Actividad**: Ej. "Mantenimiento Preventivo"
   - **Cliente**: Nombre del cliente
   - **Edificio/Ubicación**: Ej. "Torre Norte, Piso 5"
   - **Dirección**: Dirección completa
   - **Fecha**: Cuándo se realizará
   - **Hora Inicio y Fin**: Ej. 08:00 - 10:00
   - **Tipo**: Preventivo, Correctivo o Emergencia
   - **Prioridad**: Baja, Media o Alta
   - **Recurrencia**: ¿Se repite? (ver más abajo)

3. **Clic en "Guardar Actividad"**

#### 💡 Ejemplo de Actividad Única:
```
Técnico: Juan Pérez
Actividad: Inspección de Ascensores
Cliente: Torre Ejecutiva
Edificio: Edificio A
Fecha: 2025-10-20
Hora: 09:00 - 11:00
Tipo: Preventivo
Prioridad: Media
Recurrencia: Única vez
```

---

### 3️⃣ **Crear Actividades Recurrentes** 🔄

Las actividades recurrentes se **crean automáticamente** según la frecuencia que elijas.

#### Ejemplo 1: Mantenimiento Mensual
```
Actividad: Revisión Mensual de Equipos
Fecha: 2025-01-15
Recurrencia: Mensual
Fecha de Fin: 2025-12-31
```
**Resultado**: Se crean automáticamente 12 actividades (una cada mes el día 15)

#### Ejemplo 2: Inspección Semanal
```
Actividad: Inspección de Seguridad
Fecha: 2025-10-20 (Lunes)
Recurrencia: Semanal
Fecha de Fin: 2025-12-31
```
**Resultado**: Se crea una actividad cada lunes hasta fin de año

#### Ejemplo 3: Mantenimiento Trimestral
```
Actividad: Mantenimiento Mayor
Fecha: 2025-01-15
Recurrencia: Trimestral
Fecha de Fin: 2025-12-31
```
**Resultado**: Se crean 4 actividades (enero, abril, julio, octubre)

---

### 4️⃣ **Gestionar Feriados de Ecuador** 🇪🇨

#### Abrir el Gestor de Feriados:
1. **Clic en "Gestionar Feriados"** (botón verde en la parte superior)
2. Verás la lista de todos los feriados de Ecuador para 2025

#### Modificar la Fecha de un Feriado:
Cuando el gobierno hace "puentes" o cambia fechas:
1. Encuentra el feriado en la lista
2. Cambia la fecha en el campo correspondiente
3. Se guarda **automáticamente**
4. Recibirás una notificación confirmando el cambio

#### Desactivar un Feriado:
Si un feriado no aplica a tu empresa:
1. Encuentra el feriado
2. Haz clic en el botón del **ojo** (👁️)
3. El feriado quedará **desactivado** (gris)
4. Ya no aparecerá en el calendario

#### Agregar un Feriado Personalizado:
Para días especiales de tu empresa:
1. Ve a la parte inferior del modal
2. Escribe el nombre del feriado (Ej. "Aniversario de la Empresa")
3. Selecciona la fecha
4. Haz clic en **"Agregar"**
5. ¡Listo! Aparecerá en el calendario

---

### 5️⃣ **Usar las Diferentes Vistas**

#### 📅 **Vista Diaria**
**Cuándo usarla**: Para ver el detalle completo de un día específico

**Funcionalidades**:
- Lista de todas las actividades del día
- Si es feriado, muestra una alerta roja con el nombre
- Muestra hora, técnico, cliente, dirección
- Puedes hacer clic en cualquier actividad para ver más detalles

**Navegación**:
- Usa el selector de fecha para cambiar de día

---

#### 📊 **Vista Semanal**
**Cuándo usarla**: Para planificar la semana de los técnicos

**Funcionalidades**:
- Cuadrícula de 7 días (Domingo a Sábado)
- Franjas horarias cada 30 minutos
- Bloques de actividades con colores
- Clic en cualquier actividad para ver detalles

**Colores**:
- 🔵 Azul: Preventivo programado
- 🟦 Azul claro: Preventivo en progreso
- 🟢 Verde: Completado
- 🟠 Naranja: Correctivo
- 🔴 Rojo: Emergencia

---

#### 🗓️ **Vista Mensual**
**Cuándo usarla**: Para tener una visión general del mes

**Funcionalidades**:
- Calendario de todo el mes
- **Feriados destacados en rojo** 🎉
- Contador de actividades por día
- Muestra las primeras 2 actividades de cada día
- Navegación con flechas ◀️ ▶️

**Ejemplo de día en el calendario**:
```
┌─────────────────┐
│ 15         [3]  │  ← Día 15 con 3 actividades
│ 🎉 Navidad      │  ← Es feriado
│ 09:00 Mantenim. │  ← Primera actividad
│ 14:00 Inspección│  ← Segunda actividad
│ +1 más          │  ← Hay una más
└─────────────────┘
```

---

#### 📆 **Vista Anual**
**Cuándo usarla**: Para planificación de largo plazo

**Funcionalidades**:
- 12 tarjetas (una por mes)
- Resumen de actividades por mes
- Número de feriados del mes
- Estadísticas: completadas y emergencias
- Navegación por año con flechas

**Información por mes**:
```
┌──────────────────────┐
│ Enero 2025           │
│                      │
│ 📅 15 actividades    │
│ 🎉 1 feriado         │
│                      │
│ ✅ 10 completadas    │
│ ⚠️  2 emergencias    │
└──────────────────────┘
```

---

### 6️⃣ **Filtrar por Técnico**

En todas las vistas puedes filtrar:

1. Busca el selector **"Filtrar por Técnico"** (parte superior derecha)
2. Opciones:
   - **Todos los Técnicos**: Muestra todo
   - **Juan Pérez**: Solo actividades de Juan
   - **María López**: Solo actividades de María
   - **Carlos Mendez**: Solo actividades de Carlos
   - **Ana Gómez**: Solo actividades de Ana

---

### 7️⃣ **Optimizar Cronograma** 🔄

Esta función reorganiza automáticamente las actividades:

1. Haz clic en **"Optimizar"** (botón morado)
2. El sistema reorganiza las actividades:
   - Primero las de **prioridad alta**
   - Luego las de **prioridad media**
   - Al final las de **prioridad baja**
3. Dentro de cada prioridad, ordena por hora
4. Recibirás una notificación de confirmación

**Cuándo usar**: Cuando agregues muchas actividades nuevas y quieras ordenarlas.

---

### 8️⃣ **Modo Emergencia** 🚨

Activa este modo cuando hay urgencias:

1. Haz clic en **"Modo Emergencia"** (botón amarillo/rojo)
2. Aparece una alerta roja en pantalla
3. Las emergencias tendrán máxima prioridad
4. Para desactivar, haz clic nuevamente

**Cuándo usar**: Cuando hay un ascensor detenido o una urgencia que requiere atención inmediata.

---

### 9️⃣ **Ver Detalles de una Actividad**

En cualquier vista:

1. **Haz clic** en una actividad
2. Se abre un modal con:
   - Información del técnico (nombre, zona, color)
   - Cliente y edificio
   - Tipo, prioridad, estado
   - **Ubicación con botón "Ver en Mapa"**
   - Horarios (entrada, salida, duración)
3. Puedes **Cerrar** o **Editar** la actividad

---

### 🔔 **Panel de Notificaciones**

Las notificaciones aparecen automáticamente en la parte superior cuando:
- ✅ Creas una actividad
- ✅ Optimizas el cronograma
- ⚠️ Activas modo emergencia
- ℹ️ Modificas un feriado

**Acciones**:
- Las notificaciones se muestran por **3 segundos**
- Puedes hacer clic en **"Limpiar Todo"** para borrarlas

---

## 📊 Entendiendo las Estadísticas

En la parte superior verás 5 tarjetas con números:

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Total   │Completadas│En Progreso│Programadas│Emergencias│
│   [25]   │   [10]   │    [5]   │   [8]    │    [2]   │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

- **Total**: Todas las actividades (del técnico seleccionado o de todos)
- **Completadas**: Actividades que ya se terminaron
- **En Progreso**: Actividades que se están haciendo ahora
- **Programadas**: Actividades futuras
- **Emergencias**: Actividades urgentes (sin importar su estado)

---

## 💡 Consejos de Uso

### ✅ **Mejores Prácticas**:

1. **Planifica al inicio del año**: Crea actividades recurrentes para todo el año
2. **Revisa mensualmente**: Usa la vista mensual para confirmar que todo esté bien
3. **Actualiza feriados en enero**: Verifica que las fechas sean correctas
4. **Usa prioridades**: Marca correctamente la prioridad de cada actividad
5. **Filtra por técnico**: Revisa la carga de trabajo de cada uno

### ⚠️ **Evita**:

1. **No crear duplicados**: Usa recurrencia en vez de crear manualmente
2. **No olvidar actualizar**: Si una actividad se completa, actualiza su estado
3. **No ignorar feriados**: Verifica que no haya actividades en días feriados
4. **No sobrecargar técnicos**: Revisa que no tengan actividades superpuestas

---

## 🎨 Leyenda de Colores Rápida

| Color | Significado |
|-------|-------------|
| 🔵 Azul | Preventivo programado |
| 🟦 Azul claro | Preventivo en progreso |
| 🟢 Verde | Completado |
| 🟠 Naranja | Correctivo |
| 🔴 Rojo | Emergencia |
| 🔴 Rojo claro | Feriado |

---

## 📞 Flujo de Trabajo Típico

### **Inicio del Año**:
1. Revisar y actualizar feriados
2. Crear actividades recurrentes (mantenimientos mensuales, inspecciones semanales)
3. Asignar técnicos
4. Optimizar cronograma

### **Durante el Mes**:
1. Usar vista semanal para el día a día
2. Agregar actividades correctivas cuando surjan
3. Marcar actividades como completadas
4. Activar modo emergencia si es necesario

### **Fin de Mes**:
1. Revisar vista mensual
2. Verificar que todas las actividades estén completadas
3. Preparar el siguiente mes

---

## 🚀 ¡Comienza Ahora!

1. **Abre la página de Cronograma**
2. **Clic en "Nueva Actividad"**
3. **Crea tu primera actividad recurrente**
4. **Explora las diferentes vistas**
5. **Gestiona los feriados de Ecuador**

**¡Eso es todo! El sistema está listo para ayudarte a organizar todo el año de mantenimientos.** 🎉

