import ConfigurationSources from './ConfigurationSources.js';
import ConfigurationSource from './abstraction/ConfigurationSource.js';
import ConfigurationProvider from './abstraction/ConfigurationProvider.js';

/**
 * ConfigurationManager
 * ====================
 * 
 * Inspirado en Microsoft.Extensions.Configuration.ConfigurationManager.
 * Permite agregar fuentes de configuración y acceder a los valores consolidados.
 */
class ConfigurationManager {
    /**
     * Identificador del feature para ServiceCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.configuration.configurationmanager');
    }

    /** @type {ConfigurationSources} */
    #sources;
    /** @type {ConfigurationProvider[]} */
    #providers;

    constructor() {
        /** @type {ConfigurationSources} */
        this.#sources = new ConfigurationSources(this);
        /** @type {ConfigurationProvider[]} */
        this.#providers = [];

        // Proxy para acceso indexado: configManager['key']
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Soporte para acceso indexado por clave de configuración
                if (typeof prop === 'string' && !(prop in target)) {
                    return target.get(prop);
                }

                const value = target[prop];
                if (value instanceof Function) {
                    return value.bind(target);
                }

                // Permite acceso normal a métodos/propiedades
                return Reflect.get(target, prop, receiver);
            },
            set: (target, prop, value, receiver) => {
                if (typeof prop === 'string' && !(prop in target)) {
                    target.set(prop, value);
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            has: (target, prop) => {
                if (typeof prop === 'string' && !(prop in target)) {
                    return target.get(prop) !== undefined;
                }
                return Reflect.has(target, prop);
            },
            ownKeys: (target) => [
                ...Reflect.ownKeys(target),
                ...target.keys()
            ],
            getOwnPropertyDescriptor: (target, prop) => {
                if (typeof prop === 'string' && !(prop in target)) {
                    return {
                        enumerable: true,
                        configurable: true
                    };
                }
                return Reflect.getOwnPropertyDescriptor(target, prop);
            }
        });
    }

    /**
     * Devuelve la lista de fuentes de configuración.
     * @returns {ConfigurationSources}
     */
    get sources() {
        return this.#sources;
    }

    /**
     * Devuelve la lista de providers actuales.
     * @returns {ConfigurationProvider[]}
     */
    get providers() {
        return this.#providers;
    }

    /**
     * Agrega una fuente de configuración (ConfigurationSource).
     * @param {ConfigurationSource} source
     */
    addSource(source) {
        if (!(source instanceof ConfigurationSource)) {
            throw new TypeError('addSource: source debe ser ConfigurationSource');
        }
        const provider = source.build(this);
        if (!(provider instanceof ConfigurationProvider)) {
            throw new TypeError('El provider retornado debe ser ConfigurationProvider');
        }
        this.providers.push(provider);
    }

    /**
     * Recarga todos los providers (útil cuando cambian las fuentes).
     */
    reloadSources() {
        this.providers = [];
        for (const source of this.sources) {
            this.addSource(source);
        }
    }

    /**
     * Obtiene el valor para una clave (recorre providers en orden inverso).
     * @param {string} key
     * @returns {string | null | undefined}
     */
    get(key) {
        for (let i = this.providers.length - 1; i >= 0; i--) {
            const data = this.providers[i].tryGet(key);
            const { found, value } = data;
            if (found) return value;
        }
        return undefined;
    }

    /**
     * Establece el valor para una clave en el primer provider no solo-lectura.
     * @param {string} key
     * @param {string | null} value
     */
    set(key, value) {
        for (const provider of this.providers) {
            if (!provider.isReadOnly) {
                provider.set(key, value);
                return;
            }
        }
        throw new Error('No hay ningún provider escribible para set()');
    }

    /**
     * Devuelve todas las claves únicas de todos los providers.
     * @returns {string[]}
     */
    keys() {
        const allKeys = new Set();
        for (const provider of this.providers) {
            for (const key of provider.keys()) {
                allKeys.add(key);
            }
        }
        return Array.from(allKeys);
    }

    /**
     * Devuelve un subárbol de configuración bajo el path dado.
     * @param {string} path
     * @returns {object}
     */
    getSection(path) {
        const children = {};
        const prefix = path.endsWith(':') ? path : path + ':';
        for (const key of this.keys()) {
            if (key.startsWith(prefix)) {
                const subkey = key.slice(prefix.length);
                children[subkey] = this.get(key);
            }
        }
        return children;
    }
}

export default ConfigurationManager;