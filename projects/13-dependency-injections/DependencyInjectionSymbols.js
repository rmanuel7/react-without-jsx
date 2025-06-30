import SpaJsCoreSymbols from "@spajscore/symbols";

/**
 * DependencyInjectionSymbols
 * ==========================
 *
 * Repositorio centralizado de identificadores simbólicos (`Symbol.for(...)`) utilizados en el sistema
 * de inyección de dependencias inspirado en .NET Core.
 * 
 * @description
 * Cada propiedad representa un identificador único y global utilizado para registrar y resolver
 * componentes dentro del contenedor DI, como `ServiceProvider`, `ServiceDescriptor`, etc.
 *
 * Al utilizar `Symbol.keyFor(...)`, se asegura que los nombres simbólicos estén correctamente
 * jerarquizados y compartan una misma marca de producto (`softlibjs`) y dominio funcional (`spajscore.dependency_injection`).
 *
 * @example
 * Uso común en metadatos de servicios:
 * 
 * ```js
 * static get __metadata() {
 *     return {
 *         provides: [DependencyInjectionSymbols.serviceProvider],
 *         inject: {
 *             logger: DependencyInjectionSymbols.logger
 *         }
 *     };
 * }
 * ```
 */
class DependencyInjectionSymbols extends SpaJsCoreSymbols {
    /**
     * Paquete funcional de inyección de dependencias
     * @returns {symbol}
     */
    static get package() {
        return Symbol.for(`${Symbol.keyFor(this.product)}.dependency_injection`);
    }

    /**
     * Namespace de tipos base y contratos abstractos
     * @returns {symbol}
     */
    static get abstractions() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.abstractions`);
    }

    /**
     * Identificador simbólico para `ServiceMetadata`
     * @returns {symbol}
     */
    static get serviceMetadata() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.service_metadata`);
    }

    /**
     * Identificador simbólico para `ServiceLifetime`
     * @returns {symbol}
     */
    static get serviceLifetime() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.service_lifetime`);
    }

    /**
     * Identificador simbólico para `ServiceDescriptor`
     * @returns {symbol}
     */
    static get serviceDescriptor() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.service_descriptor`);
    }

    /**
     * Identificador simbólico para `ServiceCollection`
     * @returns {symbol}
     */
    static get serviceCollection() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.service_collection`);
    }

    /**
     * Identificador simbólico para `ServiceProvider`
     * @returns {symbol}
     */
    static get serviceProvider() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.service_provider`);
    }

    /**
     * Identificador simbólico para `ServiceScope`
     * @returns {symbol}
     */
    static get serviceScope() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.service_scope`);
    }

    // --- ServiceLifetime.Symbols (inspirado en .NET Core) ---

    /**
     * Identificador simbólico para el ciclo de vida `Singleton`
     * @returns {symbol}
     */
    static get lifetimeSingleton() {
        return Symbol.for(`${Symbol.keyFor(this.serviceLifetime)}.singleton`);
    }
    /**
     * Identificador simbólico para el ciclo de vida `Scoped`
     * @returns {symbol}
     */
    static get lifetimeScoped() {
        return Symbol.for(`${Symbol.keyFor(this.serviceLifetime)}.scoped`);
    }
    /**
     * Identificador simbólico para el ciclo de vida `Transient`
     * @returns {symbol}
     */
    static get lifetimeTransient() {
        return Symbol.for(`${Symbol.keyFor(this.serviceLifetime)}.transient`);
    }

    // Símbolos internos (privacidad semántica con @@)

    /**
     * Símbolo interno para acceder de forma restringida al método de instanciación interna.
     * 
     * @returns {symbol}
     */
    static get __createInstance() {
        return Symbol.for(`@@${Symbol.keyFor(this.serviceProvider)}.create_instance`);
    }

    /**
     * Símbolo interno para acceder de forma restringida al método de resolución de descriptores.
     * 
     * @returns {symbol}
     */
    static get __resolveDescriptor() {
        return Symbol.for(`@@${Symbol.keyFor(this.serviceProvider)}.resolve_descriptor`);
    }
}

export default DependencyInjectionSymbols;
