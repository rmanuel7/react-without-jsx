import HttpRequestFeature from './HttpRequestFeature.js';
import TargetFeatureCollection from '../../extensions/features/TargetFeatureCollection.js';
import FeatureReferences from '../../extensions/features/FeatureReferences.js';

/**
 * Simula IRequestCookiesFeature de ASP.NET Core.
 * Proporciona acceso a las cookies de la solicitud como un diccionario clave-valor.
 */
class RequestCookiesFeature {
    /**
     * Identificador del feature para FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.http.features.requestcookiesfeature');
    }

    /** @type {FeatureReferences<HttpRequestFeature>} */
    #features;
    /** @type {Record<string, string> | null} */
    #cookies = null;
    /** @type {string | null} */
    #raw = null;

    /**
     * @param {TargetFeatureCollection} [features]
     */
    constructor(features = null) {
        /** @type {FeatureReferences<HttpRequestFeature>} */
        this.#features = new FeatureReferences(features ?? null);
        /** @type {Record<string, string> | null} */
        this.#cookies = null;
        /** @type {string | null} */
        this.#raw = null;
    }

    /**
     * Obtiene las cookies parseadas como un diccionario clave-valor.
     * @returns {Record<string, string>}
     */
    get cookies() {
        if (!this.#features.collection) return this.#cookies ?? {};

        const request = this._fetchRequestFeature();
        // En HTTP real, las cookies van en headers['cookie'], aquí simulamos igual
        const rawCookie = request.headers?.cookie ?? '';

        if (!this.#cookies || this.#raw !== rawCookie) {
            this.#raw = rawCookie;
            this.#cookies = this._parseCookies(rawCookie);
        }

        return this.#cookies;
    }

    /**
     * Establece las cookies manualmente (sobrescribe headers['cookie']).
     * @param {Record<string, string>} value
     */
    set cookies(value) {
        this.#cookies = value;
        this.#raw = this._serializeCookies(value);

        const request = this._fetchRequestFeature();
        if (!request.headers) request.headers = {};
        request.headers.cookie = this.#raw;
    }

    /**
     * Obtiene el HttpRequestFeature usando FeatureReferences.
     * @returns {HttpRequestFeature}
     */
    _fetchRequestFeature() {
        return this.#features.fetchWithCollection(
            this.#features.cache,
            (collection) => collection.get(HttpRequestFeature.__typeof)
        );
    }

    /**
     * Parsea una cadena de cookies HTTP a un objeto.
     * @param {string} cookieString
     * @returns {Record<string, string>}
     */
    _parseCookies(cookieString) {
        const out = {};
        if (!cookieString) return out;
        // cookieString: "a=1; b=2; c=3"
        cookieString.split(';').forEach(pair => {
            const idx = pair.indexOf('=');
            if (idx > -1) {
                const key = decodeURIComponent(pair.slice(0, idx).trim());
                const val = decodeURIComponent(pair.slice(idx + 1).trim());
                out[key] = val;
            }
        });
        return out;
    }

    /**
     * Serializa un objeto de cookies a cadena HTTP.
     * @param {Record<string, string>} cookies
     * @returns {string}
     */
    _serializeCookies(cookies) {
        return Object.entries(cookies)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('; ');
    }
}

export default RequestCookiesFeature;