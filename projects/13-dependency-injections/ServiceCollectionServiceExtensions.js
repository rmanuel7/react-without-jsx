import ServiceDescriptor from './ServiceDescriptor.js';
import ServiceLifetime from './ServiceLifetime.js';
import ServiceProvider from '../ServiceProvider.js';
import ServiceMetadata from './ServiceMetadata.js';

/**
 * ServiceCollectionServiceExtensions
 * ==================================
 *
 * Contiene métodos de utilidad para registrar servicios en una instancia de ServiceCollection.
 * Inspirado en Microsoft.Extensions.DependencyInjection.ServiceCollectionServiceExtensions.
 * 
 * @example
 * import { default as SCE } from './ServiceCollectionServiceExtensions.js';
 * 
 * const services = new ServiceCollection();
 * 
 * SCE.addSingletonType(services, Symbol.for('ILogger'), Logger);
 * SCE.addSingletonFactory(services, Symbol.for('IDb'), sp => new Db(sp.get(Symbol.for('ILogger'))));
 * SCE.addSingletonInstance(services, Symbol.for('AppSettings'), { port: 3000 });
 * SCE.addFromClass(services, MyServiceWithMetadata);
 */
class ServiceCollectionServiceExtensions {
    /**
     * Registra una clase como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     */
    static addSingletonType(services, serviceClass) {
        const metadata = ServiceMetadata.from(serviceClass);
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationType: serviceClass,
            lifetime: ServiceLifetime.singleton,
            metadata: metadata
        }));
    }

    /**
     * Registra una fábrica como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {(provider: ServiceProvider) => any} factory
     */
    static addSingletonFactory(services, serviceClass, factory) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationFactory: factory,
            lifetime: ServiceLifetime.singleton
        }));
    }

    /**
     * Registra una instancia como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {any} instance
     */
    static addSingletonInstance(services, serviceClass, instance) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationInstance: instance,
            lifetime: ServiceLifetime.singleton
        }));
    }

    /**
     * Registra una clase como scoped.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     */
    static addScopedType(services, serviceClass) {
        const metadata = ServiceMetadata.from(serviceClass);
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationType: serviceClass,
            lifetime: ServiceLifetime.scoped,
            metadata: metadata
        }));
    }

    /**
     * Registra una fábrica como scoped.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {(provider: any) => any} factory
     */
    static addScopedFactory(services, serviceClass, factory) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationFactory: factory,
            lifetime: ServiceLifetime.scoped
        }));
    }

    /**
     * Registra una instancia como scoped.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {any} instance
     */
    static addScopedInstance(services, serviceClass, instance) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationInstance: instance,
            lifetime: ServiceLifetime.scoped
        }));
    }

    /**
     * Registra una clase como transient.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     */
    static addTransientType(services, serviceClass) {
        const metadata = ServiceMetadata.from(serviceClass);
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationType: serviceClass,
            lifetime: ServiceLifetime.transient,
            metadata: metadata
        }));
    }

    /**
     * Registra una fábrica como transient.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {(provider: any) => any} factory
     */
    static addTransientFactory(services, serviceClass, factory) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationFactory: factory,
            lifetime: ServiceLifetime.transient
        }));
    }

    /**
     * Registra una instancia como transient.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {any} instance
     */
    static addTransientInstance(services, serviceClass, instance) {
        services.add(new ServiceDescriptor({
            serviceType: serviceClass.__typeof,
            implementationInstance: instance,
            lifetime: ServiceLifetime.transient
        }));
    }
}

export default ServiceCollectionServiceExtensions;
