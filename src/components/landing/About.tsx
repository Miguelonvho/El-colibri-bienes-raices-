import { motion } from "framer-motion";
import { Users, MapPin, Award, Handshake } from "lucide-react";
import logoElColibri from "@/assets/logo-el-colibri.png";

const stats = [
  { icon: Award, label: "Años de trayectoria", value: "10+" },
  { icon: Users, label: "Familias asesoradas", value: "500+" },
  { icon: MapPin, label: "Barrios cubiertos", value: "15+" },
  { icon: Handshake, label: "Contratos cerrados", value: "1000+" },
];

export default function About() {
  return (
    <section id="nosotros" className="py-24 bg-background px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs font-bold text-primary uppercase tracking-widest"
            >
              Quiénes somos
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-6"
            >
              Más de una década <br />
              <span className="text-primary">construyendo confianza</span> <br />
              en Corrientes.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>
                <strong className="text-foreground">El Colibrí Bienes Raíces</strong> nació
                con una misión simple: hacer que encontrar una propiedad en Corrientes sea
                una experiencia clara, justa y sin sorpresas.
              </p>
              <p>
                Somos una inmobiliaria local, con presencia en los barrios que más importan:
                el centro histórico, la zona universitaria de la UNNE, Santa Catalina, Cambá
                Cuá, Aldana y más. Conocemos cada cuadra, cada dueño, cada edificio.
              </p>
              <p>
                Nuestro equipo de profesionales acompaña al cliente desde la primera consulta
                hasta la firma del contrato, garantizando seguridad jurídica y transparencia
                total en cada paso.
              </p>
            </motion.div>
          </div>

          {/* Right: logo + stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-border w-32 sm:w-40 flex items-center justify-center">
                <img
                  src={logoElColibri}
                  alt="El Colibrí Bienes Raíces"
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-card border border-border rounded-2xl p-5 shadow-card"
                  >
                    <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center mb-3">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
