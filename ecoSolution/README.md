# EcoSolution - Prototipo de App Móvil

## 📱 Descripción

EcoSolution es un prototipo funcional de aplicación móvil para servicios ambientales con panel administrativo. La aplicación permite a los clientes solicitar servicios como baños portátiles, limpieza de basureros, pozos sépticos, etc., y a los administradores gestionar todas las operaciones desde un panel web.

## 🚀 Características Principales

### Para Clientes
- **Registro y Login** por país (Ecuador/USA)
- **Catálogo de Servicios** filtrado por país
- **Sistema de Agendamiento** con validación de disponibilidad
- **Pagos Múltiples**: Tarjeta (USA) y Transferencia (Ecuador)
- **Gestión de Servicios** personales
- **Interfaz Mobile-First** optimizada para Android/iOS

### Para Administradores
- **Dashboard** con estadísticas en tiempo real
- **Gestión de Servicios** y reservas
- **Validación de Pagos** por transferencia
- **Calendario Global** con asignación de técnicos
- **Gestión de Zonas** y cobertura
- **Gestión de Personal** y precios

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive y animaciones
- **JavaScript ES6+** - Lógica de aplicación
- **Base de Datos Quemada** - JSON local para pruebas
- **Font Awesome** - Iconografía

## 📁 Estructura del Proyecto

```
ecoSolution/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica de la aplicación
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor web (funciona localmente)

### Instalación
1. Descarga o clona el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo! La aplicación está funcionando

### Acceso Rápido
- **URL Local**: `file:///ruta/al/proyecto/index.html`
- **Servidor Local** (opcional): Usa Live Server en VS Code o similar

## 👥 Usuarios de Prueba

### Clientes
```
Ecuador:
- Email: juan@test.com
- Contraseña: 12345

USA:
- Email: john@test.com
- Contraseña: 12345

Canadá:
- Email: marie@test.com
- Contraseña: 12345

Perú:
- Email: carlos@test.com
- Contraseña: 12345
```

### Administrador
```
- Usuario: admin
- Contraseña: admin123
```

## 🌍 Servicios por País

### Ecuador
- 🚽 **Baños Portátiles** - $100 (60 min)
- 🏗️ **Pozos Sépticos** - $150 (90 min)
- 🛠️ **Trampas de Grasa** - $200 (120 min)

### Estados Unidos
- 🗑️ **Limpieza de Basureros** - $80 (45 min)
- 🏗️ **Recolección de Escombros** - $300 (180 min)
- 🚽 **Baños Portátiles** - $120 (60 min)

### Canadá
- 🗑️ **Limpieza de Contenedores** - $90 (45 min)
- ♻️ **Recolección de Residuos** - $250 (120 min)
- 🚽 **Baños Portátiles** - $110 (60 min)

### Perú
- 🚽 **Baños Portátiles** - $80 (60 min)
- 🏗️ **Limpieza de Pozos Sépticos** - $120 (90 min)
- 🏗️ **Recolección de Escombros** - $180 (120 min)

## 📱 Flujo de Usuario

### 1. Registro/Login
- Selecciona tu país (Ecuador, USA, Canadá, Perú)
- Completa el formulario de registro
- O inicia sesión con credenciales existentes

### 2. Selección de Servicios
- Explora el catálogo de servicios
- Filtra por país si es necesario
- Haz clic en "Solicitar Servicio"

### 3. Agendamiento
- Selecciona tipo de cliente (Casa/Empresa)
- Elige fecha disponible
- Selecciona hora libre
- Continúa al pago

### 4. Pago
- **USA/Canadá**: Pago con tarjeta (procesamiento inmediato)
- **Ecuador/Perú**: Transferencia bancaria (validación manual)

### 5. Seguimiento
- Ve tus servicios en "Mis Servicios"
- Filtra por estado (Pendiente, Confirmado, Completado)
- Cancela servicios pendientes si es necesario

## 🔧 Panel Administrativo

