# 🔧 Explicación Técnica para Desarrolladores Junior

## 📚 Entendiendo el Código del Cronograma

Esta guía te explica **cómo funciona** el código por dentro, para que puedas entenderlo y modificarlo en el futuro.

---

## 1️⃣ **Estructura del Archivo `schedule.tsx`**

El archivo está organizado en secciones claras:

```typescript
// ======= SECCIÓN 1: IMPORTS =======
import React from "react";
import { Card, Button, Modal, ... } from "@heroui/react";

// ======= SECCIÓN 2: TIPOS (INTERFACES) =======
interface MaintenanceActivity { ... }
interface Holiday { ... }
interface Notification { ... }

// ======= SECCIÓN 3: DATOS CONSTANTES =======
const ECUADOR_HOLIDAYS_2025: Holiday[] = [ ... ]

// ======= SECCIÓN 4: COMPONENTE PRINCIPAL =======
export const SchedulePage: React.FC = () => {
  // Estados
  // Funciones
  // Renderizado (JSX)
}
```

---

## 2️⃣ **¿Qué son las Interfaces (Types)?**

Las interfaces definen la **estructura** de los datos. Es como un "molde" o "plantilla".

### Ejemplo de Interface:

```typescript
interface MaintenanceActivity {
  id: string;                    // Identificador único
  technicianId: string;          // ID del técnico
  technicianName: string;        // Nombre del técnico
  activity: string;              // Nombre de la actividad
  client: string;                // Nombre del cliente
  date?: string;                 // ? = opcional
  startTime: string;             // Hora de inicio "08:00"
  endTime: string;               // Hora de fin "10:00"
  type: "preventivo" | "correctivo" | "emergencia";  // Solo estos 3 valores
  priority: "baja" | "media" | "alta";                // Solo estos 3 valores
  recurrence?: {                 // Configuración de recurrencia (opcional)
    type: "unica" | "diaria" | "semanal" | "mensual" | "trimestral" | "anual";
    endDate?: string;
  };
}
```

### ¿Por qué usar interfaces?

✅ **Autocompletado**: Tu editor te sugiere qué propiedades tiene un objeto  
✅ **Errores tempranos**: Si te olvidas de una propiedad, TypeScript te avisa  
✅ **Documentación**: Cualquiera puede ver qué datos necesita  

---

## 3️⃣ **¿Qué es el Estado (useState)?**

El **estado** son variables que React "observa". Cuando cambian, React actualiza la pantalla automáticamente.

### Ejemplo Simple:

```typescript
// Crear un estado para contar clicks
const [contador, setContador] = useState(0);

// Para cambiar el valor:
setContador(5);  // Ahora contador = 5

// Para incrementar:
setContador(contador + 1);  // contador = 6

// O mejor (función):
setContador(prev => prev + 1);  // Más seguro
```

### En nuestro cronograma:

```typescript
// Estado para la vista actual (dia, semana, mes, anual)
const [viewMode, setViewMode] = useState<"dia" | "semana" | "mes" | "anual">("semana");

// Estado para los feriados
const [holidays, setHolidays] = useState<Holiday[]>(ECUADOR_HOLIDAYS_2025);

// Estado para las notificaciones
const [notifications, setNotifications] = useState<Notification[]>([]);
```

### ¿Cuándo usar estado?

- Cuando el valor **puede cambiar** (filtros, selección, etc.)
- Cuando quieres que React **actualice la pantalla** al cambiar

---

## 4️⃣ **Funciones Helper Explicadas**

### **A. Verificar si es Feriado**

```typescript
const isHoliday = (date: string): Holiday | null => {
  // Busca en el array de feriados
  const holiday = holidays.find(h => 
    h.date === date &&  // La fecha coincide Y
    h.isActive          // Está activo
  );
  
  // Si lo encuentra, devuelve el feriado. Si no, devuelve null
  return holiday || null;
};

// Uso:
const feriado = isHoliday("2025-12-25");  // Devuelve el objeto de Navidad
const noFeriado = isHoliday("2025-06-15");  // Devuelve null
```

### **B. Agregar Notificación**

