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
     * Devuelve una clase Options<T> específica para el tipo dado.
     * @param {T} optionsClass - Clase/constructor de opciones tipadas.
     * @returns {T}
     */
    static forType(optionsClass) {
        return class Options {
            static get __typeof() {
                return OptionSymbols.forType(optionsClass, OptionSymbols.options);
            }
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
           * @param {function (T): void} [deps.setup] - función opcional para configurar las opciones
           */
            constructor({ config, setup = undefined }) {
                if (!(config instanceof ConfigurationManager)) {
                    throw new TypeError('Options: config debe ser una instancia de ConfigurationManager');
                }
                this.#config = config;
                this.#setup = setup || new ConfigureOptions({ action: _ => { } });
            }

            /**
             * Devuelve una instancia de optionsClass con los valores del config.
             * @returns {T}
             */
            get value() {
                const section = this.#template.name.toLowerCase(); // replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase(); // Convertir a kebab-case
                const values = this.#config.getSection(section);
                if (this.#setup) this.#setup.configure(values);
                return new this.#template(values);
            }
        };
    }
}

export default OptionsTemplate;
