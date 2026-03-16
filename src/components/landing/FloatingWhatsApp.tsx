import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const whatsappNumber = "543794215684";
const message = encodeURIComponent("Hola! Me interesa información sobre alquileres.");
const WA_LINK = `https://wa.me/${whatsappNumber}?text=${message}`;

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-[100] bg-whatsapp text-primary-foreground p-4 rounded-full shadow-wa flex items-center justify-center"
    >
      <MessageCircle size={28} />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-25" />
    </motion.a>
  );
}
