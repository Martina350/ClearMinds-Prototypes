# Instrucciones de Prueba - EcoSolution Prototipo

## 🚀 Inicio Rápido

### 1. Ejecutar la Aplicación
```bash
npm start
# o
yarn start
```

### 2. Probar en Dispositivo
- Instalar **Expo Go** desde App Store/Google Play
- Escanear el código QR que aparece en la terminal
- La aplicación se abrirá automáticamente

## 👤 Usuarios de Prueba

### Clientes
| Email | Contraseña | País | Servicios Disponibles |
|-------|------------|------|----------------------|
| juan@test.com | 12345 | Ecuador | Baños Portátiles, Pozos Sépticos, Trampas de Grasa |
| john@test.com | 12345 | USA | Limpieza de Basureros, Recolección de Escombros, Baños Portátiles |

### Administrador
| Email | Contraseña | Acceso |
|-------|------------|--------|
| admin@ecosolution.com | admin123 | Panel Administrativo Completo |

## 📱 Flujo de Prueba - Cliente

### 1. Registro de Nuevo Usuario
1. Abrir la aplicación
2. Tocar "Regístrate aquí"
3. Completar formulario:
   - País: Ecuador o USA
   - Nombre: Tu nombre
   - Email: email@test.com
   - Teléfono: +593987654321
   - Dirección: Dirección de prueba
   - Ciudad: Quito o New York
   - Estado: Pichincha o NY
   - Contraseña: 12345
4. Tocar "REGISTRARSE"
5. Será redirigido automáticamente a la pantalla de servicios

### 2. Explorar Servicios
1. En la pantalla "Servicios", verás los servicios disponibles según tu país
2. Cada servicio muestra:
   - Imagen representativa
   - Nombre del servicio
   - Descripción detallada
   - Precio
   - Botón "SOLICITAR SERVICIO"

### 3. Agendar un Servicio
1. Tocar "SOLICITAR SERVICIO" en cualquier servicio
2. Seleccionar tipo de cliente:
   - **Casa**: Duración estándar
   - **Empresa**: Duración extendida (1.5x)
3. Elegir fecha disponible (solo se muestran fechas futuras)
4. Seleccionar hora disponible
5. Tocar "SELECCIONAR Y CONTINUAR"

### 4. Realizar Pago
1. Revisar resumen del pedido
2. Elegir método de pago:
   - **Tarjeta**: Completar datos de tarjeta
   - **Transferencia**: Completar datos bancarios y subir comprobante
3. Tocar "CONFIRMAR PAGO"
4. El servicio se agendará automáticamente

### 5. Gestionar Servicios
1. Ir a "Mis Servicios"
2. Ver lista de servicios contratados
3. Filtrar por estado:
   - **Todos**: Todos los servicios
   - **Pendientes**: Servicios pendientes de confirmación
   - **Confirmados**: Servicios confirmados
   - **Completados**: Servicios finalizados

### 6. Perfil de Usuario
1. Ir a "Perfil"
2. Ver información del usuario
3. Opciones disponibles:
   - **Editar Perfil**: Modificar datos personales
   - **Cerrar Sesión**: Salir de la aplicación

## 🖥️ Flujo de Prueba - Administrador

### 1. Acceso Administrativo
1. En la pantalla de login, tocar "Acceso Administrador"
2. Ingresar credenciales:
   - Usuario: admin
   - Contraseña: admin123
3. Tocar "ACCEDER"

### 2. Dashboard Administrativo
1. Ver métricas principales:
   - Servicios Pendientes
   - Pagos por Validar
   - Agenda Semanal
   - Personal Activo
2. Revisar actividad reciente
3. Navegar entre secciones usando las pestañas

### 3. Gestión de Servicios
1. Ir a pestaña "Servicios"
2. Ver lista de todos los servicios solicitados
3. Filtrar por estado
4. Tocar "VER DETALLES" para ver información completa
5. Acciones disponibles:
   - Asignar técnico
   - Reprogramar servicio
   - Aprobar/Rechazar

### 4. Validación de Pagos
1. Ir a pestaña "Pagos"
2. Ver transferencias pendientes de validación
3. Revisar comprobantes adjuntos
4. Aprobar o rechazar pagos
5. Los servicios se actualizarán automáticamente

## 🧪 Casos de Prueba Específicos

### Caso 1: Servicio para Casa
1. Login como juan@test.com
2. Seleccionar "Baños Portátiles"
3. Tipo: Casa
4. Fecha: Cualquier fecha disponible
5. Hora: 09:00
6. Pago: Tarjeta (datos ficticios)
7. **Resultado esperado**: Servicio confirmado inmediatamente

### Caso 2: Servicio para Empresa
1. Login como john@test.com
2. Seleccionar "Limpieza de Basureros"
3. Tipo: Empresa
4. Fecha: Cualquier fecha disponible
5. Hora: 14:00
6. Pago: Transferencia
7. **Resultado esperado**: Servicio pendiente hasta validación

### Caso 3: Validación de Pago
1. Login como admin@ecosolution.com
2. Ir a "Pagos"
3. Ver transferencia pendiente
4. Tocar "Validar"
5. **Resultado esperado**: Servicio cambia a "confirmado"

### Caso 4: Filtros de Servicios
1. En "Mis Servicios"
2. Probar filtros:
   - Todos: Muestra todos los servicios
   - Pendientes: Solo servicios pendientes
   - Confirmados: Solo servicios confirmados
   - Completados: Solo servicios completados

## 🔍 Validaciones a Probar

### Formularios
- **Email**: Probar formatos válidos e inválidos
- **Teléfono**: Probar números válidos e inválidos
- **Campos requeridos**: Dejar campos vacíos
- **Contraseñas**: Verificar coincidencia

### Navegación
- **Botones de regreso**: Funcionan correctamente
- **Navegación entre pestañas**: Cambio fluido
- **Estados de pantalla**: Mantenimiento de estado

### Datos
- **Servicios por país**: Solo se muestran servicios del país del usuario
- **Horarios disponibles**: Solo se muestran horarios libres
- **Precios**: Correctos según el país
- **Estados**: Actualización en tiempo real

## 🐛 Problemas Conocidos

1. **Iconos**: Algunos iconos pueden no mostrarse correctamente en todos los dispositivos
2. **Navegación**: La navegación entre pantallas puede requerir ajustes menores
3. **Validaciones**: Algunas validaciones pueden necesitar refinamiento

## 📝 Notas Importantes

- **Datos de prueba**: Todos los datos se almacenan localmente
- **Persistencia**: Los datos se mantienen durante la sesión
- **Offline**: La aplicación funciona sin conexión a internet
- **Responsive**: Optimizada para dispositivos móviles

## 🎯 Objetivos de Prueba

1. **Funcionalidad**: Todas las características funcionan correctamente
2. **UI/UX**: Interfaz intuitiva y fácil de usar
3. **Navegación**: Flujo lógico entre pantallas
4. **Validaciones**: Mensajes de error claros y útiles
5. **Responsive**: Funciona en diferentes tamaños de pantalla

## 📞 Soporte

Si encuentras algún problema durante las pruebas:
1. Verificar que todas las dependencias estén instaladas
2. Reiniciar el servidor de desarrollo
3. Limpiar caché de Expo Go
4. Revisar la consola para errores

---

**¡Disfruta probando el prototipo de EcoSolution! 🌱**
