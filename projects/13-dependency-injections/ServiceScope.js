import ServiceProvider from './ServiceProvider.js';
import ServiceLifetime from './abstractions/ServiceLifetime.js';
import DependencyInjectionSymbols from './internal/DependencyInjectionSymbols.js';


/**
 * ServiceScope
 * ============
 * Contenedor de servicios de ámbito (`scoped`) para Softlibjs.
 * 
 * - Comparte instancias singleton con el contenedor raíz.
 * - Crea instancias propias para servicios `scoped`.
 * - Genera nuevas instancias para `transient`.
 *
 * Todas las operaciones de resolución usan clases (constructores) como entrada.
 * La clase debe definir un getter estático `__typeof` como clave de contrato.
 * 
 * @example
 * import ServiceProvider from './ServiceProvider.js';
 * import ServiceScope from './ServiceScope.js';
 * 
 * // Suponiendo que provider es una instancia de ServiceProvider
 * const scope = provider.createScope();
 * const myScopedService = scope.get(MyScopedService); // Siempre pasa la clase, nunca el símbolo
 */
class ServiceScope {
    /** @type {ServiceProvider} Contenedor raíz (singleton) */
    #root;
    /** @type {Map<symbol, any>} Cache para instancias scoped */
    #scopedCache = new Map();

    /**
     * Crea una nueva instancia de ServiceScope.
     * @param {object} deps - Dependencias inyectadas.
     * @param {ServiceProvider} deps.rootProvider - El contenedor raíz que provee servicios singleton.
     */
    constructor({ rootProvider }) {
        if (!(rootProvider instanceof ServiceProvider)) {
            throw new TypeError('ServiceScope requiere una instancia de ServiceProvider como raíz.');
        }
        this.#root = rootProvider;
    }

    /**
     * Obtiene una instancia para la clase solicitada.
     * Siempre debes pasar la clase (constructor), nunca un símbolo.
     *
     * @param {Function} serviceClass Clase del servicio (con __typeof definido)
     * @returns {any}
     * @throws {TypeError} Si no se pasa una clase.
     * @throws {Error} Si la clase no está registrada.
     */
    get(serviceClass) {
        if (typeof serviceClass !== 'function') {
            throw new TypeError(`ServiceScope: 'serviceClass' debe ser una Clase (Function).`);
        }
        const typeKey = serviceClass.__typeof;
        if (!typeKey) {
            throw new Error(
                `La clase ${serviceClass.name} debe definir un getter estático __typeof (ej: static get __typeof() { return Symbol.for('...'); })`
            );
        }

        const descriptor = this.#findDescriptor(serviceClass);
        if (!descriptor) {
            throw new Error(`Servicio no registrado para: ${serviceClass && serviceClass.name ? serviceClass.name : String(serviceClass)}`);
        }

        const cacheKey = typeKey;

        switch (descriptor.lifetime) {
            case ServiceLifetime.singleton:
                return this.#root.get(serviceClass);

            case ServiceLifetime.scoped:
                if (this.#scopedCache.has(cacheKey)) {
                    return this.#scopedCache.get(cacheKey);
                }
                const scoped = this.#createInstance(descriptor);
                this.#scopedCache.set(cacheKey, scoped);
                return scoped;

            case ServiceLifetime.transient:
                return this.#createInstance(descriptor);

            default:
                throw new Error(`Tipo de ciclo de vida desconocido: ${String(descriptor.lifetime)}`);
        }
    }
    /**
     * Busca el descriptor utilizando el `ServiceProvider` raíz.
     *
     * @private
     * @param {Function} serviceClass
     * @returns {ServiceDescriptor|null}
     * @throws {TypeError} Si el argumento no es una clase (function).
     * @throws {Error} Si la clase no define __typeof.
     */
    #findDescriptor(serviceClass){
        // El contexto de resolución para dependencias será este scope
        return this.#root[DependencyInjectionSymbols.__resolveDescriptor](serviceClass);
    }

    /**
     * Crea una instancia utilizando el `ServiceProvider` raíz.
     * @private
     * @param {ServiceDescriptor} descriptor 
     * @returns {any}
     */
    #createInstance(descriptor) {
        // El contexto de resolución para dependencias será este scope
        return this.#root[DependencyInjectionSymbols.__createInstance](descriptor, this);
    }

    /**
     * Verifica si la clase fue registrada como servicio.
     * Siempre debes pasar la clase, nunca el símbolo.
     *
     * @param {Function} serviceClass
     * @returns {boolean}
     */
    has(serviceClass) {
        if (typeof serviceClass !== 'function') return false;
        const descriptor = this.#root[DependencyInjectionSymbols.__resolveDescriptor](serviceClass);
        return !!descriptor;
    }
}

export default ServiceScope;
