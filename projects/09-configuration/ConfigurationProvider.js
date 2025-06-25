/**
 * ConfigurationProvider
 * =====================
 * 
 * Clase abstracta base para proveedores de configuración.
 * Inspirada en Microsoft.Extensions.Configuration.ConfigurationProvider.
 * 
 * Un proveedor de configuración expone claves/valores de configuración,
 * puede recargar, y (opcionalmente) soporta escritura o notifica cambios.
 */

class ConfigurationProvider {
    /**
     * Diccionario interno de claves/valores de configuración.
     * Las claves no distinguen mayúsculas/minúsculas.
     * @type {Map<string, string|null>}
     * @private
     */
    #data;

    /**
     * Crea un nuevo ConfigurationProvider.
     * Si la implementación requiere opciones, pásalas aquí.
     * @param {object} [options]
     */
    constructor(options = {}) {
        if (new.target === ConfigurationProvider) {
            throw new TypeError('Cannot instantiate abstract class ConfigurationProvider directly.');
        }
        // Usa Map para permitir claves case-insensitive (convertir a lower)
        this.#data = new Map();
    }

    /**
     * Intenta obtener el valor para una clave.
     * @param {string} key
     * @returns {string|undefined}
     */
    tryGet(key) {
        key = key.toLowerCase();
        if (this.#data.has(key)) {
            return { found: true, value: this.#data.get(key) };
        }
        return { found: false, value: undefined };
    }

    /**
     * Establece un valor para una clave.
     * @param {string} key
     * @param {string|null} value
     */
    set(key, value) {
        key = key.toLowerCase();
        this.#data.set(key, value);
    }

    /**
     * Recarga los datos desde la fuente subyacente (si aplica).
     * Debe ser implementado en clases derivadas si es necesario.
     */
    load() {
        // No-op por defecto, sobrescribir en derivadas
    }

    /**
     * Devuelve las claves gestionadas por este provider.
     * Si se pasa parentPath, filtra las claves hijas.
     * @param {string[]} earlierKeys - Las claves anterriores que contienen otros proveedores
     * @param {string|null} parentPath - La ruta para la conffiguración principal.
     * @returns {string[]}
     */
    getChildKeys(earlierKeys = [], parentPath = null) {
        const results = [];
        if (parentPath === null) {
            for (const key of this.#data.keys()) {
                results.push(this.#segment(key, 0));
            }
        } else {
            for (const key of this.#data.keys()) {
                if (
                    key.length > parentPath.length &&
                    key.startsWith(parentPath.toLowerCase()) &&
                    key[parentPath.length] === ':'
                ) {
                    results.push(this.#segment(key, parentPath.length + 1));
                }
            }
        }
        results.push(...earlierKeys);
        results.sort();
        return results;
    }

    /**
     * Devuelve una porción del key, cortando hasta el siguiente delimitador ":".
     * @private
     * @param {string} key
     * @param {number} prefixLength
     * @returns {string}
     */
    #segment(key, prefixLength) {
        const idx = key.indexOf(':', prefixLength);
        return idx < 0 ? key.substring(prefixLength) : key.substring(prefixLength, idx);
    }

    /**
     * Devuelve todas las claves directas almacenadas (sin filtrar por parentPath).
     * @returns {string[]}
     */
    keys() {
        return Array.from(this.#data.keys());
    }

    /**
     * Devuelve una representación string del provider.
     * @returns {string}
     */
    toString() {
        return this.constructor.name;
    }

    /**
     * Permite a las clases derivadas acceder directamente al mapa interno.
     * @protected
     * @returns {Map<string, string|null>}
     */
    get data() {
        return this.#data;
    }
}

export default ConfigurationProvider;