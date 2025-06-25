import ConfigurationManager from '../ConfigurationManager.js';
import MemoryConfigurationSource from '../MemoryConfigurationSource.js';

/**
 * addInMemoryCollection
 * ====================
 * 
 * Adds the memory configuration provider to {@link ConfigurationManager}.
 * @param {ConfigurationManager} configuration
 * @param {Array<Map<string, string>>} [initialData] -The data to add to memory configuration provider.
 * @returns {ConfigurationManager}
 */
function addInMemoryCollection(configuration, initialData) {
    if (!(configuration) || !(configuration instanceof ConfigurationManager)) {
        throw new Error('addInMemoryCollection: no sea specifficado ningun proveedor de configuración');
    }

    configuration.addSource(new MemoryConfigurationSource({ initialData: initialData }));
    return configuration;
}

export default addInMemoryCollection;
