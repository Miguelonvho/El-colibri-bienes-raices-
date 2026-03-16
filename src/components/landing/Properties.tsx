import { motion } from "framer-motion";
import { ChevronRight, MessageCircle } from "lucide-react";
import PropertyCard from "./PropertyCard";
import colombia920 from "@/assets/colombia-920.jpg";
import colombia800 from "@/assets/colombia-800.jpg";
import av3deAbril from "@/assets/avenida-3-de-abril-1038.jpg";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Quisiera que me muestres el catalogo completo de propiedades por favor.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

const properties = [
  {
    image: colombia920,
    title: "Departamento de Dos Dormitorios",
    subtitle: "Colombia 920, Corrientes Capital",
    description:
      "Ideal para estudiantes universitarios o jóvenes profesionales. A pasos de las facultades de la UNNE, con seguridad 24hs y expensas claras. Entrega inmediata.",
    badges: ["2 Dormitorios", "UNNE cercana", "Seguridad 24hs"],
    tag: "Disponible",
  },
  {
    image: colombia800,
    title: "Departamento de Dos Dormitorios",
    subtitle: "Colombia 800, Corrientes Capital",
    description:
      "Amplia propiedad con jardín y excelente iluminación natural. Ideal para familias o profesionales que buscan tranquilidad y comodidad. Zona residencial privilegiada.",
    badges: ["Jardín", "Luminosidad", "Entrega inmediata"],
    tag: "Disponible",
  },
  {
    image: av3deAbril,
    title: "Cochera Cubierta",
    subtitle: "Av. 3 de Abril 1038, Corrientes Capital",
    description:
      "Seguridad para tu vehículo en la zona de mayor demanda del corredor principal de la ciudad. Acceso 24hs con portón eléctrico y vigilancia.",
    badges: ["Acceso 24hs", "Portón eléctrico", "Zona céntrica"],
    tag: "Disponible",
  },
];

export default function Properties() {
  return (
    <section id="propiedades" className="py-24 bg-muted px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:underline flex-shrink-0"
          >
            Ver catálogo completo <ChevronRight size={18} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {properties.map((prop, i) => (
            <PropertyCard key={prop.subtitle} {...prop} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-10 sm:hidden">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-whatsapp text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm shadow-wa"
          >
            <MessageCircle size={18} />
            Ver catálogo completo
          </a>
        </div>
      </div>
    </section>
  );
}
