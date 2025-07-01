import ServiceLifetime from './abstractions/ServiceLifetime.js';
import ServiceDescriptor from './abstractions/ServiceDescriptor.js';
import ServiceCollection from './abstractions/ServiceCollection.js';
import ServiceScope from './ServiceScope.js';
import DependencyInjectionSymbols from './internal/DependencyInjectionSymbols.js';

/**
 * ServiceProvider
 * ===============
 *
 * Contenedor principal para la resolución de dependencias en Softlibjs.
 * Siempre resuelve servicios usando clases (constructores). Las búsquedas
 * se hacen usando el símbolo `__typeof` que debe estar definido como getter estático
 * en cada clase registrada.
 *
 * Inspirado en Microsoft.Extensions.DependencyInjection.ServiceProvider.
 *
 * Utiliza ServiceCollection para los registros y ServiceDescriptor para los metadatos.
 * Respeta los ciclos de vida: singleton, scoped, transient.
 *
 * @example
 * import ServiceProvider from './ServiceProvider.js';
 * import ServiceCollection from './abstractions/ServiceCollection.js';
 * import ServiceDescriptor from './abstractions/ServiceDescriptor.js';
 * import ServiceLifetime from './abstractions/ServiceLifetime.js';
 *
 * // Definición de clase con __typeof y __metadata
 * class FooService {
 *   static get __typeof() { return Symbol.for('FooService'); }
 *   static get __metadata() {
 *     return {
 *       provides: [FooService.__typeof],
 *       inject: {},
 *       lifetime: ServiceLifetime.singleton
 *     };
 *   }
 * }
 *
 * // Registro y uso
 * const collection = new ServiceCollection();
 * collection.add(ServiceDescriptor.fromType(FooService));
 *
 * const provider = new ServiceProvider({ serviceCollection: collection });
 * const foo = provider.get(FooService); // Siempre pasa la clase, nunca el símbolo
 *
 * // Para servicios scoped:
 * const scope = provider.createScope();
 * const fooScoped = scope.get(FooService);
 */
class ServiceProvider {
    /**
     * Identificador simbólico para el ServiceProvider.
     * @returns {symbol} - Identificador simbólico para el ServiceProvider.
     */
    static get __typeof(){
        return DependencyInjectionSymbols.serviceProvider;
    }

    /** @type {Map<symbol, any>} Cache interna para singletons */
    #singletonCache = new Map();

    /** @type {ServiceCollection} Colección de servicios registrada */
    #collection;

    /**
     * Crea una nueva instancia del contenedor de servicios.
     * @param {object} deps - Dependencias inyectadas.
     * @param {ServiceCollection} deps.serviceCollection - Colección de servicios a usar.
     */
    constructor({ serviceCollection }) {
        if (!(serviceCollection instanceof ServiceCollection)) {
            throw new TypeError('ServiceProvider requiere una instancia de ServiceCollection');
        }
        this.#collection = serviceCollection;
    }

    /**
     * Obtiene una instancia para la clase solicitada.
     * Siempre debes pasar la clase (constructor), nunca un símbolo.
     *
     * @template T
     * @param {T} serviceClass La clase del servicio (con __typeof definido)
     * @returns {T}
     * @throws {TypeError} Si no se pasa una clase.
     * @throws {Error} Si la clase no está registrada.
     */
    get(serviceClass) {
        // Si es un Enumerable cerrado, devuelve array de instancias
        if (this.#isEnumerableClosedType(serviceClass)) {
            const descriptors = this.#findAllImplementationsForEnumerable(serviceClass);
            return descriptors.map(desc => this.#resolveDescriptor(desc, desc.serviceType));
        }

        // Caso normal: uno solo
        const descriptor = this.#findDescriptor(serviceClass);
        if (!descriptor) {
            throw new Error(
                `Servicio no registrado para: ${serviceClass && serviceClass.name ? serviceClass.name : String(serviceClass)}`
            );
        }
        
        const cacheKey = this.#getCacheKey(serviceClass);
        return this.#resolveDescriptor(descriptor, cacheKey);
    }

    /**
     * Busca el descriptor que satisface la clase solicitada.
     * Solo acepta clases, nunca símbolos.
     *
     * @private
     * @param {Function} serviceClass
     * @returns {Array<ServiceDescriptor|null>}
     * @throws {TypeError} Si el argumento no es una clase (function).
     * @throws {Error} Si la clase no define __typeof.
     */
    #findDescriptor(serviceClass) {
         if (typeof serviceClass !== 'function') {
            throw new TypeError(`ServiceProvider: 'serviceClass' debe ser una Clase (Function).`);
        }
        const typeKey = serviceClass.__typeof;
        if (!typeKey) {
            throw new Error(
                `La clase ${serviceClass.name} debe definir un getter estático __typeof (ej: static get __typeof() { return Symbol.for('...'); })`
            );
        }
        // Busca por serviceType principal o por provides
        return this.#collection.descriptors.find(desc => desc.serviceType === typeKey) ?? null;
    }

