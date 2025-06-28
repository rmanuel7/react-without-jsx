import SpaJsCoreSymbols from "@spajscore/symbols";

/**
 * OptionSymbols
 * =============
 * 
 * Repositorio centralizado para símbolos de opciones.
 * 
 * Proporciona símbolos únicos para identificar opciones tipadas y sus instancias.
 * Permite obtener símbolos específicos para clases de opciones tipadas.
 * 
 * @example
 * import OptionSymbols from './OptionSymbols.js';
 * const optionsSymbol = OptionSymbols.forType(MyOptionsClass);
 * // optionsSymbol será un símbolo único para MyOptionsClass
 */
class OptionSymbols extends SpaJsCoreSymbols {
    /**
     * Identificador simbólico para DI (contrato Options).
     * @returns {symbol}
     */
    static get package() {
        return Symbol.for(`${Symbol.keyFor(this.product)}.options`);
    }

    /**
     * Identificador simbólico para las opciones genéricas.
     * @returns {symbol}
     */
    static get options() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.options`);
    }

    /**
     * Identificador simbólico para las opciones genéricas.
     * @returns {symbol}
     */
    static get configureOptions() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.configure_options`);
    }

    /**
     * Devuelve el símbolo concreto Options<T> para un tipo dado.
     * @param {Function} optionClass - Definición de clase/constructor para las opciones tipadas.
     * @returns {symbol}
     */
    static forType(optionClass) {
        if (!optionClass || !optionClass.prototype || typeof optionClass !== 'function') {
            throw new TypeError('optionClass debe ser una clase/constructor.');
        }
        if (typeof optionClass.__typeof === 'undefined') {
            throw new Error('ServiceDescriptor: optionClass debe definir static get __typeof().');
        }
        return Symbol.for(`${Symbol.keyFor(this.options)}<${Symbol.keyFor(optionClass.__typeof)}>`);
    }

    /**
     * Devuelve el símbolo concreto Options<T> para un tipo dado.
     * @param {Function} optionClass - Definición de clase/constructor para las opciones tipadas.
     * @returns {symbol}
     */
    static forConfigureType(optionClass) {
        if (!optionClass || !optionClass.prototype || typeof optionClass !== 'function') {
            throw new TypeError('optionClass debe ser una clase/constructor.');
        }
        if (typeof optionClass.__typeof === 'undefined') {
            throw new Error('ServiceDescriptor: optionClass debe definir static get __typeof().');
        }
        return Symbol.for(`${Symbol.keyFor(this.configureOptions)}<${Symbol.keyFor(optionClass.__typeof)}>`);
    }
}

export default OptionSymbols;