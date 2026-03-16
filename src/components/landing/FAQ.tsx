import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const faqs = [
  {
    q: "¿Qué requisitos necesito para alquilar?",
    a: "En general solicitamos recibo de sueldo del inquilino y dos garantes con recibo o propiedad. Sin embargo, también trabajamos con seguros de caución para quienes no cuenten con garantía propietaria. Consultanos por tu situación y buscamos la opción más accesible.",
  },
  {
    q: "¿Cómo coordino una visita a una propiedad?",
    a: "Muy fácil: tocá el botón de WhatsApp en la propiedad que te interese y en el mismo día coordinamos la visita. Sin formularios, sin esperas. Así de simple.",
  },
  {
    q: "¿Qué gastos iniciales debo considerar?",
    a: "Al momento de ingresar, generalmente se abona el primer mes de alquiler, uno o dos meses de depósito (reintegrable al finalizar el contrato) y los honorarios inmobiliarios correspondientes. Te detallamos todo antes de cerrar cualquier operación.",
  },
  {
    q: "¿Aceptan seguro de caución?",
    a: "Sí. Trabajamos con las principales aseguradoras del mercado para facilitar tu ingreso sin necesidad de garante propietario. Consultanos qué opciones están disponibles para cada propiedad.",
  },
  {
    q: "¿Cómo funcionan los aumentos del alquiler?",
    a: "Los contratos se rigen por la normativa vigente en Argentina. Te explicamos en detalle el esquema de actualización aplicable a cada contrato antes de firmar, para que no haya sorpresas.",
  },
  {
    q: "¿Atienden a estudiantes de la UNNE?",
    a: "Por supuesto. Tenemos propiedades especialmente pensadas para estudiantes universitarios: cerca de las facultades, con precios accesibles y requisitos adaptados a quienes dependen de sus familias. Es uno de nuestros perfiles principales.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <span className="font-bold text-foreground text-sm sm:text-base leading-snug">{q}</span>
        <ChevronRight
          size={18}
          className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-primary uppercase tracking-widest"
          >
            Preguntas frecuentes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2"
          >
            Todo lo que querés saber <br className="hidden sm:block" />
            <span className="text-primary">antes de consultar.</span>
          </motion.h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
