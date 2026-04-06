/**
 * ============================================================
 * PÁGINA: Catálogo de Propiedades (/catalogo)
 * ============================================================
 * Muestra todas las propiedades disponibles en formato grilla.
 * Incluye filtros por tipo de propiedad y un buscador por texto.
 *
 * Los datos se leen desde `src/data/propiedades.ts`.
 * Cuando haya backend, reemplazar `obtenerPropiedades()` por
 * una llamada a la API.
 * ============================================================
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import PropertyCard from "@/components/landing/PropertyCard";
import { obtenerPropiedadesPublicas } from "@/data/propiedades";

/**
 * Solo mostramos propiedades públicas: disponibles y no dadas de baja.
 * Los demás estados se gestionan internamente desde /gestion.
 */
const todasLasPropiedades = obtenerPropiedadesPublicas();

// Extraemos los tipos únicos para los filtros (ej: "Departamento", "Casa", etc.)
const tiposUnicos = ["Todos", ...Array.from(new Set(todasLasPropiedades.map((p) => p.tipo)))];

export default function Catalogo() {
  // ── Estado del filtro activo ───────────────────
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // ── Estado del texto de búsqueda ──────────────
  const [textoBusqueda, setTextoBusqueda] = useState("");

  /**
   * Lista de propiedades filtradas según tipo y texto de búsqueda.
   * Se recalcula solo cuando cambian los filtros (useMemo).
   */
  const propiedadesFiltradas = useMemo(() => {
    return todasLasPropiedades.filter((propiedad) => {
      // Filtro por tipo
      const coincideTipo = filtroTipo === "Todos" || propiedad.tipo === filtroTipo;

      // Filtro por búsqueda de texto (busca en título, subtítulo y descripción)
      const textoBajo = textoBusqueda.toLowerCase();
      const coincideTexto =
        textoBusqueda === "" ||
        propiedad.titulo.toLowerCase().includes(textoBajo) ||
        propiedad.subtitulo.toLowerCase().includes(textoBajo) ||
        propiedad.descripcion.toLowerCase().includes(textoBajo);

      return coincideTipo && coincideTexto;
    });
  }, [filtroTipo, textoBusqueda]);

  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />

      <main>
        {/* ── Hero del catálogo ──────────────────── */}
        <section className="pt-32 pb-16 px-4 sm:px-6 bg-muted">
          <div className="max-w-7xl mx-auto">

            {/* Migas de pan */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home size={14} />
                Inicio
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Catálogo</span>
            </div>

            {/* Encabezado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Catálogo completo
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mt-2 mb-3">
                Todas las Propiedades
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Explorá todas las opciones disponibles. Filtrá por tipo o buscá por
                dirección o características.
              </p>
            </motion.div>

            {/* ── Barra de búsqueda y filtros ─────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              {/* Campo de búsqueda por texto */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Buscar por dirección o descripción..."
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Filtros por tipo de propiedad */}
              <div className="flex items-center gap-2 flex-wrap">
                <SlidersHorizontal size={15} className="text-muted-foreground flex-shrink-0" />
                {tiposUnicos.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipo(tipo)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                      filtroTipo === tipo
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Grilla de propiedades ──────────────── */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            {/* Contador de resultados */}
            <p className="text-sm text-muted-foreground mb-8">
              {propiedadesFiltradas.length === 0
                ? "No se encontraron propiedades con los filtros seleccionados."
                : `Mostrando ${propiedadesFiltradas.length} propiedad${propiedadesFiltradas.length !== 1 ? "es" : ""}`}
            </p>

            {/* Tarjetas de propiedades */}
            {propiedadesFiltradas.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {propiedadesFiltradas.map((propiedad, i) => (
                  <PropertyCard
                    key={propiedad.id}
                    id={propiedad.id}
                    image={propiedad.imagen}
                    title={propiedad.titulo}
                    subtitle={propiedad.subtitulo}
                    description={propiedad.descripcion}
                    badges={propiedad.insignias}
                    tag="Disponible"
                    index={i}
                  />
                ))}
              </div>
            ) : (
              /* Mensaje cuando no hay resultados */
              <div className="text-center py-24">
                <p className="text-4xl mb-4">🏠</p>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Sin resultados
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Probá con otro término de búsqueda o cambiá el filtro.
                </p>
                <button
                  onClick={() => { setFiltroTipo("Todos"); setTextoBusqueda(""); }}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
