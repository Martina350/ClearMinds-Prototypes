# Arquitectura del Proyecto - Recaudadora Móvil

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  (React Native Components, Screens, Navigation)                 │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ HomeScreen   │  │  Dashboard   │  │   Buttons    │          │
│  │              │  │    Screen    │  │   Cards      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                          ↓                                       │
└───────────────────────────┼──────────────────────────────────────┘
                            ↓
┌───────────────────────────┼──────────────────────────────────────┐
│                   APPLICATION LAYER                              │
│                    (Use Cases)                                   │
│                          ↓                                       │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ CrearCliente    │  │ AbrirCuenta  │  │ Realizar     │       │
│  │ UseCase         │  │ UseCase      │  │ Deposito     │       │
│  └─────────────────┘  └──────────────┘  └──────────────┘       │
│                          ↓                                       │
└───────────────────────────┼──────────────────────────────────────┘
                            ↓
┌───────────────────────────┼──────────────────────────────────────┐
│                      DOMAIN LAYER                                │
│              (Business Logic - Framework Independent)            │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────┐           │
│  │  ENTITIES (Pure Business Objects)                │           │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │           │
│  │  │ Cliente  │ │  Cuenta  │ │Transacción        │           │
│  │  └──────────┘ └──────────┘ └──────────┘        │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐           │
│  │  INTERFACES (Contracts)                          │           │
│  │  ┌────────────────────┐  ┌─────────────────┐   │           │
│  │  │ IClienteRepository │  │ ILocationService│   │           │
│  │  │ ICuentaRepository  │  │ IPrintService   │   │           │
│  │  └────────────────────┘  └─────────────────┘   │           │
│  └──────────────────────────────────────────────────┘           │
│                          ↑                                       │
└───────────────────────────┼──────────────────────────────────────┘
                            ↑ (implements)
┌───────────────────────────┼──────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                           │
│          (Technical Implementations - Framework Specific)        │
│                          ↑                                       │
│  ┌─────────────────────┐  ┌──────────────────┐                 │
│  │ ClienteRepository   │  │ ExpoLocation     │                 │
│  │ Impl (AsyncStorage) │  │ Service          │                 │
│  └─────────────────────┘  └──────────────────┘                 │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────┐                 │
│  │ AsyncStorage        │  │ Expo Print       │                 │
│  │ Adapter             │  │ Service          │                 │
│  └─────────────────────┘  └──────────────────┘                 │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Dependencias

### Regla de Dependencia
Las dependencias siempre apuntan HACIA ADENTRO:

```
Presentation → Application → Domain ← Infrastructure
```

- ✅ Presentation conoce Application y Domain
- ✅ Application conoce Domain
- ✅ Infrastructure conoce Domain
- ❌ Domain NO conoce a nadie (es independiente)

## 🎯 Responsabilidades por Capa

### 1. Domain Layer (Dominio)
**Responsabilidad**: Contener la lógica de negocio pura

**Contiene**:
- ✅ Entidades con sus reglas de negocio
- ✅ Interfaces de repositorios
- ✅ Interfaces de servicios
- ❌ NO contiene código de React, Expo, AsyncStorage, etc.

**Ejemplo**:
```typescript
// Cliente.ts - Entidad pura
export class Cliente {
  constructor(
    public readonly id: UUID,
    public readonly cedula: string,
    public readonly nombres: string,
    // ...
  ) {
    this.validar(); // Lógica de negocio
  }
  
  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }
}
```

### 2. Application Layer (Aplicación)
**Responsabilidad**: Orquestar casos de uso

**Contiene**:
- ✅ Casos de uso (acciones del usuario)
- ✅ DTOs (Data Transfer Objects)
- ❌ NO contiene UI ni implementaciones técnicas

**Ejemplo**:
```typescript
// CrearClienteUseCase.ts
export class CrearClienteUseCase {
  constructor(
    private clienteRepository: IClienteRepository,
    private locationService: ILocationService
  ) {}
  
  async execute(dto: CrearClienteDTO): Promise<Cliente> {
    // 1. Validar
    // 2. Crear entidad
    // 3. Guardar usando repositorio
    // 4. Retornar resultado
  }
}
```

### 3. Infrastructure Layer (Infraestructura)
**Responsabilidad**: Implementar las interfaces del dominio usando tecnologías específicas

**Contiene**:
- ✅ Implementaciones de repositorios (AsyncStorage, SQLite, API)
- ✅ Implementaciones de servicios (Expo Location, Expo Print)
- ✅ Adaptadores para bibliotecas externas

