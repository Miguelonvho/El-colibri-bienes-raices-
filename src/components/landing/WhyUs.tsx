import { motion } from "framer-motion";
import { ShieldCheck, MessageCircle, CheckCircle2, MapPin, FileText, Clock } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Propiedades 100% verificadas",
    desc: "Antes de publicar, inspeccionamos cada propiedad. Lo que ves es exactamente lo que encontrás.",
  },
  {
    icon: MessageCircle,
    title: "Atención rápida por WhatsApp",
    desc: "Respondemos tus consultas el mismo día. Sin formularios eternos, sin esperas innecesarias.",
  },
  {
    icon: FileText,
    title: "Seguridad jurídica real",
    desc: "Contratos claros bajo la normativa argentina vigente. Te explicamos todo antes de firmar.",
  },
  {
    icon: CheckCircle2,
    title: "Requisitos flexibles",
    desc: "Trabajamos con seguros de caución y otras opciones. No te bloqueamos por falta de garante.",
  },
  {
    icon: MapPin,
    title: "Expertos locales en Corrientes",
    desc: "Conocemos cada barrio, cada edificio, cada zona. Te orientamos según tu perfil y necesidades.",
  },
  {
    icon: Clock,
    title: "Acompañamiento completo",
    desc: "Desde la primera búsqueda hasta la entrega de llaves. Estamos en cada etapa del proceso.",
  },
];

export default function WhyUs() {
  return (
    <section id="beneficios" className="py-24 bg-foreground px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-primary uppercase tracking-widest"
          >
            Por qué elegirnos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-4xl font-extrabold text-background mt-2"
          >
            La diferencia que se siente <br className="hidden sm:block" />
            desde la primera consulta.
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-background/6 border border-background/10 rounded-3xl p-6 hover:bg-background/10 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  <Icon className="text-primary" size={22} />
                </div>
                <h3 className="text-lg font-bold text-background mb-2">{b.title}</h3>
                <p className="text-sm text-background/60 leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
