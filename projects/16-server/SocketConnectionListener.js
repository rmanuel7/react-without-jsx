import normalizePath from './normalizePath.js';
import { CancellationToken } from '@spajscore/threading';


/**
 * SocketConnectionListener
 * ========================
 * 
 * Router analogo a socket
 * 
 * @description Utiliza el historial del navegador para manejar las rutas y proporciona
 * un contexto para la navegación y los datos de la ruta actual.
 */
class SocketConnectionListener {
    /** @param {(event: Event) => void} event */
    #bindHandlerBound = event => { };
    /** @type {HttpApplication} */
    #application;

    /**
     * @param {object} deps
     * @param {LoggerFactory} deps.loggerFactory
     */
    constructor({ loggerFactory }) {

    }

    /**
     * bind
     * @param {HttpApplication} application
     * @param {CancellationToken} cancellationToken
     */
    async bindAsync(application, cancellationToken) {
        this.#application = application;
        this.#bindHandlerBound = (event) => this.#handlePopStateAsync(event, cancellationToken);
        window.addEventListener('popstate', this.#bindHandlerBound.bind(null));
        await this.#acceptAsync(cancellationToken);
    }

    /**
     * unbind
     * @param {CancellationToken} cancellationToken
     */
    async unbindAsync(cancellationToken) {
        window.removeEventListener('popstate', this.#bindHandlerBound);
    }

    /**
     * Maneja el evento `popstate` del navegador.
     * 
     * Este evento se dispara cuando el usuario navega usando los botones de retroceso o avance del navegador.
     * @method
     * @name handlePopState
     * @description Actualiza la ubicación interna del componente para reflejar el historial.
     * @param {Event} event 
     * @param {CancellationToken} cancellationToken 
     * @returns {void}
     */
    async #handlePopStateAsync(event, cancellationToken) {
        //console.log('Popstate event triggered. Current history state:', window.history.state);
        await this.#acceptAsync(cancellationToken);
    }

    /**
     * Actualiza el estado interno del componente según la URL actual del navegador.
     *
     * @method
     * @name updateLocation
     * @description Extrae la ruta (`pathname`), los parámetros de consulta (`query`) y el estado (`history.state`) para mantener sincronizado el estado.
     * @param {CancellationToken} cancellationToken 
     * @returns {void}
     */
    async #acceptAsync(cancellationToken) {
        const context = this.#application.createContext(this);
        try {
            await this.#application.processRequestAsync(context);
        } catch (error) {

        }
    }

    /**
     * Navega programáticamente a una nueva ruta utilizando `pushState`.
     *
     * @method
     * @name navigate
     * @description Agrega una nueva entrada al historial del navegador y actualiza el estado interno.
     * @param {string} relativePath - Ruta a la que se desea navegar (relativa a tu aplicación).
     * @param {object} [state={}] - Objeto de estado asociado a la nueva ruta.
     * @returns {void}
     */
    async navigateAsync(relativePath, state = {}) {
        const fullPath = this.#getFullPath(relativePath);
        window.history.pushState(state, null, fullPath);
        // console.log(`Navigating to: ${fullPath} with state:`, state);
        await this.#acceptAsync();
    }

    /**
     * Reemplaza la entrada actual del historial con una nueva ruta utilizando `replaceState`.
     * 
     * @method
     * @name replace
     * @description No agrega una nueva entrada al historial. Útil para redirecciones.
     * @param {string} relativePath - Ruta que reemplazará a la actual (relativa a tu aplicación).
     * @param {object} [state={}] - Objeto de estado asociado a la nueva ruta.
     * @returns {void}
     */
    async replaceAsync(relativePath, state = {}) {
        const fullPath = this.#getFullPath(relativePath);
        window.history.replaceState(state, null, fullPath);
        console.log(`Replacing current history entry with: ${fullPath} with state:`, state);
        await this.#acceptAsync();
    }

    /**
     * Obtiene la ruta relativa al basePath.
     * @private
     * @param {string} fullPath - La ruta completa del navegador.
     * @returns {string} La ruta relativa.
     */
    #getRelativePath(fullPath) {
        if (this.basePath && fullPath.startsWith(this.basePath)) {
            // Eliminar el basePath y asegurar que siempre empiece con '/'
            let relative = fullPath.substring(this.basePath.length);
            return relative.startsWith('/') ? relative : `/${relative}`;
        }
        return fullPath; // Si no hay basePath o no coincide, devuelve la ruta tal cual
    }

    /**
     * Obtiene la ruta completa prefijada con el basePath.
     * @private
     * @param {string} relativePath - La ruta relativa a tu aplicación.
     * @returns {string} La ruta completa para el navegador.
     */
    #getFullPath(relativePath) {
        // Asegurarse de que relativePath no tenga doble barra si ya empieza con '/'
        const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        return normalizePath(`${this.basePath}/${cleanRelativePath}`);
    }
}

export default SocketConnectionListener;
