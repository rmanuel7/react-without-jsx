import HostingSymbols from "./HostingSymbols";

/**
 * HostOptions
 * ===========
 * Configuración para el entorno de hospedaje, inspirada en HostOptions de .NET Core.
 *
 * @example
 * import HostOptions from './HostOptions.js';
 * const options = new HostOptions({
 *   shutdownTimeout: 10000,
 *   backgroundServiceWaitTimeout: 5000
 * });
 * console.log(options.shutdownTimeout); // 10000
 */
class HostOptions {
    /**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.hostOptions;
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

    #shutdownTimeout;
    #backgroundServiceWaitTimeout;

    /**
     * @param {object} opts
     * @param {number} [opts.shutdownTimeout=5000] - Tiempo máximo de espera de apagado (ms).
     * @param {number} [opts.backgroundServiceWaitTimeout=5000] - Tiempo de espera para servicios en segundo plano (ms).
     */
    constructor({ shutdownTimeout = 5000, backgroundServiceWaitTimeout = 5000 } = {}) {
        this.#shutdownTimeout = shutdownTimeout;
        this.#backgroundServiceWaitTimeout = backgroundServiceWaitTimeout;
    }

    /**
     * Obtiene el tiempo máximo de espera de apagado (ms).
     * @returns {number}
     */
    get shutdownTimeout() {
        return this.#shutdownTimeout;
    }

    /**
     * Establece el tiempo máximo de espera de apagado (ms).
     * @param {number} value
     */
    set shutdownTimeout(value) {
        this.#shutdownTimeout = value;
    }

    /**
     * Obtiene el tiempo de espera para finalizar servicios en segundo plano (ms).
     * @returns {number}
     */
    get backgroundServiceWaitTimeout() {
        return this.#backgroundServiceWaitTimeout;
    }

    /**
     * Establece el tiempo de espera para finalizar servicios en segundo plano (ms).
     * @param {number} value
     */
    set backgroundServiceWaitTimeout(value) {
        this.#backgroundServiceWaitTimeout = value;
    }
}

export default HostOptions;