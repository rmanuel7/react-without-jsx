/**
 * @typedef {object} FeatureInterfaces
 * @property {ItemsFeature} [Items]
 * @property {HttpAuthenticationFeature} [Authentication]
 * @property {RequestServicesFeature} [ServiceProviders]
 * // TODO: agregar interfaces como ISessionFeature, ILifetimeFeature, etc.
 */

import FeatureReferences from '../extensions/features/FeatureReferences.js';
import FeatureCollection from '../extensions/features/FeatureCollection.js';

import HttpRequestFeature from './features/HttpRequestFeature.js';
import HttpResponseFeature from './features/HttpResponseFeature.js';
import HttpAuthenticationFeature from './features/HttpAuthenticationFeature.js';

import DefaultHttpRequest from './internal/DefaultHttpRequest.js';
import DefaultHttpResponse from './internal/DefaultHttpResponse.js';
import HttpContextValue from './abstractions/HttpContextValue.js';

/**
 * Simula la clase DefaultHttpContext de ASP.NET Core.
 */
class DefaultHttpContext extends HttpContextValue {
    /**
     * Marca el símbolo identificador del contexto.
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.http.defaulthttpcontext');
    }

    /**
     * @type {FeatureReferences<FeatureInterfaces>}
     */
    #features;

    /**
     * @type {DefaultHttpRequest}
     */
    #request;

    /**
     * @type {DefaultHttpResponse}
     */
    #response;

    /**
     * @type {boolean}
     */
    _active = false;

    /**
     * @type {any}
     */
    serviceScopeFactory = null;

    /**
     * Crea una nueva instancia de DefaultHttpContext.
     * Inicializa la colección de features, y las instancias de request y response.
     * 
     * @param {FeatureCollection|null} [features] - Colección inicial de features (opcional).
     */
    constructor(features = null) {
        super();

        const collection = features ?? FeatureCollection();
        collection[HttpRequestFeature.__typeof] ||= new HttpRequestFeature();
        collection[HttpResponseFeature.__typeof] ||= new HttpResponseFeature();
        collection[HttpAuthenticationFeature.__typeof] ||= new HttpAuthenticationFeature();

        /**
         * @type {FeatureReferences<FeatureInterfaces>}
         */
        this.#features = new FeatureReferences(collection);

        this.#request = new DefaultHttpRequest(this);
        this.#response = new DefaultHttpResponse(this);
    }

    /**
     * Reutiliza esta instancia de contexto con un nuevo FeatureCollection.
     * @param {FeatureCollection} features
     */
    initialize(features) {
        const revision = features.revision;
        this.#features.initializeWithRevision(features, revision);
        this.#request.initializeRevision(revision);
        this.#response.initializeRevision(revision);
        this._active = true;
    }

    /**
     * Limpia las referencias a features, request y response.
     */
    uninitialize() {
        this.#features = null;
        this.#request.uninitialize();
        this.#response.uninitialize();
        this._active = false;
    }

    /**
     * Obtiene la colección de features de este contexto.
     * Esta propiedad es de solo lectura.
     * 
     * @returns {FeatureCollection}
     */
    get features() {
        return this.#features?.collection ?? this._throwContextDisposed();
    }

    /**
     * Obtiene el objeto DefaultHttpRequest de esta solicitud.
     * 
     * @returns {DefaultHttpRequest}
     * @readonly
     */
    get request() {
        return this.#request;
    }

    /**
     * Obtiene el objeto DefaultHttpResponse de esta solicitud.
     * 
     * @returns {DefaultHttpResponse}
     * @readonly
     */
    get response() {
        return this.#response;
    }

    // ====== User (ClaimsPrincipal) ======

    /**
     * Obtiene el usuario autenticado (ClaimsPrincipal) desde el feature de autenticación.
     * 
     * @returns {ClaimsPrincipal | null}
     */
    get user() {
        return this.#AuthenticationFeature.user;
    }

    /**
     * Establece el usuario autenticado (ClaimsPrincipal) en el feature de autenticación.
     * 
     * @param {ClaimsPrincipal | null} value
     */
    set user(value) {
        this.#AuthenticationFeature.user = value;
    }

    // ====== Métodos/propiedades opcionales para tests avanzados ======
    // Agrega aquí otros getters/setters si lo necesitas.

    /**
     * Devuelve una referencia a sí mismo (útil para diagnóstico o tests).
     * 
     * @returns {DefaultHttpContext}
     */
    get httpContext() {
        return this;
    }

    // ======== Internals (Features por propiedad) ========

    /**
     * Interno: obtiene el feature de autenticación desde la colección.
     * 
     * @private
     * @returns {HttpAuthenticationFeature}
     */
    get #AuthenticationFeature() {
        return this.#features.fetch(
            this.#features.cache?.Authentication,
            HttpAuthenticationFeature.__typeof,
            () => new HttpAuthenticationFeature()
        );
    }

    /**
     * Lanza un error si el contexto fue desechado o la colección no está disponible.
     * 
     * @private
     * @throws {Error}
     */
    _throwContextDisposed() {
        throw new Error('HttpContext ha sido desechado: la solicitud ha terminado.');
    }

    /**
     * Representación string para depuración. Incluye método y path de la request.
     * @returns {string}
     */
    toString() {
        return `[HttpContext] request=${this.request?.method} ${this.request?.path}`;
    }

    /**
     * Marca este objeto como identificador interno (similar a `DebuggerDisplay`).
     * @returns {string}
     */
    get [Symbol.toStringTag]() {
        return 'DefaultHttpContext';
    }
}

export default DefaultHttpContext;