    /**
     * Devuelve la instancia adecuada para un descriptor,
     * aplicando el ciclo de vida (singleton/transient).
     * @template T
     * @private
     * @param {ServiceDescriptor} descriptor
     * @param {symbol} serviceClass
     * @returns {T}
     */
    #resolveDescriptor(descriptor, cacheKey) {
        switch (descriptor.lifetime) {
            case ServiceLifetime.singleton:
                if (this.#singletonCache.has(cacheKey)) {
                    return this.#singletonCache.get(cacheKey);
                }
                const singleton = this.#createInstance(descriptor);
                this.#singletonCache.set(cacheKey, singleton);
                return singleton;

            case ServiceLifetime.transient:
                return this.#createInstance(descriptor);

            case ServiceLifetime.scoped:
                throw new Error('Scoped services requieren un ServiceScope. Solicita este servicio usando un scope.');

            default:
                throw new Error(`Ciclo de vida desconocido: ${String(descriptor.lifetime)}`);
        }
    }

    /**
     * Busca todos los descriptores que implementan T (para Enumerable<T>).
     * @param {Function} enumerableClass - Clase cerrada devuelta por EnumerableTemplate.forType(T)
     * @returns {Array<ServiceDescriptor>}
     */
    #findAllImplementationsForEnumerable(enumerableClass) {
        if (typeof enumerableClass !== 'function') {
            throw new TypeError(`ServiceProvider: 'enumerableClass' debe ser una Clase (Function).`);
        }
        // 1. Detecta si es un "Enumerable cerrado"
        const parameters = enumerableClass.__metadata?.parameters;
        if (!Array.isArray(parameters) || parameters.length !== 1) {
            throw new Error(
                `La clase ${enumerableClass.name} debe definir un getter estático __metadata con parameters: [T]`
            );
        }
        const elementType = parameters[0];
        const typeKey = elementType.__typeof;
        if (!typeKey) {
            throw new Error(`El tipo de elemento debe definir __typeof`);
        }
        // 2. Busca todas las implementaciones de T (por símbolo)
        return this.#collection.descriptors.filter(desc =>
            Symbol.keyFor(desc.serviceType).endsWith(`: ${Symbol.keyFor(typeKey)}`)
        );
    }

    /**
     * Determina la clave de caché para singletons.
     * Usamos siempre el símbolo __typeof de la clase.
     *
     * @private
     * @param {Function} serviceClass
     * @returns {symbol}
     */
    #getCacheKey(serviceClass) {
        return serviceClass.__typeof;
    }

    /**
     * Crea una instancia según el tipo de implementación registrado.
     *
     * @private
     * @param {ServiceDescriptor} descriptor
     * @returns {any}
     */
    #createInstance(descriptor) {
        if (descriptor.implementationInstance) {
            return descriptor.implementationInstance;
        }

        if (descriptor.implementationFactory) {
            return descriptor.implementationFactory(this);
        }

        if (descriptor.implementationType) {
            const dependencies = this.#resolveDependencies(descriptor);
            return new descriptor.implementationType(dependencies);
        }

        throw new Error(`No se puede crear el servicio: ${String(descriptor.serviceType)}`);
    }

    /**
     * Resuelve todas las dependencias definidas en `metadata.inject`.
     *
     * @private
     * @param {ServiceDescriptor} descriptor
     * @returns {object} Objeto con claves igual a los nombres de los parámetros definidos en inject
     */
    #resolveDependencies(descriptor) {
        const inject = descriptor.metadata?.inject;
        if (!inject || typeof inject !== 'object') return {};

        const deps = {};

        for (const [paramName, typeRef] of Object.entries(inject)) {
            if (typeof typeRef !== 'function') {
                throw new TypeError(
                    `El valor de inject["${paramName}"] debe ser una clase válida (Function), pero se recibió: ${String(typeRef)}`
                );
            }
            // Resuelve la clase
            deps[paramName] = this.get(typeRef);
        }

        return deps;
    }

    /**
     * 
     * @param {*} type 
     * @returns 
     */
    #isEnumerableClosedType(type) {
        return Array.isArray(type?.__metadata?.parameters) && type.__metadata.parameters.length === 1;
    }

    /**
     * Crea un nuevo `ServiceScope` para servicios scoped.
     *
     * @returns {ServiceScope}
     */
    createScope() {
        return new ServiceScope({ rootProvider: this });
    }

    /**
     * Verifica si la clase fue registrada como servicio.
     * Siempre debes pasar la clase, nunca el símbolo.
     *
     * @param {Function} serviceClass
     * @returns {boolean}
     */
    has(serviceClass) {
        return !!this.#findDescriptor(serviceClass);
    }

    /**
     * Permite a ServiceScope u otros componentes internos crear instancias usando symbol.
     *
     * @param {ServiceDescriptor} descriptor Descriptor de servicio a instanciar
     * @param {object} [context=this] Contexto de resolución para dependencias (por defecto this)
     * @returns {any}
     * @ignore
     */
    [DependencyInjectionSymbols.__createInstance](descriptor, context = this) {
        return this.#createInstance(descriptor, context);
    }

    /**
     * Permite a ServiceScope u otros componentes internos resolver descriptores usando symbol.
     *
     * @param {Function} serviceClass Clase a buscar
     * @returns {ServiceDescriptor|null}
     * @ignore
     */
    [DependencyInjectionSymbols.__resolveDescriptor](serviceClass) {
        return this.#findDescriptor(serviceClass);
    }
}

export default ServiceProvider;
