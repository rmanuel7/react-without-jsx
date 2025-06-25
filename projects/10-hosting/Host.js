import HostingSymbols from './HostingSymbols.js';
import HostEnvironment from './HostEnvironment.js';
import HostOptions from './HostOptions.js';
import HostApplicationLifetime from './HostApplicationLifetime.js';
import { LoggerFactory } from '@spajscore/logging';
import { Logger } from '@spajscore/logging';
import ConsoleLifetime from './ConsoleLifetime.js';

/**
 * Host
 * ====
 * Punto de entrada principal para la orquestación del ciclo de vida de la aplicación.
 * Inspirado en Microsoft.Extensions.Hosting.Host de .NET Core.
 *
 * @example
 * import Host from './Host.js';
 * const host = new Host({
 *   environment,
 *   options,
 *   applicationLifetime,
 *   loggerFactory
 * });
 * await host.start();
 * // ... hacer lógica de la app ...
 * await host.stop();
 */
class Host {
    /**
     * Identificador simbólico para DI (contrato IHost).
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.host;
    }

    /** * Metadatos para el contenedor DI.
     * Define las dependencias requeridas y el
     * tipo que provee este host.
     * @returns {object}
     * @property {symbol[]} provides - Tipos que este host provee.
     * @property {object} inject - Dependencias requeridas por este host.
     * @property {HostEnvironment} inject.environment - Entorno de ejecución.
     * @property {HostOptions} inject.options - Opciones de configuración del host.
     * @property {HostApplicationLifetime} inject.applicationLifetime - Ciclo de vida de la aplicación.
     * @property {LoggerFactory} inject.loggerFactory - Fábrica de loggers para registrar eventos.
     */
    static get __metadata() {
        return {
            provides: [Host.__typeof],
            inject: {
                environment: HostEnvironment,
                options: HostOptions,
                applicationLifetime: HostApplicationLifetime,
                consoleLifetime: ConsoleLifetime,
                loggerFactory: LoggerFactory
            }
        };
    }

    /** @type {HostEnvironment} */        #environment;
    /** @type {HostOptions} */            #options;
    /** @type {HostApplicationLifetime} */#applicationLifetime;
    /** @type {ConsoleLifetime} */        #consoleLifetime;
    /** @type {Logger} */                 #logger;
    /** @type {boolean} */                #started;

    /**
     * @param {object} deps
     * @param {HostEnvironment} deps.environment
     * @param {HostOptions} deps.options
     * @param {HostApplicationLifetime} deps.applicationLifetime
     * @param {ConsoleLifetime} deps.consoleLifetime
     * @param {LoggerFactory} deps.loggerFactory
     */
    constructor({ environment, options, applicationLifetime, consoleLifetime, loggerFactory }) {
        this.#environment = environment;
        this.#options = options;
        this.#applicationLifetime = applicationLifetime;
        this.#consoleLifetime = consoleLifetime;
        this.#logger = loggerFactory.createLogger(Symbol.keyFor(Host.__typeof));
        this.#started = false;
    }

    /**
     * Devuelve el entorno de ejecución.
     * @returns {HostEnvironment}
     */
    get environment() {
        return this.#environment;
    }

    /**
     * Devuelve las opciones del host.
     * @returns {HostOptions}
     */
    get options() {
        return this.#options;
    }

    /**
     * Devuelve el ciclo de vida de la aplicación.
     * @returns {HostApplicationLifetime}
     */
    get applicationLifetime() {
        return this.#applicationLifetime;
    }
    /**
     * Devuelve el ciclo de vida de la consola.
     * @returns {ConsoleLifetime}
     */
    get consoleLifetime() {
        return this.#consoleLifetime;
    }

    /**
     * Indica si el host está iniciado.
     * @returns {boolean}
     */
    get isStarted() {
        return this.#started;
    }

    /**
     * Inicia el host y el ciclo de vida.
     * @returns {Promise<void>}
     */
    async start() {
        if (this.#started) return;
        this.#logger.info('Host starting...');
        // Aquí puedes agregar lógica de inicialización si es necesario
        this.#consoleLifetime.start();
        this.#applicationLifetime.start();
        this.#started = true;
        this.#logger.info('Host started.');
    }

    /**
     * Detiene el host y el ciclo de vida.
     * @returns {Promise<void>}
     */
    async stop() {
        if (!this.#started) return;
        this.#logger.info('Host stopping...');
        // Aquí puedes agregar lógica de limpieza si es necesario
        this.#consoleLifetime.stop();
        this.#applicationLifetime.stop();
        // Aquí puedes agregar lógica de espera o limpieza si es necesario
        this.#started = false;
        this.#logger.info('Host stopped.');
    }
}

export default Host;