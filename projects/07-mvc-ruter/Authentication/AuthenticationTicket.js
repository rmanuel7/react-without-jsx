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
        return this.#properties.hasExpired();
    }

    /**
     * Crea una representación serializable del ticket.
     * Ideal para almacenar el ticket en el almacenamiento local o en una cookie.
     * @returns {object} Un objeto simple que contiene datos del principal y propiedades.
     */
    toObject() {
        return {
            principal: this.#principal.toObject(), // Asume que ClaimsPrincipal tiene un toObject()
            properties: {
                issuedUtc: this.#properties.issuedUtc?.toISOString(),
                expiresUtc: this.#properties.expiresUtc?.toISOString(),
                isPersistent: this.#properties.isPersistent,
                authenticationScheme: this.#properties.authenticationScheme
            }
        };
    }

    /**
     * Crea una instancia de AuthenticationTicket a partir de un objeto serializado.
     * @param {object} obj - El objeto serializado.
     * @param {object} obj.principal - El objeto principal serializado.
     * @param {object} obj.properties - El objeto de propiedades serializado.
     * @returns {AuthenticationTicket} Una nueva instancia de AuthenticationTicket.
     */
    static fromObject(obj) {
        if (!obj || !obj.principal || !obj.properties) {
            throw new Error('El objeto serializado no tiene la estructura correcta para AuthenticationTicket.');
        }

        const principal = ClaimsPrincipal.fromObject(obj.principal); // Asume que ClaimsPrincipal tiene un fromObject()
        const properties = new AuthenticationProperties({
            issuedUtc: obj.properties.issuedUtc ? new Date(obj.properties.issuedUtc) : null,
            expiresUtc: obj.properties.expiresUtc ? new Date(obj.properties.expiresUtc) : null,
            isPersistent: obj.properties.isPersistent,
            authenticationScheme: obj.properties.authenticationScheme
        });

        return new AuthenticationTicket(principal, properties);
    }
}

export default AuthenticationTicket;
