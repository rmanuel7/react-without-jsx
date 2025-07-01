import { Logger, LoggerFactory } from "@spajscore/logging";
import HostingSymbols from "./HostingSymbols";
import { CancellationToken, CancellationTokenSource } from "@spajscore/threading";

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
            parameters: [],
            properties: {},
            inject: {
                logger: HostingSymbols.makeTypeBySymbol(HostingSymbols.forTypeBySymbol(this.__typeof, Logger.__typeof))
            }
        };
    }

    /** @type {Logger<HostApplicationLifetime>} */ #logger;
    /** @type {CancellationTokenSource} */ #startedSource = new CancellationTokenSource();
    /** @type {CancellationTokenSource} */ #stoppingSource = new CancellationTokenSource();
    /** @type {CancellationTokenSource} */ #stoppedSource = new CancellationTokenSource();

    /**
     * Inicializa los estados y listeners internos del ciclo de vida.
     * @param {object} deps - Dependencias necesarias para el ciclo de vida del host.
     * @param {Logger<HostApplicationLifetime>} deps.logger - Logger para registrar eventos.
     */
    constructor({ logger }) {
        if(!logger|| !(logger instanceof Logger)){
            throw new Error('HostApplicationLifetime: logger debe ser una instancia de Logger');
        }

        this.#logger = logger;
    }

    /**
     * Obtiene un CancellationToken que se cancela cuando la aplicación ha iniciado completamente.
     * Análogo a IHostApplicationLifetime.ApplicationStarted.
     * @returns {CancellationToken}
     */
    get applicationStarted() {
        return this.#startedSource.token;
    }

    /**
     * Obtiene un CancellationToken que se cancela cuando la aplicación está a punto de detenerse.
     * Análogo a IHostApplicationLifetime.ApplicationStopping.
     * @returns {CancellationToken}
     */
    get applicationStopping() {
        return this.#stoppingSource.token;
    }

    /**
     * Obtiene un CancellationToken que se cancela cuando la aplicación se ha detenido por completo.
     * Análogo a IHostApplicationLifetime.ApplicationStopped.
     * @returns {CancellationToken}
     */
    get applicationStopped() {
        return this.#stoppedSource.token;
    }

    /**
     * Notifica que la aplicación está a punto de detenerse.
     * Esto dispara el evento ApplicationStopping.
     * Análogo a IHostApplicationLifetime.NotifyStopping().
     */
    stopApplication() {
        if (!this.#stoppingSource.token.isCancellationRequested) {
            this.#logger.info("[ApplicationLifetime] Application is stopping.");
            this.#stoppingSource.cancel();
        }
    }

    /**
     * Notifica que la aplicación ha iniciado completamente.
     * Esto dispara el evento ApplicationStarted.
     * Análogo a IHostApplicationLifetime.NotifyStarted().
     */
    notifyStarted() {
        try {
            this.#startedSource.cancel();
            this.#logger.info("[ApplicationLifetime] Application has successfully started.");
        } catch (error) {
            // En C#, este método atrapa y no relanza excepciones.
            // Lo mismo aquí para emular ese comportamiento.
            this.#logger.error("[ApplicationLifetime] Error during NotifyStarted:", error);
        }
    }

    /**
     * Notifica que la aplicación se ha detenido por completo.
     * Esto dispara el evento ApplicationStopped.
     * Análogo a IHostApplicationLifetime.NotifyStopped().
     */
    notifyStopped() {
        if (!this.#stoppedSource.token.isCancellationRequested) {
            this.#logger.info("[ApplicationLifetime] Application has stopped.");
            this.#stoppedSource.cancel();
        }
    }
}

export default HostApplicationLifetime;
