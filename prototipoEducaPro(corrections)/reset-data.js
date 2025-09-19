// Script para reinicializar todos los datos del sistema
// Ejecutar en la consola del navegador: 
// 1. Abrir DevTools (F12)
// 2. Ir a la pestaña Console
// 3. Copiar y pegar este código

console.log('🔄 Iniciando reinicialización de datos...');

// Primero intentar migrar datos existentes
try {
  if (typeof window !== 'undefined' && window.forceDataMigration) {
    window.forceDataMigration();
    console.log('✅ Datos migrados exitosamente');
  }
} catch (error) {
  console.log('⚠️ No se pudo migrar datos, procediendo con limpieza completa');
}

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

console.log('🎉 Datos limpiados exitosamente!');
console.log('📝 Ahora recarga la página para que se generen los nuevos datos:');
console.log('   - 100 estudiantes');
console.log('   - 50 padres');
console.log('   - 10 docentes');
console.log('   - 5 clases (20 estudiantes por clase)');
console.log('   - Tareas, notas, asistencia y pagos generados automáticamente');
console.log('');
console.log('🔄 Recarga la página ahora con Ctrl+F5 o Cmd+Shift+R');
