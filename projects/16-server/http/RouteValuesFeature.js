/**
 * Simula IRouteValuesFeature de ASP.NET Core.
 * Proporciona acceso a los valores de ruta para la solicitud actual.
 */
class RouteValuesFeature {
    /**
     * Identificador del feature para FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.features.routevaluesfeature');
    }

    /** @type {Record<string, string> | null} */
    #routeValues = null;

    /**
     * Crea una nueva instancia del feature de enrutamiento.
     * @param {Record<string, string>} [initial]
     */
    constructor(initial = null) {
        if (initial) {
            this.#routeValues = { ...initial };
        }
    }

    /**
     * Obtiene los valores de ruta actuales (clave-valor).
     * Se inicializa bajo demanda si aún no existen.
     * @returns {Record<string, string>}
     */
    get routeValues() {
        if (!this.#routeValues) {
            this.#routeValues = {};
        }
        return this.#routeValues;
    }

    /**
     * Reemplaza completamente los valores de ruta.
     * @param {Record<string, string>} values
     */
    set routeValues(values) {
        this.#routeValues = values;
    }
}

export default RouteValuesFeature;
