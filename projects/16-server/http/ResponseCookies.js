import TargetFeatureCollection from '../../extensions/features/TargetFeatureCollection.js';

/**
 * Simula IResponseCookies de ASP.NET Core.
 * Expone una API para manipular cookies en la respuesta HTTP.
 * Esta clase contiene la lógica real de append/delete y opera sobre la colección de features.
 */
class ResponseCookies {
    /** @type {TargetFeatureCollection} */
    #features;

    /**
     * @param {TargetFeatureCollection} features
     */
    constructor(features) {
        if (!features) throw new Error('ResponseCookies requiere una colección de features.');
        this.#features = features;
    }

    /**
     * Agrega o reemplaza una cookie en la respuesta.
     * @param {string} name
     * @param {string} value
     * @param {object} [options]
     */
    append(name, value, options = {}) {
        const headerValue = this.#buildSetCookieHeader(name, value, options);
        this.#addSetCookieHeader(headerValue);
    }

    /**
     * Elimina una cookie (expira inmediatamente).
     * @param {string} name
     * @param {object} [options]
     */
    delete(name, options = {}) {
        // Para borrar, valor vacío y expiración en el pasado
        this.append(name, '', { ...options, expires: new Date(0) });
    }

    /**
     * Agrega un header Set-Cookie a la respuesta.
     * @param {string} headerValue
     */
    #addSetCookieHeader(headerValue) {
        const response = this.#getResponseFeature();
        if (!response.headers['set-cookie']) {
            response.headers['set-cookie'] = [];
        }
        if (!Array.isArray(response.headers['set-cookie'])) {
            response.headers['set-cookie'] = [response.headers['set-cookie']];
        }
        response.headers['set-cookie'].push(headerValue);
    }

    /**
     * Construye el valor del header Set-Cookie.
     * @param {string} name
     * @param {string} value
     * @param {object} options
     * @returns {string}
     */
    #buildSetCookieHeader(name, value, options) {
        let header = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.expires) {
            // Si es Date, conviértelo a UTC string
            const expires = (options.expires instanceof Date)
                ? options.expires.toUTCString()
                : options.expires;
            header += `; Expires=${expires}`;
        }
        if (options.maxAge != null) header += `; Max-Age=${options.maxAge}`;
        if (options.domain) header += `; Domain=${options.domain}`;
        if (options.path) header += `; Path=${options.path}`;
        if (options.secure) header += `; Secure`;
        if (options.httpOnly) header += `; HttpOnly`;
        if (options.sameSite) header += `; SameSite=${options.sameSite}`;
        return header;
    }

    /**
     * Obtiene el feature de respuesta HTTP.
     * @returns {any}
     */
    #getResponseFeature() {
        const httpResponseSymbol = Symbol.for('softlib.spawebcore.features.httpresponsefeature');
        let response = null;

        if (this.#features && typeof this.#features.getFeature === 'function') {
            response = this.#features.getFeature(httpResponseSymbol);
        } else if (this.#features && typeof this.#features.get === 'function') {
            response = this.#features.get(httpResponseSymbol);
        }

        if (!response) {
            // fallback: crea uno básico si no existe
            response = { headers: {} };
        }

        return response;
    }
}

export default ResponseCookies;