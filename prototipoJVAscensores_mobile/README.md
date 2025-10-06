# Prototipo Móvil OTs (Expo)

## Ejecutar

- npm install
- npm start

Abre con Expo Go en tu dispositivo.

## Funcionalidades clave

- Ruta del día con mapa (WebView + Leaflet)
- Check-in con validación de geofence (100 m) y override de prototipo
- Checklist dinámico (bool, texto, número, foto)
- Firma digital
- Check-out y Cierre (PDF generado y compartir)
- Emergencias (simular) y Reprogramaciones (simular)
- Cola offline en memoria con prioridades
- Modo claro/oscuro (Ajustes)

## Estructura

- src/
  - domain/           (modelos y lógica pura – haversine)
  - infra/mock/       (datos quemados – OTs y plantillas)
  - application/      (cola de sincronización en memoria)
  - ui/
    - components/     (Screen, AppText, AppButton, Card, Input, Icon)
    - screens/        (Home, Detalle, Check-in, Checklist, Firma, Checkout, Cierre, Historial, Ajustes)
    - navigation/     (RootNavigator)
    - providers/      (Bootstrap)
    - state/          (AppState – cola, banner, tema)
    - theme/          (tokens de diseño y tema)
    - utils/          (responsive)

## Diseño

- Tokens (tema claro/oscuro): colores, espaciado, radios, tipografías
- Componentes base: consistencia en márgenes, fuentes y botones
- Responsivo: layouts fluidos; WebView alto fijo en móvil y escalable en tablet

## Simulaciones

- Emergencia: Home → “Simular EMERGENCIA” → abre la OT creada y encola evento
- Reprogramación: Home → “Simular REPROG” (prioriza una OT en la lista)

## Notas

- Este prototipo usa datos quemados; no hay backend.
- Para mapas nativos usar `expo-maps` en builds precompiladas; aquí utilizamos WebView.
