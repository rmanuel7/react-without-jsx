import AuthenticationProperties from './AuthenticationProperties.js';
import ClaimsPrincipal from './ClaimsPrincipal.js';
import Identity from './Identity.js'; // También necesitarías Identity

/**
 * @class AuthenticationTicket
 * @description Representa un ticket de autenticación que encapsula la identidad
 * del usuario autenticado (`ClaimsPrincipal`) y las propiedades de la sesión
 * (`AuthenticationProperties`).
 * Este objeto es el resultado de un proceso de autenticación exitoso y se utiliza
 * para transportar la información de la sesión a través de la aplicación.
 */
class AuthenticationTicket {
    /**
     * @private
     * @type {ClaimsPrincipal}
     * @description El objeto `ClaimsPrincipal` que representa la identidad del usuario autenticado.
     */
    #principal;

    /**
     * @private
     * @type {AuthenticationProperties}
     * @description Las propiedades o metadatos asociados a este ticket de autenticación.
     */
    #properties;

    /**
     * Crea una nueva instancia de AuthenticationTicket.
     * @param {ClaimsPrincipal} principal - El `ClaimsPrincipal` que representa la identidad autenticada.
     * @param {AuthenticationProperties} properties - Las propiedades de autenticación para este ticket.
     * @throws {Error} Si `principal` no es una instancia de `ClaimsPrincipal` o `properties` no es una instancia de `AuthenticationProperties`.
     */
    constructor(principal, properties) {
        if (!(principal instanceof ClaimsPrincipal)) {
            throw new Error('El argumento principal debe ser una instancia de ClaimsPrincipal.');
        }
        if (!(properties instanceof AuthenticationProperties)) {
            throw new Error('El argumento properties debe ser una instancia de AuthenticationProperties.');
        }

        this.#principal = principal;
        this.#properties = properties;
    }

    /**
     * Obtiene el `ClaimsPrincipal` asociado a este ticket.
     * @returns {ClaimsPrincipal}
     */
    get principal() {
        return this.#principal;
    }

    /**
     * Obtiene las `AuthenticationProperties` asociadas a este ticket.
     * @returns {AuthenticationProperties}
     */
    get properties() {
        return this.#properties;
    }

    /**
     * Verifica si el ticket de autenticación ha expirado basándose en sus propiedades.
     * @returns {boolean} True si el ticket ha expirado, false en caso contrario.
     */
    hasExpired() {
        if (!this.#properties.expiresUtc) {
            return false; // No expira si no hay fecha de expiración definida
        }
        return this.#properties.expiresUtc.getTime() < Date.now();
    }

    /**
     * Determina si el ticket de autenticación está cerca de expirar o ya expiró.
     * La verificación se realiza utilizando la propiedad `ExpiresUtc` de las `AuthenticationProperties`
     * asociadas a este ticket.
     *
     * @method
     * @param {number} [thresholdMinutes=5] - El umbral en minutos para considerar que el ticket está "cerca" de expirar.
     * @param {boolean} [withLog=false] - Si es `true`, imprimirá mensajes de log en la consola.
     * @returns {boolean} `true` si el ticket está cerca de expirar o ya expiró; `false` en caso contrario.
     */
    isNearExpiry(thresholdMinutes = 5, withLog = false) {
        withLog && console.log('[AuthenticationTicket] isNearExpiry');

        const { expiresUtc } = this.#properties;

        // Si no hay fecha de expiración en las propiedades, asumimos que no hay sesión válida o es infinita.
        if (!expiresUtc instanceof Date || isNaN(expiresUtc.getTime())) {
            console.warn("[AuthenticationTicket] No hay una fecha de expiración válida (Properties.ExpiresUtc).");
            return true; // Consideramos que el ticket está expirado o no existe una expiración definible.
        }

        try {
            const expirationTime = expiresUtc.getTime(); // Timestamp en milisegundos
            const currentTime = Date.now(); // Tiempo actual en milisegundos

            const REFRESH_THRESHOLD_MS = thresholdMinutes * 60 * 1000; // Umbral en milisegundos

            const timeLeft = expirationTime - currentTime;
            const isNearExpiry = timeLeft <= REFRESH_THRESHOLD_MS;

            if (withLog) {
                if (isNearExpiry) {
                    console.log(`[AuthenticationTicket] Ticket expirará en ~${formatTimeLeft(timeLeft)}. Cerca de expirar.`);
                } else {
                    console.log(`[AuthenticationTicket] Ticket válido por ~${formatTimeLeft(timeLeft)}.`);
                }
            }

            return isNearExpiry;
        } catch (error) {
            console.error("[AuthenticationTicket] Error al procesar la fecha de expiración:", error);
            return true; // Si hay un error, asumimos que el ticket no es válido
        }
    }
}

export default AuthenticationTicket;
