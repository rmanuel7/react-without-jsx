import { FeatureCollection } from "@spajscore/extensions";
import { CancellationToken } from "@spajscore/threading";
import SocketConnectionListener from './transport/SocketConectionListener.js';

/**
 * Kestrel
 * =======
 * 
 * Clase principal que representa el servidor HTTP inspirado en Kestrel de .NET Core.
 * Se encarga de orquestar la recepción de conexiones y el ciclo de vida de la aplicación HTTP.
 * Utiliza un `SocketConnectionListener` para aceptar conexiones, y delega el procesamiento
 * de cada solicitud a una instancia de `HttpApplication`.
 * 
 * @example
 * import Kestrel from './Kestrel.js';
 * import FeatureCollection from '@spajscore/extensions';
 * import SocketConnectionListener from './SocketConnectionListener.js';
 * 
 * const kestrel = new Kestrel({
 *   features: new FeatureCollection(),
 *   socketConnectionListener: new SocketConnectionListener({ loggerFactory })
 * });
 * 
 * // Arranca el servidor pasando la aplicación y el token de cancelación
 * await kestrel.startAsync(myHttpApplication, cancellationToken);
 * 
 * // Detiene el servidor
 * await kestrel.stopAsync(cancellationToken);
 */
class Kestrel {
    #features;
    /** @type {SocketConnectionListener} */
    #socketConnectionListener;

    /**
     * Crea una nueva instancia de Kestrel.
     * 
     * @param {object} deps 
     * @param {FeatureCollection} deps.features - Colección de features a usar por el servidor.
     * @param {SocketConnectionListener} deps.socketConnectionListener - Componente encargado de aceptar conexiones.
     */
    constructor({ features, socketConnectionListener }) {
        this.#features = features;
        this.#socketConnectionListener = socketConnectionListener;
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
