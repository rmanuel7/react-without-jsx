/**
 * Simula IHttpResponseFeature de ASP.NET Core.
 * Permite representar el estado de la respuesta HTTP y controlar su ciclo de vida.
 */
class HttpResponseFeature {
    /**
     * Identificador del feature para usar en FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.features.httpresponsefeature');
    }

    /** @type {number} */
    statusCode = 200;

    /** @type {string | null} */
    reasonPhrase = null;

    /** @type {Record<string, string>} */
    headers = {};

    /** @type {any} */
    body = null;

    /** @type {boolean} */
    #hasStarted = false;

    /** @type {Array<{ callback: Function, state: any }>} */
    #onStartingCallbacks = [];

    /** @type {Array<{ callback: Function, state: any }>} */
    #onCompletedCallbacks = [];

    constructor() {
        // valores por defecto establecidos arriba
    }

    /**
     * Indica si la respuesta ya fue iniciada.
     * @returns {boolean}
     */
    get hasStarted() {
        return this.#hasStarted;
    }

    /**
     * Marca la respuesta como iniciada y ejecuta callbacks registrados con `onStarting`.
     */
    async start() {
        if (!this.#hasStarted) {
            this.#hasStarted = true;
            for (const { callback, state } of this.#onStartingCallbacks) {
                await callback(state);
            }
        }
    }

    /**
     * Ejecuta los callbacks registrados con `onCompleted`.
     */
    async complete() {
        for (const { callback, state } of this.#onCompletedCallbacks) {
            await callback(state);
        }
    }

    /**
     * Registra un callback que se ejecuta justo antes de iniciar la respuesta.
     * @param {(state: any) => Promise<void> | void} callback
     * @param {any} state
     */
    onStarting(callback, state) {
        this.#onStartingCallbacks.push({ callback, state });
    }

    /**
     * Registra un callback que se ejecuta al completar la respuesta.
     * @param {(state: any) => Promise<void> | void} callback
     * @param {any} state
     */
    onCompleted(callback, state) {
        this.#onCompletedCallbacks.push({ callback, state });
    }
}

export default HttpResponseFeature;
