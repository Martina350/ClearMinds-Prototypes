# Sistema de Gestión de Referidos

## 📋 Descripción
Prototipo web para la gestión de estudiantes referidos y cálculo de comisiones para docentes. El sistema permite a los docentes registrar estudiantes referidos y a los administradores gestionar las comisiones generadas.

## 🚀 Características Principales

### 👩‍🏫 Panel Docente
- **Login seguro** con credenciales de docente
- **Dashboard con métricas**:
  - Número de estudiantes referidos
  - Número de estudiantes inscritos
  - Comisión pendiente y pagada
- **Registro de referidos** con datos completos
- **Gestión de estados** (pendiente/inscrito)
- **Historial de pagos** recibidos

### 🛠️ Panel Administrador
- **Login administrativo** con acceso completo
- **Métricas generales**:
  - Total de docentes registrados
  - Docentes activos
  - Total de referidos
  - Comisiones totales
- **Gestión de comisiones**:
  - Cálculo automático de comisiones
  - Marcado de pagos como realizados
  - Registro de pagos con comprobantes
- **Filtros y reportes** por docente, asignatura y estado
- **Exportar/Importar datos** para respaldo

## 🎯 Funcionalidades Técnicas
- **Autenticación dual** (Docente/Administrador)
- **Almacenamiento local** con localStorage
- **Diseño responsive** para PC, tablet y móvil
- **Interfaz moderna** con animaciones y notificaciones
- **Cálculo automático** de comisiones ($10 por estudiante inscrito)

## 🔐 Credenciales de Prueba

### Docente
- **Usuario:** `docente1`
- **Contraseña:** `123`

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📱 Cómo Usar

### 1. Acceso al Sistema
1. Abrir `index.html` en cualquier navegador web
2. Seleccionar el tipo de usuario (Docente/Administrador)
3. Ingresar las credenciales correspondientes

### 2. Panel Docente
1. **Registrar Referido:**
   - Completar formulario con datos del estudiante
   - Seleccionar asignatura (Inglés, Matemáticas, Robótica, Programación)
   - El sistema calcula automáticamente la fecha

2. **Gestionar Estados:**
   - Cambiar estado de estudiante entre "pendiente" e "inscrito"
   - Las comisiones se calculan automáticamente

3. **Ver Métricas:**
   - Dashboard muestra estadísticas en tiempo real
   - Historial de pagos recibidos

### 3. Panel Administrador
1. **Ver Métricas Generales:**
   - Estadísticas de todo el sistema
   - Docentes activos y comisiones totales

2. **Gestionar Comisiones:**
   - Ver comisiones pendientes por docente
   - Marcar pagos como realizados
   - Registrar pagos manuales

3. **Filtrar y Reportar:**
   - Filtrar por docente, asignatura o estado
   - Exportar datos para respaldo
   - Importar datos desde archivo JSON

## 🎨 Asignaturas Disponibles
- **Inglés** - Clases de idioma inglés
- **Matemáticas** - Cursos de matemáticas
- **Robótica** - Programación y robótica
- **Programación** - Desarrollo de software

## 💰 Sistema de Comisiones
- **$10 USD** por cada estudiante inscrito
- **Cálculo automático** basado en estado del estudiante
- **Seguimiento de pagos** pendientes y realizados
- **Historial completo** de transacciones

## 🔧 Tecnologías Utilizadas
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Funcionalidad interactiva
- **LocalStorage** - Persistencia de datos
- **Font Awesome** - Iconografía

## 📊 Datos de Ejemplo
El sistema incluye datos de demostración:
- 3 docentes de prueba
- Estudiantes referidos en diferentes asignaturas
- Historial de pagos de ejemplo
- Estados variados (pendiente/inscrito)

## 🚀 Instalación y Uso
1. **Descargar archivos:**
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Abrir en navegador:**
   - Hacer doble clic en `index.html`
   - O arrastrar a una ventana del navegador

3. **¡Listo para usar!**
   - No requiere instalación adicional
   - Funciona offline
   - Datos se guardan localmente

## 🔄 Funcionalidades Avanzadas
- **Exportar datos** en formato JSON
- **Importar datos** desde archivo
- **Filtros dinámicos** en todas las tablas
- **Notificaciones** de acciones realizadas
- **Diseño adaptativo** para móviles

## 📈 Escalabilidad
El sistema está diseñado para:
- Agregar nuevos roles de usuario
- Incluir más asignaturas
- Modificar sistema de comisiones
- Integrar con bases de datos externas
- Añadir funcionalidades de reportes avanzados

## 🎯 Casos de Uso
1. **Docente refiere 20 estudiantes**
2. **10 se inscriben efectivamente**
3. **Sistema calcula: 10 × $10 = $100**
4. **Admin marca pago como realizado**
5. **Docente ve comisión como pagada**

## 📞 Soporte
Para dudas o mejoras, revisar el código fuente comentado en `script.js` donde se explican todas las funcionalidades implementadas.

---
**Sistema de Gestión de Referidos - Prototipo Web**
