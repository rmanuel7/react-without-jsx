import SpaJsCoreSymbols from '@spajscore/symbols';

/**
 * ConfigurationSymbols
 * ====================
 * 
 * Repositorio centralizado de símbolos globales (`Symbol.for(...)`) utilizados en el sistema
 * de configuración inspirado en .NET Core.
 *
 * Cada propiedad representa un identificador único y global para registrar y resolver
 * componentes dentro del contenedor DI relacionados con la configuración:
 * - ConfigurationManager
 * - ConfigurationSource
 * - ConfigurationProvider
 * - etc.
 *
 * @example
 * import ConfigurationSymbols from './ConfigurationSymbols.js';
 * Symbol.keyFor(ConfigurationSymbols.configurationManager); // 'softlib.di.configuration.configuration_manager'
 */
class ConfigurationSymbols extends SpaJsCoreSymbols {
    /**
     * Paquete funcional de configuración
     * @returns {symbol}
     */
    static get package() {
        return Symbol.for(`${Symbol.keyFor(this.product)}.configuration`);
    }

    //=====================================================================
    //                          ABSTRACTIONS
    //=====================================================================
    /**
     * Namespace de tipos base y contratos abstractos
     * @returns {symbol}
     */
    static get abstractions() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.abstractions`);
    }

    /**
     * Identificador simbólico para ConfigurationSource.
     * @returns {symbol}
     */
    static get configurationSource() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.configuration_source`);
    }

    /**
     * Identificador simbólico para ConfigurationProvider.
     * @returns {symbol}
     */
    static get configurationProvider() {
        return Symbol.for(`${Symbol.keyFor(this.abstractions)}.configuration_provider`);
    }



    /**
     * Namespace de tipos concretos y utilidades
     * @returns {symbol}
     */
    static get extensions() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.extensions`);
    }

    /**
     * Namespace de tipos internos y utilidades
     * @returns {symbol}
     */
    static get internal() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.internal`);
    }


    /**
     * Identificador simbólico para ConfigurationManager.
     * @returns {symbol}
     */
    static get configurationManager() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.configuration_manager`);
    }
    
    /**
     * Identificador simbólico para ConfigurationSources (colección de sources).
     * @returns {symbol}
     */
    static get configurationSources() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.configuration_sources`);
    }

    /**
     * Identificador simbólico para MemoryConfigurationSource.
     * @returns {symbol}
     */
    static get memoryConfigurationSource() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.memory_configuration_source`);
    }

    /**
     * Identificador simbólico para MemoryConfigurationProvider.
     * @returns {symbol}
     */
    static get memoryConfigurationProvider() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.memory_configuration_provider`);
    }

    /**
     * Identificador simbólico para EnvironmentVariablesConfigurationSource.
     * @returns {symbol}
     */
    static get environmentVariablesConfigurationSource() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.environment_variables_configuration_source`);
    }
    /**
     * Identificador simbólico para EnvironmentVariablesConfigurationProvider.
     * @returns {symbol}
     */
    static get environmentVariablesConfigurationProvider() {
        return Symbol.for(`${Symbol.keyFor(this.package)}.environment_variables_configuration_provider`);
    }

    // Agrega aquí otros símbolos relacionados con configuración según necesites...
}

export default ConfigurationSymbols;
