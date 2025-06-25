import { Logger } from "@spajscore/logging";
import HostingSymbols from "./HostingSymbols";

/**
 * HostApplicationLifetime
 * =======================
 * Permite controlar y observar los eventos de ciclo de vida de la aplicación (inicio, detención, etc.).
 *
 * Inspirado en IHostApplicationLifetime de .NET Core.
 *
 * @example
 * import HostApplicationLifetime from './HostApplicationLifetime.js';
 * const lifetime = new HostApplicationLifetime();
 * lifetime.onStarted(() => console.log('App iniciada'));
 * lifetime.start();
 */
class HostApplicationLifetime {
    /**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.hostApplicationLifetime;
    }

    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [HostApplicationLifetime.__typeof],
            inject: {
                logger: Logger
            }
        };
    }

    /** @type {Logger} */ #logger;
    /** @type {Array<function():void>} */ #startedCallbacks;
    /** @type {Array<function():void>} */ #stoppingCallbacks;
    /** @type {Array<function():void>} */ #stoppedCallbacks;
    /** @type {boolean} */ #isStarted;
    /** @type {boolean} */ #isStopping;
    /** @type {boolean} */ #isStopped;

    /**
     * Inicializa los estados y listeners internos del ciclo de vida.
     * @param {object} deps - Dependencias necesarias para el ciclo de vida del host.
     * @param {Logger} deps.logger - Logger para registrar eventos.
     */
    constructor({ logger }) {
        this.#logger = logger;
        this.#startedCallbacks = [];
        this.#stoppingCallbacks = [];
        this.#stoppedCallbacks = [];
        this.#isStarted = false;
        this.#isStopping = false;
        this.#isStopped = false;
    }

    /**
     * Registra un callback para cuando la aplicación inicia.
     * @param {function():void} callback
     */
    onStarted(callback) {
        if (typeof callback === 'function') {
            this.#startedCallbacks.push(callback);
        } else {
            this.#logger.warn('onStarted callback debe ser una función');
        }
    }

    /**
     * Registra un callback para cuando la aplicación comienza a detenerse.
     * @param {function():void} callback
     */
    onStopping(callback) {
        if (typeof callback === 'function') {
            this.#stoppingCallbacks.push(callback);
        } else {
            this.#logger.warn('onStopping callback debe ser una función');
        }
    }

    /**
     * Registra un callback para cuando la aplicación ya se detuvo.
     * @param {function():void} callback
     */
    onStopped(callback) {
        if (typeof callback === 'function') {
            this.#stoppedCallbacks.push(callback);
        } else {
            this.#logger.warn('onStopped callback debe ser una función');
        }
    }

    /**
     * Marca la aplicación como iniciada y ejecuta los callbacks correspondientes.
     */
    start() {
        if (this.#isStarted) return;
        this.#isStarted = true;
        for (const cb of this.#startedCallbacks) cb();
    }

    /**
     * Marca la aplicación como comenzando a detenerse y ejecuta los callbacks correspondientes.
     */
    stop() {
        if (this.#isStopping && this.#isStopped) return;
        this.#isStopping = true;
        for (const cb of this.#stoppingCallbacks) cb();
    }

    /**
     * Marca la aplicación como detenida y ejecuta los callbacks correspondientes.
     */
    stopped() {
        if (this.#isStopped) return;
        this.#isStopped = true;
        for (const cb of this.#stoppedCallbacks) cb();
    }

    /**
     * Indica si la aplicación ha iniciado.
     * @returns {boolean}
     */
    get isStarted() {
        return this.#isStarted;
    }

    /**
     * Indica si la aplicación se está deteniendo.
     * @returns {boolean}
     */
    get isStopping() {
        return this.#isStopping;
    }

    /**
     * Indica si la aplicación ya se detuvo.
     * @returns {boolean}
     */
    get isStopped() {
        return this.#isStopped;
    }
}

export default HostApplicationLifetime;