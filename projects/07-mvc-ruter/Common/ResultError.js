/**
 * @typedef {object} ResultErrorDetails
 * @property {number} code - El código de estado HTTP del error.
 * @property {string} type - El tipo o nombre del error (ej. 'BadRequest', 'Unauthorized').
 * @property {string|object} details - Un mensaje de error o un objeto con detalles adicionales del error.
 */

/**
 * @class ResultError
 * @description Representa los detalles de un error estandarizado para las respuestas de la API.
 */
class ResultError {
    /**
     * @private
     * @type {number}
     * @description El código de estado HTTP del error.
     */
    #code;

    /**
     * @private
     * @type {string}
     * @description El tipo o nombre del error.
     */
    #type;

    /**
     * @private
     * @type {string|object}
     * @description Un mensaje descriptivo del error o un objeto con detalles adicionales.
     */
    #details;

    /**
     * Crea una instancia de ResultError.
     * @param {number} code - El código de estado HTTP.
     * @param {string} type - El tipo de error (ej. 'BadRequest').
     * @param {string|object} details - El mensaje o los detalles del error.
     */
    constructor(code, type, details) {
        this.#code = code;
        this.#type = type;
        this.#details = details;
    }

    /**
     * Obtiene el código de estado HTTP del error.
     * @returns {number}
     */
    get code() {
        return this.#code;
    }

    /**
     * Obtiene el tipo o nombre del error.
     * @returns {string}
     */
    get type() {
        return this.#type;
    }

    /**
     * Obtiene los detalles del error (mensaje o objeto de detalles).
     * @returns {string|object}
     */
    get details() {
        return this.#details;
    }
}

export default ResultError;
