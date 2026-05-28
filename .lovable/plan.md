# Acento Accesible — Prototipo navegable

Prototipo de alta fidelidad con datos simulados (sin backend) basado en la dirección "Civic Feed": tipografía Public Sans, color brand teal `#0d9488`, superficies blancas con `ring-1 ring-black/5` y radios generosos (20-24px).

## Arquitectura de rutas (TanStack Start)

```
src/routes/
  __root.tsx              Layout global: nav superior con badge "CDMX • En vivo" y avatar
  index.tsx               Mapa Ciudadano (vista principal del feed cívico)
  reportar.tsx            Flujo de Reporte Ciudadano (módulo 2)
  comercios.tsx           Directorio Sello de Ciudad Inclusiva (módulo 3)
  inteligencia.tsx        Dashboard de Inteligencia Urbana (módulo 4)
  perfil.tsx              Perfil con gamificación (módulo 5)
```

Cada ruta con su propio `head()` (title, description, og). Navegación principal en el header: "Mapa Ciudadano" e "Inteligencia Urbana" + links secundarios a Reportar, Comercios, Perfil.

## Módulos

**1. Motor de Navegación (`/`)** — Layout 4/8 columnas del prototipo aprobado:
- Panel izquierdo: buscador Origen/Destino, botón "Buscar ruta accesible", feed "Reportes Cercanos" en vivo (obras, rampas, elevadores) con timestamps y badges de verificación.
- Panel derecho: mapa SVG estilizado (generado con `imagegen`) con marcadores teal (ruta) y ámbar (obstáculos), overlays flotantes con Índice de Accesibilidad 84/100, botones Capas/Tráfico.
- Debajo: 2 tarjetas de comercios destacados + grid de 4 KPIs (Km accesibles, Reportes resueltos, Puntos de apoyo, Nivel de confianza).

**2. Reporte Ciudadano (`/reportar`)** — Wizard de 3 pasos:
- Paso 1: Categoría (banqueta bloqueada, rampa inexistente, obra, punto de descanso) con iconos grandes y accesibles.
- Paso 2: Geolocalización (mini-mapa con pin arrastrable) + captura de foto (drop zone simulado).
- Paso 3: Confirmación con vista previa y mensaje de validación cruzada ("Tu reporte ganará peso cuando otros usuarios lo confirmen").

**3. Ecosistema Comercial (`/comercios`)** — Grid de tarjetas con:
- Filtros por tipo (restaurantes, clínicas, comercios) y nivel de sello (Oro, Plata, Bronce).
- Cada tarjeta: foto, nombre, badge "Sello Ciudad Inclusiva", índice 0-100, características (rampa, baño accesible, menú braille, personal capacitado).
- 8-10 negocios simulados de CDMX.

**4. Inteligencia Urbana (`/inteligencia`)** — Dashboard institucional:
- Header con selector de alcaldía.
- 4 KPIs grandes: barreras detectadas, reducción trimestral, tiempo medio de resolución, cobertura ciudadana.
- Mapa de calor (SVG/imagen) con clusters de obstáculos.
- Tabla de zonas prioritarias (acceso a hospitales/servicios) con score y CTA "Priorizar mantenimiento".
- Gráfica de tendencia (Recharts) de accesibilidad por trimestre.

**5. Perfil y Gamificación (`/perfil`)** — Vista personal:
- Tarjeta de usuario: avatar, nombre, rol ("Auditor verificado · Nivel 4").
- Métricas de impacto: reportes hechos, rutas optimizadas, usuarios ayudados.
- Insignias desbloqueadas y barra de progreso al siguiente nivel.
- Timeline de últimos reportes con estado (validado, en revisión, resuelto).

## Detalles técnicos

- **Design tokens** en `src/styles.css`: `--brand: oklch(...)` (teal `#0d9488`), `--surface`, `--ui-text`, `--ui-muted`. Tipografía Public Sans vía `@fontsource/public-sans` en `src/main.tsx`. Animación `pulse-soft` para badges en vivo.
- **Imágenes**: 1 mapa estilizado, 1 mapa de calor, ~4-6 storefronts y avatares via `imagegen` (fast tier) guardadas en `src/assets/`.
- **Datos simulados**: archivo `src/data/mock.ts` con arrays de reportes, comercios, KPIs y perfil. Sin Lovable Cloud (es solo prototipo visual).
- **Componentes reutilizables** en `src/components/`: `Header`, `LiveBadge`, `ReportCard`, `BusinessCard`, `KpiCard`, `MapShell`, `StepIndicator`.
- **Accesibilidad**: contraste WCAG AA, foco visible, `aria-label` en botones-icono, jerarquía de headings correcta por ruta, `lang="es"`.
- **Responsive**: mobile-first con la barra inferior fija del prototipo en `< md`.

## Fuera de alcance (prototipo)

- Mapas reales (Google Maps / Mapbox) — usamos imagen estilizada.
- Backend, auth, persistencia de reportes.
- Ruteo real con pesos dinámicos — se muestra como UI estática.

Si más tarde quieres convertirlo en producto real, los siguientes pasos serían activar Lovable Cloud (tablas de reportes/comercios/usuarios + RLS) y conectar Google Maps para mapa y geocoding.
