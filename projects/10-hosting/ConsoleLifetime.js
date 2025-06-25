import HostingSymbols from './HostingSymbols';
import HostApplicationLifetime from './HostApplicationLifetime.js';
import HostOptions from './HostOptions.js';
import HostEnvironment from './HostEnvironment.js';
import { Logger } from '@spajscore/logging';
import { LoggerFactory } from '@spajscore/logging';

/**
 * ConsoleLifetime
 * ===============
 * Implementa IHostLifetime para controlar el ciclo de vida del host basado en el proceso de consola.
 * Controla el ciclo de vida del host en consola, desacoplado del entorno.
 * Inspirado en ConsoleLifetime de .NET Core.
 *
 * @example
 * import ConsoleLifetime from './ConsoleLifetime.js';
 * const cl = new ConsoleLifetime({
 *   consoleLifetimeOptions,
 *   environment,
 *   applicationLifetime,
 *   hostOptions,
 *   loggerFactory
 * });
 * cl.start();
 */
class ConsoleLifetime {
    /**
     * Identificador simbólico para DI (contrato IHostLifetime).
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.consoleLifetime;
    }

    /**
     * Metadatos para el contenedor DI.
     * Proporciona las dependencias necesarias para el ciclo de vida del host.
     * @returns {object}
     * @property {symbol[]} provides - Símbolos que indican qué servicios proporciona.
     * @property {object} inject - Dependencias a inyectar.
     * @property {object} inject.consoleLifetimeOptions - Opciones del ciclo de vida de la consola.
     * @property {object} inject.environment - Entorno de ejecución.
     * @property {object} inject.applicationLifetime - Ciclo de vida de la aplicación.
     * @property {object} inject.hostOptions - Opciones del host.
     * @property {object} inject.loggerFactory - Fábrica de loggers.
     */
    static get __metadata() {
        return {
            provides: [ConsoleLifetime.__typeof],
            inject: {
                // consoleLifetimeOptions: ConsoleLifetimeOptions,
                environment: HostEnvironment,
                applicationLifetime: HostApplicationLifetime,
                hostOptions: HostOptions,
                loggerFactory: LoggerFactory
            }
        };
    }

    #consoleLifetimeOptions;
    /** @type {HostEnvironment} */        #environment;
    /** @type {HostApplicationLifetime} */ #applicationLifetime;
    /** @type {HostOptions} */            #hostOptions;
    /** @type {Logger} */                 #logger;
    /** @type {Array<function():void>} */ #sigintCallbacks;
    /** @type {Array<function():void>} */ #sigtermCallbacks;
    /** @type {function():void} */        #shutdownHandlerBound;
    /** @type {boolean} */                #isStarted;

    /**
     * Inicializa los listeners y estado.
     * @param {object} deps - Dependencias necesarias para el ciclo de vida del host.
     * @param {object} deps.consoleLifetimeOptions
     * @param {HostEnvironment} deps.environment
     * @param {HostApplicationLifetime} deps.applicationLifetime
     * @param {HostOptions} deps.hostOptions
     * @param {LoggerFactory} deps.loggerFactory
     */
    constructor({
        consoleLifetimeOptions,
        environment,
        applicationLifetime,
        hostOptions,
        loggerFactory
    }) {
        this.#consoleLifetimeOptions = consoleLifetimeOptions;
        this.#environment = environment;
        this.#applicationLifetime = applicationLifetime;
        this.#hostOptions = hostOptions;
        this.#logger = loggerFactory.createLogger(Symbol.keyFor(ConsoleLifetime.__typeof));
        this.#sigintCallbacks = [];
        this.#sigtermCallbacks = [];
        this.#isStarted = false;
    }

    /**
     * Inicia el ciclo de vida y se suscribe a eventos de consola.
     */
    start() {
        if (this.#isStarted) return;
        this.#isStarted = true;
        this.#applicationLifetime.onStarted(()=> this.#handleSigint());
        this.#registerShutdownHandlers();
    }

    /**
     * Detiene la suscripción a los eventos de consola.
     */
    stop() {
        return;
    }

    /**
     * Registra un callback para el evento SIGINT.
     * @param {function():void} callback
     */
    onSigint(callback) {
        if (typeof callback === 'function') {
            this.#sigintCallbacks.push(callback);
        }
    }

    /**
     * Registra un callback para el evento SIGTERM.
     * @param {function():void} callback
     */
    onSigterm(callback) {
        if (typeof callback === 'function') {
            this.#sigtermCallbacks.push(callback);
        }
    }

    /**
     * Interno: Llama a los callbacks de SIGINT.
     * @private
     */
    #handleSigint() {
        // for (const cb of this.#sigintCallbacks) cb();
        this.#logger.info('Application started. Press Ctrl+C to shut down.');
        this.#logger.info('Hosting environment: {EnvName}', this.#environment.environmentName);
        this.#logger.info('Content root path: {ContentRoot}', this.#environment.contentRootPath);
    }

    /**
     * Interno: Llama a los callbacks de SIGTERM.
     * @private
     */
    #handleSigterm() {
        //for (const cb of this.#sigtermCallbacks) cb();
        this.#logger.info('Application is shutting down...');
        this.#unregisterShutdownHandlers();
        this.#applicationLifetime.stopApplication();
    }

    /**
     * Registra handlers de 'shutdown' para Node.js y/o navegador.
     * El usuario debe decidir explícitamente qué entorno usar.
     *
     * @param {object} opts
     * @param {boolean} [opts.useNode] - Si se desea registrar handlers en Node.js (SIGINT/SIGTERM/SIGQUIT)
     * @param {boolean} [opts.useBrowser] - Si se desea registrar handler de beforeunload en navegador
     */
    #registerShutdownHandlers() {
        // Node.js signals
        // Browser beforeunload
        if (typeof window !== 'undefined' && window.addEventListener && window.removeEventListener) {
            this.#shutdownHandlerBound = (e) => this.#handleSigterm();
            window.addEventListener('beforeunload', this.#shutdownHandlerBound.bind(null, 'beforeunload'));
        }
    }

    /**
     * Des-registra los handlers de shutdown previamente registrados.
     * El usuario debe llamar esto antes de destruir la instancia.
     */
   #unregisterShutdownHandlers() {
        // Node.js
        
        // Browser
        if (typeof window !== 'undefined' && window.removeEventListener && this.#shutdownHandlerBound) {
            window.removeEventListener('beforeunload', this.#shutdownHandlerBound);
        }
        this.#shutdownHandlerBound = null;
    }

    /**
     * Indica si el ciclo de vida está iniciado.
     * @returns {boolean}
     */
    get isStarted() {
        return this.#isStarted;
    }

    /**
     * Cambia el estado de inicio.
     * @param {boolean} value
     */
    set isStarted(value) {
        this.#isStarted = !!value;
    }
}

export default ConsoleLifetime;
