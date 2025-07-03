import ResponseCookies from '../internal/ResponseCookies.js';
import TargetFeatureCollection from '../../extensions/features/TargetFeatureCollection.js';

/**
 * Simula IResponseCookiesFeature de ASP.NET Core.
 * Solo expone una instancia singleton de ResponseCookies.
 */
class ResponseCookiesFeature {
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.http.features.responsecookiesfeature');
    }

    /** @type {TargetFeatureCollection} */
    #features;
    /** @type {ResponseCookies|null} */
    #cookiesCollection = null;

    /**
     * @param {TargetFeatureCollection} features
     */
    constructor(features) {
        if (!features) throw new Error('ResponseCookiesFeature: features es requerido');
        this.#features = features;
    }

    /**
     * Devuelve el objeto ResponseCookies singleton.
     * @returns {ResponseCookies}
     */
    get cookies() {
        if (!this.#cookiesCollection) {
            this.#cookiesCollection = new ResponseCookies(this.#features);
        }
        return this.#cookiesCollection;
    }
}

export default ResponseCookiesFeature;