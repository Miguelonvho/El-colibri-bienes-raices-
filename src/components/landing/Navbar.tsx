import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";
import logoElColibri from "@/assets/logo-el-colibri.png";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Propiedades", href: "#propiedades" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Por qué elegirnos", href: "#beneficios" },
    { label: "Preguntas", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-card/95 backdrop-blur-lg shadow-nav border-b border-border"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logoElColibri}
            alt="El Colibrí Bienes Raíces"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
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

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-xl text-foreground"
          aria-label="Menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-card border-b border-border px-4 pb-4 space-y-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-foreground hover:bg-primary-light hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
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
