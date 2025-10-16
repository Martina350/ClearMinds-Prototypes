# Guía de Desarrollo - Recaudadora Móvil

Esta guía te ayudará a entender cómo trabajar con el proyecto y seguir agregando funcionalidades.

## 📚 Conceptos Básicos de Clean Architecture

### ¿Qué es Clean Architecture?

Clean Architecture es un patrón de diseño que separa el código en **capas concéntricas**, donde las capas internas no conocen a las externas. Esto hace que:

- ✅ El código sea más fácil de mantener
- ✅ Puedas cambiar tecnologías sin afectar la lógica de negocio
- ✅ Puedas probar cada parte de forma independiente
- ✅ El proyecto sea escalable y profesional

### Las Capas del Proyecto

#### 1. 🎯 **Domain** (Dominio - El Corazón)
**Ubicación**: `src/domain/`

Esta es la capa más importante y más interna. Contiene:

- **Entidades** (`entities/`): Las "cosas" principales de tu negocio
  - Ejemplo: `Cliente`, `Cuenta`, `Transaccion`
  - Son clases con sus propiedades y validaciones
  - No dependen de NADA externo (ni React, ni Expo, ni nada)

- **Repositorios** (`repositories/`): Interfaces (contratos) que definen CÓMO acceder a los datos
  - Ejemplo: `IClienteRepository` define que puedes guardar, buscar, eliminar clientes
  - Solo son interfaces (TypeScript), sin implementación real
  
- **Servicios** (`services/`): Interfaces de servicios externos
  - Ejemplo: `ILocationService` para GPS, `IPrintService` para impresión
  - También solo interfaces, sin código de implementación

**Regla de Oro**: Esta capa NO puede importar nada de las otras capas.

#### 2. 📋 **Application** (Aplicación - La Orquestación)
**Ubicación**: `src/application/`

Contiene los **Casos de Uso** (Use Cases):

- Cada caso de uso representa una acción que el usuario puede hacer
- Ejemplos:
  - `CrearClienteUseCase`: Crea un cliente nuevo
  - `RealizarDepositoUseCase`: Realiza un depósito
  - `AbrirCuentaUseCase`: Abre una cuenta

**Estructura de un Caso de Uso**:
```typescript
export class CrearClienteUseCase {
  constructor(
    private clienteRepository: IClienteRepository,
    private referenciaRepository: IReferenciaPersonalRepository,
    private locationService: ILocationService
  ) {}

  async execute(dto: CrearClienteDTO): Promise<Cliente> {
    // 1. Validar
    // 2. Obtener datos si es necesario
    // 3. Crear entidades
    // 4. Guardar usando repositorios
    // 5. Retornar resultado
  }
}
```

**Regla**: Los casos de uso dependen del dominio (interfaces), pero no de infraestructura ni presentación.

#### 3. 🔧 **Infrastructure** (Infraestructura - Las Implementaciones)
**Ubicación**: `src/infrastructure/`

Aquí va el código que interactúa con tecnologías específicas:

- **Persistence** (`persistence/`): Almacenamiento de datos
  - `AsyncStorageAdapter`: Adaptador para guardar datos localmente
  - `ClienteRepositoryImpl`: Implementación REAL del `IClienteRepository`
  
- **Location** (`location/`): GPS
  - `ExpoLocationService`: Implementación usando Expo Location
  
- **Printing** (`printing/`): Impresión
  - `PrintServiceImpl`: Implementación usando Expo Print

**Importante**: Estas clases IMPLEMENTAN las interfaces del dominio.

#### 4. 🎨 **Presentation** (Presentación - La UI)
**Ubicación**: `src/presentation/`

Todo lo relacionado con React Native:

- **Screens** (`screens/`): Las pantallas completas
  - `HomeScreen`: Pantalla principal
  - `DashboardScreen`: Dashboard de actividades
  
- **Components** (`components/`): Componentes reutilizables
  - `Button`, `Card`, `Input`: Componentes UI
  
- **Navigation** (`navigation/`): Configuración de navegación
  - `AppNavigator`: Define las rutas de la app

**Regla**: Esta capa solo muestra información y captura acciones del usuario. La lógica real está en los casos de uso.

## 🔄 Flujo de Datos

```
Usuario → Screen → Caso de Uso → Repositorio → AsyncStorage
                                ↓
                            Validación (Entidad)
```

