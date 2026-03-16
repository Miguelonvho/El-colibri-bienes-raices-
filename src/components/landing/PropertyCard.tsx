import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, MapPin, X, ZoomIn, CheckCircle2 } from "lucide-react";

const whatsappNumber = "543794215684";
const baseMessage = "Hola! Me interesa información sobre el alquiler de la propiedad: ";
const WA_LINK = (title: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(baseMessage + title)}`;

interface PropertyCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  badges?: string[];
  tag?: string;
  index: number;
}

export default function PropertyCard({
  image,
  title,
  subtitle,
  description,
  badges = [],
  tag = "Disponible",
  index,
}: PropertyCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        className="group bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
      >
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-card-overlay" />

          {/* Tag */}
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
            {tag}
          </div>

          {/* Zoom button */}
          <button
            onClick={() => setModalOpen(true)}
            className="absolute top-4 right-4 bg-card/90 backdrop-blur-md p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Ampliar imagen"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start gap-1 text-primary mb-2">
            <MapPin size={13} className="mt-0.5 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-tight text-primary">{subtitle}</span>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{description}</p>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {badges.map((b) => (
                <span
                  key={b}
                  className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-full"
                >
                  <CheckCircle2 size={10} />
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-foreground text-background px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-charcoal transition-colors"
            >
              Ver más
            </button>
            <a
              href={WA_LINK(title + " - " + subtitle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-primary-light text-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.article>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl overflow-hidden w-full max-w-lg shadow-card-hover"
            >
              <div className="relative h-64 sm:h-80">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 gradient-card-overlay" />
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 bg-card/90 backdrop-blur-md p-2 rounded-full text-foreground hover:bg-card transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} />{subtitle}
                  </p>
                  <h3 className="text-2xl font-extrabold text-primary-foreground leading-tight">{title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>

                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {badges.map((b) => (
                      <span key={b} className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={10} />{b}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={WA_LINK(title + " - " + subtitle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-whatsapp text-primary-foreground py-3.5 rounded-2xl font-bold text-base hover:opacity-90 transition-opacity shadow-wa"
                >
                  <MessageCircle size={20} />
                  Consultar disponibilidad por WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
