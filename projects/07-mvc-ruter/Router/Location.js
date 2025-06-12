/**
 * Clase para gestionar la navegación del historial del navegador en una SPA.
 * 
 * Sus operaciones de historial (`pushState`, `replaceState`) son inyectadas a través del constructor,
 * permitiendo una mayor flexibilidad y probabilidad.
 */
class Location {
    /**
     * @private
     * @type {function(HistoryStateData, string, string): void}
     * @description La función inyectada para realizar una operación `pushState`.
     * Recibe `state`, `title` (cadena vacía) y `url`.
     */
    #pushStateFn;

    /**
     * @private
     * @type {function(HistoryStateData, string, string): void}
     * @description La función inyectada para realizar una operación `replaceState`.
     * Recibe `state`, `title` (cadena vacía) y `url`.
     */
    #replaceStateFn;

    /**
     * Crea una instancia de la clase Location.
     *
     * @param {object} options - Opciones de configuración para la clase Location.
     * @param {function(HistoryStateData, string, string): void} options.pushStateFn -
     * La función a utilizar para la operación `pushState`. Debe aceptar `state`, `title` y `url`.
     * @param {function(HistoryStateData, string, string): void} options.replaceStateFn -
     * La función a utilizar para la operación `replaceState`. Debe aceptar `state`, `title` y `url`.
     * @throws {Error} Si no se proporcionan las funciones `pushStateFn` o `replaceStateFn`.
     */
    constructor({ pushStateFn, replaceStateFn }) {
        if (typeof pushStateFn !== 'function') {
            throw new Error('El constructor de Location requiere una función "pushStateFn".');
        }
        if (typeof replaceStateFn !== 'function') {
            throw new Error('El constructor de Location requiere una función "replaceStateFn".');
        }

        this.#pushStateFn = pushStateFn;
        this.#replaceStateFn = replaceStateFn;

        // Opcional: Congelar la instancia para asegurar la inmutabilidad de los métodos inyectados
        Object.freeze(this);
    }

    /**
     * Navega programáticamente a una nueva ruta utilizando `pushState`.
     *
     * @method
     * @name navigate
     * @description Agrega una nueva entrada al historial del navegador y actualiza el estado interno.
     * @param {string} relativePath - Ruta a la que se desea navegar (relativa a tu aplicación).
     * @param {object} [state={}] - Objeto de estado asociado a la nueva ruta.
     * @returns {void}
     */
    navigate(relativePath, state = {}) {
        this.#pushStateFn(state, '', relativePath);
    }

    /**
     * Reemplaza la entrada actual del historial con una nueva ruta utilizando `replaceState`.
     * 
     * @method
     * @name replace
     * @description No agrega una nueva entrada al historial. Útil para redirecciones.
     * @param {string} relativePath - Ruta que reemplazará a la actual (relativa a tu aplicación).
     * @param {object} [state={}] - Objeto de estado asociado a la nueva ruta.
     * @returns {void}
     */
    replace(relativePath, state = {}) {
        this.#replaceStateFn(state, '', relativePath);
    }
}

export default Location;
