/**
 * SpaJsCoreSymbols
 * =================
 * 
 * Clase base centralizadora de símbolos globales para todos los paquetes SPA JS Core.
 * Todos los paquetes funcionales deben extender esta clase y definir sus propios símbolos namespacados.
 *
 * @example
 * // Paquete de configuración:
 * class ConfigurationSymbols extends SpaJsCoreSymbols {
 *   static get configurationManager() {
 *     return Symbol.for(`${Symbol.keyFor(this.product)}.configuration.configuration_manager`);
 *   }
 * }
 */
class SpaJsCoreSymbols {
    /**
     * Marca global del producto base (softlibjs)
     * @returns {symbol}
     */
    static get brand() {
        return Symbol.for('softlibjs');
    }

    /**
     * Producto o módulo principal del sistema SPA JS Core
     * @returns {symbol}
     */
    static get product() {
        return Symbol.for(`${Symbol.keyFor(this.brand)}.spajscore`);
    }

    /**
     * (Opcional) Paquete funcional base para la extensión.
     * Los paquetes hijos deben sobreescribir este getter con su propio namespace.
     * @returns {symbol}
     */
    static get package() {
        throw new Error('SpaJsCoreSymbols.package debe ser implementado por subclases');
    }

    /**
     * Devuelve el símbolo concreto GenericType<ParameterType> para un tipo dado.
     *
     * @param {Function} parameterType - Clase/constructor concreta a parametrizar.
     * @param {symbol} genericType - Símbolo global del tipo genérico.
     * @returns {symbol}
     * 
     * @example
     * // Para contratos genéricos (interfaz o clase) como `Enumerable<T>`, usa siempre:
     * CollectionsSymbols.forType(elementClass, CollectionsSymbols.enumerable)
     * // Genera: `<symbol_key_for_enumerable><<symbol_key_for_elementClass>>`
     */
    static forType(parameterType, genericType) {
        if (!parameterType || typeof parameterType !== 'function' || !parameterType.prototype) {
            throw new TypeError('forType: parameterType debe ser una clase/constructor.');
        }
        return this.forTypeBySymbol(parameterType, genericType);
    }

    static forTypeBySymbol(parameterType, genericType) {
        if (typeof parameterType !== 'symbol') {
            throw new Error('forType: parameterType debe ser un Symbol global.');
        }
        if (typeof genericType !== 'symbol') {
            throw new TypeError('forType: genericType debe ser un Symbol global.');
        }
        const genericKey = Symbol.keyFor(genericType);
        const paramKey = Symbol.keyFor(parameterType);
        if (!genericKey || !paramKey) {
            throw new Error('forType: Ambos argumentos deben ser Symbol globales creados con Symbol.for().');
        }
        const __typeof = `${genericKey}<${paramKey}>`;
        return Symbol.for(__typeof.trim());
    }

    /**
     * Genera un identificador único para registrar una clase concreta
     * que provee una interfaz o clase base en el contenedor de inyección de dependencias (DI).
     *
     * @description
     * Este símbolo establece la relación "Implementación : Base" dentro del DI,
     * permitiéndole resolver la `baseType` (interfaz o clase base)
     * a una instancia de la `implementType` (la clase que la provee).
     * 
     * @param {Function} implementType - El constructor de la clase concreta (la implementación).
     * @param {symbol} baseType - Símbolo global de la interfaz o clase base que la `implementType` provee.
     * @returns {symbol} Un símbolo único que el DI usará para identificar esta relación de servicio.
     * 
     * @example
     * // Cuando ConsoleLogger implementa ILogger, esta función generaría un identificador
     * // para registrar la relación: ConsoleLogger : ILogger
     *
     */
    static implType(implementType, baseType) {
        if (!implementType || typeof implementType !== 'function' || !implementType.prototype) {
            throw new TypeError('implType: implementType debe ser una clase/constructor.');
        }
        return this.implTypeBySymbol(implementType.__typeof, baseType);
    }

    static implTypeBySymbol(implementType, baseType) {
        if (typeof implementType !== 'symbol') {
            throw new Error('implTypeBySymbol: implementType debe ser un Symbol global.');
        }
        if (typeof baseType !== 'symbol') {
            throw new TypeError('implTypeBySymbol: baseType debe ser un Symbol global.');
        }
        const baseKey = Symbol.keyFor(baseType);
        const implKey = Symbol.keyFor(implementType);
        if (!baseKey || !implKey) {
            throw new Error('implType: Ambos argumentos deben ser Symbol globales creados con Symbol.for().');
        }
        const __typeof = `${implKey} : ${baseKey}`;
        return Symbol.for(__typeof.trim());
    }

    /**
     * 
     * @param {symbol} type 
     * @returns {class}
     */
    static makeTypeBySymbol(type) {
        if(typeof type !== 'symbol'){
            throw new TypeError('makeTypeBySymbol: type debe ser un symbol');
        }
        return class Interface {
            static get __typeof() {
                return type;
            }
        };
    }
    
    /**
     * Verifica si existe un símbolo con el nombre global exacto en esta clase.
     * 
     * @example
     * SpaJsCoreSymbols.hasSymbolKeyFor('softlibjs.spajscore.dependency_injection.service_provider')
     * // → true
     *
     * @param {string} path - Nombre de símbolo (como lo pasaste a Symbol.for).
     * @returns {boolean} Verdadero si se encuentra definido en esta clase.
     */
    static hasSymbolKeyFor(path) {
        if (typeof path !== 'string' || !path.trim()) {
            return false;
        }

        for (const key of Object.getOwnPropertyNames(this)) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor?.get) {
                const value = this[key];
                if (typeof value === 'symbol' && Symbol.keyFor(value) === path) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Verifica si el símbolo dado ya está definido como una propiedad de esta clase.
     * 
     * @example
     * SpaJsCoreSymbols.hasSymbol(SpaJsCoreSymbols.serviceProvider)
     * // → true
     *
     * @param {symbol} symbol - Instancia de símbolo.
     * @returns {boolean} Verdadero si el símbolo ya está definido.
     */
    static hasSymbol(symbol) {
        if (typeof symbol !== 'symbol') {
            return false;
        }

        for (const key of Object.getOwnPropertyNames(this)) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor?.get) {
                const value = this[key];
                if (typeof value === 'symbol' && value === symbol) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default SpaJsCoreSymbols;
