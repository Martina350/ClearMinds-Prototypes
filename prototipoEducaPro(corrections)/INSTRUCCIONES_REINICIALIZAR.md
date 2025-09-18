# 📚 Instrucciones para Reinicializar Datos

## 🎯 Objetivo
Reinicializar el sistema con **100 estudiantes** distribuidos en **5 clases** (20 estudiantes por clase).

## 📋 Pasos a Seguir

### 1. Abrir la Aplicación
- Ve a `http://localhost:5173` en tu navegador

### 2. Abrir DevTools
- Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux)
- O `Cmd+Option+I` (Mac)

### 3. Ir a la Consola
- Haz clic en la pestaña **Console**

### 4. Ejecutar el Script de Limpieza
Copia y pega este código en la consola:

```javascript
// Limpiar todos los datos existentes
const keys = [
  'educapro_users',
  'educapro_students', 
  'educapro_parents',
  'educapro_teachers',
  'educapro_classes',
  'educapro_tasks',
  'educapro_task_submissions',
  'educapro_grades',
  'educapro_attendance',
  'educapro_payments',
  'educapro_notifications',
  'educapro_teacher_ratings',
  'educapro_current_user'
];

keys.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Eliminado: ${key}`);
});

console.log('🎉 Datos limpiados! Recarga la página para generar los nuevos datos.');
console.log('📝 NOTA: El docente ahora tiene ID 52 y verá las clases de Matemáticas 5to A');
```

### 5. Recargar la Página
- Presiona `Ctrl+F5` (Windows/Linux) o `Cmd+Shift+R` (Mac)

## 📊 Nuevos Datos Generados

### 👥 Usuarios
- **100 estudiantes** con nombres reales españoles
- **50 padres** (2 estudiantes por padre)
- **10 docentes** especializados en diferentes materias
- **1 administrador** y **1 personal de finanzas**

### 🏫 Clases (5 clases)
1. **Matemáticas 5to A** - 20 estudiantes
2. **Ciencias 5to B** - 20 estudiantes  
3. **Historia 6to A** - 20 estudiantes
4. **Español 6to B** - 20 estudiantes
5. **Inglés 7mo A** - 20 estudiantes

### 📚 Contenido Académico
- **20 tareas** (4 por clase) con diferentes tipos
- **Notas** para algunos estudiantes (6-10 puntos)
- **Asistencia** de los últimos 30 días (90% promedio)
- **Pagos** de mensualidades y matrículas
- **Notificaciones** para todos los roles

### 🎓 Materias
- Matemáticas
- Ciencias  
- Historia
- Español
- Inglés

## ✅ Verificación
Después de recargar, podrás ver:
- Listas de estudiantes más largas en todas las páginas
- Múltiples clases en los selectores
- Más tareas, notas y datos de asistencia
- Estadísticas más realistas en los dashboards

## 🔄 Si Necesitas Reinicializar Otra Vez
Solo repite los pasos 2-5. Los datos se regenerarán automáticamente.
