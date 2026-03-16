import { motion } from "framer-motion";
import { MessageCircle, ChevronDown, ShieldCheck, Star } from "lucide-react";
import colombia920 from "@/assets/colombia-920.jpg";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-bold tracking-widest uppercase mb-6"
            >
              <Star size={12} className="fill-current" />
              Inmobiliaria en Corrientes Capital
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] text-foreground mb-6 text-balance"
            >
              Tu próximo hogar{" "}
              <br className="hidden sm:block" />
              en Corrientes{" "}
              <span className="text-primary">empieza acá.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg"
            >
              Alquileres y ventas verificados con seguridad jurídica real. Sin
              vueltas, sin sorpresas. Propiedades en las mejores zonas de
              Corrientes para estudiantes, profesionales y familias.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {[
                "✓ Propiedades verificadas",
                "✓ Contratos transparentes",
                "✓ Respuesta en el día",
              ].map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light px-3 py-1.5 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#propiedades"
                className="flex items-center justify-center gap-2 px-7 py-4 bg-foreground text-background rounded-2xl font-bold text-base hover:opacity-80 transition-all shadow-card hover:shadow-card-hover"
              >
                Ver propiedades
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-4 bg-whatsapp text-primary-foreground rounded-2xl font-bold text-base hover:opacity-90 transition-all shadow-wa"
              >
                <MessageCircle size={20} />
                Consultar ahora
              </a>
            </motion.div>

            {/* Social proof numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex gap-8 mt-10 pt-8 border-t border-border"
            >
              {[
                { n: "10+", label: "Años en el mercado" },
                { n: "100%", label: "Propiedades reales" },
                { n: "24hs", label: "Respuesta garantizada" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-primary">{stat.n}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-card-hover rotate-2 border-4 border-card">
              <img
                src={colombia920}
                alt="Edificio Colombia 920 - El Colibrí Bienes Raíces"
                className="w-full h-full object-cover -rotate-2 scale-105"
              />
              <div className="absolute inset-0 gradient-card-overlay" />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-6 bg-card rounded-2xl shadow-card-hover p-4 flex items-center gap-3 border border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                <ShieldCheck className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Seguridad Jurídica</p>
                <p className="text-xs text-muted-foreground">Contratos verificados</p>
              </div>
            </motion.div>

            {/* Online badge */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-card p-3 border border-border flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-whatsapp animate-pulse-slow" />
              <span className="text-xs font-bold text-foreground">En línea ahora</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#propiedades"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  );
}
