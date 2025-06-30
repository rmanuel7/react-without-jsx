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
}

export default OptionSymbols;