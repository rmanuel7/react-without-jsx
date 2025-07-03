import { FeatureCollection } from "@spajscore/extensions";
import { CancellationToken } from "@spajscore/threading";
import SocketConnectionListener from './transport/SocketConectionListener.js';

class KestrelServer {
    /**
     * @param {object} opts
     * @param {object} opts.options - Opciones del servidor (simil KestrelServerOptions)
     * @param {Array<RouterListenerFactory>} opts.transportFactories - Fabrica de listeners para SPA (popstate, pushState, etc)
     * @param {Array<any>} [opts.multiplexedFactories] - Extensible para protocolos avanzados (opcional)
     * @param {any} [opts.httpsConfigurationService] - No aplica, pero para alineación estructural
     * @param {function} [opts.loggerFactory] - Fábrica de loggers
     * @param {any} [opts.metrics] - Métricas/telemetría (opcional)
     */
    constructor({
        options,
        transportFactories,
        multiplexedFactories = [],
        httpsConfigurationService = null,
        loggerFactory = null,
        metrics = null
    }) {
        if (!options) throw new Error('KestrelServer: options es requerido');
        if (!transportFactories) throw new Error('KestrelServer: transportFactories es requerido');

        this.options = options;
        this.transportFactories = transportFactories;
        this.multiplexedFactories = multiplexedFactories;
        this.httpsConfigurationService = httpsConfigurationService;
        this.loggerFactory = loggerFactory;
        this.metrics = metrics;

        // Puedes instanciar aquí lo que sería "ServiceContext" si lo necesitas.
    }

    /**
     * Devuelve la colección de features activos.
     * @returns {FeatureCollection}
     */
    get features() {
        return this.#features;
    }

    /**
     * Inicia el ciclo de vida del servidor, aceptando conexiones y procesando solicitudes.
     * 
     * @param {HttpApplication} application - Lógica de la aplicación HTTP a ejecutar por conexión.
     * @param {CancellationToken} cancellationToken - Token para cancelar el procesamiento.
     * @returns {Promise<void>}
     */
    async startAsync(application, cancellationToken) {
        // Inicia la escucha de conexiones
        await this.#socketConnectionListener.bindAsync(application, cancellationToken);
    }

    /**
     * Detiene el servidor y libera recursos.
     * 
     * @param {CancellationToken} cancellationToken - Token para cancelar la operación de detención.
     * @returns {Promise<void>}
     */
    async stopAsync(cancellationToken) {
        // Detener el listener si es necesario
        this.#socketConnectionListener.unbindAsync(cancellationToken);
    }
}

export default Kestrel;
