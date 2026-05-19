/**
 * ============================================================
 * CONFIGURACIÓN: Visibilidad de secciones
 * ============================================================
 * Controla qué secciones se muestran en la landing y en el navbar.
 *
 * Cuando un flag está en `false`, el componente directamente NO se
 * renderiza — no existe en el HTML ni es visible con herramientas
 * de inspección del navegador (F12, DevTools, etc.).
 *
 * Para reactivar una sección, cambiar el valor a `true`.
 * ============================================================
 */

export const SECCIONES = {
  /** Sección "Sobre nosotros" */
  nosotros: false,

  /** Sección "Por qué elegirnos" */
  porQueElegirnos: false,

  /** Sección "Testimonios" */
  testimonios: false,

  /** Sección "Preguntas frecuentes" */
  preguntas: false,

  /** Sección de contacto con botón WhatsApp */
  contacto: true,
};
