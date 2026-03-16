import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

export default function ContactCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola%21%20Me%20llamo%20${encodeURIComponent(form.name)}%20y%20me%20interesa%3A%20${encodeURIComponent(form.interest)}%20%7C%20Tel%3A%20${encodeURIComponent(form.phone)}`;
    window.open(`https://wa.me/543794215684?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-muted px-4 sm:px-6" id="contacto">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xs font-bold text-primary uppercase tracking-widest"
            >
              Contacto directo
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2 mb-4"
            >
              ¿Buscás alquilar <br />o comprar en{" "}
              <span className="text-primary">Corrientes?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-muted-foreground leading-relaxed mb-8"
            >
              Contamos con propiedades reales, contratos transparentes y un equipo
              que responde el mismo día. Escribinos y te ayudamos a encontrar la
              propiedad ideal para vos.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.24 }}
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-whatsapp text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-wa"
            >
              <MessageCircle size={24} />
              Escribir por WhatsApp
            </motion.a>

            <p className="text-xs text-muted-foreground mt-4">
              También podés llamar al{" "}
              <a
                href="tel:+543794215684"
                className="font-bold text-foreground hover:text-primary transition-colors"
              >
                +54 379 4215684
              </a>
            </p>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-8 gap-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">¡Gracias por contactarte!</h3>
                <p className="text-muted-foreground text-sm">Te redirigimos a WhatsApp para continuar la conversación con nuestro equipo.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground mb-1">Consultá disponibilidad</h3>
                <p className="text-sm text-muted-foreground mb-6">Te respondemos el mismo día.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan García"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Tu teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 3794 123456"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      ¿Qué estás buscando?
                    </label>
                    <select
                      required
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      <option value="">Seleccioná una opción</option>
                      <option value="Alquilar un departamento">Alquilar un departamento</option>
                      <option value="Alquilar una casa">Alquilar una casa</option>
                      <option value="Comprar una propiedad">Comprar una propiedad</option>
                      <option value="Alquilar una cochera">Alquilar una cochera</option>
                      <option value="Asesoramiento inmobiliario">Asesoramiento inmobiliario</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3.5 rounded-xl font-bold text-sm hover:bg-primary transition-colors shadow-card mt-2"
                  >
                    <Send size={16} />
                    Enviar consulta por WhatsApp
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
