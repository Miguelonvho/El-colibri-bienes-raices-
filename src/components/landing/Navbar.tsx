/**
 * ============================================================
 * COMPONENTE: Navbar (Barra de Navegación)
 * ============================================================
 * Barra de navegación fija en la parte superior de todas las páginas.
 * Se vuelve opaca con sombra al hacer scroll.
 *
 * Incluye:
 * - Logo con enlace al inicio
 * - Links de secciones de la landing (anclas)
 * - Links de páginas internas: Catálogo, Gestión
 * - Botón de WhatsApp
 * - Menú hamburguesa para móvil
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import logoElColibri from "@/assets/logo-el-colibri.png";
import { SECCIONES } from "@/config/secciones";

// Configuración del enlace de WhatsApp
const whatsappNumber = "543794215684";
const mensaje = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${mensaje}`;

export default function Navbar() {
  // Estado: si el usuario hizo scroll (para cambiar el fondo)
  const [scrolled, setScrolled] = useState(false);
  // Estado: si el menú móvil está abierto
  const [menuOpen, setMenuOpen] = useState(false);

  // Escucha el scroll para activar el fondo sólido
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Links de ancla: apuntan a secciones de la landing.
   * Solo se incluyen las secciones habilitadas en `src/config/secciones.ts`.
   */
  const linksSeccion = [
    { label: "Inicio", href: "/#propiedades", visible: true },
    { label: "Nosotros", href: "/#nosotros", visible: SECCIONES.nosotros },
    { label: "Por qué elegirnos", href: "/#beneficios", visible: SECCIONES.porQueElegirnos },
    { label: "Preguntas", href: "/#faq", visible: SECCIONES.preguntas },
    { label: "Contacto", href: "/#contacto", visible: SECCIONES.contacto },
  ].filter((l) => l.visible);

  /**
   * Links de rutas internas del sitio (usan React Router).
   * Gestión se omite intencionalmente — acceso solo por URL directa con clave.
   */
  const linksRutas = [
    { label: "Catálogo", to: "/catalogo", icono: <LayoutGrid size={15} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-lg shadow-nav border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">

        {/* ── Logo ───────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logoElColibri}
            alt="El Colibrí Bienes Raíces"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* ── Navegación desktop ─────────────────── */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Links de secciones (anclas) */}
          {linksSeccion.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Separador visual */}
          <span className="w-px h-4 bg-border" />

          {/* Links de rutas internas */}
          {linksRutas.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              {link.icono}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Botón WhatsApp (desktop) ────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-whatsapp text-primary-foreground px-4 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all shadow-wa"
          >
            <MessageCircle size={16} />
            <span>+54 379 4215684</span>
          </a>
        </div>

        {/* ── Botón menú hamburguesa (móvil) ─────── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-xl text-foreground"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Menú desplegable (móvil) ─────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-card border-b border-border px-4 pb-4 space-y-1"
          >
            {/* Links de secciones */}
            {linksSeccion.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Separador */}
            <div className="border-t border-border my-2" />

            {/* Links de rutas internas */}
            {linksRutas.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors"
              >
                {link.icono}
                {link.label}
              </Link>
            ))}

            {/* Botón WhatsApp */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-2 bg-whatsapp text-primary-foreground px-4 py-3 rounded-xl text-sm font-bold"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
