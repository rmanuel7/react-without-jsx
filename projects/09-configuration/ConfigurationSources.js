import ConfigurationSource from './abstraction/ConfigurationSource.js';
import ConfigurationManager from './ConfigurationManager.js';
import ConfigurationSymbols from './internal/ConfigurationSymbols.js';

/**
 * ConfigurationSources
 * ====================
 *
 * Representa una lista ordenada de fuentes de configuración (sources).
 * Al agregar, quitar o reemplazar fuentes, notifica al ConfigurationManager.
 * Inspirado en Microsoft.Extensions.Configuration.ConfigurationSources.
 *
 * Permite acceso indexado (como sources[0]) usando un Proxy.
 *
 * @example
 * const sources = new ConfigurationSources(configManager);
 * sources.add(new MemoryConfigurationSource({ ... }));
 * for (const src of sources) { ... }
 */
class ConfigurationSources {
/**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return ConfigurationSymbols.configurationSources;
    }

    /**
     * Metadatos para el contenedor DI.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [
                this.__typeof
            ],
            inject: {
                config: ConfigurationManager
            }
        };
    }

    /**
     * @type {Array<ConfigurationSource>}
     * @private
     */
    #sources = [];

    /**
     * @type {ConfigurationManager}
     * @private
     */
    #config;

    /**
     * Crea una nueva instancia de ConfigurationSources.
     * @param {ConfigurationManager} config
     */
    constructor(config) {
        this.#config = config;
        // Devuelve un proxy para indexar como un array
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Si la prop es un número, accede como array
                if (!isNaN(prop)) {
                    return target.#sources[Number(prop)];
                }
                // Métodos/propiedades de instancia
                if (prop in target) return Reflect.get(target, prop, receiver);
                // Delegar a #sources si existe (como Symbol.iterator, length, etc.)
                if (prop in target.#sources) return target.#sources[prop].bind(target.#sources);
                return undefined;
            },
            set: (target, prop, value, receiver) => {
                if (!isNaN(prop)) {
                    target.#sources[Number(prop)] = value;
                    target.#config.reloadSources();
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            deleteProperty: (target, prop) => {
                if (!isNaN(prop)) {
                    target.#sources.splice(Number(prop), 1);
                    target.#config.reloadSources();
                    return true;
                }
                return Reflect.deleteProperty(target, prop);
            },
            ownKeys: (target) => {
                // Devuelve claves numéricas y métodos propios
                return [
                    ...Object.getOwnPropertyNames(target),
                    ...Object.keys(target.#sources)
                ];
            },
            has: (target, prop) => {
                if (!isNaN(prop)) return Number(prop) < target.#sources.length;
                return prop in target || prop in target.#sources;
            },
            getOwnPropertyDescriptor: (target, prop) => {
                if (!isNaN(prop)) {
                    return {
                        enumerable: true,
                        configurable: true,
                    };
                }
                return Object.getOwnPropertyDescriptor(target, prop)
                    || Object.getOwnPropertyDescriptor(target.#sources, prop);
            }
        });
    }

    /**
     * Número de fuentes registradas.
     * @returns {number}
     */
    get count() {
        return this.#sources.length;
    }

    /**
     * Indica si la colección es solo lectura.
     * @returns {boolean}
     */
    get isReadOnly() {
        return false;
    }

    /**
     * Agrega una fuente y la registra en el ConfigurationManager.
     * @param {ConfigurationSource} source
     */
    add(source) {
        this.#sources.push(source);
        this.#config.addSource(source);
    }

    /**
     * Elimina todas las fuentes y recarga las fuentes.
     */
    clear() {
        this.#sources = [];
        this.#config.reloadSources();
    }

    /**
     * Determina si la fuente está registrada.
     * @param {ConfigurationSource} source
     * @returns {boolean}
     */
    contains(source) {
        return this.#sources.includes(source);
    }

    /**
     * Copia las fuentes a un arreglo destino.
     * @param {Array<ConfigurationSource>} array
     * @param {number} arrayIndex
     */
    copyTo(array, arrayIndex = 0) {
        for (let i = 0; i < this.#sources.length; i++) {
            array[arrayIndex + i] = this.#sources[i];
        }
    }

    /**
     * Devuelve el enumerador (iterador) de las fuentes.
     * @returns {IterableIterator<ConfigurationSource>}
     */
    [Symbol.iterator]() {
        return this.#sources[Symbol.iterator]();
    }

    /**
     * Obtiene el índice de una fuente.
     * @param {ConfigurationSource} source
     * @returns {number}
     */
    indexOf(source) {
        return this.#sources.indexOf(source);
    }

    /**
     * Inserta una fuente en el índice dado y recarga las fuentes.
     * @param {number} index
     * @param {ConfigurationSource} source
     */
    insert(index, source) {
        // The splice() method can be used to insert elements at any position within an array.
        this.#sources.splice(index, 0, source);
        this.#config.reloadSources();
    }

    /**
     * Elimina una fuente y recarga las fuentes.
     * @param {ConfigurationSource} source
     * @returns {boolean}
     */
    remove(source) {
        const idx = this.#sources.indexOf(source);
        if (idx !== -1) {
            // The number of elements to remove from the array 
            this.#sources.splice(idx, 1);
            this.#config.reloadSources();
            return true;
        }
        return false;
    }

    /**
     * Elimina la fuente en el índice dado y recarga las fuentes.
     * @param {number} index
     */
    removeAt(index) {
        this.#sources.splice(index, 1);
        this.#config.reloadSources();
    }
}

export default ConfigurationSources;