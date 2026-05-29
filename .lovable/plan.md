# Rediseño Mobile-First: Acento Accesible

Convertir el prototipo en una app nativa para smartphone (iOS/Android style), enfocada en accesibilidad para adultos mayores y personas con discapacidad motriz. Se eliminan vistas desktop, dashboard administrativo y landing.

## Paleta y tipografía (ajuste a src/styles.css)

- Fondo: blanco roto `oklch(0.99 0.003 240)` y grises claros.
- Brand: azul petróleo `#0e7490` (oklch ~0.55 0.09 220).
- Acento: verde accesible `#16a34a` (oklch ~0.66 0.16 152).
- Alerta: ámbar suave; Error: rojo desaturado.
- Tipografía: Public Sans, tamaños base aumentados (body 17px, títulos 28–32px, botones 17px medium).
- Radios grandes (rounded-2xl/3xl), sombras suaves, mucho whitespace.
- Targets táctiles mínimos 48×48px; inputs altura 56px; CTA principal 56px.

## Arquitectura de rutas (src/routes/)

Reemplaza la estructura actual. Todo se renderiza dentro de un "phone frame" centrado en desktop pero ocupa toda la pantalla en móvil real.

```text
__root.tsx            shell con frame móvil + bottom nav condicional
splash.tsx            / -> redirige aquí en primera carga (logo animado)
onboarding.tsx        3 pasos con paginador
encuesta.tsx          preferencias de accesibilidad (silla, bastón, baja visión, etc.)
index.tsx             /mapa - pantalla principal con mapa full-screen
reportar.tsx          flujo de reporte (foto + ubicación + categoría)
rutas.tsx             buscar ruta accesible (origen/destino, resultados)
alertas.tsx           alertas cercanas (lista + badges severidad)
perfil.tsx            perfil + historial de reportes + insignias
```

Se eliminan: `comercios.tsx`, `inteligencia.tsx` (dashboard).

Flujo de primer uso: splash → onboarding → encuesta → mapa. Persistencia con `localStorage` (`aa.onboarded`, `aa.profile`).

## Componentes clave (src/components/)

- `PhoneFrame`: contenedor que en `md+` muestra el contenido dentro de un marco de teléfono centrado; en móvil ocupa 100dvh.
- `BottomNav`: 5 tabs fijos (Mapa, Reportar, Rutas, Alertas, Perfil), iconos 24px + label 11px, alto 72px + safe-area-inset-bottom, el botón central "Reportar" elevado y destacado (estilo Uber/Instagram).
- `TopBar`: barra superior translúcida con título contextual y botón retroceso.
- `FloatingCard`: tarjeta flotante sobre el mapa (bottom sheet estático) con handle, padding generoso.
- `BottomSheet`: hoja deslizable con 2 snap points (peek 30% / expanded 75%).
- `BigButton`: CTA primario 56px, alto contraste, ícono opcional izquierdo.
- `SearchPill`: input redondeado tipo Apple Maps con ícono lupa y micrófono.
- `AlertCard`, `ReportCard`, `RouteCard`: tarjetas grandes con jerarquía clara.
- `Stepper`: indicador de pasos para onboarding/reportar.
- `MapCanvas`: reemplaza `MapShell`, ocupa full-screen, con marcadores grandes (accesible / barrera / alerta) y FAB de "centrar en mi ubicación".

Componentes a eliminar: `site-header.tsx`, `mobile-tabbar.tsx` (reemplazado), `kpi-card.tsx`, `business-card.tsx`.

## Pantallas — detalle

1. **Splash** (`/splash`): fondo blanco, logo "Acento Accesible" (símbolo + wordmark), tagline corta, transición automática a 1.5s. Genero ilustración del logo.
2. **Onboarding** (`/onboarding`): 3 slides — "Rutas que respetan tu paso", "Reporta barreras en segundos", "Comunidad que valida". Cada slide ilustración + título grande + texto corto. Botones "Saltar" / "Siguiente"; el último dice "Comenzar".
3. **Encuesta** (`/encuesta`): preguntas con chips grandes seleccionables — "¿Cómo te mueves?" (silla manual, silla eléctrica, andador, bastón, sin ayuda), "¿Qué evitar?" (escaleras, pendientes, banquetas rotas). CTA "Personalizar mi mapa".
4. **Mapa** (`/`): mapa ocupa 100% de la pantalla. Top: search pill flotante "¿A dónde vamos?" + chip de filtro accesibilidad. Bottom sheet peek con "Cerca de ti" (3 alertas próximas) + CTA grande "Buscar ruta accesible". FAB derecha: ubicación. Marcadores teal/ámbar/verde.
5. **Reportar** (`/reportar`): 3 pasos — (a) elegir categoría con grid 2×3 de iconos grandes (rampa faltante, banqueta rota, obstáculo, semáforo, baño, otro), (b) confirmar ubicación en mini-mapa + agregar foto (placeholder cámara), (c) confirmación con animación check y "Tu reporte ayudará a +12 personas hoy".
6. **Rutas** (`/rutas`): inputs origen/destino apilados, lista de rutas resultantes con score de accesibilidad, tiempo, # rampas, pendiente. Tap → detalle con paso a paso accesible.
7. **Alertas** (`/alertas`): lista cronológica de alertas cercanas con severidad por color, distancia, tiempo. Pull-to-refresh visual.
8. **Perfil** (`/perfil`): avatar grande + nombre + nivel (Colaborador, Validador, Guardián). Barra de progreso. Sección "Mi impacto" (reportes, rutas optimizadas, personas ayudadas). Lista "Mis reportes" (historial con estado validado/pendiente). Acceso a "Mis preferencias" (re-abre encuesta).

## Patrones de accesibilidad reforzados

- Contraste AAA en CTAs principales.
- Estados `focus-visible` con outline azul petróleo 3px.
- Soporte `prefers-reduced-motion`.
- Texto escalable (uso de rem); botones nunca por debajo de 48px.
- Labels visibles + `aria-label` en iconos.
- Bottom nav con `aria-current` y labels siempre visibles (no solo iconos).

## Assets a generar (imagegen)

- Logo "Acento Accesible" (símbolo wayfinding + tipografía).
- 3 ilustraciones de onboarding (estilo plano, paleta de marca).
- Fondo de mapa estilizado (Apple Maps-like, tonos crema/teal) — reemplaza `map-city.jpg`.
- Avatar por defecto.

## Cambios técnicos puntuales

- `styles.css`: nuevos tokens, tamaños base, utilidad `.safe-bottom` (`padding-bottom: env(safe-area-inset-bottom)`), animación de check y fade de splash.
- `__root.tsx`: envolver Outlet en `PhoneFrame`, mover `<main>` ahí, ocultar `BottomNav` en `/splash`, `/onboarding`, `/encuesta`.
- `routeTree.gen.ts`: regenerado automáticamente al crear/borrar rutas.
- Eliminar imports y assets de comercios/inteligencia.
- Mock data ajustado: quitar `businesses`, agregar `alerts` y `routes`.

## Fuera de alcance

- Mapas reales (Mapbox/Leaflet) — se mantiene imagen estilizada + SVG markers.
- Cámara real / geolocalización real — se simulan.
- Backend, auth, persistencia más allá de `localStorage`.
- Modo oscuro completo (se deja base, no se pule).

## Resultado esperado

Una experiencia que se siente como una app nativa: splash → onboarding → encuesta → mapa full-screen con bottom nav de 5 tabs, todas las pantallas con tarjetas flotantes, tipografía grande y CTAs grandes, lista para presentar como prototipo de App Store/Play Store.
