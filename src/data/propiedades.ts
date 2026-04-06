/**
 * ============================================================
 * MÓDULO DE DATOS: PROPIEDADES
 * ============================================================
 * Centraliza la información de todas las propiedades del catálogo.
 * Utiliza localStorage para persistir los cambios realizados desde
 * el panel de gestión, sin necesidad de backend por el momento.
 *
 * TODO (integración backend):
 *   - Reemplazar `obtenerPropiedades()` por: GET /api/propiedades
 *   - Reemplazar `guardarPropiedades()` por: POST/PUT/DELETE /api/propiedades/:id
 *   - Eliminar la lógica de localStorage una vez conectado el servidor.
 * ============================================================
 */

import colombia920 from "@/assets/colombia-920.jpg";
import colombia800 from "@/assets/colombia-800.jpg";
import av3deAbril from "@/assets/avenida-3-de-abril-1038.jpg";

/** Clave usada para guardar/leer el catálogo en el navegador */
const CLAVE_ALMACENAMIENTO = "colibri_propiedades";

// ─────────────────────────────────────────────
// TIPO: Propiedad
// ─────────────────────────────────────────────

/** Estructura de datos de una propiedad inmobiliaria */
export interface Propiedad {
  /** Identificador único numérico */
  id: number;
  /** URL de la imagen principal (local importada o URL externa) */
  imagen: string;
  /** Nombre o tipo de la propiedad */
  titulo: string;
  /** Dirección completa */
  subtitulo: string;
  /** Descripción detallada */
  descripcion: string;
  /** Etiquetas con características destacadas */
  insignias: string[];
  /** Estado: "Disponible", "Alquilado", "En negociación", etc. */
  etiqueta: string;
  /** Categoría: "Departamento", "Casa", "Cochera", "Local comercial", etc. */
  tipo: string;
  /** Precio de alquiler o venta */
  precio?: string;
  /** Superficie en m² */
  superficie?: string;
  /** Cantidad de ambientes */
  ambientes?: number;
  /** Si es true, se muestra en la sección destacada de la página de inicio */
  destacada?: boolean;
  /**
   * Baja lógica: si es true, la propiedad fue dada de baja por el administrador.
   * NO se elimina del sistema, sino que se oculta del catálogo público y del inicio.
   * Solo visible en el panel de gestión bajo "Propiedades dadas de baja".
   * Para restaurarla, el admin puede reactivarla desde ese panel.
   */
  dadaDeBaja?: boolean;
}

// ─────────────────────────────────────────────
// DATOS INICIALES
// ─────────────────────────────────────────────

/**
 * Catálogo inicial con 9 propiedades.
 *
 * - Las primeras 3 usan imágenes reales del proyecto.
 * - Las 6 siguientes usan imágenes de https://picsum.photos (servicio de
 *   imágenes de placeholder gratuito). Reemplazar por fotos reales cuando
 *   estén disponibles.
 *
 * Las propiedades marcadas con `destacada: true` aparecen en el inicio.
 */
