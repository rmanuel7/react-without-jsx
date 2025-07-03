/**
 * Simula la implementación por defecto de IHttpRequestFeature en .NET Core.
 * Contiene todos los campos requeridos por el middleware HTTP para interpretar la solicitud.
 */
class HttpRequestFeature {
    /**
     * Identificador del feature para usar en FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.features.httprequestfeature');
    }

    /** @type {string} */
    protocol = '';

    /** @type {string} */
    scheme = '';

    /** @type {string} */
    method = '';

    /** @type {string} */
    pathBase = '';

    /** @type {string} */
    path = '';

    /** @type {string} */
    queryString = '';

    /** @type {string} */
    rawTarget = '';

    /** @type {Record<string, string>} */
    headers = {};

    /** @type {any} */
    body = null;

    /**
     * Crea una instancia de HttpRequestFeature, con valores por defecto o derivados del entorno.
     * @param {Partial<HttpRequestFeature>} [init]
     */
    constructor(init = {}) {
        this.protocol = init.protocol ?? '';
        this.scheme = init.scheme ?? '';
        this.method = init.method ?? '';
        this.pathBase = init.pathBase ?? '';
        this.path = init.path ?? '';
        this.queryString = init.queryString ?? '';
        this.rawTarget = init.rawTarget ?? '';
        this.headers = init.headers ?? { };
        this.body = init.body ?? null;
    }
}

export default HttpRequestFeature;
