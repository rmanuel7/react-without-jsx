import OptionSymbols from './internal/OptionSymbols.js';

/**
 * ConfigureOptions<T>
 * ====================
 * 
 * Aplica un callback de configuración a opciones tipadas, opcionalmente por nombre.
 * @template T
 * 
 * @example
 * import ConfigureOptionsTemplate from './ConfigureOptionsTemplate.js';
 * const ConfigureOptionsForSettings = ConfigureOptionsTemplate.forType(MySettings);
 * const configure = new ConfigureOptionsForSettings({
 *     action: (options) => {
 *         // Configurar opciones aquí
 *     }
 * });
 */
class ConfigureOptionsTemplate {
    /**
     * No instanciar directamente.
     * Usar ConfigureOptionsTemplate.forType(T).
     */
    constructor() {
        throw new Error('No se debe instanciar ConfigureOptionsTemplate directamente. Usa forType(T).');
    }

    /**
     * Devuelve una clase ConfigureOptions<T> específica para el tipo dado.
     * @param {T} optionsClass - Clase/constructor de opciones tipadas.
     * @returns {T}
     */
    static forType(optionsClass) {
        if (!optionsClass || typeof optionsClass !== 'function' || !optionsClass.prototype) {
            throw new TypeError('forType: optionsClass debe ser una clase/constructor.');
        }
        if (typeof optionsClass.__typeof !== 'symbol') {
            throw new Error('forType: optionsClass debe definir static get __typeof().');
        }

        /**
         * ConfigureOptions
         * ================
         * 
         * clase ConfigureOptions tipado con metadatos DI
         * @template T
         */
        return class ConfigureOptions {
            /**
             * Identificador simbólico para DI.
             * @returns {symbol}
             */
            static get __typeof() {
                return OptionSymbols.forType(optionsClass, OptionSymbols.configureOptions);
            }

            /**
             * Metadatos para inyección de dependencias.
             * @returns {object}
             */
            static get __metadata() {
                return {
                    parameters: [optionsClass],
                    properties: {},
                    inject: {}
                };
            }

            /** @type {(options: T) => void} */
            #action;

            /**
             * Crea una instancia de ConfigureOptions.
             * @param {(options: T) => void} action
             */
            constructor({ action = _ => {} } = {}) {
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
        };
    }
}

export default ConfigureOptionsTemplate;
