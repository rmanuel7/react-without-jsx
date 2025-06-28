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
import ConfigureOptions from '../ConfigureOptions.js';

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
     * Agrega un servicio Options<T> al contenedor de servicios usando una configuración.
     * @template T
     * @param {ServiceCollection} services
     * @param {T} serviceClass
     * @param {function (T): void} setupOptions - Función de configuración que recibe una instancia de T.
     */
    static addConfigureOptions(services, serviceClass, setupOptions) {
        const __options = this.configureOptionsType(serviceClass);
        this.addOptionsType(services, serviceClass);
        services.add(new ServiceDescriptor({
            serviceType: __options.__typeof,
            implementationInstance: new ConfigureOptions({ action: setupOptions }),
            lifetime: ServiceLifetime.singleton
        }));
    }

    /**
     * Agrega un servicio Options<T> al contenedor de servicios como singleton.
     * @template T
     * @param {ServiceCollection} services
     * @param {T} serviceClass
     */
    static addOptionsType(services, serviceClass) {
        const __options = this.optionsType(serviceClass);
        const metadata = ServiceMetadata.from(__options);
        services.add(new ServiceDescriptor({
            serviceType: __options.__typeof,
            implementationType: Options,
            lifetime: ServiceLifetime.singleton,
            metadata: metadata
        }));
        ServiceCollectionServiceExtensions.addSingletonType(services, serviceClass);
    }

    /**
     * Agrega un servicio Options<T> al contenedor de servicios usando una fábrica como singleton.
     * @template T
     * @param {ServiceCollection} services
     * @param {T} serviceClass
     * @param {(provider: ServiceProvider) => T} factory
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
     * @template T
     * @param {ServiceCollection} services
     * @param {T} serviceClass
     * @param {T} instance
     */
    static addOptionsInstance(services, serviceClass, instance) {
        services.add(new ServiceDescriptor({
            serviceType: OptionSymbols.forType(serviceClass),
            implementationInstance: instance,
            lifetime: ServiceLifetime.singleton,
        }));
    }

    /**
     * Crea una clase que representa un tipo de opciones tipadas.
     * @param {Function} optionsClass - Clase de opciones tipadas.
     * @returns {Function} Clase que representa el tipo de opciones tipadas.
     */
    static optionsType(optionsClass) {
        return class OptionsT {
            static get __typeof() {
                return OptionSymbols.forType(optionsClass);
            }
            static get __metadata() {
                return {
                    provides: [],
                    inject: {
                        config: ConfigurationManager,
                        target: optionsClass,
                        setup: this.configureOptionsType(optionsClass)
                    }
                };
            }
        };
    }

    /**
     * Crea una clase que representa un tipo de opciones tipadas.
     * @param {Function} optionsClass - Clase de opciones tipadas.
     * @returns {Function} Clase que representa el tipo de opciones tipadas.
     */
    static configureOptionsType(optionsClass) {
        return class ConfigureOptionsT {
            static get __typeof() {
                return OptionSymbols.forConfigureType(optionsClass);
            }
            static get __metadata() {
                return {
                    provides: [],
                    inject: { }
                };
            }
        };
    }
}

export default OptionsServiceCollectionExtensions;