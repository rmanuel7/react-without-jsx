import SpaJsCoreSymbols from "@spajscore/symbols";

/**
 * HttpSymbols
 * ===========
 * 
 * Repositorio centralizado para símbolos globales usados en el sistema HTTP,
 * inspirado en .NET Core y alineado a la convención SPA JS Core.
 *
 * Cada propiedad representa un identificador único y global para registrar y resolver
 * componentes HTTP dentro del contenedor DI, como ApplicationBuilder, RequestDelegate, etc.
 *
 * @example
 * import HttpSymbols from './HttpSymbols.js';
 * Symbol.keyFor(HttpSymbols.application_builder); // 'softlibjs.spajscore.http.application_builder'
 */
class HttpSymbols extends SpaJsCoreSymbols {
    /**
     * Paquete funcional de http
     * @returns {symbol}
     */
    static get package() {
        return Symbol.for(`${Symbol.keyFor(this.product)}.http`);
    }

    // ==================================================================
    //                          ROOT SYMBOLS
    // ==================================================================

    /**
     * Identificador simbólico para ApplicationBuilder
     * @returns {symbol}
     */
    static get applicationBuilder() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.application_builder`);
    }

    /**
     * Identificador simbólico para RequestDelegate
     * @returns {symbol}
     */
    static get request_delegate() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.request_delegate`);
    }

    /**
     * Identificador simbólico para Middleware
     * @returns {symbol}
     */
    static get middleware() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.middleware`);
    }

    /**
     * Identificador simbólico para FeatureCollection
     * @returns {symbol}
     */
    static get feature_collection() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.feature_collection`);
    }

    /**
     * Identificador simbólico para HttpContext
     * @returns {symbol}
     */
    static get http_context() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.http_context`);
    }

    /**
     * Identificador simbólico para EndpointDataSource
     * @returns {symbol}
     */
    static get endpoint_data_source() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.endpoint_data_source`);
    }

    /**
     * Identificador simbólico para Endpoint
     * @returns {symbol}
     */
    static get endpoint() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.endpoint`);
    }

    // Puedes agregar más símbolos relacionados con HTTP aquí según tu stack...
}

export default HttpSymbols;