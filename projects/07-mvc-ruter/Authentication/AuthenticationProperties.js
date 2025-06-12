/**
 * @class AuthenticationProperties
 * @description Representa las propiedades o metadatos asociados a un ticket de autenticación.
 * Estas propiedades pueden incluir información como la fecha de emisión, la fecha de expiración,
 * si la sesión debe ser persistente (ej. "recuérdame"), o el tipo de autenticación utilizado.
 */
class AuthenticationProperties {
    /**
     * @private
     * @type {Date | null}
     * @description La fecha y hora en que se emitió el ticket de autenticación.
     */
    #issuedUtc = null;

    /**
     * @private
     * @type {Date | null}
     * @description La fecha y hora en que expirará el ticket de autenticación.
     */
    #expiresUtc = null;

    /**
     * @private
     * @type {boolean}
     * @description Indica si la sesión de autenticación debe persistir a través de múltiples sesiones de navegador (ej. "recuérdame").
     */
    #isPersistent = false;

    /**
     * @private
     * @type {string | null}
     * @description El esquema o tipo de autenticación asociado a este ticket (ej. 'Cookies', 'Bearer').
     */
    #authenticationScheme = null;

    /**
     * Crea una nueva instancia de AuthenticationProperties.
     * @param {object} [options] - Opciones para inicializar las propiedades.
     * @param {Date | null} [options.issuedUtc=null] - Fecha y hora de emisión del ticket.
     * @param {Date | null} [options.expiresUtc=null] - Fecha y hora de expiración del ticket.
     * @param {boolean} [options.isPersistent=false] - Indica si la sesión es persistente.
     * @param {string | null} [options.authenticationScheme=null] - El esquema de autenticación.
     */
    constructor({ issuedUtc = null, expiresUtc = null, isPersistent = false, authenticationScheme = null } = {}) {
        this.#issuedUtc = issuedUtc;
        this.#expiresUtc = expiresUtc;
        this.#isPersistent = isPersistent;
        this.#authenticationScheme = authenticationScheme;
    }

    /**
     * Obtiene la fecha y hora de emisión del ticket.
     * @returns {Date | null}
     */
    get issuedUtc() {
        return this.#issuedUtc;
    }

    /**
     * Establece la fecha y hora de emisión del ticket.
     * @param {Date | null} value - La fecha y hora de emisión.
     */
    set issuedUtc(value) {
        this.#issuedUtc = value;
    }

    /**
     * Obtiene la fecha y hora de expiración del ticket.
     * @returns {Date | null}
     */
    get expiresUtc() {
        return this.#expiresUtc;
    }

    /**
     * Establece la fecha y hora de expiración del ticket.
     * @param {Date | null} value - La fecha y hora de expiración.
     */
    set expiresUtc(value) {
        this.#expiresUtc = value;
    }

    /**
     * Indica si la sesión de autenticación es persistente.
     * @returns {boolean}
     */
    get isPersistent() {
        return this.#isPersistent;
    }

    /**
     * Establece si la sesión de autenticación es persistente.
     * @param {boolean} value - True si la sesión es persistente, false en caso contrario.
     */
    set isPersistent(value) {
        this.#isPersistent = value;
    }

    /**
     * Obtiene el esquema de autenticación asociado a este ticket.
     * @returns {string | null}
     */
    get authenticationScheme() {
        return this.#authenticationScheme;
    }

    /**
     * Establece el esquema de autenticación asociado a este ticket.
     * @param {string | null} value - El esquema de autenticación.
     */
    set authenticationScheme(value) {
        this.#authenticationScheme = value;
    }

    /**
     * Verifica si el ticket ha expirado.
     * @returns {boolean} True si el ticket ha expirado, false en caso contrario o si no tiene fecha de expiración.
     */
    hasExpired() {
        if (!this.#expiresUtc) {
            return false; // No expira si no hay fecha de expiración definida
        }
        return this.#expiresUtc.getTime() < Date.now();
    }
}

export default AuthenticationProperties;
