import OptionSymbols from './internal/OptionSymbols.js';
import { ConfigurationManager } from '@spajscore/configuration';
import ConfigureOptions from './ConfigureOptions.js';

/**
 * Options<T>
 * ==============
 * Servicio de opciones fuertemente tipadas, inspirado en Options<T> de .NET.
 *
 * @template T
 * @example
 * // Suponiendo que MySettings es una clase de configuración
 * const opts = new Options({ config, target: MySettings });
 * const mySettings = opts.value; // instancia de MySettings con valores del config
 */
class Options {
    /**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return OptionSymbols.options;
    }

    /**
     * Metadatos para DI.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [this.__typeof],
            inject: {
                config: ConfigurationManager,
                target: undefined, // Se espera que sea una clase/constructor
                setup: undefined // Función opcional para configurar las opciones
            }
        };
    }

    #config;
    #target;
    /** @type {ConfigureOptions<T>} */
    #setup;
    #section;

    /**
     * @param {object} deps
     * @param {ConfigurationManager} deps.config
     * @param {Function} deps.target - clase/constructor para las opciones tipadas
     * @param {function (T): void} [deps.setup] - función opcional para configurar las opciones
     */
    constructor({ config, target, setup = undefined }) {
        if (!(config instanceof ConfigurationManager)) {
            throw new TypeError('Options: config debe ser una instancia de ConfigurationManager');
        }
        this.#config = config;
        this.#target = target;
        this.#setup = setup || new ConfigureOptions({ action: _ => {} });
        this.#section = target.name || target.constructor.name;
        // this.#section = this.#section.replace(/([a-z])([A-Z])/g, '$1.$2').toLowerCase(); // Convertir a kebab-case
        this.#section = this.#section.toLowerCase();
    }

    /**
     * Devuelve la instancia tipada con valores provenientes de config.
     * @returns {object}
     */
    get value() {
        const opts = this.#config.getSection(this.#section);
        this.#setup.configure(opts); // Aplicar configuración adicional si se proporciona
        const Target = this.#target.name 
            ? this.#target // Si es la definición de la clase
            : this.#target.constructor; // Si es una instancia
        return new Target(opts);
    }
}

export default Options;