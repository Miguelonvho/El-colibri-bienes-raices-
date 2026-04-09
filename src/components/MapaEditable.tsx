/**
 * ============================================================
 * COMPONENTE: MapaEditable
 * ============================================================
 * Mapa interactivo para el formulario de gestión de propiedades.
 * Permite al admin marcar la ubicación de un inmueble de dos maneras:
 *   1. Haciendo clic en cualquier punto del mapa para colocar el marcador
 *   2. Arrastrando el marcador para afinar la posición
 *
 * Cuando la ubicación cambia de forma significativa (por ejemplo, al
 * geocodificar una dirección), el mapa vuela animadamente hacia el nuevo punto.
 * Los ajustes pequeños con el marcador no disparan el re-centrado.
 *
 * ── Tecnologías ──────────────────────────────────────────────
 * - Leaflet + react-leaflet + OpenStreetMap (sin clave de API)
 *
 * ── Fix de íconos en Vite ────────────────────────────────────
 * Mismo fix que en MapaPropiedad: Leaflet no puede resolver sus
 * propias rutas de íconos cuando Vite renombra los assets en el build.
 * Solución: importar los PNG directamente y sobreescribir L.Icon.Default.
 * ============================================================
 */

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

// Importamos los íconos directamente para que Vite los procese
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

/** Centro por defecto: Corrientes Capital, Argentina */
const CENTRO_DEFAULT: [number, number] = [-27.481, -58.8253];

/** Zoom cuando no hay marcador todavía */
const ZOOM_SIN_MARCADOR = 14;

/** Zoom cuando hay un marcador colocado */
const ZOOM_CON_MARCADOR = 16;

// ─────────────────────────────────────────────
// FIX: Íconos de Leaflet para Vite
// ─────────────────────────────────────────────

/**
 * Igual que en MapaPropiedad: elimina el resolver automático de Leaflet
 * y provee las rutas correctas que Vite sí puede manejar.
 * El fix es idempotente, se puede llamar desde varios componentes sin problema.
 */
function usarIconosLeafletCorrectos() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIconPng,
      iconRetinaUrl: markerIconRetinaPng,
      shadowUrl: markerShadowPng,
    });
  }, []); // Solo se ejecuta al montar el componente
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: captura los clics en el mapa
// ─────────────────────────────────────────────

/**
 * Componente auxiliar que registra los eventos del mapa usando el hook
 * useMapEvents de react-leaflet. Debe estar dentro de un MapContainer.
 * Cada clic en el mapa llama a onClic con las coordenadas del punto clickeado.
 */
function CapturadorDeClic({
  onClic,
}: {
  onClic: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(evento) {
      // El usuario hizo clic: colocamos o movemos el marcador a esa posición
      onClic(evento.latlng.lat, evento.latlng.lng);
    },
  });
  return null;
}

// ─────────────────────────────────────────────
// SUBCOMPONENTE: vuela al centro cuando la clave de geocodificación cambia
// ─────────────────────────────────────────────

/**
 * Escucha `claveGeocoding` — un número que sube cada vez que la geocodificación
 * completa con éxito. Cuando cambia, vuela animadamente hacia `ubicacion`.
 *
 * Por qué usar una clave y no comparar coordenadas:
 *   - El umbral de distancia falla en ciudades pequeñas: en Corrientes, una calle
 *     puede estar a solo 200m del marcador anterior y nunca superar el umbral.
 *   - El arrastre del marcador actualiza `ubicacion` pero NO cambia `claveGeocoding`,
 *     por lo que el mapa no re-centra al arrastrar (comportamiento correcto).
 *
 * Debe estar dentro de un MapContainer para poder usar useMap().
 */