export const propiedadesIniciales: Propiedad[] = [
  // ── Propiedad 1 ──────────────────────────────
  {
    id: 1,
    imagen: colombia920,
    titulo: "Departamento de Dos Dormitorios",
    subtitulo: "Colombia 920, Corrientes Capital",
    descripcion:
      "Ideal para estudiantes universitarios o jóvenes profesionales. A pasos de las facultades de la UNNE, con seguridad 24hs y expensas claras. Entrega inmediata.",
    insignias: ["2 Dormitorios", "UNNE cercana", "Seguridad 24hs"],
    etiqueta: "Disponible",
    tipo: "Departamento",
    precio: "Consultar",
    superficie: "65 m²",
    ambientes: 3,
    destacada: true,
  },
  // ── Propiedad 2 ──────────────────────────────
  {
    id: 2,
    imagen: colombia800,
    titulo: "Departamento de Dos Dormitorios",
    subtitulo: "Colombia 800, Corrientes Capital",
    descripcion:
      "Amplia propiedad con jardín y excelente iluminación natural. Ideal para familias o profesionales que buscan tranquilidad y comodidad. Zona residencial privilegiada.",
    insignias: ["Jardín", "Luminosidad", "Entrega inmediata"],
    etiqueta: "Disponible",
    tipo: "Departamento",
    precio: "Consultar",
    superficie: "72 m²",
    ambientes: 3,
    destacada: true,
  },
  // ── Propiedad 3 ──────────────────────────────
  {
    id: 3,
    imagen: av3deAbril,
    titulo: "Cochera Cubierta",
    subtitulo: "Av. 3 de Abril 1038, Corrientes Capital",
    descripcion:
      "Seguridad para tu vehículo en la zona de mayor demanda del corredor principal de la ciudad. Acceso 24hs con portón eléctrico y vigilancia.",
    insignias: ["Acceso 24hs", "Portón eléctrico", "Zona céntrica"],
    etiqueta: "Disponible",
    tipo: "Cochera",
    precio: "Consultar",
    superficie: "18 m²",
    destacada: true,
  },

  // ── Propiedades de demostración ───────────────
  // NOTA: Las imágenes a continuación son placeholders de https://picsum.photos
  // Reemplazar las URLs por las fotos reales de cada propiedad.

  // ── Propiedad 4 ──────────────────────────────
  {
    id: 4,
    imagen: "https://picsum.photos/seed/colibri-monoambiente/800/600",
    titulo: "Monoambiente Moderno",
    subtitulo: "San Juan 450, Corrientes Capital",
    descripcion:
      "Monoambiente completamente equipado en pleno centro. Cocina integrada, baño completo y balcón con vista a la calle. Ideal para profesional o estudiante.",
    insignias: ["Balcón", "Cocina equipada", "Zona céntrica"],
    etiqueta: "Disponible",
    tipo: "Departamento",
    precio: "Consultar",
    superficie: "38 m²",
    ambientes: 1,
    destacada: false,
  },
  // ── Propiedad 5 ──────────────────────────────
  {
    id: 5,
    imagen: "https://picsum.photos/seed/colibri-casafamiliar/800/600",
    titulo: "Casa Familiar 3 Dormitorios",
    subtitulo: "Italia 234, Corrientes Capital",
    descripcion:
      "Amplia casa con patio, quincho y garage. Tres dormitorios, living-comedor espacioso y dos baños completos. Barrio residencial tranquilo con excelente acceso.",
    insignias: ["3 Dormitorios", "Patio y quincho", "Garage"],
    etiqueta: "Disponible",
    tipo: "Casa",
    precio: "Consultar",
    superficie: "150 m²",
    ambientes: 5,
    destacada: false,
  },
  // ── Propiedad 6 ──────────────────────────────
  {
    id: 6,
    imagen: "https://picsum.photos/seed/colibri-local/800/600",
    titulo: "Local Comercial",
    subtitulo: "9 de Julio 800, Corrientes Capital",
    descripcion:
      "Local a pie de calle con gran vidriera sobre avenida principal. Ideal para comercio, consultorio o showroom. Instalaciones eléctricas trifásicas incluidas.",
    insignias: ["Vidriera grande", "Sobre avenida", "Instalación trifásica"],
    etiqueta: "Disponible",
    tipo: "Local comercial",
    precio: "Consultar",
    superficie: "80 m²",
    destacada: false,
  },
  // ── Propiedad 7 ──────────────────────────────
  {
    id: 7,
    imagen: "https://picsum.photos/seed/colibri-depto1d/800/600",
    titulo: "Departamento 1 Dormitorio",
    subtitulo: "Junín 560, Corrientes Capital",
    descripcion:
      "Departamento luminoso con dormitorio amplio, living separado y balcón. Edificio con ascensor, seguridad y lavandería. A metros del río Paraná.",
    insignias: ["Balcón", "Ascensor", "Cerca del río"],
    etiqueta: "Disponible",
    tipo: "Departamento",
    precio: "Consultar",
    superficie: "52 m²",
    ambientes: 2,
    destacada: false,
  },
  // ── Propiedad 8 ──────────────────────────────
  {
    id: 8,
    imagen: "https://picsum.photos/seed/colibri-duplex/800/600",
    titulo: "Dúplex 3 Dormitorios",
    subtitulo: "Santa Fe 1200, Corrientes Capital",
    descripcion:
      "Moderno dúplex de dos plantas con tres dormitorios en suite. Terraza privada, piscina compartida y estacionamiento cubierto. Complejo cerrado con amenities.",
    insignias: ["Piscina", "Terraza privada", "Complejo cerrado"],
    etiqueta: "Disponible",
    tipo: "Dúplex",
    precio: "Consultar",
    superficie: "180 m²",
    ambientes: 5,
    destacada: false,
  },
  // ── Propiedad 9 ──────────────────────────────
  {
    id: 9,
    imagen: "https://picsum.photos/seed/colibri-oficina/800/600",
    titulo: "Oficina Corporativa",
    subtitulo: "Pellegrini 890, Corrientes Capital",
    descripcion:
      "Oficina en piso ejecutivo con sala de reuniones incluida. Recepción compartida, WiFi de alta velocidad y estacionamiento. Contrato flexible a largo plazo.",
    insignias: ["Sala de reuniones", "WiFi incluido", "Estacionamiento"],
    etiqueta: "Disponible",
    tipo: "Oficina",
    precio: "Consultar",
    superficie: "45 m²",
    destacada: false,
  },
];

