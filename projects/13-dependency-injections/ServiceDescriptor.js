import ServiceLifetime from './ServiceLifetime.js';
import ServiceMetadata from './ServiceMetadata.js';

/**
 * ServiceDescriptor
 * =================
 * 
 * Describe un servicio registrado en la colección de dependencias.
 * Inspirado en ServiceDescriptor de .NET Core.
 *
 * @example
 * Un ServiceDescriptor define:
 * - El tipo de servicio (serviceType): Symbol.
 * - La implementación: clase concreta, instancia, o factory.
 * - El ciclo de vida: singleton, scoped, transient (usa ServiceLifetime).
 *
 * Ejemplo de registro:
 *   new ServiceDescriptor({
 *     serviceType: MyService.__typeof,
 *     implementationType: MyService,
 *     implementationFactory: () => new MyService(),
 *     lifetime: ServiceLifetime.singleton
 *   })
 */
class ServiceDescriptor {
    /** @type {symbol} */           #serviceType;
    /** @type {Function|null} */    #implementationType;
    /** @type {any|null} */         #implementationInstance;
    /** @type {Function|null} */    #implementationFactory;
    /** @type {symbol} */           #lifetime;
    /** @type {ServiceMetadata|null} */ #metadata;

    /**
     * @param {object} options
     * @param {symbol} options.serviceType - Identificador simbólico principal del servicio.
     * @param {Function} [options.implementationType] - Clase que será instanciada.
     * @param {any} [options.implementationInstance] - Instancia ya creada.
     * @param {Function} [options.implementationFactory] - Función fábrica que produce una instancia.
     * @param {symbol} options.lifetime - Ciclo de vida (singleton, scoped, transient).
     * @param {ServiceMetadata} [options.metadata] - Metadata estructurada opcional.
     */
    constructor({
        serviceType,
        implementationType = null,
        implementationInstance = null,
        implementationFactory = null,
        lifetime = ServiceLifetime.scoped,
        metadata = null
    }) {
        if (!serviceType || typeof serviceType !== 'symbol') {
            throw new TypeError('ServiceDescriptor: "serviceType" debe ser un Symbol válido.');
        }

        if (!ServiceLifetime.values.includes(lifetime)) {
            throw new TypeError('ServiceDescriptor: "lifetime" debe ser un valor de ServiceLifetime.');
        }

        if (implementationType) {
            if (typeof implementationType !== 'function') {
                throw new Error('ServiceDescriptor: implementationType debe ser una clase.');
            }
            if (typeof implementationType.__metadata !== 'object') {
                throw new Error('ServiceDescriptor: implementationType debe definir static get __metadata().');
            }
            if (typeof implementationType.__typeof === 'undefined') {
                throw new Error('ServiceDescriptor: implementationType debe definir static get __typeof().');
            }
            if (!(metadata instanceof ServiceMetadata)) {
                throw new TypeError('ServiceDescriptor: requiere que __metadata sea una instancia de ServiceMetadata.');
            }
        }

        this.#serviceType = serviceType;
        this.#implementationType = implementationType;
        this.#implementationInstance = implementationInstance;
        this.#implementationFactory = implementationFactory;
        this.#lifetime = lifetime;
        this.#metadata = metadata;
    }

    /** 
     * Identificador simbólico principal del servicio
     * 
     * @returns {symbol}
     */
    get serviceType() {
        return this.#serviceType;
    }

    /** 
     * Clase que será instanciada.
     * 
     * @returns {Function|null}
     */
    get implementationType() {
        return this.#implementationType;
    }

    /** 
     * Instancia ya creada.
     * 
     * @returns {any|null}
     */
    get implementationInstance() {
        return this.#implementationInstance;
    }

    /** 
     * Función fábrica que produce una instancia.
     * 
     * @returns {Function|null} 
     */
    get implementationFactory() {
        return this.#implementationFactory;
    }

    /** 
     * Ciclo de vida (singleton, scoped, transient).
     * 
     * @returns {symbol}
     */
    get lifetime() {
        return this.#lifetime;
    }

    /** 
     * Metadata estructurada opcional.
     * 
     * @returns {ServiceMetadata|null} 
     */
    get metadata() {
        return this.#metadata;
    }

    /**
     * Crea un descriptor desde una clase.
     * @param {Function} serviceClass
     * @returns {ServiceDescriptor[]}
     */
    static fromType(serviceClass) {
        const metadata = ServiceMetadata.from(serviceClass);
        return new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationType: serviceClass,
            lifetime: metadata.lifetime,
            metadata
        });
    }

    /**
     * Crea un descriptor a partir de una instancia concreta.
     * @param {Function} serviceClass
     * @param {any} instance
     * @returns {ServiceDescriptor}
     */
    static fromInstance(serviceClass, instance) {
        const metadata = ServiceMetadata.from(serviceClass);
        return new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationInstance: instance,
            lifetime: metadata.lifetime,
        });
    }

    /**
     * Crea un descriptor a partir de una función de fábrica.
     * @param {Function} serviceClass
     * @param {Function} factory
     * @returns {ServiceDescriptor}
     */
    static fromFactory(serviceClass, factory) {
        const metadata = ServiceMetadata.from(serviceClass);
        return new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationFactory: factory,
            lifetime: metadata.lifetime,
        });
    }

    /**
     * Crea un array de ServiceDescriptor, uno por cada provides.
     * @param {Function} serviceClass
     * @returns {ServiceDescriptor[]}
     */
    static fromProvides(serviceClass) {
        const metadata = ServiceMetadata.from(serviceClass);
        return (metadata.provides || []).map(prov =>
            new ServiceDescriptor({
                serviceType: prov.__typeof,
                implementationType: serviceClass,
                lifetime: metadata.lifetime,
                metadata
            })
        );
    }

    /**
     * Devuelve una representación string para depuración.
     * @returns {string}
     */
    toString() {
        return `[ServiceDescriptor type=${String(this.serviceType)} lifetime=${String(this.lifetime)}]`;
    }
}

export default ServiceDescriptor;