**Ejemplo**:
```typescript
// ClienteRepositoryImpl.ts
export class ClienteRepositoryImpl implements IClienteRepository {
  constructor(private storage: AsyncStorageAdapter) {}
  
  async guardar(cliente: Cliente): Promise<void> {
    await this.storage.guardar(`cliente_${cliente.id}`, cliente);
  }
}
```

### 4. Presentation Layer (Presentación)
**Responsabilidad**: Mostrar información y capturar acciones del usuario

**Contiene**:
- ✅ Componentes React Native
- ✅ Pantallas
- ✅ Navegación
- ✅ Hooks personalizados
- ❌ NO contiene lógica de negocio compleja

**Ejemplo**:
```typescript
// HomeScreen.tsx
export const HomeScreen = ({ navigation }) => {
  const handleCrearCliente = async (datos) => {
    const useCase = DependencyContainer.getCrearClienteUseCase();
    await useCase.execute(datos);
    navigation.goBack();
  };
  
  return <View>{/* UI aquí */}</View>;
};
```

## 🔌 Inyección de Dependencias

Usamos un **DependencyContainer** que:

1. Crea las implementaciones concretas
2. Las inyecta en los casos de uso
3. Proporciona acceso centralizado

```typescript
// Inicialización
DependencyContainer.initialize();

// Uso en componentes
const useCase = DependencyContainer.getCrearClienteUseCase();
const resultado = await useCase.execute(datos);
```

## 📊 Ventajas de esta Arquitectura

### 1. Testabilidad
- Puedes probar la lógica de negocio sin UI
- Puedes hacer mocks fácilmente

### 2. Mantenibilidad
- Cambios en una capa no afectan otras
- Código organizado y predecible

### 3. Escalabilidad
- Fácil agregar nuevas funcionalidades
- Estructura clara para equipos grandes

### 4. Independencia de Frameworks
- Puedes cambiar React Native por otra tecnología
- La lógica de negocio permanece intacta

### 5. Reutilización
- Los casos de uso pueden usarse en web, mobile, etc.
- Las entidades son compartibles

## 🎓 Principios SOLID Aplicados

### Single Responsibility (Responsabilidad Única)
- Cada clase tiene UNA razón para cambiar
- `CrearClienteUseCase` solo crea clientes

### Open/Closed (Abierto/Cerrado)
- Abierto para extensión, cerrado para modificación
- Puedes agregar nuevos repositorios sin modificar los existentes

### Liskov Substitution (Sustitución de Liskov)
- Cualquier implementación de `IClienteRepository` funciona igual
- Puedes cambiar AsyncStorage por SQLite sin romper nada

### Interface Segregation (Segregación de Interfaces)
- Interfaces pequeñas y específicas
- `ILocationService` solo para GPS, no mezcla otras cosas

### Dependency Inversion (Inversión de Dependencias)
- Dependemos de abstracciones (interfaces), no de implementaciones
- Los casos de uso dependen de `IClienteRepository`, no de `ClienteRepositoryImpl`

## 📚 Ejemplo Completo: Crear Cliente

### 1. Usuario llena formulario (Presentation)
```typescript
// CrearClienteScreen.tsx
const [datos, setDatos] = useState({ cedula: '', nombres: '' });

const handleSubmit = async () => {
  const useCase = DependencyContainer.getCrearClienteUseCase();
  const cliente = await useCase.execute(datos);
  console.log('Cliente creado:', cliente);
};
```

### 2. Caso de Uso orquesta (Application)
```typescript
// CrearClienteUseCase.ts
async execute(dto: CrearClienteDTO): Promise<Cliente> {
  const coordenadas = await this.locationService.obtenerCoordenadas();
  const cliente = new Cliente(id, dto.cedula, dto.nombres, ...);
  await this.clienteRepository.guardar(cliente);
  return cliente;
}
```

### 3. Entidad se valida (Domain)
```typescript
// Cliente.ts
constructor(...) {
  this.validar(); // Valida cédula, nombres, etc.
}
```

### 4. Repositorio guarda (Infrastructure)
```typescript
// ClienteRepositoryImpl.ts
async guardar(cliente: Cliente): Promise<void> {
  await this.storage.guardar(`cliente_${cliente.id}`, cliente);
}
```

---

**Esta arquitectura garantiza código profesional, mantenible y escalable.** 🚀

