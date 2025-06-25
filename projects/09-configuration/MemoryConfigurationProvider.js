import ConfigurationProvider from './abstraction/ConfigurationProvider.js';
import MemoryConfigurationSource from './MemoryConfigurationSource.js';

/**
 * MemoryConfigurationProvider
 * ===========================
 * 
 * Proveedor concreto que almacena los datos en memoria (RAM).
 * Permite lectura y escritura.
 *
 * @example
 * import MemoryConfigurationSource from './MemoryConfigurationSource.js';
 * import MemoryConfigurationProvider from './MemoryConfigurationProvider.js';
 * const source = new MemoryConfigurationSource({ foo: 'bar' });
 * const provider = new MemoryConfigurationProvider(source);
 * provider.tryGet('foo'); // { found: true, value: 'bar' }
 */
class MemoryConfigurationProvider extends ConfigurationProvider {
    /**
     * @type {source}
     */
    #source;

    /**
     * @param {MemoryConfigurationSource} source
     */
    constructor(source) {
        super();

        if (!(source instanceof MemoryConfigurationSource)) {
            throw new Error('MemoryConfigurationProvider: source must be an instance of MemoryConfigurationSource');
        }

        if (!source) {
            throw new Error('MemoryConfigurationProvider: source is required');
        }

        this.#source = source;

        // Inicializa los datos a partir de source.initialData
        const initialData = this.#source.initialData;
        if (initialData && typeof initialData === 'object') {
            for (const [key, value] of Object.entries(initialData)) {
                this.set(key, value);
            }
        }
    }

    /**
     * Indica que este proveedor permite escritura.
     * @returns {boolean}
     */
    get isReadOnly() {
        return false;
    }

    /**
     * Sobrescribe para exponer tryGet y set con semántica de Dictionary.
     * @param {string} key
     * @returns {{ found: boolean, value: string|null }}
     */
    tryGet(key) {
        return super.tryGet(key);
    }

    /**
     * @param {string} key
     * @param {string|null} value
     */
    set(key, value) {
        super.set(key, value);
    }
}

export default MemoryConfigurationProvider;