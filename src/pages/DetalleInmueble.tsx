/**
 * ============================================================
 * PÁGINA: Detalle de Inmueble (/inmueble/:id)
 * ============================================================
 * Muestra toda la información de una propiedad específica.
 * El ID de la propiedad se obtiene desde la URL (parámetro :id).
 *
 * Incluye:
 * - Imagen principal grande
 * - Título, dirección y estado
 * - Descripción completa
 * - Características (insignias)
 * - Ficha técnica: tipo, superficie, ambientes, precio
 * - Botón de contacto por WhatsApp
 * - Botones de navegación (volver al catálogo / inicio)
 * ============================================================
 */

import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Home,
  Maximize2,
  DoorOpen,
  Tag,
  Banknote,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import { obtenerPropiedad } from "@/data/propiedades";

// Configuración de WhatsApp
const whatsappNumber = "543794215684";
const mensajeBase = "Hola! Me interesa información sobre el alquiler de la propiedad: ";

/** Genera el enlace de WhatsApp con el nombre de la propiedad */
const WA_LINK = (titulo: string, subtitulo: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    mensajeBase + titulo + " - " + subtitulo
  )}`;

export default function DetalleInmueble() {
  // Obtenemos el ID de la URL (ej: /inmueble/3 → id = "3")
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Buscamos la propiedad con ese ID en los datos
  const propiedad = obtenerPropiedad(Number(id));

  // ── Propiedad no encontrada ────────────────────
  if (!propiedad) {
    return (
      <div className="min-h-screen bg-background antialiased">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
          <p className="text-5xl">🏚️</p>
          <h1 className="text-2xl font-bold text-foreground">Propiedad no encontrada</h1>
          <p className="text-muted-foreground">
            La propiedad que buscás no existe o fue eliminada del catálogo.
          </p>
          <Link
            to="/catalogo"
            className="mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Ver catálogo completo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Propiedad encontrada: renderizar detalle ───
  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />

      <main className="pt-24">

        {/* ── Imagen principal ──────────────────── */}
        <div className="relative w-full h-72 sm:h-96 lg:h-[520px] overflow-hidden">
          <img
            src={propiedad.imagen}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
          />
          {/* Gradiente oscuro en la parte inferior de la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

          {/* Etiqueta de estado sobre la imagen */}
          <div className="absolute top-6 left-6 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
            {propiedad.etiqueta}
          </div>

          {/* Título sobre la imagen (visible en la parte inferior) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-wider flex items-center gap-1 mb-1">
                <MapPin size={12} />
                {propiedad.subtitulo}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">
                {propiedad.titulo}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Contenido principal ───────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          {/* Migas de pan */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home size={14} />
              Inicio
            </Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {propiedad.titulo}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Columna izquierda: descripción + características ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Descripción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-lg font-bold text-foreground mb-3">Descripción</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {propiedad.descripcion}
                </p>
              </motion.div>

              {/* Insignias / Características */}
              {propiedad.insignias.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-lg font-bold text-foreground mb-3">Características</h2>
                  <div className="flex flex-wrap gap-3">
                    {propiedad.insignias.map((insignia) => (
                      <span
                        key={insignia}
                        className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary-light px-4 py-2 rounded-full"
                      >
                        <CheckCircle2 size={14} />
                        {insignia}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Botón de volver (móvil: visible aquí; desktop: en sidebar) */}
              <div className="lg:hidden">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={16} />
                  Volver
                </button>
              </div>
            </div>

            {/* ── Columna derecha: ficha técnica + CTA ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Ficha técnica */}
              <div className="bg-card rounded-3xl border border-border shadow-card p-6">
                <h2 className="text-base font-bold text-foreground mb-4">Ficha técnica</h2>
                <ul className="space-y-3 text-sm">
                  {/* Tipo de propiedad */}
                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Tag size={14} className="text-primary" />
                      Tipo
                    </span>
                    <span className="font-semibold text-foreground">{propiedad.tipo}</span>
                  </li>

                  {/* Superficie */}
                  {propiedad.superficie && (
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Maximize2 size={14} className="text-primary" />
                        Superficie
                      </span>
                      <span className="font-semibold text-foreground">{propiedad.superficie}</span>
                    </li>
                  )}

                  {/* Ambientes */}
                  {propiedad.ambientes !== undefined && (
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <DoorOpen size={14} className="text-primary" />
                        Ambientes
                      </span>
                      <span className="font-semibold text-foreground">{propiedad.ambientes}</span>
                    </li>
                  )}

                  {/* Precio */}
                  {propiedad.precio && (
                    <li className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Banknote size={14} className="text-primary" />
                        Precio
                      </span>
                      <span className="font-semibold text-foreground">{propiedad.precio}</span>
                    </li>
                  )}

                  {/* Dirección */}
                  <li className="pt-2 border-t border-border">
                    <span className="flex items-start gap-2 text-muted-foreground">
                      <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{propiedad.subtitulo}</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTA: consultar por WhatsApp */}
              <a
                href={WA_LINK(propiedad.titulo, propiedad.subtitulo)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-whatsapp text-primary-foreground py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-opacity shadow-wa"
              >
                <MessageCircle size={20} />
                Consultar disponibilidad
              </a>

              {/* Navegación de volver (desktop) */}
              <div className="hidden lg:flex flex-col gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={15} />
                  Volver
                </button>
                <Link
                  to="/catalogo"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Ver catálogo completo →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
