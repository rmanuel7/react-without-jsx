import HttpRequestFeature from './HttpRequestFeature.js';
import FeatureReferences from '../../extensions/features/FeatureReferences.js';

/**
 * Simula IQueryFeature de ASP.NET Core.
 * Proporciona acceso a los parámetros de consulta parseados.
 */
class QueryFeature {
    /**
     * Identificador del feature para FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.http.features.queryfeature');
    }

    /** @type {FeatureReferences<HttpRequestFeature>} */
    #features;
    /** @type {URLSearchParams | null} */
    #parsedValues = null;
    /** @type {string | null} */
    #original = null;

    /**
     * @param {TargetFeatureCollection} [features]
     */
    constructor(features = null) {
        /** @type {FeatureReferences<HttpRequestFeature>} */
        this.#features = new FeatureReferences(features ?? null);
        /** @type {URLSearchParams | null} */
        this.#parsedValues = null;
        /** @type {string | null} */
        this.#original = null;
    }

    /**
     * Obtiene o establece el diccionario de consulta.
     * @type {URLSearchParams}
     */
    get query() {
        if (!this.#features.collection) {
            return this.#parsedValues ?? new URLSearchParams();
        }

        const request = this._fetchRequestFeature();
        const current = request.queryString;

        if (!this.#parsedValues || this.#original !== current) {
            this.#original = current;
            this.#parsedValues = new URLSearchParams(current.startsWith('?') ? current.slice(1) : current);
        }

        return this.#parsedValues;
    }

    set query(value) {
        this.#parsedValues = value;

        if (this.#features.collection) {
            const request = this._fetchRequestFeature();
            this.#original = value.toString();
            request.queryString = `?${this.#original}`;
        }
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
}

export default QueryFeature;
