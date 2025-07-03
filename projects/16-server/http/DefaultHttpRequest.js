/**
 * Conjunto de interfaces que representan características del contexto HTTP actual.
 * 
 * @typedef {Object} FeatureInterfaces
 * 
 * @property {IHttpRequestFeature} [Request] - Proporciona acceso a los datos brutos de la solicitud HTTP.
 * @property {IQueryFeature} [Query] - Expone la colección de parámetros de consulta (`query string`) de la solicitud.
 * @property {IFormFeature} [Form] - Proporciona acceso a los datos de formulario enviados por el cliente.
 * @property {IRequestCookiesFeature} [Cookies] - Permite acceder a las cookies enviadas con la solicitud.
 * @property {IRouteValuesFeature} [RouteValues] - Contiene los valores de ruta extraídos del patrón de enrutamiento.
 * @property {IRequestBodyPipeFeature} [BodyPipe] - Permite el acceso al cuerpo de la solicitud como un flujo legible.
 */

import HttpRequestFeature from '../features/HttpRequestFeature.js';
import QueryFeature from '../features/QueryFeature.js';
import FormFeature from '../features/FormFeature.js';
import RequestCookiesFeature from '../features/RequestCookiesFeature.js';
import RouteValuesFeature from '../features/RouteValuesFeature.js';
import { FeatureReferences } from '@spajscore/extensions';

import DefaultHttpContext from '../DefaultHttpContext.js';

/**
 * Simula la clase DefaultHttpRequest de ASP.NET Core.
 * Esta clase actúa como fachada sobre un conjunto de features internos,
 * obtenidos a través de FeatureCollection y gestionados con FeatureReferences.
 * @class DefaultHttpRequest
 */
class DefaultHttpRequest {
    /** @type {DefaultHttpContext} */
    #context;
    /** @type {FeatureReferences<FeatureInterfaces>} */
    #features;

    /**
     * @constructor
     * @param {DefaultHttpContext} context - Debe exponer .features (TargetFeatureCollection)
     */
    constructor(context) {
        this.#context = context;
        this.#features = new FeatureReferences(context.features);
    }

    /**
     * Inicializa el FeatureReferences con la FeatureCollection actual.
     * Equivale a: public void Initialize() en .NET
     */
    initialize() {
        this.#features.initialize(this.#context.features);
    }

    /**
     * Inicializa el FeatureReferences con la FeatureCollection y revisión dada.
     * Equivale a: public void Initialize(int revision) en .NET
     * @param {number} revision
     */
    initializeRevision(revision) {
        this.#features.initializeWithRevision(this.#context.features, revision);
    }

    /**
     * Elimina las referencias a features (pone a null el FeatureReferences).
     * Equivale a: public void Uninitialize() en .NET
     */
    uninitialize() {
        this.#features = null;
    }

    // --- IHttpRequestFeature ---

    /** @type {string} */
    get method() {
        return this.#requestFeature().method;
    }
    set method(val) {
        this.#requestFeature().method = val;
    }

    /** @type {string} */
    get scheme() {
        return this.#requestFeature().scheme;
    }
    set scheme(val) {
        this.#requestFeature().scheme = val;
    }

    /** @type {string} */
    get pathBase() {
        return this.#requestFeature().pathBase;
    }
    set pathBase(val) {
        this.#requestFeature().pathBase = val;
    }

    /** @type {string} */
    get path() {
        return this.#requestFeature().path;
    }
    set path(val) {
        this.#requestFeature().path = val;
    }

    /** @type {string} */
    get queryString() {
        return this.#requestFeature().queryString;
    }
    set queryString(val) {
        this.#requestFeature().queryString = val;
    }

    /** @type {string} */
    get protocol() {
        return this.#requestFeature().protocol;
    }
    set protocol(val) {
        this.#requestFeature().protocol = val;
    }

    /** @type {Record<string, string>} */
    get headers() {
        return this.#requestFeature().headers;
    }

    set headers(val) {
        this.#requestFeature().headers = val;
    }

    /** @type {any} */
    get body() {
        return this.#requestFeature().body;
    }
    set body(val) {
        this.#requestFeature().body = val;
    }

    // --- IRequestCookiesFeature ---
    /** @type {Record<string, string>} */
    get cookies() {
        return this.#cookiesFeature().cookies;
    }
    set cookies(val) {
        this.#cookiesFeature().cookies = val;
    }

    // --- IQueryFeature ---
    /** @type {URLSearchParams} */
    get query() {
        return this.#queryFeature().query;
    }
    set query(val) {
        this.#queryFeature().query = val;
    }

    // --- IFormFeature ---
    /** @type {URLSearchParams|FormData|null} */
    get form() {
        return this.#formFeature().form;
    }
    set form(val) {
        this.#formFeature().form = val;
    }

    /** @type {boolean} */
    get hasFormContentType() {
        return this.#formFeature().hasFormContentType;
    }

    // --- IRouteValuesFeature ---
    /** @type {object} */
    get routeValues() {
        return this.#routeValuesFeature().routeValues;
    }
    set routeValues(val) {
        this.#routeValuesFeature().routeValues = val;
    }

    // --- Helpers: acceso a features internos ---

    #requestFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.requestFeature,
            collection => collection.get(HttpRequestFeature.__typeof)
                ?? new HttpRequestFeature()
        );
    }

    #cookiesFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.cookiesFeature,
            collection => collection.get(RequestCookiesFeature.__typeof)
                ?? new RequestCookiesFeature(collection)
        );
    }

    #formFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.formFeature,
            collection => collection.get(FormFeature.__typeof)
                ?? new FormFeature(null, this.contentType)
        );
    }

    #queryFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.queryFeature,
            collection => collection.get(QueryFeature.__typeof)
                ?? new QueryFeature(collection)
        );
    }

    #routeValuesFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache?.routeValuesFeature,
            collection => collection.get(RouteValuesFeature.__typeof)
                ?? new RouteValuesFeature()
        );
    }

    // --- Propiedades derivadas útiles ---

    /** @type {string|undefined} */
    get contentType() {
        return this.headers?.['content-type'];
    }
    set contentType(val) {
        if (val) this.headers['content-type'] = val;
    }

    /** @type {string|undefined} */
    get contentLength() {
        return this.headers?.['content-length'];
    }
    set contentLength(val) {
        if (val) this.headers['content-length'] = val;
    }

    /** @type {boolean} */
    get isHttps() {
        return this.scheme?.toLowerCase() === 'https';
    }
    set isHttps(val) {
        this.scheme = val ? 'https' : 'http';
    }
}

export default DefaultHttpRequest;