```typescript
const addNotification = (title: string, message: string, type: Notification["type"]) => {
  // Crea un nuevo objeto de notificación
  const newNotification: Notification = {
    id: `notif-${Date.now()}`,        // ID único con timestamp
    title,                             // Título (shorthand para title: title)
    message,                           // Mensaje
    type,                              // Tipo (success, warning, etc.)
    timestamp: new Date(),             // Fecha y hora actual
    read: false,                       // No leída
  };
  
  // Agrega la notificación al inicio del array
  setNotifications(prev => [newNotification, ...prev]);
  //                       ↑ nueva          ↑ las que ya había
};

// Uso:
addNotification("Éxito", "Actividad creada correctamente", "success");
```

### **C. Crear Actividades Recurrentes**

Esta es la función más compleja. Vamos paso a paso:

```typescript
const createRecurringActivity = (baseActivity: MaintenanceActivity) => {
  // 1. Si es actividad única, devolver solo esa
  if (!baseActivity.recurrence || baseActivity.recurrence.type === "unica") {
    return [baseActivity];  // Array con 1 elemento
  }

  // 2. Crear array vacío para las actividades generadas
  const generatedActivities: MaintenanceActivity[] = [];
  
  // 3. Definir fechas de inicio y fin
  const startDate = new Date(baseActivity.date || selectedDate);
  const endDate = baseActivity.recurrence.endDate 
    ? new Date(baseActivity.recurrence.endDate) 
    : new Date(selectedYear, 11, 31);  // Fin del año

  // 4. Empezar desde la fecha de inicio
  let currentDate = new Date(startDate);

  // 5. Loop mientras no pasemos la fecha de fin
  while (currentDate <= endDate) {
    // Crear una nueva actividad para esta fecha
    generatedActivities.push({
      ...baseActivity,  // Copiar todas las propiedades
      id: `${baseActivity.id}-${currentDate.toISOString().split('T')[0]}`,  // ID único
      date: currentDate.toISOString().split('T')[0],  // Fecha en formato YYYY-MM-DD
    });

    // 6. Avanzar a la siguiente fecha según el tipo
    switch (baseActivity.recurrence.type) {
      case "diaria":
        currentDate.setDate(currentDate.getDate() + 1);  // +1 día
        break;
      case "semanal":
        currentDate.setDate(currentDate.getDate() + 7);  // +7 días
        break;
      case "mensual":
        currentDate.setMonth(currentDate.getMonth() + 1);  // +1 mes
        break;
      case "trimestral":
        currentDate.setMonth(currentDate.getMonth() + 3);  // +3 meses
        break;
      case "anual":
        currentDate.setFullYear(currentDate.getFullYear() + 1);  // +1 año
        break;
    }
  }

  // 7. Devolver todas las actividades generadas
  return generatedActivities;
};
```

**Ejemplo de uso:**
```typescript
// Actividad mensual desde enero hasta diciembre
const actividadBase = {
  id: "A001",
  activity: "Mantenimiento Mensual",
  date: "2025-01-15",
  recurrence: {
    type: "mensual",
    endDate: "2025-12-31"
  },
  // ... otras propiedades
};

const actividades = createRecurringActivity(actividadBase);
// Resultado: Array con 12 actividades (enero a diciembre, día 15)
```

---

## 5️⃣ **Renderizado Condicional**

En React, puedes mostrar/ocultar elementos según condiciones:

### **Operador AND (&&)**

```typescript
// Si hay notificaciones, muestra el panel
{notifications.length > 0 && (
  <Card>
    <p>Tienes {notifications.length} notificaciones</p>
  </Card>
)}

// Si NO hay notificaciones, no muestra nada
```

### **Operador Ternario (? :)**

```typescript
// Si está en modo emergencia, texto "Desactivar", si no "Modo"
<Button>
  {emergencyMode ? "Desactivar" : "Modo"} Emergencia
</Button>
```

### **Switch/Case con JSX**

```typescript
{viewMode === "semana" && (
  <div>Vista Semanal</div>
)}

{viewMode === "mes" && (
  <div>Vista Mensual</div>
)}

{viewMode === "anual" && (
  <div>Vista Anual</div>
)}
```

