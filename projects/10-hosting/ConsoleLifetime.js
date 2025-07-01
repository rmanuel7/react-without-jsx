import HostingSymbols from './HostingSymbols';
import HostApplicationLifetime from './HostApplicationLifetime.js';
import HostOptions from './HostOptions.js';
import HostEnvironment from './HostEnvironment.js';
import { Logger, LoggerFactory } from '@spajscore/logging';
import { CancellationToken } from '@spajscore/threading';

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
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            parameters: [],
            properties: {},
            inject: {
                // consoleLifetimeOptions: ConsoleLifetimeOptions,
                environment: HostEnvironment,
                applicationLifetime: HostApplicationLifetime,
                hostOptions: HostOptions,
                loggerFactory: LoggerFactory
            }
        };
    }

    /** @type {function():void} */
    #shutdownHandlerBound = _ => { };

    /** @type {function():void} */
    #applicationStartedRegistration = _ => { };
    /** @type {function():void} */
    #applicationStoppingRegistration = _ => { };

    /** @type {ConsoleLifetimeOptions} */ #consoleLifetimeOptions;
    /** @type {HostEnvironment} */        #environment;
    /** @type {HostApplicationLifetime} */ #applicationLifetime;
    /** @type {HostOptions} */            #hostOptions;
    /** @type {Logger} */                 #logger;

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
        if (!environment || !(environment instanceof HostEnvironment)) {
            throw new Error('ConsoleLifetime: environment debe ser una instancia de HostEnvironment');
        }
        if (!applicationLifetime || !(applicationLifetime instanceof HostApplicationLifetime)) {
            throw new Error('ConsoleLifetime: applicationLifetime debe ser una instancia de HostApplicationLifetime');
        }
        if (!hostOptions || !(hostOptions instanceof HostOptions)) {
            throw new Error('ConsoleLifetime: hostOptions debe ser una instancia de HostOptions');
        }
        if (!loggerFactory || !(loggerFactory instanceof LoggerFactory)) {
            throw new Error('ConsoleLifetime: loggerFactory debe ser una instancia de LoggerFactory');
        }
        this.#consoleLifetimeOptions = consoleLifetimeOptions;
        this.#environment = environment;
        this.#applicationLifetime = applicationLifetime;
        this.#hostOptions = hostOptions;
        this.#logger = loggerFactory.createLogger(Symbol.keyFor(ConsoleLifetime.__typeof));
    }

    /**
     * Inicia el monitoreo de las señales de apagado de la consola.
     * Análogo a IHostLifetime.WaitForStartAsync() pero enfocado en iniciar el monitoreo.
     * @param {CancellationToken} cancellationToken 
     * @returns {Promise<void>}
     */
    async waitForStartAsync(cancellationToken) {
        // Monitorear el evento de inicio de la aplicación para cuando el host llame a NotifyStarted
        this.#applicationStartedRegistration = this.#applicationLifetime.applicationStarted.register(
            state => {
                if (state instanceof ConsoleLifetime) {
                    state.#onApplicationStarted();
                }
            },
            this
        );
        // Monitorear el evento de detención de la aplicación para cuando el host llame a StopApplication
        this.#applicationStoppingRegistration = this.#applicationLifetime.applicationStopping.register(
            state => {
                if (state instanceof ConsoleLifetime) {
                    state.#onApplicationStopping();
                }
            },
            this
        );

        this.#registerShutdownHandlers();

        // Este método no "espera" a que el host inicie, solo configura los listeners.
        // La espera de inicio la manejará el host principal (StartAsync).
        // Podemos resolver inmediatamente aquí si no hay una espera explícita.
        return Promise.resolve();
    }

    /**
     * Lanza los mensajes que notifican el inicio de la aplicación.
     * @description
     * Monitorear el evento de inicio de la aplicación para cuando el host llame a NotifyStarted
     * @private
     */
    #onApplicationStarted() {
        // for (const cb of this.#sigintCallbacks) cb();
        this.#logger.info('Application started. Press Ctrl+C to shut down.');
        this.#logger.info('Hosting environment: {EnvName}', this.#environment.environmentName);
        this.#logger.info('Content root path: {ContentRoot}', this.#environment.contentRootPath);
    }

    /**
     * Lanza un mensajes indicando que la aplicación se detuvo.
     * @description
     * Monitorear el evento de detención de la aplicación para cuando el host llame a NotifyStopping
     * @private
     */
    #onApplicationStopping() {
        //for (const cb of this.#sigtermCallbacks) cb();
        this.#logger.info('Application is shutting down...');
    }

    /**
     * Detiene la suscripción a los eventos de consola.
     */
    stop() {
        return;
    }

    /**
     * Detiene la suscripción a los eventos de consola.
     */
    async stopAsync() {
        // No hay nada que hacer aquí
        return Promise.resolve();
    }

    /**
     * Des-registra los handlers de shutdown previamente registrados.
     */
    dispose() {
        this.#unregisterShutdownHandlers();

        this.#applicationStartedRegistration();
        this.#applicationStoppingRegistration();
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
        this.#shutdownHandlerBound = (e) => this.#applicationLifetime.stopApplication();
        // Node.js signals
        // Browser beforeunload
        if (typeof window !== 'undefined' && window.addEventListener && window.removeEventListener) {
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
}

export default ConsoleLifetime;
