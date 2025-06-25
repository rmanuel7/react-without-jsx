import MemoryConfigurationSource from '../MemoryConfigurationSource.js';
import EnvironmentVariablesConfigurationSource from '../EnvironmentVariablesConfigurationSource.js';
import ConfigurationManager from '../ConfigurationManager.js';

/**
 * SourceConfigurationBuilderExtensions
 * ====================
 * Métodos estáticos para agregar fuentes de configuración estándar
 * a ConfigurationManager, siguiendo convención SPA JS Core.
 *
 * @example
 * import SourceConfigurationBuilderExtensions from './SourceConfigurationBuilderExtensions.js';
 * SourceConfigurationBuilderExtensions.addInMemoryCollection(config, { key: 'value' });
 */
class SourceConfigurationBuilderExtensions {
    /**
     * Agrega la fuente de configuración de memoria.
     * @param {ConfigurationManager} configuration
     * @param {Record<string, string>} [initialData]
     * @returns {ConfigurationManager}
     */
    static addInMemoryCollection(configuration, initialData) {
        if (!configuration || configuration instanceof ConfigurationManager === false) {
            throw new Error('addInMemoryCollection: configuration debe ser ConfigurationManager');
        }
        configuration.addSource(new MemoryConfigurationSource(initialData));
        return configuration;
    }

    /**
     * Agrega la fuente de variables de entorno.
     * Requiere que exista EnvironmentVariablesConfigurationSource.
     * @param {ConfigurationManager} configuration - Instancia de ConfigurationManager.
     * @param {string} [prefix] - Prefijo para las variables de entorno.
     *                            Si no se especifica, se usarán todas las variables de entorno.
     * @returns {ConfigurationManager}
     */
    static addEnvironmentVariables(configuration, prefix) {
        if (!configuration || configuration instanceof ConfigurationManager === false) {
            throw new Error('addEnvironmentVariables: configuration debe ser ConfigurationManager');
        }
        configuration.addSource(new EnvironmentVariablesConfigurationSource({ prefix }));
        return configuration;
    }
}

export default SourceConfigurationBuilderExtensions;