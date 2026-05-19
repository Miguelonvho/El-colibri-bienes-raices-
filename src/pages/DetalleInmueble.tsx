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

import { useState } from "react";
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
import MapaPropiedad from "@/components/MapaPropiedad";
import LightboxImagenes from "@/components/LightboxImagenes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
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

  // Estado del lightbox de imágenes
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [lightboxIndice, setLightboxIndice] = useState(0);

  const abrirLightbox = (indice: number) => {
    setLightboxIndice(indice);
    setLightboxAbierto(true);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          {/* Migas de pan */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
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

          {/* Botón volver — debajo de las migas, arriba a la izquierda */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground border border-border rounded-full px-4 py-1.5 hover:text-foreground hover:border-foreground/40 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Volver
          </button>

          {/* Encabezado: dirección + título + etiqueta de estado */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
              <MapPin size={13} className="text-primary flex-shrink-0" />
              {propiedad.subtitulo}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                {propiedad.titulo}
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                {propiedad.etiqueta}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Columna izquierda: carrusel + descripción + características ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Carrusel de imágenes o imagen única */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
              >
                {propiedad.galeria && propiedad.galeria.length > 0 ? (
                  <Carousel opts={{ loop: true }}>
                    <CarouselContent>
                      {propiedad.galeria.map((img, i) => (
                        <CarouselItem key={i}>
                          <img
                            src={img}
                            alt={`${propiedad.titulo} - foto ${i + 1}`}
                            className="w-full h-[360px] sm:h-[440px] lg:h-[580px] object-cover cursor-zoom-in"
                            onClick={() => abrirLightbox(i)}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-3 bg-black/40 border-0 text-white hover:bg-black/60 hover:text-white" />
                    <CarouselNext className="right-3 bg-black/40 border-0 text-white hover:bg-black/60 hover:text-white" />
                  </Carousel>
                ) : (
                  <img
                    src={propiedad.imagen}
                    alt={propiedad.titulo}
                    className="w-full h-[360px] sm:h-[440px] lg:h-[580px] object-cover"
                  />
                )}
              </motion.div>

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


              {/* ── Mapa de ubicación ─────────────────────
               * Solo se muestra si la propiedad tiene coordenadas cargadas.
               * Las coordenadas se ingresan desde el panel de gestión (/gestion)
               * en los campos "Latitud" y "Longitud".
               *
               * Si la propiedad no tiene ubicacion definida, este bloque
               * simplemente no se renderiza (sin errores ni espacios vacíos).
               */}
              {propiedad.ubicacion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" />
                    Ubicación
                  </h2>
                  {/* Componente del mapa Leaflet con las coordenadas de la propiedad */}
                  <MapaPropiedad
                    lat={propiedad.ubicacion.lat}
                    lng={propiedad.ubicacion.lng}
                    nombrePropiedad={propiedad.titulo}
                    direccion={propiedad.subtitulo}
                    altura="300px"
                  />
                  {/* Dirección textual debajo del mapa */}
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary flex-shrink-0" />
                    {propiedad.subtitulo}
                  </p>
                </motion.div>
              )}

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

              {/* Características / Insignias */}
              {propiedad.insignias.length > 0 && (
                <div className="bg-card rounded-3xl border border-border shadow-card p-6">
                  <h2 className="text-base font-bold text-foreground mb-4">Características</h2>
                  <div className="flex flex-wrap gap-2">
                    {propiedad.insignias.map((insignia) => (
                      <span
                        key={insignia}
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle2 size={13} />
                        {insignia}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Lightbox: se monta en document.body vía portal */}
      {propiedad.galeria && (
        <LightboxImagenes
          imagenes={propiedad.galeria}
          indiceInicial={lightboxIndice}
          abierto={lightboxAbierto}
          onCerrar={() => setLightboxAbierto(false)}
        />
      )}
    </div>
  );
}
