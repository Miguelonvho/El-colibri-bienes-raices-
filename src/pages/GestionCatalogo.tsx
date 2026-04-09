/**
 * ============================================================
 * PÁGINA: Gestión del Catálogo (/gestion)
 * ============================================================
 * Panel de administración para gestionar las propiedades del catálogo.
 * Solo accesible por el dueño de la inmobiliaria.
 *
 * Funcionalidades:
 *   - Ver todas las propiedades activas con filtro por estado y búsqueda
 *   - Crear nueva propiedad (formulario en modal con imagen por URL o archivo)
 *   - Editar propiedad existente (formulario pre-completado)
 *   - Dar de baja una propiedad (baja lógica — no se elimina del sistema)
 *   - Ver propiedades dadas de baja y restaurarlas o eliminarlas definitivamente
 *   - Marcar/desmarcar como "destacada" (aparece en el inicio de la landing)
 *
 * ──────────────────────────────────────────────────────────
 * VISIBILIDAD PÚBLICA vs. ADMIN:
 *   - Público (inicio + catálogo): solo ve propiedades con etiqueta "Disponible"
 *     y que NO estén dadas de baja.
 *   - Admin (este panel): ve TODAS las propiedades y sus estados reales.
 *
 * ──────────────────────────────────────────────────────────
 * AUTENTICACIÓN (pendiente):
 * Cuando se implemente el login, descomentar el bloque marcado
 * con "AUTENTICACIÓN" más abajo.
 * ──────────────────────────────────────────────────────────
 */

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Star,
  StarOff,
  Search,
  X,
  ImageOff,
  CheckCircle2,
  MapPin,
  LayoutGrid,
  Eye,
  ArchiveX,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Tag,
  Maximize2,
  DoorOpen,
  Banknote,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // ← Descomentar para redirección de auth

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MapaEditable from "@/components/MapaEditable";
import {
  obtenerPropiedades,
  guardarPropiedades,
  generarNuevoId,
  type Propiedad,
} from "@/data/propiedades";

// ─────────────────────────────────────────────────────────────
// AUTENTICACIÓN (pendiente de implementar)
// ─────────────────────────────────────────────────────────────
/*
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useRequiereAuth() {
  const navigate = useNavigate();
  useEffect(() => {
    // TODO: Verificar token JWT en localStorage o cookie
    const token = localStorage.getItem("colibri_auth_token");
    if (!token) {
      navigate("/login");
    }
    // TODO: Verificar que el token no haya expirado
  }, [navigate]);
}
*/
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

/** Tipos de propiedad disponibles en el formulario */
const TIPOS_PROPIEDAD = [
  "Departamento",
  "Casa",
  "Cochera",
  "Local comercial",
  "Oficina",
  "Dúplex",
  "Terreno",
  "Otro",
];

/** Estados disponibles para una propiedad activa */
const ESTADOS_PROPIEDAD = [
  "Disponible",
  "Alquilado",
  "En negociación",
  "Reservado",
  "Pausado",
];

// ─────────────────────────────────────────────
// TIPOS INTERNOS
// ─────────────────────────────────────────────

type CamposFormulario = Omit<Propiedad, "id" | "dadaDeBaja">;

const formularioVacio: CamposFormulario = {
  imagen: "",
  titulo: "",
  subtitulo: "",
  descripcion: "",
  insignias: [],
  etiqueta: "Disponible",
  tipo: "Departamento",
  precio: "Consultar",
  superficie: "",
  ambientes: undefined,
  destacada: false,
  // Coordenadas por defecto: centro de Corrientes Capital.
  // El admin puede mover el marcador o buscar la dirección exacta.
  ubicacion: { lat: -27.481, lng: -58.8253 },
};

// ─────────────────────────────────────────────
// UTILIDAD: Redimensionar imagen para almacenamiento
// ─────────────────────────────────────────────

/**
 * Redimensiona una imagen a un ancho máximo y la comprime a JPEG.
 * Se usa al cargar archivos desde el explorador para evitar que las imágenes
 * en base64 excedan el límite de localStorage (~5MB por dominio).
 *
 * TODO (backend): Cuando haya servidor, reemplazar esto por un upload
 * real a un CDN (S3, Cloudinary, etc.) y guardar solo la URL devuelta.
 *
 * @param archivo - Archivo de imagen seleccionado
 * @param anchoMaximo - Ancho máximo en píxeles (por defecto 800px)
 * @returns Promesa con la imagen en formato base64 (data URL)
 */
