/**
 * ============================================================
 * CONFIGURACIÓN: Acceso al panel de gestión
 * ============================================================
 *
 * gestionHabilitada:
 *   false → la ruta /gestion no existe (devuelve 404). Nadie puede
 *           entrar, ni siquiera con la URL directa o conocimientos técnicos.
 *   true  → la ruta existe pero requiere la contraseña para acceder.
 *
 * ADMIN_PASSWORD:
 *   Clave de acceso al panel. Cambiar antes de entregar al cliente.
 *
 * IMPORTANTE: Esta es una protección client-side — evita el acceso
 * casual pero no reemplaza una autenticación real con backend.
 * Cuando se implemente el servidor, reemplazar por JWT / sesiones.
 * ============================================================
 */

export const gestionHabilitada = false;
