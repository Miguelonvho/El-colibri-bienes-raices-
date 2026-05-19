/**
 * ============================================================
 * ARCHIVO: App.tsx — Configuración de rutas de la aplicación
 * ============================================================
 * Define todas las rutas del sitio usando React Router v6.
 *
 * Rutas disponibles:
 *   /              → Página de inicio (landing)
 *   /catalogo      → Catálogo completo de propiedades
 *   /inmueble/:id  → Detalle de una propiedad específica
 *   /gestion       → Panel de gestión (CRUD) — solo para el administrador
 *   *              → Página 404 (no encontrada)
 *
 * ──────────────────────────────────────────────────────────
 * AUTENTICACIÓN (pendiente):
 * Cuando se implemente el login, reemplazar la ruta de /gestion
 * por una ruta protegida. Ejemplo de implementación:
 *
 *   // Componente que verifica si el usuario está autenticado
 *   <Route path="/gestion" element={
 *     <RutaProtegida>
 *       <GestionCatalogo />
 *     </RutaProtegida>
 *   } />
 *
 *   // También agregar:
 *   <Route path="/login" element={<Login />} />
 *
 * Ver GestionCatalogo.tsx para el bloque de autenticación
 * comentado dentro del componente.
 * ──────────────────────────────────────────────────────────
 */

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * ScrollToTop: Sube al inicio de la página cada vez que cambia la ruta.
 * Soluciona el problema de que al navegar entre páginas el scroll
 * queda en la posición donde estaba en la página anterior.
 * Se ubica dentro del BrowserRouter para poder usar useLocation().
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Importación de páginas
import Index from "./pages/Index.tsx";
import Catalogo from "./pages/Catalogo.tsx";
import DetalleInmueble from "./pages/DetalleInmueble.tsx";
import GestionCatalogo from "./pages/GestionCatalogo.tsx";
import NotFound from "./pages/NotFound.tsx";
import { gestionHabilitada } from "./config/admin.ts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Sube al tope en cada cambio de página */}
        <ScrollToTop />
        <Routes>
          {/* Página de inicio / landing */}
          <Route path="/" element={<Index />} />

          {/* Catálogo completo de propiedades */}
          <Route path="/catalogo" element={<Catalogo />} />

          {/* Detalle de una propiedad individual */}
          <Route path="/inmueble/:id" element={<DetalleInmueble />} />

          {/* Panel de gestión — solo existe si gestionHabilitada = true en config/admin.ts */}
          {gestionHabilitada && (
            <Route path="/gestion" element={<GestionCatalogo />} />
          )}

          {/* Ruta 404 — debe ir siempre al final */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