function redimensionarImagen(archivo: File, anchoMaximo = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calcular el factor de escala para no superar el ancho máximo
        const escala = Math.min(anchoMaximo / img.width, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No se pudo crear el contexto canvas")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Comprimir a JPEG con calidad 80% para reducir el tamaño
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
      img.src = e.target?.result as string;
    };
    lector.onerror = () => reject(new Error("No se pudo leer el archivo"));
    lector.readAsDataURL(archivo);
  });
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function GestionCatalogo() {
  // useRequiereAuth(); // ← Descomentar cuando haya autenticación

  // ── Lista de propiedades ───────────────────
  const [propiedades, setPropiedades] = useState<Propiedad[]>(obtenerPropiedades);

  // ── Modal formulario ───────────────────────
  const [modalAbierto, setModalAbierto] = useState(false);
  const [propiedadEditando, setPropiedadEditando] = useState<Propiedad | null>(null);
  const [formulario, setFormulario] = useState<CamposFormulario>(formularioVacio);
  const [insigniaTexto, setInsigniaTexto] = useState("");
  const [cargandoImagen, setCargandoImagen] = useState(false);

  // ── Confirmación de baja ───────────────────
  const [idParaBaja, setIdParaBaja] = useState<number | null>(null);

  // ── Modal detalle de propiedad dada de baja (solo lectura) ──
  const [propiedadDetalleBaja, setPropiedadDetalleBaja] = useState<Propiedad | null>(null);

  // ── Filtros de propiedades activas ─────────
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // ── Buscador dentro de la sección de bajas ─
  const [busquedaBajas, setBusquedaBajas] = useState("");

  // ── Sección "dados de baja" expandida ─────
  const [bajasExpandidas, setBajasExpandidas] = useState(false);

  // ── Notificación de éxito ──────────────────
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // DATOS DERIVADOS
  // ─────────────────────────────────────────────

  /** Propiedades activas (no dadas de baja) con filtros aplicados */
  const propiedadesActivas = useMemo(() => {
    return propiedades
      .filter((p) => !p.dadaDeBaja)
      .filter((p) => filtroEstado === "Todos" || p.etiqueta === filtroEstado)
      .filter((p) => {
        if (!textoBusqueda.trim()) return true;
        const texto = textoBusqueda.toLowerCase();
        return (
          p.titulo.toLowerCase().includes(texto) ||
          p.subtitulo.toLowerCase().includes(texto) ||
          p.tipo.toLowerCase().includes(texto)
        );
      });
  }, [propiedades, filtroEstado, textoBusqueda]);

  /** Propiedades dadas de baja, filtradas por el buscador interno de esa sección */
  const propiedadesDadaDeBaja = useMemo(() => {
    const bajas = propiedades.filter((p) => p.dadaDeBaja);
    if (!busquedaBajas.trim()) return bajas;
    const texto = busquedaBajas.toLowerCase();
    return bajas.filter(
      (p) =>
        p.titulo.toLowerCase().includes(texto) ||
        p.subtitulo.toLowerCase().includes(texto) ||
        p.tipo.toLowerCase().includes(texto)
    );
  }, [propiedades, busquedaBajas]);

  /** Total de bajas sin filtro, para mostrar el contador real en el encabezado */
  const totalBajas = useMemo(
    () => propiedades.filter((p) => p.dadaDeBaja).length,
    [propiedades]
  );

  // ─────────────────────────────────────────────
  // FUNCIONES AUXILIARES
  // ─────────────────────────────────────────────

  const actualizarYGuardar = (nuevaLista: Propiedad[]) => {
    setPropiedades(nuevaLista);
    guardarPropiedades(nuevaLista);
  };

  const mostrarExito = (mensaje: string) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const abrirModalCrear = () => {
    setPropiedadEditando(null);
    setFormulario(formularioVacio);
    setInsigniaTexto("");
    setModalAbierto(true);
  };

  const abrirModalEditar = (propiedad: Propiedad) => {
    setPropiedadEditando(propiedad);
    setFormulario({
      imagen: propiedad.imagen,
      titulo: propiedad.titulo,
      subtitulo: propiedad.subtitulo,
      descripcion: propiedad.descripcion,
      insignias: [...propiedad.insignias],
      etiqueta: propiedad.etiqueta,
      tipo: propiedad.tipo,
      precio: propiedad.precio ?? "Consultar",
      superficie: propiedad.superficie ?? "",
      ambientes: propiedad.ambientes,
      destacada: propiedad.destacada ?? false,
      // Cargamos las coordenadas existentes de la propiedad para editarlas
      ubicacion: propiedad.ubicacion,
    });
    setInsigniaTexto("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPropiedadEditando(null);
  };

  // ─────────────────────────────────────────────
  // OPERACIONES CRUD
  // ─────────────────────────────────────────────

  /** Guarda la propiedad (crear o editar) */
  const guardarFormulario = () => {
    if (!formulario.titulo.trim() || !formulario.subtitulo.trim()) {
      alert("El título y la dirección son obligatorios.");
      return;
    }

    if (propiedadEditando) {
      // EDITAR: actualiza la propiedad manteniendo su id y estado de baja
      const lista = propiedades.map((p) =>
        p.id === propiedadEditando.id
          ? { ...formulario, id: propiedadEditando.id, dadaDeBaja: false }
          : p
      );
      actualizarYGuardar(lista);
      mostrarExito("Propiedad actualizada correctamente.");
    } else {
      // CREAR: agrega una nueva propiedad al final
      const nueva: Propiedad = {
        ...formulario,
        id: generarNuevoId(),
        dadaDeBaja: false,
      };
      actualizarYGuardar([...propiedades, nueva]);
      mostrarExito("Propiedad creada correctamente.");
    }
    cerrarModal();
  };

  /**
   * BAJA LÓGICA: marca la propiedad como dada de baja.
   * La propiedad NO se elimina del sistema.
   * Se puede restaurar desde la sección "Dados de baja".
   */
  const confirmarBaja = () => {
    if (idParaBaja === null) return;
    const lista = propiedades.map((p) =>
      p.id === idParaBaja ? { ...p, dadaDeBaja: true, destacada: false } : p
    );
    actualizarYGuardar(lista);
    setIdParaBaja(null);
    mostrarExito("Propiedad dada de baja. Podés restaurarla desde la sección inferior.");
    // Expandir automáticamente la sección de bajas para que el admin la vea
    setBajasExpandidas(true);
  };

  /** Restaura una propiedad previamente dada de baja */
  const restaurarPropiedad = (id: number) => {
    const lista = propiedades.map((p) =>
      p.id === id ? { ...p, dadaDeBaja: false } : p
    );
    actualizarYGuardar(lista);
    mostrarExito("Propiedad restaurada al catálogo activo.");
  };

  // (No hay eliminación física — solo baja lógica y restauración)

  /** Alterna el estado "destacada" de una propiedad activa */
  const alternarDestacada = (id: number) => {
    const lista = propiedades.map((p) =>
      p.id === id ? { ...p, destacada: !p.destacada } : p
    );
    actualizarYGuardar(lista);
  };

  // ─────────────────────────────────────────────
  // MANEJO DEL FORMULARIO
  // ─────────────────────────────────────────────

  const cambiarCampo = (
    campo: keyof CamposFormulario,
    valor: string | number | boolean | string[] | { lat: number; lng: number } | undefined
  ) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const agregarInsignia = () => {
    const texto = insigniaTexto.trim();
    if (!texto || formulario.insignias.includes(texto)) return;
    cambiarCampo("insignias", [...formulario.insignias, texto]);
    setInsigniaTexto("");
  };

  const quitarInsignia = (insignia: string) => {
    cambiarCampo("insignias", formulario.insignias.filter((i) => i !== insignia));
  };

  /**
   * Maneja la selección de un archivo de imagen desde el explorador.
   * Redimensiona y comprime la imagen antes de guardarla como base64.
   */
  const manejarArchivoImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    // Validar que sea una imagen
    if (!archivo.type.startsWith("image/")) {
      alert("Por favor seleccioná un archivo de imagen (JPG, PNG, WEBP, etc.).");
      return;
    }
    try {
      setCargandoImagen(true);
      const base64 = await redimensionarImagen(archivo, 800);
      cambiarCampo("imagen", base64);
    } catch (error) {
      alert("No se pudo cargar la imagen. Intentá con otro archivo.");
      console.error("Error al procesar imagen:", error);
    } finally {
      setCargandoImagen(false);
      // Limpiar el input para que se pueda volver a seleccionar el mismo archivo
      e.target.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Encabezado ───────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Panel de administración
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-1">
                Gestión del Catálogo
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {propiedades.filter((p) => !p.dadaDeBaja).length} activa{propiedades.filter((p) => !p.dadaDeBaja).length !== 1 ? "s" : ""} ·{" "}
                {propiedades.filter((p) => p.destacada && !p.dadaDeBaja).length} destacada{propiedades.filter((p) => p.destacada && !p.dadaDeBaja).length !== 1 ? "s" : ""} ·{" "}
                {totalBajas} dada{totalBajas !== 1 ? "s" : ""} de baja
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/catalogo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <Eye size={15} />
                Ver catálogo público
              </Link>
              <button
                onClick={abrirModalCrear}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity shadow-primary"
              >
                <Plus size={18} />
                Nueva propiedad
              </button>
            </div>
          </div>

          {/* ── Notificación de éxito ────────────── */}
          <AnimatePresence>
            {mensajeExito && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 bg-primary-light text-primary border border-primary/20 rounded-2xl px-4 py-3 mb-6 text-sm font-semibold"
              >
                <CheckCircle2 size={16} />
                {mensajeExito}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Búsqueda + Filtros por estado ────── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Buscador de texto */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre, dirección..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Filtros por estado */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal size={15} className="text-muted-foreground flex-shrink-0" />
              {["Todos", ...ESTADOS_PROPIEDAD].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                    filtroEstado === estado
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>

          {/* ── Grilla de propiedades activas ───── */}
          {propiedadesActivas.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <LayoutGrid size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No hay propiedades con ese filtro</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {propiedadesActivas.map((propiedad) => (
                <TarjetaGestion
                  key={propiedad.id}
                  propiedad={propiedad}
                  onEditar={() => abrirModalEditar(propiedad)}
                  onDarDeBaja={() => setIdParaBaja(propiedad.id)}
                  onAlternarDestacada={() => alternarDestacada(propiedad.id)}
                />
              ))}
            </div>
          )}

          {/* ── Sección: Propiedades dadas de baja ── */}
          {/* Siempre visible para que el admin pueda encontrarla */}
          <div className="border border-border rounded-3xl overflow-hidden">

            {/* Cabecera colapsable */}
            <button
              onClick={() => setBajasExpandidas(!bajasExpandidas)}
              className="w-full flex items-center justify-between px-6 py-4 bg-muted hover:bg-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArchiveX size={18} className="text-muted-foreground" />
                <span className="font-bold text-foreground text-sm">
                  Propiedades dadas de baja
                </span>
                {/* Muestra el total real, no el filtrado */}
                <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full">
                  {totalBajas}
                </span>
              </div>
              {bajasExpandidas ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Contenido colapsable */}
            <AnimatePresence>
              {bajasExpandidas && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {/* Buscador dentro de la sección de bajas */}
                  <div className="px-6 pt-5 pb-2">
                    <div className="relative max-w-sm">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar entre las dadas de baja..."
                        value={busquedaBajas}
                        onChange={(e) => setBusquedaBajas(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  {/* Grilla de bajas o mensaje vacío */}
                  {propiedadesDadaDeBaja.length > 0 ? (
                    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {propiedadesDadaDeBaja.map((propiedad) => (
                        <TarjetaBaja
                          key={propiedad.id}
                          propiedad={propiedad}
                          onVerDetalle={() => setPropiedadDetalleBaja(propiedad)}
                          onRestaurar={() => restaurarPropiedad(propiedad.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {busquedaBajas
                        ? "No se encontraron propiedades con ese criterio."
                        : "No hay propiedades dadas de baja."}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── Modal: Formulario crear/editar ──────── */}
      <AnimatePresence>
        {modalAbierto && (
          <ModalFormulario
            esEdicion={!!propiedadEditando}
            formulario={formulario}
            insigniaTexto={insigniaTexto}
            cargandoImagen={cargandoImagen}
            onCambiarCampo={cambiarCampo}
            onCambiarInsigniaTexto={setInsigniaTexto}
            onAgregarInsignia={agregarInsignia}
            onQuitarInsignia={quitarInsignia}
            onArchivoImagen={manejarArchivoImagen}
            onGuardar={guardarFormulario}
            onCerrar={cerrarModal}
          />
        )}
      </AnimatePresence>

      {/* ── Modal: Confirmar baja lógica ────────── */}
      <AnimatePresence>
        {idParaBaja !== null && (
          <ModalConfirmacion
            titulo="¿Dar de baja esta propiedad?"
            descripcion="La propiedad dejará de aparecer en el catálogo público y en el inicio. Podés restaurarla en cualquier momento desde la sección &quot;Propiedades dadas de baja&quot;."
            nombrePropiedad={propiedades.find((p) => p.id === idParaBaja)?.titulo ?? ""}
            textoConfirmar="Dar de baja"
            colorConfirmar="bg-orange-500 text-white hover:opacity-90"
            icono={<ArchiveX size={28} className="text-orange-500" />}
            iconoFondo="bg-orange-50"
            onConfirmar={confirmarBaja}
            onCancelar={() => setIdParaBaja(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Modal: Detalle de propiedad dada de baja (solo lectura) ── */}
      <AnimatePresence>
        {propiedadDetalleBaja && (
          <ModalDetalleBaja
            propiedad={propiedadDetalleBaja}
            onRestaurar={() => {
              restaurarPropiedad(propiedadDetalleBaja.id);
              setPropiedadDetalleBaja(null);
            }}
            onCerrar={() => setPropiedadDetalleBaja(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Tarjeta de propiedad activa
// ─────────────────────────────────────────────────────────────

function TarjetaGestion({
  propiedad,
  onEditar,
  onDarDeBaja,
  onAlternarDestacada,
}: {
  propiedad: Propiedad;
  onEditar: () => void;
  onDarDeBaja: () => void;
  onAlternarDestacada: () => void;
}) {
  /** Color del badge de estado según la etiqueta */
  const colorEstado: Record<string, string> = {
    "Disponible": "bg-primary-light text-primary",
    "Alquilado": "bg-blue-50 text-blue-700",
    "En negociación": "bg-yellow-50 text-yellow-700",
    "Reservado": "bg-purple-50 text-purple-700",
    "Pausado": "bg-gray-100 text-gray-600",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      className="bg-card rounded-3xl border border-border shadow-card overflow-hidden flex flex-col"
    >
      {/* Imagen */}
      <div className="relative h-44 overflow-hidden bg-muted">
        {propiedad.imagen ? (
          <img
            src={propiedad.imagen}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff size={32} />
          </div>
        )}

        {/* Badge de estado (visible solo al admin) */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${colorEstado[propiedad.etiqueta] ?? "bg-muted text-muted-foreground"}`}>
          {propiedad.etiqueta}
        </div>

        {/* Botón destacar */}
        <button
          onClick={onAlternarDestacada}
          title={propiedad.destacada ? "Quitar de destacadas" : "Marcar como destacada"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
            propiedad.destacada
              ? "bg-yellow-400/90 text-yellow-900"
              : "bg-card/90 text-muted-foreground hover:text-yellow-500"
          }`}
        >
          {propiedad.destacada ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-primary mb-1">
          <MapPin size={11} />
          <span className="text-xs font-semibold uppercase tracking-tight truncate">
            {propiedad.subtitulo}
          </span>
        </div>
        <h3 className="font-bold text-foreground text-base leading-tight mb-1">
          {propiedad.titulo}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{propiedad.descripcion}</p>

        {/* Metadatos */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
            {propiedad.tipo}
          </span>
          {propiedad.superficie && (
            <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
              {propiedad.superficie}
            </span>
          )}
          {propiedad.ambientes !== undefined && (
            <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
              {propiedad.ambientes} amb.
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-auto">
          {/* Ver más: navega a la vista de detalle del inmueble (misma página que el catálogo público) */}
          <Link
            to={`/inmueble/${propiedad.id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-muted text-muted-foreground hover:bg-border transition-colors"
          >
            <Eye size={13} />
            Ver más
          </Link>
          {/* Editar */}
          <button
            onClick={onEditar}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Pencil size={13} />
            Editar
          </button>
          {/* Dar de baja (baja lógica) */}
          <button
            onClick={onDarDeBaja}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
          >
            <ArchiveX size={13} />
            Dar de baja
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Tarjeta de propiedad dada de baja
// ─────────────────────────────────────────────────────────────

/**
 * Tarjeta de propiedad dada de baja.
 * Solo lectura: permite ver el detalle y restaurar, pero no editar ni eliminar.
 */
function TarjetaBaja({
  propiedad,
  onVerDetalle,
  onRestaurar,
}: {
  propiedad: Propiedad;
  onVerDetalle: () => void;
  onRestaurar: () => void;
}) {
  return (
    <div className="bg-card rounded-2xl border border-dashed border-border overflow-hidden flex flex-col opacity-70 hover:opacity-100 transition-opacity">
      {/* Imagen atenuada — clic abre el detalle */}
      <div
        className="relative h-36 overflow-hidden bg-muted grayscale cursor-pointer"
        onClick={onVerDetalle}
      >
        {propiedad.imagen ? (
          <img src={propiedad.imagen} alt={propiedad.titulo} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff size={24} />
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="absolute top-2 left-2 bg-destructive/90 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          Baja
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground truncate mb-0.5">{propiedad.subtitulo}</p>
        <h4
          className="font-bold text-foreground text-sm leading-tight mb-3 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={onVerDetalle}
        >
          {propiedad.titulo}
        </h4>

        {/* Acciones */}
        <div className="flex gap-2 mt-auto">
          {/* Ver detalle (solo lectura) */}
          <button
            onClick={onVerDetalle}
            className="flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-muted text-muted-foreground hover:bg-border transition-colors"
          >
            <Eye size={13} />
          </button>
          {/* Restaurar al catálogo activo */}
          <button
            onClick={onRestaurar}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-primary-light text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <RotateCcw size={12} />
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Modal formulario (crear / editar)
// ─────────────────────────────────────────────────────────────

function ModalFormulario({
  esEdicion,
  formulario,
  insigniaTexto,
  cargandoImagen,
  onCambiarCampo,
  onCambiarInsigniaTexto,
  onAgregarInsignia,
  onQuitarInsignia,
  onArchivoImagen,
  onGuardar,
  onCerrar,
}: {
  esEdicion: boolean;
  formulario: CamposFormulario;
  insigniaTexto: string;
  cargandoImagen: boolean;
  onCambiarCampo: (campo: keyof CamposFormulario, valor: string | number | boolean | string[] | { lat: number; lng: number } | undefined) => void;
  onCambiarInsigniaTexto: (texto: string) => void;
  onAgregarInsignia: () => void;
  onQuitarInsignia: (insignia: string) => void;
  onArchivoImagen: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGuardar: () => void;
  onCerrar: () => void;
}) {
  // Referencia al input de archivo (para abrirlo al hacer click en el botón)
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  // Estado del modo de carga de imagen: "url" o "archivo"
  const [modoImagen, setModoImagen] = useState<"url" | "archivo">("url");

  // ── Geocodificación ──────────────────────────────────────────────────────────
  // Estado de carga y error para la búsqueda de coordenadas por dirección

  /** Indica si hay una búsqueda de coordenadas en curso */
  const [geocodificando, setGeocodificando] = useState(false);

  /** Mensaje de error si la geocodificación falla o no encuentra resultados */
  const [errorGeocodificacion, setErrorGeocodificacion] = useState<string | null>(null);

  /**
   * Sube cada vez que la geocodificación completa con éxito.
   * MapaEditable escucha este valor para saber cuándo volar hacia la nueva ubicación.
   */
  const [claveGeocoding, setClaveGeocoding] = useState(0);

  /**
   * Busca las coordenadas geográficas de la propiedad usando la API de Nominatim
   * (OpenStreetMap). Toma la dirección del campo "subtitulo" del formulario.
   *
   * Si encuentra la dirección, actualiza el campo "ubicacion" del formulario,
   * lo que a su vez hace que el MapaEditable vuele animadamente hacia ese punto.
   *
   * Nominatim es gratuito y no requiere clave de API. Límite: 1 req/seg.
   * Para uso de prototipo con un solo admin, esto es más que suficiente.
   *
   * TODO (mejora): agregar debounce si se conecta a un input con autocomplete.
   */
  const buscarCoordenadas = async () => {
    const direccion = formulario.subtitulo.trim();
    if (!direccion) {
      setErrorGeocodificacion("Primero ingresá la dirección en el campo de arriba.");
      return;
    }
    setGeocodificando(true);
    setErrorGeocodificacion(null);
    try {
      // Si la dirección no menciona Corrientes, la agregamos como contexto para
      // que Nominatim encuentre calles locales sin ambigüedad (ej: "Colombia 920"
      // puede existir en muchas ciudades de Argentina).
      const mencionaCorrientes = /corrientes/i.test(direccion);
      const consultaCompleta = mencionaCorrientes ? direccion : `${direccion}, Corrientes, Argentina`;
      const consulta = encodeURIComponent(consultaCompleta);
      const respuesta = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${consulta}&format=json&limit=1&countrycodes=ar`,
        { headers: { "Accept-Language": "es" } }
      );
      const datos = (await respuesta.json()) as Array<{ lat: string; lon: string }>;

      if (datos.length === 0) {
        setErrorGeocodificacion(
          "No se encontró la dirección. Probá con más detalle (ej: 'Colombia 920, Corrientes') o marcá la ubicación directamente en el mapa."
        );
        return;
      }

      // Actualizamos la ubicación y subimos la clave para que el mapa vuele hacia ahí
      onCambiarCampo("ubicacion", {
        lat: parseFloat(datos[0].lat),
        lng: parseFloat(datos[0].lon),
      });
      setClaveGeocoding((c) => c + 1);
    } catch {
      setErrorGeocodificacion("Error al buscar la dirección. Verificá tu conexión a internet.");
    } finally {
      setGeocodificando(false);
    }
  };
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card-hover"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-foreground">
            {esEdicion ? "Editar propiedad" : "Nueva propiedad"}
          </h2>
          <button onClick={onCerrar} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-5">

          {/* ── Imagen ─────────────────────────── */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Imagen</label>

            {/* Selector de modo: URL o archivo */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setModoImagen("url")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  modoImagen === "url"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                <LinkIcon size={13} />
                Pegar URL
              </button>
              <button
                type="button"
                onClick={() => setModoImagen("archivo")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  modoImagen === "archivo"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                }`}
              >
                <Upload size={13} />
                Subir archivo
              </button>
            </div>

            {/* Input URL */}
            {modoImagen === "url" && (
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formulario.imagen.startsWith("data:") ? "" : formulario.imagen}
                onChange={(e) => onCambiarCampo("imagen", e.target.value)}
                className="campo-formulario"
              />
            )}

            {/* Input archivo */}
            {modoImagen === "archivo" && (
              <div>
                {/* Input oculto */}
                <input
                  ref={inputArchivoRef}
                  type="file"
                  accept="image/*"
                  onChange={onArchivoImagen}
                  className="hidden"
                />
                {/* Botón de carga / zona de drop */}
                <button
                  type="button"
                  onClick={() => inputArchivoRef.current?.click()}
                  disabled={cargandoImagen}
                  className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  {cargandoImagen ? (
                    <>
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Procesando imagen...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-xs font-semibold">Seleccionar imagen</span>
                      <span className="text-xs opacity-60">JPG, PNG, WEBP — se redimensiona automáticamente</span>
                    </>
                  )}
                </button>
                {/* Nota sobre almacenamiento */}
                <p className="text-xs text-muted-foreground mt-1.5">
                  La imagen se guarda localmente en el navegador.{" "}
                  {/* TODO (backend): Reemplazar por upload a CDN cuando haya servidor */}
                  Cuando se conecte el servidor, se subirá a un CDN.
                </p>
              </div>
            )}

            {/* Vista previa de imagen */}
            {formulario.imagen && (
              <div className="mt-3 relative">
                <img
                  src={formulario.imagen}
                  alt="Vista previa"
                  className="h-36 w-full object-cover rounded-xl border border-border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => onCambiarCampo("imagen", "")}
                  className="absolute top-2 right-2 bg-card/90 p-1 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                  title="Quitar imagen"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Título <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Departamento de Dos Dormitorios"
              value={formulario.titulo}
              onChange={(e) => onCambiarCampo("titulo", e.target.value)}
              className="campo-formulario"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
              Dirección <span className="text-destructive">*</span>
              {/* Spinner que aparece mientras se buscan las coordenadas */}
              {geocodificando && <Loader2 size={13} className="animate-spin text-primary" />}
            </label>
            <input
              type="text"
              placeholder="Ej: Colombia 920, Corrientes Capital"
              value={formulario.subtitulo}
              onChange={(e) => onCambiarCampo("subtitulo", e.target.value)}
              onKeyDown={(e) => {
                // Al presionar Enter, buscamos las coordenadas en el mapa
                if (e.key === "Enter") {
                  e.preventDefault();
                  buscarCoordenadas();
                }
              }}
              className="campo-formulario"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Presioná Enter para buscar la ubicación en el mapa.
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Descripción</label>
            <textarea
              placeholder="Describe la propiedad en detalle..."
              value={formulario.descripcion}
              onChange={(e) => onCambiarCampo("descripcion", e.target.value)}
              rows={4}
              className="campo-formulario resize-none"
            />
          </div>

          {/* Tipo + Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Tipo</label>
              <select value={formulario.tipo} onChange={(e) => onCambiarCampo("tipo", e.target.value)} className="campo-formulario">
                {TIPOS_PROPIEDAD.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Estado</label>
              <select value={formulario.etiqueta} onChange={(e) => onCambiarCampo("etiqueta", e.target.value)} className="campo-formulario">
                {ESTADOS_PROPIEDAD.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Precio + Superficie + Ambientes */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Precio</label>
              <input type="text" placeholder="$120.000" value={formulario.precio ?? ""} onChange={(e) => onCambiarCampo("precio", e.target.value)} className="campo-formulario" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Superficie</label>
              <input type="text" placeholder="65 m²" value={formulario.superficie ?? ""} onChange={(e) => onCambiarCampo("superficie", e.target.value)} className="campo-formulario" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Ambientes</label>
              <input
                type="number"
                placeholder="3"
                min={1}
                value={formulario.ambientes ?? ""}
                onChange={(e) => onCambiarCampo("ambientes", e.target.value ? Number(e.target.value) : "")}
                className="campo-formulario"
              />
            </div>
          </div>

          {/* Insignias */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Características</label>
            {formulario.insignias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formulario.insignias.map((ins) => (
                  <span key={ins} className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary-light px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={11} />
                    {ins}
                    <button onClick={() => onQuitarInsignia(ins)} className="hover:text-destructive transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Agregar característica (Enter)"
                value={insigniaTexto}
                onChange={(e) => onCambiarInsigniaTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAgregarInsignia())}
                className="campo-formulario flex-1"
              />
              <button type="button" onClick={onAgregarInsignia} className="px-4 py-2.5 bg-primary-light text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Destacada */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                formulario.destacada ? "bg-primary border-primary" : "border-border group-hover:border-primary"
              }`}
              onClick={() => onCambiarCampo("destacada", !formulario.destacada)}
            >
              {formulario.destacada && <CheckCircle2 size={12} className="text-primary-foreground" />}
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">Mostrar en Propiedades Destacadas</span>
              <p className="text-xs text-muted-foreground">Aparecerá en la sección de inicio de la landing (solo si está Disponible).</p>
            </div>
          </label>

          {/* ── Ubicación en el mapa ────────────────────────────────────────────────
           * El admin puede marcar la ubicación del inmueble de tres formas:
           *   1. Botón "Buscar dirección": geocodifica la dirección ya ingresada
           *      usando la API de Nominatim (OpenStreetMap, gratuita y sin clave).
           *   2. Clic en el mapa: coloca o mueve el marcador al punto clickeado.
           *   3. Campos manuales de lat/lng: para corrección exacta de coordenadas.
           * El marcador siempre se puede arrastrar para ajustar la posición final.
           * Si no se completa, el mapa simplemente no aparece en el detalle público.
           */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Ubicación en el mapa
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(opcional)</span>
            </label>

            {/* Hint: las dos formas de marcar la ubicación */}
            <p className="text-xs text-muted-foreground mb-3">
              Hacé clic en el mapa para colocar el marcador, o presioná Enter en el campo Dirección para buscarlo automáticamente.
            </p>

            {/* Error de geocodificación (si ocurre) */}
            {errorGeocodificacion && (
              <p className="text-xs text-destructive font-medium mb-2.5 flex items-start gap-1">
                <span className="mt-px">⚠</span>
                {errorGeocodificacion}
              </p>
            )}

            {/*
             * Mapa interactivo:
             *   - Clic en el mapa → coloca/mueve el marcador y actualiza lat/lng
             *   - Marcador draggable → arrastrar para ajustar posición
             *   - Si la geocodificación encuentra la dirección, el mapa vuela hacia ahí
             */}
            <MapaEditable
              ubicacion={formulario.ubicacion}
              nombrePropiedad={formulario.titulo || "Nueva propiedad"}
              onChange={(pos) => onCambiarCampo("ubicacion", pos)}
              claveGeocoding={claveGeocoding}
              altura="230px"
            />

            {/* Campos manuales de coordenadas — para corrección fina o ingreso directo */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  placeholder="-27.4844"
                  step="any"
                  value={formulario.ubicacion?.lat ?? ""}
                  onChange={(e) => {
                    const lat = parseFloat(e.target.value);
                    if (e.target.value === "" || e.target.value === "-") {
                      const lngActual = formulario.ubicacion?.lng;
                      onCambiarCampo("ubicacion", lngActual !== undefined ? { lat: 0, lng: lngActual } : undefined);
                    } else if (!isNaN(lat)) {
                      onCambiarCampo("ubicacion", { lat, lng: formulario.ubicacion?.lng ?? 0 });
                    }
                  }}
                  className="campo-formulario"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  placeholder="-58.7943"
                  step="any"
                  value={formulario.ubicacion?.lng ?? ""}
                  onChange={(e) => {
                    const lng = parseFloat(e.target.value);
                    if (e.target.value === "" || e.target.value === "-") {
                      const latActual = formulario.ubicacion?.lat;
                      onCambiarCampo("ubicacion", latActual !== undefined ? { lat: latActual, lng: 0 } : undefined);
                    } else if (!isNaN(lng)) {
                      onCambiarCampo("ubicacion", { lat: formulario.ubicacion?.lat ?? 0, lng });
                    }
                  }}
                  className="campo-formulario"
                />
              </div>
            </div>

            {/* Indicador de estado y botón para limpiar la ubicación */}
            {formulario.ubicacion && formulario.ubicacion.lat !== 0 && formulario.ubicacion.lng !== 0 ? (
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-primary font-semibold flex items-center gap-1">
                  <MapPin size={11} />
                  Ubicación marcada: {formulario.ubicacion.lat.toFixed(4)}, {formulario.ubicacion.lng.toFixed(4)}
                </p>
                <button
                  type="button"
                  onClick={() => onCambiarCampo("ubicacion", undefined)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Quitar ubicación
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1.5">
                Sin coordenadas — el mapa no se mostrará en el detalle del inmueble.
              </p>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-card">
          <button onClick={onCerrar} className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button onClick={onGuardar} className="flex-1 py-3 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-primary">
            {esEdicion ? "Guardar cambios" : "Crear propiedad"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Modal de detalle de propiedad dada de baja
// ─────────────────────────────────────────────────────────────

/**
 * Muestra los detalles completos de una propiedad dada de baja.
 * Es de SOLO LECTURA — no permite editar ningún campo.
 * Ofrece únicamente el botón "Restaurar" para volver a activarla.
 */
function ModalDetalleBaja({
  propiedad,
  onRestaurar,
  onCerrar,
}: {
  propiedad: Propiedad;
  onRestaurar: () => void;
  onCerrar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl w-full max-w-lg overflow-hidden shadow-card-hover"
      >
        {/* Imagen con gradiente y badge "Baja" */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-muted grayscale">
          {propiedad.imagen ? (
            <img src={propiedad.imagen} alt={propiedad.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageOff size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

          {/* Badge de baja */}
          <div className="absolute top-4 left-4 bg-destructive/90 text-white px-3 py-1 rounded-full text-xs font-bold">
            Dada de baja
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            className="absolute top-4 right-4 bg-card/90 backdrop-blur-md p-2 rounded-full text-foreground hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>

          {/* Título sobre la imagen */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin size={11} />
              {propiedad.subtitulo}
            </p>
            <h3 className="text-xl font-extrabold text-primary-foreground leading-tight">
              {propiedad.titulo}
            </h3>
          </div>
        </div>

        {/* Cuerpo del detalle */}
        <div className="p-6 space-y-4">
          {/* Descripción */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {propiedad.descripcion || <span className="italic">Sin descripción.</span>}
          </p>

          {/* Ficha técnica */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag size={13} className="text-primary" />
              <span>Tipo:</span>
              <span className="font-semibold text-foreground">{propiedad.tipo}</span>
            </div>
            {propiedad.superficie && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Maximize2 size={13} className="text-primary" />
                <span>Sup.:</span>
                <span className="font-semibold text-foreground">{propiedad.superficie}</span>
              </div>
            )}
            {propiedad.ambientes !== undefined && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DoorOpen size={13} className="text-primary" />
                <span>Amb.:</span>
                <span className="font-semibold text-foreground">{propiedad.ambientes}</span>
              </div>
            )}
            {propiedad.precio && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Banknote size={13} className="text-primary" />
                <span>Precio:</span>
                <span className="font-semibold text-foreground">{propiedad.precio}</span>
              </div>
            )}
          </div>

          {/* Insignias */}
          {propiedad.insignias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {propiedad.insignias.map((ins) => (
                <span key={ins} className="flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={10} />
                  {ins}
                </span>
              ))}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCerrar}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onRestaurar}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-primary"
            >
              <RotateCcw size={15} />
              Restaurar propiedad
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBCOMPONENTE: Modal de confirmación genérico
// ─────────────────────────────────────────────────────────────

function ModalConfirmacion({
  titulo,
  descripcion,
  nombrePropiedad,
  textoConfirmar,
  colorConfirmar,
  icono,
  iconoFondo,
  onConfirmar,
  onCancelar,
}: {
  titulo: string;
  descripcion: string;
  nombrePropiedad: string;
  textoConfirmar: string;
  colorConfirmar: string;
  icono: React.ReactNode;
  iconoFondo: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancelar}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl w-full max-w-sm p-6 shadow-card-hover text-center"
      >
        <div className={`w-14 h-14 rounded-full ${iconoFondo} flex items-center justify-center mx-auto mb-4`}>
          {icono}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{titulo}</h3>
        <p className="text-sm font-semibold text-foreground mb-1">"{nombrePropiedad}"</p>
        {/* dangerouslySetInnerHTML para poder usar &quot; en descripcion */}
        <p className="text-xs text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: descripcion }} />
        <div className="flex gap-3">
          <button onClick={onCancelar} className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirmar} className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-opacity ${colorConfirmar}`}>
            {textoConfirmar}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