### Ejemplo Práctico: Crear un Cliente

1. **Usuario** llena un formulario en `CrearClienteScreen`
2. **Screen** llama a `DependencyContainer.getCrearClienteUseCase()`
3. **Caso de Uso** (`CrearClienteUseCase`):
   - Valida los datos
   - Crea la entidad `Cliente` (que auto-valida)
   - Llama al repositorio para guardar
   - Obtiene GPS si es necesario
   - Guarda referencias personales
4. **Repositorio** (`ClienteRepositoryImpl`) guarda en AsyncStorage
5. **Screen** muestra mensaje de éxito

## 🛠️ Cómo Agregar una Nueva Funcionalidad

### Ejemplo: Agregar "Editar Cliente"

#### Paso 1: Crear el Caso de Uso
```typescript
// src/application/use-cases/EditarClienteUseCase.ts
export class EditarClienteUseCase {
  constructor(private clienteRepository: IClienteRepository) {}

  async execute(id: UUID, datos: EditarClienteDTO): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) throw new Error('Cliente no encontrado');
    
    // Crear cliente actualizado
    const clienteActualizado = new Cliente(
      cliente.id,
      datos.cedula || cliente.cedula,
      datos.nombres || cliente.nombres,
      // ... resto de campos
    );
    
    await this.clienteRepository.guardar(clienteActualizado);
    return clienteActualizado;
  }
}
```

#### Paso 2: Agregar al Contenedor de Dependencias
```typescript
// src/shared/di/DependencyContainer.ts
static getEditarClienteUseCase(): EditarClienteUseCase {
  if (!this.editarClienteUseCase) {
    this.editarClienteUseCase = new EditarClienteUseCase(
      this.clienteRepository
    );
  }
  return this.editarClienteUseCase;
}
```

#### Paso 3: Crear la Pantalla
```typescript
// src/presentation/screens/EditarClienteScreen.tsx
export const EditarClienteScreen = ({ route }) => {
  const { clienteId } = route.params;
  
  const handleEditar = async (datos) => {
    const useCase = DependencyContainer.getEditarClienteUseCase();
    await useCase.execute(clienteId, datos);
    // Navegar de vuelta o mostrar mensaje
  };
  
  return (
    <View>
      {/* Formulario aquí */}
    </View>
  );
};
```

## 📝 Implementaciones Pendientes

Actualmente el proyecto tiene la estructura completa, pero faltan implementar algunos repositorios:

### Por Hacer:
1. **Repositorios faltantes**:
   - `CuentaRepositoryImpl`
   - `TransaccionRepositoryImpl`
   - `CobranzaRepositoryImpl`
   - `AgenteRepositoryImpl`
   - `ReferenciaPersonalRepositoryImpl`

2. **Pantallas faltantes**:
   - `CrearCuentaScreen` (para abrir cuentas)
   - `DepositoScreen` (para depósitos)
   - `CobroScreen` (para cobros)
   - `ConsultaScreen` (para buscar clientes)
   - `LoginScreen` (autenticación)

3. **Servicios**:
   - Implementación de `IAuthService`
   - Implementación de `ISyncService` (sincronización con servidor)

## 💡 Consejos para Desarrolladores Junior

### 1. Siempre sigue el flujo de capas
- ✅ Presentation → Application → Domain → Infrastructure
- ❌ No saltes capas ni mezcles responsabilidades

### 2. Piensa en contratos (interfaces)
- Primero define QUÉ necesitas (interfaz)
- Luego implementa CÓMO lo harás (clase)

### 3. Cada clase tiene UNA responsabilidad
- `Cliente` solo representa un cliente
- `CrearClienteUseCase` solo crea clientes
- `ClienteRepositoryImpl` solo guarda/recupera clientes

### 4. Usa TypeScript a tu favor
- Define tipos e interfaces
- El compilador te ayudará a no olvidar nada

### 5. Valida siempre
- En las entidades (en el constructor)
- En los casos de uso (antes de procesar)
- En la UI (para mejorar la experiencia)

## 🧪 Cómo Probar

```bash
# Instalar dependencias
npm install

# Ejecutar la app
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## 📚 Recursos Adicionales

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)

---

**¡Recuerda!** La arquitectura puede parecer compleja al principio, pero hace que el código sea mucho más mantenible y profesional a largo plazo. Tómate tu tiempo para entender cada capa. 🚀