// ─────────────────────────────────────────────
// FUNCIONES DE ACCESO A DATOS
// ─────────────────────────────────────────────

/**
 * Devuelve el listado completo de propiedades.
 * Primero intenta leer desde localStorage; si no hay datos guardados,
 * retorna la lista inicial definida en este archivo.
 *
 * TODO (backend): Reemplazar por: const res = await fetch('/api/propiedades');
 */
export function obtenerPropiedades(): Propiedad[] {
  try {
    const guardadas = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardadas) {
      return JSON.parse(guardadas) as Propiedad[];
    }
  } catch (error) {
    console.error("Error al leer propiedades del almacenamiento local:", error);
  }
  return propiedadesIniciales;
}

/**
 * Guarda el listado completo de propiedades en localStorage.
 * Es llamada automáticamente por el CRUD después de cada modificación.
 *
 * TODO (backend): Reemplazar por llamadas a la API según la operación:
 *   - Crear:   POST   /api/propiedades
 *   - Editar:  PUT    /api/propiedades/:id
 *   - Eliminar: DELETE /api/propiedades/:id
 */
export function guardarPropiedades(propiedades: Propiedad[]): void {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(propiedades));
  } catch (error) {
    console.error("Error al guardar propiedades en almacenamiento local:", error);
  }
}

/**
 * Busca y retorna una única propiedad por su ID.
 * Retorna `undefined` si no se encuentra.
 *
 * TODO (backend): Reemplazar por: GET /api/propiedades/:id
 */
export function obtenerPropiedad(id: number): Propiedad | undefined {
  return obtenerPropiedades().find((p) => p.id === id);
}

/**
 * Estados que ocultan completamente una propiedad del catálogo público.
 *
 * Lógica de visibilidad para clientes:
 *   - "Alquilado"  → oculto (ya no está disponible)
 *   - "Reservado"  → oculto (comprometido, no negociable)
 *   - "Pausado"    → oculto (el dueño decidió pausarla)
 *   - dadaDeBaja   → oculto (baja lógica)
 *
 * Cualquier otro estado (incluyendo "En negociación") se muestra
 * como "Disponible" al cliente, porque el gestor puede negociar
 * con múltiples clientes al mismo tiempo.
 */
const ESTADOS_OCULTOS_AL_PUBLICO = ["Alquilado", "Reservado", "Pausado"];

/**
 * Retorna las propiedades visibles en el catálogo público.
 * Se excluyen las dadas de baja y las que tienen un estado de oculto.
 * El tag "etiqueta" que traen estas propiedades NO debe mostrarse al cliente
 * tal cual — las vistas públicas deben reemplazarlo siempre por "Disponible".
 */
export function obtenerPropiedadesPublicas(): Propiedad[] {
  return obtenerPropiedades().filter(
    (p) => !p.dadaDeBaja && !ESTADOS_OCULTOS_AL_PUBLICO.includes(p.etiqueta)
  );
}

/**
 * Retorna únicamente las propiedades marcadas como destacadas
 * que además sean visibles al público (no dadas de baja, disponibles).
 * Estas son las que se muestran en la sección de inicio de la landing.
 */
export function obtenerPropiedadesDestacadas(): Propiedad[] {
  return obtenerPropiedadesPublicas().filter((p) => p.destacada);
}

/**
 * Genera un nuevo ID único para una propiedad nueva.
 * Toma el ID más alto existente y suma 1.
 */
export function generarNuevoId(): number {
  const propiedades = obtenerPropiedades();
  if (propiedades.length === 0) return 1;
  return Math.max(...propiedades.map((p) => p.id)) + 1;
}
