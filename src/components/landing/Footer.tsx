import { MessageCircle, MapPin, Phone, Instagram } from "lucide-react";
import logoElColibri from "@/assets/logo-el-colibri.png";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/70 px-4 sm:px-6 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src={logoElColibri}
              alt="El Colibrí Bienes Raíces"
              className="h-20 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed max-w-xs">
              Inmobiliaria de confianza en Corrientes Capital. Alquileres, ventas y
              asesoramiento con transparencia y seguridad jurídica desde hace más de 10 años.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-background font-bold text-sm mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Propiedades", href: "#propiedades" },
                { label: "Nosotros", href: "#nosotros" },
                { label: "Por qué elegirnos", href: "#beneficios" },
                { label: "Preguntas frecuentes", href: "#faq" },
                { label: "Contacto", href: "#contacto" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-primary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-background font-bold text-sm mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-primary flex-shrink-0" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Av.+3+de+Abril+576,+Corrientes+Capital,+Argentina" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors"
                >
                  Av. 3 de Abril 576, Corrientes Capital, Argentina
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={14} className="text-primary flex-shrink-0" />
                <a 
                  href="https://www.instagram.com/elcolibribienesraices" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary transition-colors"
                >
                  @elcolibribienesraices
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <a href="tel:+543794215684" className="hover:text-primary transition-colors">
                  +54 379 4215684
                </a>
              </li>
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-whatsapp text-background px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity mt-1"
                >
                  <MessageCircle size={14} />
                  WhatsApp directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>© {new Date().getFullYear()} El Colibrí Bienes Raíces. Todos los derechos reservados.</p>
          <p>Corrientes Capital, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
