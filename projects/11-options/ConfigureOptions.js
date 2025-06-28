import OptionSymbols from './internal/OptionSymbols.js';

/**
 * ConfigureOptions<T>
 * ====================
 * 
 * Aplica un callback de configuración a opciones tipadas, opcionalmente por nombre.
 * @template T
 * 
 * @example
 * import ConfigureOptions from './ConfigureOptions.js';
 * const configure = new ConfigureOptions({
 *     action: (options) => {
 *         // Configurar opciones aquí
 *     }
 * });
 */
class ConfigureOptions {
    /**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return OptionSymbols.configureOptions;
    }

    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [],
            inject: {}
        };
    }

    #action;

    /**
     * Crea una instancia de ConfigureOptions.
     * @param {(options: T) => void} action
     */
    constructor({ action }) {
        this.#action = action;
    }

    /**
     * Devuelve la función de acción de configuración.
     * @returns {function(T): void}
     */
    get action() {
        return this.#action;
    }

    /**
     * Aplica la acción de configuración.
     * @param {T} options
     */
    configure(options) {
        this.#action(options);
    }
}

export default ConfigureOptions;