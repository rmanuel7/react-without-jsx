import SpaJsCoreSymbols from "@spajscore/symbols";

/**
 * HostingSymbols
 * ==============
 *
 * Repositorio centralizado de identificadores simbólicos (`Symbol.for(...)`) utilizados en el sistema
 * de hosting inspirado en .NET Core. Sigue exactamente la convención de symbol-style.md.
 *
 * @description
 * Cada propiedad representa un identificador único y global utilizado para registrar y resolver
 * componentes dentro del ecosistema de hosting, como `HostEnvironment`, `HostOptions`, etc.
 *
 * @example
 * import HostingSymbols from './HostingSymbols.js';
 * Symbol.keyFor(HostingSymbols.hostEnvironment) // "softlibjs.spajscore.hosting.abstractions.host_environment"
 */
class HostingSymbols extends SpaJsCoreSymbols {
    /**
     * Paquete funcional de hosting
     * @returns {symbol}
     */
    static get package() {
        return Symbol.for(`${Symbol.keyFor(this.product)}.hosting`);
    }

    // ==================================================================
    //                          ROOT FILES
    // ==================================================================

    /**
     * Identificador simbólico para `HostBuilderContext`
     * @returns {symbol}
     */
    static get hostBuilderContext() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.host_builder_context`);
    }
    
    /**
     * Identificador simbólico para `HostApplicationBuilder`
     * @returns {symbol}
     */
    static get hostApplicationBuilder() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.host_application_builder`);
    }

    // ==================================================================
    //                          ABSTRACTIONS
    // ==================================================================

    /**
     * Namespace de tipos base y contratos abstractos
     * @returns {symbol}
     */
    static get abstractions() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.abstractions`);
    }

    // ==================================================================
    //                          INTERNAL
    // ==================================================================

    /**
     * Namespace de tipos internos
     * @returns {symbol}
     */
    static get internal() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.internal`);
    }
    
    /**
     * Identificador simbólico para `HostEnvironment`
     * @returns {symbol}
     */
    static get hostEnvironment() {
        return Symbol.for(`${Symbol.keyFor(this.internal)}.host_environment`);
    }

    /**
     * Identificador simbólico para `HostOptions`
     * @returns {symbol}
     */
    static get hostOptions() {
        return Symbol.for(`${Symbol.keyFor(this.internal)}.host_options`);
    }

    /**
     * Identificador simbólico para `HostApplicationLifetime`
     * @returns {symbol}
     */
    static get hostApplicationLifetime() {
        return Symbol.for(`${Symbol.keyFor(this.internal)}.host_application_lifetime`);
    }

    /**
     * Identificador simbólico para `ConsoleLifetime`
     * @returns {symbol}
     */
    static get consoleLifetime() {
        return Symbol.for(`${Symbol.keyFor(this.internal)}.console_lifetime`);
    }
    /**
     * Identificador simbólico para `Host`
     * @returns {symbol}
     */
    static get host() {
        return Symbol.for(`${Symbol.keyFor(this.internal)}.host`);
    }
}

export default HostingSymbols;
