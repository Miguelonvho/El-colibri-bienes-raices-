/**
 * Lightbox para visualizar imágenes a pantalla completa.
 * Se abre al hacer clic en cualquier foto del carrusel.
 * Soporta navegación con botones y teclado (←/→/Escape).
 */

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxImagenesProps {
  /** Lista completa de imágenes de la galería */
  imagenes: string[];
  /** Índice de la imagen que se muestra al abrir */
  indiceInicial: number;
  /** Controla si el lightbox está visible */
  abierto: boolean;
  /** Callback para cerrar el lightbox */
  onCerrar: () => void;
}

export default function LightboxImagenes({
  imagenes,
  indiceInicial,
  abierto,
  onCerrar,
}: LightboxImagenesProps) {
  const [indice, setIndice] = useState(indiceInicial);

  // Sincroniza el índice cada vez que se abre el lightbox desde una foto distinta
  useEffect(() => {
    if (abierto) setIndice(indiceInicial);
  }, [abierto, indiceInicial]);

  const anterior = useCallback(() => {
    setIndice((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  }, [imagenes.length]);

  const siguiente = useCallback(() => {
    setIndice((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  }, [imagenes.length]);

  // Navegación con teclado
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onCerrar, anterior, siguiente]);

  // Bloquea el scroll del body mientras el lightbox está abierto
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  if (!abierto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onCerrar}
    >
      {/* Botón cerrar */}
      <button
        onClick={onCerrar}
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
        aria-label="Cerrar"
      >
        <X size={20} />
      </button>

      {/* Contador de fotos */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums">
        {indice + 1} / {imagenes.length}
      </div>

      {/* Botón anterior */}
      <button
        onClick={(e) => { e.stopPropagation(); anterior(); }}
        className="absolute left-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
        aria-label="Foto anterior"
      >
        <ChevronLeft size={26} />
      </button>

      {/* Imagen con fade al cambiar de slide */}
      <motion.img
        key={indice}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        src={imagenes[indice]}
        alt={`Foto ${indice + 1} de ${imagenes.length}`}
        className="max-w-[88vw] max-h-[88vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Botón siguiente */}
      <button
        onClick={(e) => { e.stopPropagation(); siguiente(); }}
        className="absolute right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
        aria-label="Foto siguiente"
      >
        <ChevronRight size={26} />
      </button>
    </div>,
    document.body,
  );
}
