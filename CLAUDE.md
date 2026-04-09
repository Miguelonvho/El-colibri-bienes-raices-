# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de desarrollo

El proyecto raíz es `colibr-properties-d8ee555b/`. Todos los comandos se ejecutan desde ahí.

```bash
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Build de producción (TypeScript + Vite)
npm run lint         # ESLint sobre todo el proyecto
npm run test         # Vitest (modo run, una sola vez)
npm run test:watch   # Vitest en modo watch
```

Para correr un test específico:
```bash
npx vitest run src/path/to/file.test.ts
```

## Arquitectura general

### Fuente única de datos: `src/data/propiedades.ts`

**Todas** las páginas leen y escriben propiedades exclusivamente a través de las funciones exportadas de este módulo. No hay backend: los datos persisten en `localStorage` bajo la clave `colibri_propiedades`. Las funciones clave son:

- `obtenerPropiedades()` — lee desde localStorage o retorna `propiedadesIniciales`
- `obtenerPropiedadesPublicas()` — filtra baja lógica y estados ocultos (`Alquilado`, `Reservado`, `Pausado`)
- `obtenerPropiedadesDestacadas()` — subset de las públicas con `destacada: true`
- `guardarPropiedades(arr)` — persiste en localStorage; la llama el CRUD tras cada cambio
- `obtenerPropiedad(id)` — para la vista de detalle

Cuando se integre un backend, estos son los únicos puntos a reemplazar.

### Rutas (`src/App.tsx`)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Index.tsx` | Landing page completa |
| `/catalogo` | `Catalogo.tsx` | Listado con filtros |
| `/inmueble/:id` | `DetalleInmueble.tsx` | Detalle de propiedad |
| `/gestion` | `GestionCatalogo.tsx` | CRUD admin (sin auth por ahora) |

### Autenticación (pendiente)

`/gestion` está sin autenticación intencionalmente. Hay bloques comentados marcados con `// AUTENTICACIÓN` en `App.tsx` y `GestionCatalogo.tsx` listos para activarse. Cuando se implemente, agregar `<RutaProtegida>` y la ruta `/login`.

### Componentes de la landing (`src/components/landing/`)

Cada sección de `Index.tsx` es un componente independiente: `Navbar`, `Hero`, `Properties`, `About`, `WhyUs`, `Testimonials`, `FAQ`, `ContactCTA`, `Footer`, `FloatingWhatsApp`, `PropertyCard`.

### Design system

Los tokens de color y tipografía viven en `src/index.css` (variables CSS bajo `@layer base`). Tailwind los consume a través de `tailwind.config.ts`. Colores principales:

- `primary` → Verde Colibrí (`hsl(150 52% 36%)`)
- `accent` → Azul institucional (`hsl(200 45% 38%)`)
- `whatsapp` → Verde WhatsApp para el botón flotante
- `charcoal` / `charcoal-light` → Textos oscuros

Tipografía: **Plus Jakarta Sans** (Google Fonts), configurada como fuente `sans` y `display` en Tailwind.

### Mapas

El componente `src/components/MapaPropiedad.tsx` usa **React Leaflet**. Las coordenadas de cada propiedad se cargan desde el campo `ubicacion: { lat, lng }` del tipo `Propiedad`.

### UI base

Los componentes de `src/components/ui/` son shadcn/ui (Radix UI + CVA + Tailwind). No modificar manualmente; regenerar con `npx shadcn@latest add <componente>` si se necesitan nuevos.

## Convenciones de código

- Todo el código se comenta en **español**. Cada componente, función y sección JSX debe tener comentarios explicativos en español. Es un requisito del equipo.
- El alias `@/` apunta a `src/`. Usar siempre `@/` para imports internos.
- El tipo `Propiedad` (en `propiedades.ts`) es la única definición de la entidad. No duplicar la interfaz.
- La baja lógica usa `dadaDeBaja: true` — nunca borrar registros del array, solo marcar el flag.
- Los estados `"Alquilado"`, `"Reservado"`, `"Pausado"` ocultan la propiedad del catálogo público. Las vistas públicas siempre muestran `"Disponible"` como etiqueta.