---

## 6️⃣ **Eventos y Handlers**

Los **handlers** son funciones que se ejecutan cuando pasa algo (click, cambio, etc.)

### **onClick / onPress**

```typescript
// Función que se ejecuta al hacer click
const handleButtonClick = () => {
  console.log("¡Hiciste click!");
};

// En el JSX:
<Button onPress={handleButtonClick}>
  Haz Click
</Button>

// O directamente:
<Button onPress={() => console.log("Click!")}>
  Haz Click
</Button>
```

### **onChange (inputs)**

```typescript
// Cuando escribes en un input
<Input
  value={newActivityForm.activity}
  onChange={(e) => {
    // e.target.value es lo que escribiste
    setNewActivityForm(prev => ({
      ...prev,                    // Mantener todo lo anterior
      activity: e.target.value    // Actualizar solo 'activity'
    }));
  }}
/>
```

### **onSelectionChange (selects)**

```typescript
<Select
  selectedKeys={[selectedTechnician]}
  onSelectionChange={(keys) => {
    // keys es un Set, lo convertimos a Array y tomamos el primero
    const selected = Array.from(keys)[0] as string;
    setSelectedTechnician(selected);
  }}
>
  <SelectItem key="T001">Juan Pérez</SelectItem>
  <SelectItem key="T002">María López</SelectItem>
</Select>
```

---

## 7️⃣ **Arrays y Métodos Útiles**

### **map() - Transformar array**

```typescript
// Tengo un array de números
const numeros = [1, 2, 3, 4, 5];

// Quiero multiplicar cada uno por 2
const dobles = numeros.map(n => n * 2);
// Resultado: [2, 4, 6, 8, 10]

// En el cronograma:
holidays.map((holiday) => (
  <Card key={holiday.id}>
    <p>{holiday.name}</p>
  </Card>
))
// Crea una Card por cada feriado
```

### **filter() - Filtrar array**

```typescript
// Tengo actividades
const todasActividades = [...];

// Solo quiero las completadas
const completadas = todasActividades.filter(act => act.status === "completado");

// Solo las del técnico T001
const deJuan = todasActividades.filter(act => act.technicianId === "T001");

// Encadenar filtros
const completadasDeJuan = todasActividades
  .filter(act => act.technicianId === "T001")
  .filter(act => act.status === "completado");
```

### **find() - Encontrar elemento**

```typescript
// Buscar un técnico por ID
const tecnico = technicians.find(t => t.id === "T001");
// Devuelve el primer elemento que cumple la condición
// Si no encuentra nada, devuelve undefined

// Por eso usamos ? (optional chaining)
const nombreTecnico = technicians.find(t => t.id === "T001")?.name;
//                                                          ↑ si existe, dame .name
```

### **sort() - Ordenar array**

```typescript
// Ordenar actividades por hora
const ordenadas = activities.sort((a, b) => 
  a.startTime.localeCompare(b.startTime)
);

// Ordenar por prioridad (personalizado)
const porPrioridad = activities.sort((a, b) => {
  const priorityOrder = { alta: 0, media: 1, baja: 2 };
  return priorityOrder[a.priority] - priorityOrder[b.priority];
});
```

---

## 8️⃣ **Fechas en JavaScript**

### **Crear fechas**

```typescript
// Fecha actual
const ahora = new Date();

// Fecha específica (mes es 0-11, 0=enero, 11=diciembre)
const navidad = new Date(2025, 11, 25);  // 25 de diciembre de 2025

// Desde string
const fecha = new Date("2025-12-25");
```

### **Manipular fechas**

```typescript
const fecha = new Date("2025-01-15");

// Sumar 1 día
fecha.setDate(fecha.getDate() + 1);  // 2025-01-16

// Sumar 1 mes
fecha.setMonth(fecha.getMonth() + 1);  // 2025-02-16

// Sumar 1 año
fecha.setFullYear(fecha.getFullYear() + 1);  // 2026-02-16
```

### **Formatear fechas**

