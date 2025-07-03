/**
 * Simula IHttpAuthenticationFeature de ASP.NET Core.
 * Contiene la identidad del usuario autenticado para la solicitud actual.
 */
class HttpAuthenticationFeature {
    /**
     * Identificador del feature para FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.sapwebcore.http.features.httpauthenticationfeature');
    }

    /**
     * @type {ClaimsPrincipal | null}
     * El usuario autenticado (si existe).
     */
    user = null;

    /**
     * @constructor
     * @param {ClaimsPrincipal | null} [user]
     */
    constructor(user = null) {
        this.user = user;
    }
}

export default HttpAuthenticationFeature;
