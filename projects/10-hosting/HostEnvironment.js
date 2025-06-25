import HostingSymbols from "./HostingSymbols";

/**
 * HostEnvironment
 * ===============
 * Representa el entorno de hospedaje de la aplicación (desarrollo, producción, etc.).
 *
 * @example
 * import HostEnvironment from './HostEnvironment.js';
 * const env = new HostEnvironment({
 *    environmentName: 'Development',
 *    contentRootPath: '/app',
 *    applicationName: 'MyApp'
 * });
 * console.log(env.environmentName); // 'Development'
 * env.environmentName = 'Production';
 * console.log(env.environmentName); // 'Production'
 */
class HostEnvironment {
    /**
     * Identificador simbólico principal para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.hostEnvironment;
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

    #environmentName;
    #contentRootPath;
    #applicationName;

    /**
     * Crea una nueva instancia de HostEnvironment.
     * @param {object} deps
     * @param {string} deps.environmentName - Nombre del entorno ('Production', 'Development', etc.)
     * @param {string} deps.contentRootPath - Ruta raíz de contenido de la aplicación
     * @param {string} [deps.applicationName] - Nombre de la aplicación
     */
    constructor({ environmentName = 'Development', contentRootPath, applicationName = '' }) {
        this.#environmentName = environmentName;
        this.#contentRootPath = contentRootPath;
        this.#applicationName = applicationName;
    }

    /**
     * Obtiene el nombre del entorno actual.
     * @returns {string}
     */
    get environmentName() {
        return this.#environmentName;
    }

    /**
     * Establece el nombre del entorno actual.
     * @param {string} value
     * @see {HostBuilder.createHostingEnvironment}
     */
    set environmentName(value) {
        this.#environmentName = value;
    }

    /**
     * Obtiene la ruta raíz de contenido de la aplicación.
     * @returns {string}
     */
    get contentRootPath() {
        return this.#contentRootPath;
    }

    /**
     * Establece la ruta raíz de contenido de la aplicación.
     * @param {string} value
     */
    set contentRootPath(value) {
        this.#contentRootPath = value;
    }

    /**
     * Obtiene el nombre de la aplicación.
     * @returns {string}
     */
    get applicationName() {
        return this.#applicationName;
    }

    /**
     * Establece el nombre de la aplicación.
     * @param {string} value
     */
    set applicationName(value) {
        this.#applicationName = value;
    }
}

export default HostEnvironment;