```typescript
const fecha = new Date(2025, 11, 25);

// A string ISO (YYYY-MM-DD)
const iso = fecha.toISOString().split('T')[0];  // "2025-12-25"

// Formato local (español)
const local = fecha.toLocaleDateString('es-ES', { 
  month: 'long',    // "diciembre"
  year: 'numeric'   // "2025"
});  // "diciembre de 2025"
```

---

## 9️⃣ **Modales (useDisclosure)**

Los modales se controlan con el hook `useDisclosure`:

```typescript
// Crear el control del modal
const { isOpen, onOpen, onOpenChange } = useDisclosure();
//        ↑        ↑        ↑
//     ¿Abierto?  Abrir   Cambiar estado

// Abrir el modal
<Button onPress={onOpen}>Abrir Modal</Button>

// El modal
<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader>Título</ModalHeader>
        <ModalBody>Contenido</ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>Cerrar</Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>
```

---

## 🔟 **Spread Operator (...)**

El spread operator es **super útil** para copiar y modificar objetos/arrays:

### **Con Objetos**

```typescript
// Tengo un objeto
const actividad = {
  id: "A001",
  name: "Mantenimiento",
  priority: "media"
};

// Quiero crear uno nuevo con priority cambiado
const nuevaActividad = {
  ...actividad,          // Copia todo
  priority: "alta"       // Sobrescribe solo priority
};

// Resultado:
// {
//   id: "A001",
//   name: "Mantenimiento", 
//   priority: "alta"  ← Cambió
// }
```

### **Con Arrays**

```typescript
// Tengo un array
const numeros = [1, 2, 3];

// Agregar al final
const masNumeros = [...numeros, 4, 5];  // [1, 2, 3, 4, 5]

// Agregar al inicio
const otrosNumeros = [0, ...numeros];  // [0, 1, 2, 3]

// Combinar arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combinado = [...arr1, ...arr2];  // [1, 2, 3, 4]
```

---

## 🎯 **Conceptos Clave del Proyecto**

### **1. Separación de Responsabilidades** [[memory:7838181]]

```
✅ BIEN:
- Función para calcular duración
- Función para verificar feriado
- Función para crear recurrencias

❌ MAL:
- Todo el código en una sola función gigante
```

### **2. Inmutabilidad**

```typescript
// ❌ MAL (muta el estado directamente)
activities.push(newActivity);

// ✅ BIEN (crea nuevo array)
setActivities(prev => [...prev, newActivity]);
```

### **3. Componentes Reutilizables**

En el futuro, puedes extraer partes en componentes:

```typescript
// Componente de tarjeta de actividad
const ActivityCard = ({ activity }) => (
  <Card>
    <h3>{activity.name}</h3>
    <p>{activity.client}</p>
  </Card>
);

// Usar en múltiples lugares
<ActivityCard activity={act1} />
<ActivityCard activity={act2} />
```

---

## 📝 **Resumen de Conceptos**

| Concepto | ¿Qué es? | Ejemplo |
|----------|----------|---------|
| **Interface** | Estructura de datos | `interface User { name: string }` |
| **useState** | Variable que React observa | `const [count, setCount] = useState(0)` |
| **Handler** | Función que maneja eventos | `const handleClick = () => {...}` |
| **map()** | Transforma array | `[1,2,3].map(n => n*2)  // [2,4,6]` |
| **filter()** | Filtra array | `[1,2,3].filter(n => n > 1)  // [2,3]` |
| **Spread (...)** | Copia objeto/array | `{...obj, key: 'new'}` |
| **? (optional)** | Propiedad opcional | `date?: string` |
| **&& (and)** | Renderizado condicional | `{show && <Component />}` |

---

## 🚀 **Siguiente Paso: Experimentar**

Ahora que entiendes cómo funciona, prueba hacer cambios pequeños:

1. **Cambia un color** en `getBlockColor()`
2. **Agrega un nuevo tipo de actividad** (ej. "revisión")
3. **Modifica el formato de fecha** en la vista mensual
4. **Agrega un nuevo campo** al formulario de actividades

¡La mejor manera de aprender es **practicando**! 🎓

