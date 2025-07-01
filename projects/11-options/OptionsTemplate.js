import OptionSymbols from './internal/OptionSymbols.js';
import { ConfigurationManager } from '@spajscore/configuration';
import ConfigureOptionsTemplate from './ConfigureOptionsTemplate.js';

/**
 * Options<T>
 * ==============
 * 
 * Servicio de opciones fuertemente tipadas, inspirado en Options<T> de .NET.
 *
 * @template T
 * @example
 * const OptionsForSettings = OptionsTemplate.forType(MySettings);
 * services.add(ServiceDescriptor.fromType(OptionsForSettings));
 * const opts = provider.get(OptionsForSettings);
 * const value = opts.value;
 */
class OptionsTemplate {
    /**
     * No instanciar directamente.
     * Usar OptionsTemplate.forType(T).
     */
    constructor() {
        throw new Error('No se debe instanciar OptionsTemplate directamente. Usa forType(T).');
    }

    /**
     * Devuelve una clase Options<T> específica para el tipo dado.
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
         * Options
         * ========
         * 
         * clase Options tipado con metadatos DI
         * @template T
         */
        return class Options {
            /**
             * Identificador simbólico para DI.
             * @returns {symbol}
             */
            static get __typeof() {
                return OptionSymbols.forType(optionsClass, OptionSymbols.options);
            }

            /**
             * Metadatos para inyección de dependencias.
             * @returns {object}
             */
            static get __metadata() {
                return {
                    parameters: [optionsClass],
                    properties: optionsClass.__metadata?.properties || {},
                    inject: {
                        config: ConfigurationManager,
                        setup: ConfigureOptionsTemplate.forType(optionsClass)
                    }
                };
            }

            /** @type {class} */
            #template = optionsClass;
            /** @type {ConfigurationManager} */
            #config;
            /** @type {ConfigureOptions<T>} */
            #setup;
            /** @type {string} */
            #section;

            /**
           * @param {object} deps - dependencias 
           * @param {ConfigurationManager} deps.config - instancia con la información de la configuración
           * @param {ConfigureOptions<T>} [deps.setup] - función opcional para configurar las opciones
           */
            constructor({ config, setup = undefined }) {
                if (!(config instanceof ConfigurationManager)) {
                    throw new TypeError('Options: config debe ser una instancia de ConfigurationManager');
                }
                this.#config = config;
                this.#setup = setup || new (ConfigureOptionsTemplate.forType(optionsClass))({ action: _ => { } });
            }

            /**
             * Devuelve una instancia de optionsClass con los valores del config.
             * @returns {T}
             */
            get value() {
                const section = this.#template.name.toLowerCase(); // replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase(); // Convertir a kebab-case
                const rawOptions = this.#config.getSection(section);

                // Si la clase tiene properties en metadata, resuelve recursivo.
                const meta = this.#template.__metadata || {};
                let args = { ...rawOptions };

                if (meta.properties) {
                    for (const [prop, SubType] of Object.entries(meta.properties)) {
                        if (rawOptions && typeof rawOptions[prop] === 'object') {
                            // Instancia la subclase options (anidada)
                            args[prop] = this.#instantiateOptions(SubType, rawOptions[prop]);
                        }
                    }
                }

                if (this.#setup) this.#setup.configure(args);
                return new this.#template(args);
            }

            /**
             * Instancian correctamente todas las subclases, sin importar cuán profundo sea el árbol.
             * @template T
             * @param {T} Type 
             * @param {object} raw 
             * @returns T
             */
            #instantiateOptions(Type, raw) {
                // Si no es objeto, retorna el valor tal cual
                if (!raw || typeof raw !== 'object') return raw;

                const meta = Type.__metadata || {};
                const args = { ...raw };

                if (meta.properties) {
                    for (const [prop, SubType] of Object.entries(meta.properties)) {
                        if (raw[prop] && typeof raw[prop] === 'object') {
                            // Recursividad: instancia subclase y sub-subclases
                            args[prop] = this.#instantiateOptions(SubType, raw[prop]);
                        }
                    }
                }

                return new Type(args);
            }
        };
    }
}

export default OptionsTemplate;
