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
        this._validateOptions();
    
        if (this._hasStarted) throw new Error("Server already started");
        this._hasStarted = true;
    
        // this.serviceContext.heartbeat?.start();
    
        // OnBind: para cada listener SPA
        const onBind = async (listenOptions, cancellationToken) => {
            // Decide qué eventos/transportes activar (popstate, hashchange, etc)
            if (listenOptions.protocols.includes('popstate')) {
                if (!this.transportFactories.length)
                    throw new Error("No listener factories registered");
    
                // UseHttpServer: compón el pipeline de navegación
                const connectionDelegate = listenOptions.buildPipeline(application);
    
                // BindAsync: registra el listener en el browser
                listenOptions.endpoint = await this.transportManager.bindAsync(
                    listenOptions.endpoint, connectionDelegate, listenOptions, cancellationToken
                );
            }
            // ...otros protocolos/eventos si fueran necesarios...
        };
    
        this.addressBindContext = new AddressBindContext(this.serverAddresses, this.options, this.trace, onBind);
    
        await this.bindAsync(cancellationToken);
    }

    async bindAsync(cancellationToken) {
        // 1. Previene doble bind
        if (this._binding) throw new Error("Already binding");
        this._binding = true;
    
        try {
            if (this._stopping) throw new Error("Server stopped");
    
            // 2. (Opcional) Prevenir mutaciones en endpoints
            this.serverAddresses.preventExternalMutation();
    
            // 3. (Opcional) Suscribirse a cambios de configuración dinámica
            if (this.options.reloadOnChange) {
                this._configChangedRegistration = this.options.onReload(() => this.triggerRebind());
            }
    
            // 4. Actualiza la configuración interna de endpoints
            this.options.loadInternal();
            this.options.processEndpointsToAdd();
    
            // 5. Para cada ListenOption (por ejemplo, popstate, hashchange, etc.)
            await AddressBinder.bindAsync(
                this.options.getListenOptions(),  // [{eventType: 'popstate', ...}]
                this.addressBindContext,          // Incluye el onBind y el application
                this.httpsConfigurationService,   // No relevante en SPA
                cancellationToken
            );
        } finally {
            this._binding = false;
        }
    }
    
    /**
     * Detiene el servidor y libera recursos.
     * 
     * @param {CancellationToken} cancellationToken - Token para cancelar la operación de detención.
     * @returns {Promise<void>}
     */
    async stopAsync(cancellationToken) {
        // Detener el listener si es necesario
    }
}

export default Kestrel;
