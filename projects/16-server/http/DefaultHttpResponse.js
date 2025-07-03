/**
 * Conjunto de interfaces que representan características de la respuesta HTTP actual.
 * 
 * @typedef {Object} FeatureInterfaces
 * 
 * @property {IHttpResponseFeature} [Response] - Proporciona acceso a los metadatos de la respuesta HTTP (estado, encabezados, etc.).
 * @property {IHttpResponseBodyFeature} [ResponseBody] - Permite escribir el cuerpo de la respuesta directamente como un flujo.
 * @property {IResponseCookiesFeature} [Cookies] - Permite agregar cookies a la respuesta HTTP.
 */


import HttpResponseFeature from '../features/HttpResponseFeature.js';
import ResponseCookiesFeature from '../features/ResponseCookiesFeature.js';
import FeatureReferences from '../../extensions/features/FeatureReferences.js';

/**
 * Simula la clase DefaultHttpResponse de ASP.NET Core.
 * Actúa como fachada sobre los features internos de la respuesta HTTP.
 */
class DefaultHttpResponse {
    /** @type {any} */
    #context;
    /** @type {FeatureReferences<FeatureInterfaces>} */
    #features;

    /**
     * @constructor
     * @param {any} context - Debe exponer .features (TargetFeatureCollection)
     */
    constructor(context) {
        this.#context = context;
        this.#features = new FeatureReferences(context.features);
    }

    /**
     * Inicializa el FeatureReferences con la FeatureCollection actual.
     */
    initialize() {
        this.#features.initialize(this.#context.features);
    }

    /**
     * Inicializa el FeatureReferences con la FeatureCollection y revisión dada.
     * @param {number} revision
     */
    initializeRevision(revision) {
        this.#features.initializeWithRevision(this.#context.features, revision);
    }

    /**
     * Elimina las referencias a features (pone a null el FeatureReferences).
     */
    uninitialize() {
        this.#features = null;
    }

    // --- IHttpResponseFeature (delegados) ---

    get statusCode() {
        return this.#responseFeature().statusCode;
    }
    set statusCode(val) {
        this.#responseFeature().statusCode = val;
    }

    get reasonPhrase() {
        return this.#responseFeature().reasonPhrase;
    }
    set reasonPhrase(val) {
        this.#responseFeature().reasonPhrase = val;
    }

    get headers() {
        return this.#responseFeature().headers;
    }
    set headers(val) {
        this.#responseFeature().headers = val;
    }

    get body() {
        return this.#responseFeature().body;
    }
    set body(val) {
        this.#responseFeature().body = val;
    }

    get hasStarted() {
        return this.#responseFeature().hasStarted;
    }

    // --- Cookies API (IResponseCookiesFeature) ---
    /**
     * Devuelve el API de cookies de respuesta.
     * @returns {ResponseCookies}
     */
    get cookies() {
        return this.#cookiesFeature().cookies;
    }

    // --- Métodos utilitarios ---

    /**
     * Redirige la respuesta (simulado, cambia statusCode y podría usarse en middleware SPA).
     * @param {string} url
     */
    redirect(url) {
        this.statusCode = 302;
        this.headers['location'] = url;
        // En SPA, podrías usar window.location.href = url si quieres simular navegación real.
    }

    /**
     * Simula escritura de una respuesta lógica. Puedes conectar esto a logs o a una UI.
     * @param {any} content
     */
    write(content) {
        // Esto puede redirigirse a un portal visual o logger
        // En entornos reales: escribiría en el stream de respuesta
        console.warn('[HttpResponse.write] Simulación de salida:', content);
    }

    /**
     * Establece una cabecera simulada.
     * @param {string} name
     * @param {string} value
     */
    setHeader(name, value) {
        this.headers[name.toLowerCase()] = value;
    }

    /**
     * Obtiene el valor de una cabecera simulada.
     * @param {string} name
     * @returns {string | undefined}
     */
    getHeader(name) {
        return this.headers[name.toLowerCase()];
    }

    // --- Helpers privados para acceso a features ---

    #responseFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.responseFeature,
            collection => collection.get(HttpResponseFeature.__typeof)
                ?? new HttpResponseFeature()
        );
    }

    #cookiesFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.responseCookiesFeature,
            collection => collection.get(ResponseCookiesFeature.__typeof)
                ?? new ResponseCookiesFeature(collection)
        );
    }
}

export default DefaultHttpResponse;
