/**
 * @typedef {object} RouterProps - Las propiedades del componente.
 * @property {strng} [basePath] - Ruta de acceso base de la solicitud. La base de ruta de acceso no debe terminar con una barra diagonal final.
 * @property {React.ReactNode} children - Componente <Routes> Contenedor para la definición de rutas anidadas.
 */

/**
 * @typedef {Object} RouterState - Valor del estado del componente.
 * @property {RequestContextValue} req - Información de la solicitud HTTP actual.
 */


import { createReactElement as h } from '../Shared/ReactFunctions.js';
import RouterContext from './RouterContext.js';
import RequestContext from './RequestContext.js';
import RequestContextValue from './RequestContextValue.js';
import RouterContextValue from './RouterContextValue.js';
import normalizePath from './normalizePath.js';


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
    /**
     * 
     * @param {(event: Event) => void} event
     */
    #bindHandlerBound = event => { };

    constructor({ loggerFactory }) {

    }

    /**
     * 
     */
    accept() {
        this.#updateLocation();
        this.#bindHandlerBound = (event) => this.#handlePopState(event);
        window.addEventListener('popstate', this.#bindHandlerBound);
    }

    /**
     * 
     */
    unbind() {
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
     * @returns {void}
     */
    #handlePopState(event) {
        console.log('Popstate event triggered. Current history state:', window.history.state);
        this.#updateLocation();
    }

    /**
     * Actualiza el estado interno del componente según la URL actual del navegador.
     *
     * @method
     * @name updateLocation
     * @description Extrae la ruta (`pathname`), los parámetros de consulta (`query`) y el estado (`history.state`) para mantener sincronizado el estado.
     * @returns {void}
     */
    #updateLocation() {
        const stateDataInfo = window.history.state;

        const currentRequestContext = RequestContextValue.fromWindowLocation({
            pathBase: this.pathBase,
            // El `relativePath` específicamente, puedes derivarlo del `.path`.
            path: this.#getRelativePath(fullPath),
            contentLength: stateDataInfo?.contentLength,
            contentType: stateDataInfo?.contentType,
            hasFormContentType: stateDataInfo?.hasFormContentType,
            form: stateDataInfo?.form,
        });

        this.setState({
            req: currentRequestContext
        });
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
    navigate(relativePath, state = {}) {
        const fullPath = this.#getFullPath(relativePath);
        window.history.pushState(state, null, fullPath);
        console.log(`Navigating to: ${fullPath} with state:`, state);
        this.#updateLocation();
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
    replace(relativePath, state = {}) {
        const fullPath = this.#getFullPath(relativePath);
        window.history.replaceState(state, null, fullPath);
        console.log(`Replacing current history entry with: ${fullPath} with state:`, state);
        this.#updateLocation();
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
