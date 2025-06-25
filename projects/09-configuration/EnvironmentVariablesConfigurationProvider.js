import ConfigurationProvider from './abstraction/ConfigurationProvider.js';
import EnvironmentVariablesConfigurationSource from './EnvironmentVariablesConfigurationSource.js';
import ConfigurationSymbols from './internal/ConfigurationSymbols.js';

/**
 * EnvironmentVariablesConfigurationProvider
 * =========================================
 *
 * Proveedor de configuración basado en variables de entorno.
 * Extrae las variables de entorno del proceso (en Node.js) y permite acceso uniforme.
 * Permite filtrar por prefijo y normaliza claves a snake_case.
 *
 * @example
 * import EnvironmentVariablesConfigurationSource from './EnvironmentVariablesConfigurationSource.js';
 * const source = new EnvironmentVariablesConfigurationSource({ prefix: 'MYAPP_' });
 * const provider = new EnvironmentVariablesConfigurationProvider(source);
 * provider.tryGet('myapp_key'); // { found: true, value: ... }
 */
class EnvironmentVariablesConfigurationProvider extends ConfigurationProvider {
    /** @type {EnvironmentVariablesConfigurationSource} */
    #source;

    /**
     * @param {EnvironmentVariablesConfigurationSource} source
     */
    constructor(source) {
        super();
        if (!(source instanceof EnvironmentVariablesConfigurationSource)) {
            throw new Error('EnvironmentVariablesConfigurationProvider: source debe ser una instancia de EnvironmentVariablesConfigurationSource');
        }
        this.#source = source;

        // Cargar variables de entorno según el entorno de ejecución
        let env = {};
        if (typeof window !== 'undefined' && window.__env__) {
            env = window.__env__;
        }

        // Si hay un prefijo, filtrar las variables
        const prefix = this.#source.prefix ? String(this.#source.prefix) : null;
        for (const [key, value] of Object.entries(env)) {
            if (!prefix || key.startsWith(prefix)) {
                // Normaliza la clave: elimina prefijo, snake_case, a minúsculas
                const normalizedKey = this.#normalizeKey(key, prefix);
                this.set(normalizedKey, value);
            }
        }
    }

    /**
     * Indica que este proveedor es solo lectura.
     * @returns {boolean}
     */
    get isReadOnly() {
        return true;
    }

    /**
     * Normaliza la clave de variable de entorno:
     * - Elimina el prefijo si existe
     * - Convierte a minúsculas
     * - Reemplaza "_" por ":"
     * @private
     * @param {string} key
     * @param {string|null} prefix
     * @returns {string}
     */
    #normalizeKey(key, prefix) {
        let k = key;
        if (prefix && k.startsWith(prefix)) {
            k = k.slice(prefix.length);
        }
        // Convierte a snake_case con ":" como separador para secciones
        return k.toLowerCase().replace(/__/g, ':').replace(/_/g, ':');
    }

    /**
     * Intenta obtener el valor para una clave.
     * @param {string} key
     * @returns {{ found: boolean, value: string|null|undefined }}
     */
    tryGet(key) {
        return super.tryGet(key);
    }
}

export default EnvironmentVariablesConfigurationProvider;