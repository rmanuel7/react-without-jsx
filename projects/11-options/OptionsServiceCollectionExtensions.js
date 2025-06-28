import { 
    ServiceCollection, 
    ServiceCollectionServiceExtensions, 
    ServiceDescriptor, 
    ServiceLifetime, 
    ServiceMetadata, 
    ServiceProvider 
} from '@spajscore/dependency-injection';
import OptionSymbols from '../internal/OptionSymbols.js';
import Options from '../Options.js';
import { ConfigurationManager } from '@spajscore/configuration';

/**
 * OptionsServiceCollectionExtensions
 * ==================================
 * Métodos auxiliares para registrar servicios de opciones tipadas en el contenedor DI.
 *
 * @example
 * OptionsServiceCollectionExtensions.addOptions(services, MySettings);
 */
class OptionsServiceCollectionExtensions {
    /**
     * Agrega un servicio Options<T> al contenedor de servicios como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass - Clase de opciones tipadas
     */
    static addOptionsType(services, serviceClass) {
        const __typeof = OptionSymbols.forType(serviceClass);
        ServiceCollectionServiceExtensions.addSingletonType(services, serviceClass);
        services.add(new ServiceDescriptor({
            serviceType: __typeof,
            implementationType: Options,
            lifetime: ServiceLifetime.singleton,
            metadata: new ServiceMetadata({
                provides: [__typeof],
                inject: {
                    config: ConfigurationManager,
                    target: serviceClass
                }
            })
        }));
    }

    /**
     * Agrega un servicio Options<T> al contenedor de servicios usando una fábrica como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {(provider: any) => any} factory
     */
    static addOptionsFactory(services, serviceClass, factory) {
        services.add(new ServiceDescriptor({
            serviceType: OptionSymbols.forType(serviceClass),
            implementationFactory: factory,
            lifetime: ServiceLifetime.singleton
        }));
    }

    /**
     * Agrega un servicio Options<T> al contenedor de servicios usando una instancia como singleton.
     * @param {ServiceCollection} services
     * @param {Function} serviceClass
     * @param {any} instance
     */
    static addOptionsInstance(services, serviceClass, instance) {
        services.add(new ServiceDescriptor({
            serviceType: OptionSymbols.forType(serviceClass),
            implementationInstance: instance,
            lifetime: ServiceLifetime.singleton,
        }));
    }

    /**
     * Obtiene un servicio Options<T> del contenedor de servicios.
     * @param {ServiceProvider} services
     * @param {Function} serviceClass
     * @returns {Options}
     */
    static getOptions(services, serviceClass) {
        return services.get(class {
            static get __typeof() {
                return OptionSymbols.forType(serviceClass);
            }
        });
    }
}

export default OptionsServiceCollectionExtensions;