### Dashboard
- Estadísticas en tiempo real
- Servicios pendientes
- Pagos por validar
- Agenda semanal
- Personal activo

### Gestión de Servicios
- Lista completa de reservas
- Aprobar/rechazar servicios
- Asignar técnicos
- Ver detalles completos

### Validación de Pagos
- Lista de transferencias pendientes
- Aprobar/rechazar pagos
- Cambiar estado de servicios

### Calendario Global
- Vista mensual de reservas
- Horarios ocupados/libres
- Asignación de técnicos

### Gestión de Zonas
- Habilitar/deshabilitar provincias/estados
- Control de cobertura de servicios

### Gestión de Personal
- Lista de técnicos
- Estados disponibles/ocupados
- Especialidades por técnico

### Gestión de Precios
- Editar precios por servicio y país
- Actualización en tiempo real

## 🎨 Características de Diseño

### Mobile-First
- Diseño optimizado para móviles
- Navegación táctil intuitiva
- Botones grandes y accesibles

### Responsive
- Adaptable a tablets y escritorio
- Grid system flexible
- Tipografía escalable

### UX/UI Moderna
- Colores vibrantes y profesionales
- Animaciones suaves
- Feedback visual inmediato
- Notificaciones toast

## 🔄 Base de Datos Quemada

La aplicación utiliza una base de datos simulada en JavaScript con:

```javascript
database = {
  users: [...],        // Usuarios y administradores
  services: [...],     // Catálogo de servicios
  bookings: [...],     // Reservas y citas
  staff: [...],        // Personal técnico
  zones: [...],        // Zonas de cobertura
  prices: [...]        // Precios por país
}
```

## 🚀 Preparado para Migración

El código está estructurado para facilitar la migración a:

- **React Native** - Componentes modulares
- **Expo** - Funcionalidades nativas
- **Firebase** - Base de datos en la nube
- **Stripe/PayPal** - Procesamiento de pagos real

## 🧪 Casos de Prueba

### Cliente Ecuador
1. Registrarse con país Ecuador
2. Solicitar "Baños Portátiles"
3. Agendar para mañana a las 10:00
4. Pagar por transferencia
5. Ver en "Mis Servicios" como pendiente

### Cliente USA/Canadá
1. Registrarse con país USA o Canadá
2. Solicitar servicio disponible
3. Agendar para empresa
4. Pagar con tarjeta
5. Ver servicio confirmado inmediatamente

### Cliente Perú
1. Registrarse con país Perú
2. Solicitar "Baños Portátiles"
3. Agendar para mañana a las 10:00
4. Pagar por transferencia
5. Ver en "Mis Servicios" como pendiente

### Administrador
1. Login con admin/admin123
2. Ver dashboard con estadísticas
3. Ir a "Pagos" y aprobar transferencias
4. Ir a "Servicios" y asignar técnicos
5. Ver calendario con reservas

## 🔧 Personalización

### Agregar Nuevos Servicios
Edita el array `services` en `app.js`:

```javascript
{
  id: 's7',
  country: 'Ecuador',
  name: 'Nuevo Servicio',
  description: 'Descripción del servicio',
  price: 150,
  duration: 90,
  coverage: ['Pichincha', 'Guayas'],
  image: '🔧',
  available: true
}
```

### Agregar Nuevos Países
1. Añade servicios en el array `services`
2. Actualiza opciones en formularios de registro
3. Agrega zonas en el array `zones`
4. Incluye precios en el array `prices`
5. Añade personal técnico en el array `staff`

### Modificar Precios
Usa el panel administrativo o edita directamente el array `prices`

## 📞 Soporte

Para soporte técnico o consultas:
- Revisa este README
- Verifica la consola del navegador para errores
- Asegúrate de usar un navegador moderno

## 📄 Licencia

Este es un prototipo de demostración. Todos los derechos reservados.

---

**¡Disfruta explorando EcoSolution! 🌱**
