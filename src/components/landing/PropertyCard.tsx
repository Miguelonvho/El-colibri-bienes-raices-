/**
 * ============================================================
 * COMPONENTE: PropertyCard (Tarjeta de Propiedad)
 * ============================================================
 * Muestra la información resumida de una propiedad en formato tarjeta.
 * Se usa en la sección de propiedades destacadas (inicio) y en el catálogo.
 *
 * El botón "Ver más" navega a la página de detalle (/inmueble/:id).
 * El botón "WhatsApp" abre un chat directo con el número configurado.
 * ============================================================
 */

import { motion } from "framer-motion";
import { MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Número de WhatsApp de la inmobiliaria
const whatsappNumber = "543794215684";
const mensajeBase = "Hola! Me interesa información sobre el alquiler de la propiedad: ";

/** Genera el enlace de WhatsApp con el nombre de la propiedad pre-cargado */
const WA_LINK = (titulo: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeBase + titulo)}`;

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

interface PropertyCardProps {
  /** ID único de la propiedad (usado para navegar al detalle) */
  id: number;
  /** URL de la imagen principal */
  image: string;
  /** Título de la propiedad */
  title: string;
  /** Dirección / subtítulo */
  subtitle: string;
  /** Descripción breve */
  description: string;
  /** Lista de características destacadas */
  badges?: string[];
  /** Estado de la propiedad (ej: "Disponible") */
  tag?: string;
  /** Índice para escalonar la animación de entrada */
  index: number;
}

// ─────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────

export default function PropertyCard({
  id,
  image,
  title,
  subtitle,
  description,
  badges = [],
  tag = "Disponible",
  index,
}: PropertyCardProps) {
  // Hook de navegación de React Router
  const navigate = useNavigate();

  /** Navega a la página de detalle de esta propiedad */
  const verDetalle = () => navigate(`/inmueble/${id}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      {/* ── Imagen ─────────────────────────────────── */}
      <div
        className="relative h-56 sm:h-64 overflow-hidden cursor-pointer"
        onClick={verDetalle}
        role="button"
        aria-label={`Ver detalle de ${title}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradiente oscuro sobre la imagen */}
        <div className="absolute inset-0 gradient-card-overlay" />

        {/* Etiqueta de estado (ej: "Disponible") */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          {tag}
        </div>
      </div>

      {/* ── Contenido ──────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1">
        {/* Dirección */}
        <div className="flex items-start gap-1 text-primary mb-2">
          <MapPin size={13} className="mt-0.5 flex-shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-tight text-primary">
            {subtitle}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{title}</h3>

        {/* Descripción corta */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{description}</p>

        {/* Insignias de características */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {badges.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-full"
              >
                <CheckCircle2 size={10} />
                {b}
              </span>
            ))}
          </div>
        )}

        {/* ── Botones de acción ───────────────────── */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {/* Botón "Ver más" → navega a la vista de detalle */}
          <button
            onClick={verDetalle}
            className="flex items-center justify-center gap-1.5 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors"
          >
            Ver más
          </button>

          {/* Botón "WhatsApp" → abre chat con mensaje pre-cargado */}
          <a
            href={WA_LINK(title + " - " + subtitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-primary-light text-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.article>
  );
}
