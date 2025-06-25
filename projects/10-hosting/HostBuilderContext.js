import HostingSymbols from "./internal/HostingSymbols";

/**
 * HostBuilderContext
 * ==================
 * 
 * El contexto del host builder que contiene información sobre el entorno del host, la configuración y las propiedades.
 * Este contexto es utilizado por el host builder para inicializar el entorno del host y la configuración.
 * 
 * @example
 * import HostBuilderContext from './HostBuilderContext.js';
 * const context = new HostBuilderContext({
 *   properties: new Map([['key', 'value']]),
 *   configuration: new ConfigurationManager(),
 *   hostEnvironment: new HostEnvironment()
 * });
 */
class HostBuilderContext {
    /**
     * Identificador simbólico principal para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.hostBuilderContext;
    }

    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [this.__typeof],
            inject: {}
        };
    }

    /**
     * @type {HostEnvironment}
     */
    #hostEnvironment;
    /**
     * @type {ConfigurationManager}
     */
    #configuration;
    /**
     * @type {Map<object, object>}
     */
    #properties;

    constructor({ properties, configuration, hostEnvironment } = {}) {
        if (properties instanceof Map === false) {
            throw new Error('HostBuilderContext: properties debe ser una instancia de Map');
        }
        this.#properties = properties;
        this.#configuration = configuration || null;
        this.#hostEnvironment = hostEnvironment || null;
    }

    /**
     * El entorno del host inicializado por el host builder.
     * @returns {HostEnvironment}
     */
    get hostEnvironment() {
        return this.#hostEnvironment;
    }

    /**
     * El ConfigurationManager inicializado por el host builder.
     * @returns {ConfigurationManager}
     */
    get configuration() {
        return this.#configuration;
    }

    /**
     * Un mapa de propiedades que pueden ser utilizadas por el host builder.
     * @returns {Map<object, object>}
     */
    get properties() {
        return this.#properties;
    }
}

export default HostBuilderContext;
