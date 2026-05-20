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

// ── Imágenes Lote 55 ──────────────────────────────
import img1l55 from "@/assets/lote-55/img1l55.jpeg";
import img2l55 from "@/assets/lote-55/img2l55.jpeg";
import img3l55 from "@/assets/lote-55/img3l55.jpeg";
import img4l55 from "@/assets/lote-55/img4l55.jpeg";
import img5l55 from "@/assets/lote-55/img5l55.jpeg";
import img6l55 from "@/assets/lote-55/img6l55.jpeg";
import img7l55 from "@/assets/lote-55/img7l55.jpeg";
import img8l55 from "@/assets/lote-55/img8l55.jpeg";
import img9l55 from "@/assets/lote-55/img9l55.jpeg";
import img10l55 from "@/assets/lote-55/img10l55.jpeg";
import img11l55 from "@/assets/lote-55/img11l55.jpeg";
import img12l55 from "@/assets/lote-55/img12l55.jpeg";
import img13l55 from "@/assets/lote-55/img13l55.jpeg";

// ── Imágenes Lote 85 ──────────────────────────────
import img1lote85 from "@/assets/lote-85/img1lote85.jpeg";
import img2lote85 from "@/assets/lote-85/img2lote85.jpeg";
import img3lote85 from "@/assets/lote-85/img3lote85.jpeg";
import img4lote85 from "@/assets/lote-85/img4lote85.jpeg";
import img5lote85 from "@/assets/lote-85/img5lote85.jpeg";
import img6lote85 from "@/assets/lote-85/img6lote85.jpeg";
import img7lote85 from "@/assets/lote-85/img7lote85.jpeg";
import img8lote85 from "@/assets/lote-85/img8lote85.jpeg";
import img9lote85 from "@/assets/lote-85/img9lote85.jpeg";
import img10lote85 from "@/assets/lote-85/img10lote85.jpeg";
import img11lote85 from "@/assets/lote-85/img11lote85.jpeg";
import img12lote85 from "@/assets/lote-85/img12lote85.jpeg";
import img13lote85 from "@/assets/lote-85/img13lote85.jpeg";

/** Clave usada para guardar/leer el catálogo en el navegador */
const CLAVE_ALMACENAMIENTO = "colibri_propiedades";

/**
 * Versión del catálogo hardcodeado.
 * Incrementar este número cada vez que se agreguen o modifiquen propiedades
 * en `propiedadesIniciales`. Al detectar un desajuste con lo guardado en
 * localStorage, el sistema descarta el caché y carga los datos nuevos.
 */
const DATA_VERSION = "4";
const CLAVE_VERSION = "colibri_version";

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
  /**
   * Galería de imágenes para el carrusel en la vista de detalle.
   * Cuando está presente, reemplaza la imagen única en el encabezado del detalle.
   */
  galeria?: string[];
  /**
   * Coordenadas geográficas de la propiedad para mostrar en el mapa (Leaflet).
   * Se obtienen buscando la dirección en Google Maps u OpenStreetMap y copiando
   * las coordenadas. Ejemplo: { lat: -27.4844, lng: -58.7943 }
   *
   * TODO (backend): Cuando haya servidor, se puede agregar geocodificación automática
   * usando la dirección del campo `subtitulo` con la API de Nominatim (OpenStreetMap).
   */
  ubicacion?: { lat: number; lng: number };
}

// ─────────────────────────────────────────────
// DATOS INICIALES
// ─────────────────────────────────────────────

/**
 * Catálogo con 5 propiedades reales.
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
    // Coordenadas de Colombia al 920, Corrientes Capital
    ubicacion: { lat: -27.4844, lng: -58.7943 },
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
    // Coordenadas de Colombia al 800, Corrientes Capital
    ubicacion: { lat: -27.4851, lng: -58.7956 },
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
    // Coordenadas de Av. 3 de Abril 1038, Corrientes Capital
    ubicacion: { lat: -27.4721, lng: -58.8071 },
  },

  // ── Propiedad 10: Casa en Venta – Lote 55 ────
  {
    id: 10,
    imagen: img1l55,
    titulo: "Casa en Venta – Lote 55",
    subtitulo: "Catalinas Country, Corrientes",
    descripcion:
      "Casa a estrenar ubicada en Catalinas Country, sobre un terreno de 1030 m². La propiedad cuenta con 176 m² construidos, espacios amplios y una distribución pensada para el confort y la vida al aire libre. Dispone de pileta y solárium, en un entorno tranquilo a pocos minutos de Corrientes Capital, con acceso por la bajada de lancha al Riachuelo.",
    insignias: ["1030 m² de terreno", "176 m² construidos", "Pileta", "Solárium"],
    etiqueta: "Disponible",
    tipo: "Casa",
    precio: "Consultar",
    superficie: "176 m² construidos",
    destacada: true,
    galeria: [
      img1l55, img2l55, img3l55, img4l55, img5l55, img6l55, img7l55,
      img8l55, img9l55, img10l55, img11l55, img12l55, img13l55,
    ],
    // Coordenadas de Catalinas Country, Corrientes
    ubicacion: { lat: -27.559305, lng: -58.751249 },
  },

  // ── Propiedad 11: Casa en Venta – Lote 85 ────
  {
    id: 11,
    imagen: img4lote85,
    titulo: "Casa en Venta – Lote 85",
    subtitulo: "Catalinas Country, Corrientes",
    descripcion:
      "Moderna casa a estrenar desarrollada sobre un terreno de 1180 m², con 268 m² construidos. La propiedad ofrece 3 habitaciones, 4 baños y un amplio quincho integrado, ideal para reuniones y momentos de descanso. Además, cuenta con pileta y solárium, ubicada en un entorno residencial exclusivo a solo 12 km de Corrientes Capital.",
    insignias: ["1180 m² de terreno", "268 m² construidos", "3 Habitaciones", "4 Baños", "Quincho", "Pileta", "Solárium"],
    etiqueta: "Disponible",
    tipo: "Casa",
    precio: "Consultar",
    superficie: "268 m² construidos",
    ambientes: 3,
    destacada: true,
    galeria: [
      img4lote85, img1lote85, img2lote85, img3lote85, img5lote85, img6lote85, img7lote85,
      img8lote85, img9lote85, img10lote85, img11lote85, img12lote85, img13lote85,
    ],
    // Coordenadas de Catalinas Country, Corrientes
    ubicacion: { lat: -27.559305, lng: -58.751249 },
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
    const versionGuardada = localStorage.getItem(CLAVE_VERSION);
    if (versionGuardada !== DATA_VERSION) {
      // El catálogo del código es más nuevo: descartamos el caché
      localStorage.removeItem(CLAVE_ALMACENAMIENTO);
      localStorage.removeItem(CLAVE_VERSION);
      return propiedadesIniciales;
    }
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
    localStorage.setItem(CLAVE_VERSION, DATA_VERSION);
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