function SincronizarCentro({
  ubicacion,
  claveGeocoding,
}: {
  ubicacion: { lat: number; lng: number } | undefined;
  claveGeocoding: number;
}) {
  const mapa = useMap();

  useEffect(() => {
    // Solo volamos cuando claveGeocoding cambia (geocodificación exitosa)
    if (!ubicacion) return;
    mapa.flyTo([ubicacion.lat, ubicacion.lng], ZOOM_CON_MARCADOR, { duration: 0.8 });
    // Excluimos `ubicacion` a propósito: no queremos volar en cada arrastre del
    // marcador, solo cuando sube la clave de geocodificación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveGeocoding, mapa]);

  return null;
}

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────

interface PropsMapaEditable {
  /** Coordenadas actuales. Si es undefined, no se muestra marcador. */
  ubicacion: { lat: number; lng: number } | undefined;
  /** Nombre de la propiedad para el popup del marcador */
  nombrePropiedad?: string;
  /** Callback que se llama cada vez que el marcador cambia de posición */
  onChange: (ubicacion: { lat: number; lng: number }) => void;
  /**
   * Clave que sube cada vez que la geocodificación completa con éxito.
   * Cuando cambia, el mapa vuela animadamente hacia la nueva ubicación.
   * El arrastre del marcador NO cambia esta clave, por lo que no re-centra al arrastrar.
   */
  claveGeocoding?: number;
  /** Altura del contenedor del mapa (por defecto "240px") */
  altura?: string;
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function MapaEditable({
  ubicacion,
  nombrePropiedad = "Nueva propiedad",
  onChange,
  claveGeocoding = 0,
  altura = "240px",
}: PropsMapaEditable) {
  // Aplicamos el fix de íconos antes de renderizar el mapa
  usarIconosLeafletCorrectos();

  // Referencia al marcador para leer su posición exacta al soltar el arrastre
  const refMarcador = useRef<L.Marker>(null);

  // El centro inicial del mapa: si ya hay coordenadas, centramos ahí; si no, en Corrientes Capital
  const centroInicial: [number, number] = ubicacion
    ? [ubicacion.lat, ubicacion.lng]
    : CENTRO_DEFAULT;

  const zoomInicial = ubicacion ? ZOOM_CON_MARCADOR : ZOOM_SIN_MARCADOR;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-border relative"
      style={{ height: altura }}
    >
      {/*
       * Indicación flotante: solo se muestra cuando aún no hay marcador.
       * Le dice al admin que puede hacer clic para marcar la ubicación.
       * pointer-events-none para que no bloquee la interacción con el mapa.
       */}
      {!ubicacion && (
        <div className="absolute inset-x-0 top-2 flex justify-center z-[1000] pointer-events-none">
          <div className="bg-foreground/70 text-background text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            Hacé clic en el mapa para marcar la ubicación
          </div>
        </div>
      )}

      {/*
       * MapContainer: el contenedor principal del mapa.
       * - center y zoom solo se usan en el primer render (Leaflet no los actualiza después)
       * - La re-centración posterior la maneja el componente SincronizarCentro
       * - scrollWheelZoom desactivado para no interferir con el scroll del modal
       */}
      <MapContainer
        center={centroInicial}
        zoom={zoomInicial}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Tiles de OpenStreetMap — gratuito, sin clave de API */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Captura los clics del admin para colocar o mover el marcador */}
        <CapturadorDeClic onClic={(lat, lng) => onChange({ lat, lng })} />

        {/* Vuela al nuevo centro cuando la geocodificación completa con éxito */}
        <SincronizarCentro ubicacion={ubicacion} claveGeocoding={claveGeocoding} />

        {/*
         * Marcador: solo aparece cuando hay coordenadas válidas.
         * draggable: el admin puede arrastrarlo para ajustar la posición.
         * dragend: al soltar, leemos la posición final y la emitimos con onChange.
         */}
        {ubicacion && (
          <Marker
            position={[ubicacion.lat, ubicacion.lng]}
            draggable
            ref={refMarcador}
            eventHandlers={{
              dragend() {
                // Leemos la posición exacta donde soltó el marcador
                const posicion = refMarcador.current?.getLatLng();
                if (posicion) {
                  onChange({ lat: posicion.lat, lng: posicion.lng });
                }
              },
            }}
          >
            {/* Popup con las coordenadas actuales y una ayuda para el admin */}
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-foreground mb-0.5">{nombrePropiedad}</p>
                <p className="text-muted-foreground text-xs">
                  {ubicacion.lat.toFixed(5)}, {ubicacion.lng.toFixed(5)}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 italic">
                  Arrastrá el marcador para ajustar la posición
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
