import { ConfigurationManager } from '@spajscore/configuration';
import HostEnvironment from './internal/HostEnvironment.js';
import HostDefaults from './HostDefaults.js';
import { ServiceCollection, ServiceCollectionServiceExtensions } from '@spajscore/dependency-injection';
import { ServiceProvider } from '@spajscore/dependency-injection';
import HostBuilderContext from './HostBuilderContext.js';
import HostApplicationLifetime from './internal/HostApplicationLifetime.js';
import { ConsoleLifetime } from '../index-test.js';
import Host from './internal/Host.js';
import { LoggerFactory } from '@spajscore/logging';
import HostOptions from './internal/HostOptions.js';

/**
 * HostBuilder
 * ===========
 * 
 * Implementa el patrón builder para crear un entorno de host.
 * Proporciona métodos para configurar el entorno de host.
 * 
 * @example
 * import HostBuilder from './HostBuilder.js';
 * const hostConfiguration = new ConfigurationManager();
 * hostConfiguration.addInMemoryCollection({ environment: 'Development', contentRoot: './app' });
 * const { hostingEnvironment, physicalFileProvider } = HostBuilder.createHostingEnvironment(hostConfiguration);
 */
class HostBuilder {
    /**
     * Crea un entorno de host utilizando la configuración proporcionada.
     * @param {ConfigurationManager} hostConfiguration 
     */
    static createHostingEnvironment(hostConfiguration) {
        const hostingEnvironment = new HostEnvironment({
            environmentName: hostConfiguration[HostDefaults.environmentKey] || 'Production',
            contentRootPath: hostConfiguration[HostDefaults.contentRootKey] || './',
        });

        hostingEnvironment.applicationName = hostConfiguration[HostDefaults.applicationKey] || 'SPA JS Core Application';

        return {
            hostingEnvironment,
            physicalFileProvider:null
        };
    }

    /**
     * 
     * @param {ServiceCollection} services - S
     * @param {HostBuilderContext} hostBuilderContext - H
     * @param {HostEnvironment} hostingEnvironment - H
     * @param {object} defaultFileProvider - F
     * @param {ConfigurationManager} appConfiguration - C
     * @param {()=>ServiceProvider} serviceProviderGetter - S
     */
    static populateServiceCollection(
        services,
        hostBuilderContext,
        hostingEnvironment,
        defaultFileProvider, 
        appConfiguration,
        serviceProviderGetter
    ) {
        ServiceCollectionServiceExtensions.addSingletonInstance(services, HostEnvironment, hostingEnvironment);
        ServiceCollectionServiceExtensions.addSingletonInstance(services, HostBuilderContext, hostBuilderContext);
        ServiceCollectionServiceExtensions.addSingletonFactory(services, ConfigurationManager, appConfiguration);
        ServiceCollectionServiceExtensions.addSingletonFactory(services, HostApplicationLifetime, sp =>
            sp.get(HostApplicationLifetime)
        );

        // AddLifetime(services)
        ServiceCollectionServiceExtensions.addSingletonType(services, ConsoleLifetime);

        ServiceCollectionServiceExtensions.addSingletonFactory(services, Host, _=> {
            const appServices = serviceProviderGetter();
            return new Host({
                environment: hostingEnvironment,
                // physicalFileProvider
                applicationLifetime: appServices.get(HostApplicationLifetime),
                loggerFactory: appServices.get(LoggerFactory),
                consoleLifetime: appServices.get(ConsoleLifetime),
                options: appServices.get(HostOptions)
            });
        });

        ServiceCollectionServiceExtensions.addSingletonType(services, HostOptions);
    }

    /**
     * 
     */
    static resolveHost(serviceProvider, diagnostingListener = null){
        if(!serviceProvider && serviceProvider instanceof ServiceProvider === false){
            throw new Error('HostBuilder: operación invalida. El ServiceProvider es requerido.')
        }

        // resolver la configuración
        const _ = serviceProvider.get(ConfigurationManager);

        const host = serviceProvider.get(Host);

        return host;
    }
}

export default HostBuilder;