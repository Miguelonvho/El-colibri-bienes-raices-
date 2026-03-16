import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Mateo S.",
    role: "Estudiante de Medicina, UNNE",
    location: "Barrio Aldana",
    text: "Conseguí departamento cerca de la facultad en dos días. Los requisitos fueron claros desde el principio y la atención por WhatsApp fue inmediata. Nunca pensé que alquilar en Corrientes podía ser tan simple.",
    stars: 5,
  },
  {
    name: "Valeria G.",
    role: "Licenciada en Administración",
    location: "Barrio Cambá Cuá",
    text: "Buscaba mi primer departamento propio. Me asesoraron en todos los pasos de la escritura y los papeles de forma impecable. Transparencia total. Finalmente comprar una propiedad no fue un proceso traumático.",
    stars: 5,
  },
  {
    name: "Ricardo P.",
    role: "Padre de familia",
    location: "Barrio Santa Catalina",
    text: "Alquilamos una casa para toda la familia. Lo que más nos sorprendió fue la transparencia en el contrato, algo difícil de encontrar en el mercado hoy. Desde el día uno, todo claro.",
    stars: 5,
  },
  {
    name: "Lucía M.",
    role: "Comerciante",
    location: "Centro de Corrientes",
    text: "Necesitaba cochera en el centro y me ayudaron a encontrar exactamente lo que necesitaba en tiempo récord. Excelente gestión. Me ahorraron semanas de búsqueda por mi cuenta.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-muted px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-primary uppercase tracking-widest"
          >
            Testimonios reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2"
          >
            Lo que dicen <span className="text-primary">nuestros clientes</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {t.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
