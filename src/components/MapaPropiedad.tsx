/**
 * ============================================================
 * COMPONENTE: MapaPropiedad
 * ============================================================
 * Muestra un mapa interactivo de Leaflet con la ubicación exacta
 * de una propiedad, usando tiles de OpenStreetMap (gratuito, sin API key).
 *
 * Recibe las coordenadas { lat, lng } y el nombre de la propiedad
 * para mostrar en el marcador.
 *
 * ── Tecnologías ──────────────────────────────────────────────
 * - Leaflet 1.x   → librería de mapas open source
 * - react-leaflet → bindings de React para Leaflet
 * - OpenStreetMap → proveedor de tiles gratuito (sin registro ni clave)
 *
 * ── Fix de íconos en Vite ────────────────────────────────────
 * Leaflet carga los íconos del marcador con rutas relativas que no
 * funcionan en Vite porque el bundler renombra los assets.
 * La solución es importar los archivos PNG directamente y reemplazar
 * los valores por defecto de L.Icon.Default antes de renderizar.
 *
 * ── TODO (mejoras futuras) ───────────────────────────────────
 * - Agregar geocodificación automática usando la API de Nominatim
 *   para convertir la dirección de texto a coordenadas sin que
 *   Nico tenga que ingresarlas manualmente.
 *   Endpoint: https://nominatim.openstreetmap.org/search?q={direccion}&format=json
 * ============================================================
 */

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Importamos los archivos de íconos directamente para que Vite los procese correctamente
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

// Importamos el CSS de Leaflet — necesario para que el mapa se vea correctamente
import "leaflet/dist/leaflet.css";

// ─────────────────────────────────────────────
// FIX: Íconos de marcador para Vite
// ─────────────────────────────────────────────

/**
 * Leaflet usa un método interno `_getIconUrl` para resolver las rutas de
 * los íconos. En Vite, este mecanismo falla porque los assets se renombran
 * durante el build. La solución es eliminar ese método y proveer las rutas
 * correctas usando los imports de arriba.
 *
 * Este fix solo necesita ejecutarse una vez en toda la app; al estar dentro
 * del componente con useEffect se ejecuta en el primer render del mapa.
 */
function usarIconosLeafletCorrectos() {
  useEffect(() => {
    // Eliminamos el método que Leaflet usa para resolver las URLs automáticamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    // Reemplazamos con las URLs que Vite sí puede resolver (importadas arriba)
    L.Icon.Default.mergeOptions({
      iconUrl: markerIconPng,
      iconRetinaUrl: markerIconRetinaPng,
      shadowUrl: markerShadowPng,
    });
  }, []); // Se ejecuta solo una vez al montar el componente
}

// ─────────────────────────────────────────────
// PROPS del componente
// ─────────────────────────────────────────────

interface PropsMapa {
  /** Latitud de la propiedad (ej: -27.4844) */
  lat: number;
  /** Longitud de la propiedad (ej: -58.7943) */
  lng: number;
  /** Nombre de la propiedad para mostrar en el popup del marcador */
  nombrePropiedad: string;
  /** Dirección completa para mostrar debajo del nombre en el popup */
  direccion: string;
  /** Altura del contenedor del mapa (por defecto 280px) */
  altura?: string;
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function MapaPropiedad({
  lat,
  lng,
  nombrePropiedad,
  direccion,
  altura = "280px",
}: PropsMapa) {
  // Aplicamos el fix de íconos antes de renderizar el mapa
  usarIconosLeafletCorrectos();

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-border"
      style={{ height: altura }}
    >
      {/*
       * MapContainer: contenedor principal del mapa Leaflet.
       *   - center: coordenadas donde se centra el mapa al cargar
       *   - zoom: nivel de zoom inicial (16 es suficiente para ver la manzana)
       *   - scrollWheelZoom: desactivado para evitar zoom accidental al scrollear
       *   - style: necesita altura explícita para renderizar correctamente
       */}
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/*
         * TileLayer: capa de tiles que dibuja el mapa base.
         * Usamos OpenStreetMap (OSM) porque es gratuito y no requiere API key.
         * attribution: texto obligatorio por la licencia de OSM.
         */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*
         * Marker: marcador en la ubicación exacta de la propiedad.
         * El Popup se abre al hacer clic sobre el marcador y muestra
         * el nombre y dirección de la propiedad.
         */}
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-sm">
              {/* Nombre de la propiedad en negrita */}
              <p className="font-bold text-foreground mb-0.5">{nombrePropiedad}</p>
              {/* Dirección en texto secundario */}
              <p className="text-muted-foreground">{direccion}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
