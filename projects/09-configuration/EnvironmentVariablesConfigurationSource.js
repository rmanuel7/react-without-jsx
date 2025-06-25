import ConfigurationSource from './abstraction/ConfigurationSource.js';
import EnvironmentVariablesConfigurationProvider from './EnvironmentVariablesConfigurationProvider.js';
import ConfigurationSymbols from './internal/ConfigurationSymbols.js';

/**
 * EnvironmentVariablesConfigurationSource
 * =======================================
 *
 * Fuente de configuración basada en variables de entorno.
 * Permite importar todas las variables de entorno del proceso, o filtrar por prefijo.
 *
 * @example
 * import EnvironmentVariablesConfigurationSource from './EnvironmentVariablesConfigurationSource.js';
 * const source = new EnvironmentVariablesConfigurationSource({ prefix: 'MYAPP_' });
 * const provider = source.build(configurationManager);
 * provider.tryGet('myapp_key'); // { found: true, value: ... }
 */
class EnvironmentVariablesConfigurationSource extends ConfigurationSource {
    /**
     * Prefijo opcional para filtrar las variables de entorno.
     * @type {string|null}
     * @private
     */
    #prefix;

    /**
     * @param {object} [options]
     * @param {string} [options.prefix] - Prefijo opcional para filtrar las variables de entorno.
     */
    constructor({ prefix } = {}) {
        super();
        this.#prefix = prefix || null;
    }

    /**
     * Prefijo usado para filtrar variables de entorno.
     * @returns {string|null}
     */
    get prefix() {
        return this.#prefix;
    }

    /**
     * Devuelve un EnvironmentVariablesConfigurationProvider con el prefijo indicado.
     * @param {object} configurationBuilder
     * @returns {EnvironmentVariablesConfigurationProvider}
     */
    build(configurationBuilder) {
        return new EnvironmentVariablesConfigurationProvider(this);
    }
}

export default EnvironmentVariablesConfigurationSource;