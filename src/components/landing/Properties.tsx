/**
 * ============================================================
 * COMPONENTE: Properties (Sección de Propiedades Destacadas)
 * ============================================================
 * Muestra las propiedades marcadas como "destacadas" en la landing.
 * El botón "Ver catálogo completo" navega a la página /catalogo.
 *
 * Los datos se obtienen de `src/data/propiedades.ts`, que actúa como
 * fuente única de verdad para todo el sitio hasta que haya un backend.
 * ============================================================
 */

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { obtenerPropiedadesDestacadas } from "@/data/propiedades";

// Obtenemos solo las propiedades marcadas como destacadas
// (se muestran las 3 primeras del catálogo por defecto)
const propiedadesDestacadas = obtenerPropiedadesDestacadas();

export default function Properties() {
  return (
    <section id="propiedades" className="py-24 bg-muted px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Encabezado de sección ───────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs font-bold text-primary uppercase tracking-widest"
            >
              Propiedades disponibles
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2"
            >
              Propiedades Destacadas
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-muted-foreground mt-2"
            >
              Seleccionadas por ubicación, estado y seguridad jurídica.
            </motion.p>
          </div>

          {/* Enlace al catálogo completo (visible en desktop) */}
          <Link
            to="/catalogo"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:underline flex-shrink-0"
          >
            Ver catálogo completo <ChevronRight size={18} />
          </Link>
        </div>

        {/* ── Grilla de tarjetas ──────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {propiedadesDestacadas.map((prop, i) => (
            <PropertyCard
              key={prop.id}
              id={prop.id}
              image={prop.imagen}
              title={prop.titulo}
              subtitle={prop.subtitulo}
              description={prop.descripcion}
              badges={prop.insignias}
              tag="Disponible"
              index={i}
            />
          ))}
        </div>

        {/* ── Botón catálogo (visible solo en móvil) ── */}
        <div className="flex justify-center mt-10 sm:hidden">
          <Link
            to="/catalogo"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-primary"
          >
            Ver catálogo completo
            <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
