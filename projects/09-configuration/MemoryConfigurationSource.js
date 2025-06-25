import ConfigurationSource from './abstraction/ConfigurationSource.js';
import MemoryConfigurationProvider from './MemoryConfigurationProvider.js';

/**
 * MemoryConfigurationSource
 * =========================
 * 
 * Fuente de configuración basada en memoria.
 * Permite definir un diccionario inicial de claves/valores.
 *
 * @example
 * import MemoryConfigurationSource from './MemoryConfigurationSource.js';
 * const source = new MemoryConfigurationSource({ foo: 'bar' });
 * const provider = source.build(configurationManager);
 * provider.tryGet('foo'); // { found: true, value: 'bar' }
 */
class MemoryConfigurationSource extends ConfigurationSource {
    /**
     * @param {Record<string, string>} [initialData]
     */
    constructor(initialData = {}) {
        super();
        this.initialData = initialData;
    }

    /**
     * Devuelve un MemoryConfigurationProvider con los datos iniciales.
     * @param {object} configurationBuilder
     * @returns {MemoryConfigurationProvider}
     */
    build(configurationBuilder) {
        return new MemoryConfigurationProvider(this);
    }
}

export default MemoryConfigurationSource;