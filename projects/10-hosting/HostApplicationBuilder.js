import HostingSymbols from './internal/HostingSymbols.js';
import HostApplicationBuilderSettings from './HostApplicationBuilderSettings.js';
import HostEnvironment from './internal/HostEnvironment.js';
import HostOptions from './internal/HostOptions.js';
import Host from './internal/Host.js';
import { ConfigurationManager, SourceConfigurationBuilderExtensions } from '@spajscore/configuration';
import HostingHostBuilderExtensions from './HostingHostBuilderExtensions.js';
import HostDefaults from './HostDefaults.js';
import HostBuilderContext from './HostBuilderContext.js';
import HostBuilder from './HostBuilder.js';
import { ServiceCollection, ServiceProvider } from '@spajscore/dependency-injection';

/**
 * HostApplicationBuilder
 * =====================
 * Implementa el patrón builder para configurar y construir un Host.
 * Inspirado en .NET Generic Host.
 *
 * @example
 * import HostApplicationBuilder from './HostApplicationBuilder.js';
 * const builder = new HostApplicationBuilder();
 * builder.configureAppConfiguration(cfg => { ... });
 * builder.configureServices(svcs => { ... });
 * const host = await builder.build();
 * await host.start();
 */
class HostApplicationBuilder {
    /**
     * Identificador simbólico para HostApplicationBuilder.
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.hostApplicationBuilder;
    }
    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [this.__typeof],
            inject: {}
        };
    }

    #configuration;

    /** @type {HostBuilderContext} */
    #hostBuilderContext;
    /** @type {ServiceCollection} */
    #serviceCollection = new ServiceCollection();
    /** @type {HostEnvironment} */
    #environment;

    /** @type {()=> ServiceProvider} */
    #createServiceProvider;

    /** @type {ServiceProvider} */
    #appServices;
    /** @type {bool} */
    #hostBuild = false;

    /**
     * @param {object} [options]
     * @param {HostApplicationBuilderSettings} [options.settings]
     */
    constructor({ settings } = {}) {
        settings ||= new HostApplicationBuilderSettings();

        this.#configuration = settings.configuration || new ConfigurationManager();

        if(!settings.disableDefaults){
            if(!settings.contentRootPath){
                HostingHostBuilderExtensions.setDefaultContentRoot(this.#configuration);
            }
            SourceConfigurationBuilderExtensions.addEnvironmentVariables(this.#configuration, 'SPA_');
        }

        const { hostBuilderContext, environment, logging, metrics } = this.#initialize(settings);
        this.#hostBuilderContext = hostBuilderContext;
        this.#environment = environment;

        if(!settings.disableDefaults){
            // applyDefaultConfiguration: appsettings.json
            // addDefaultServices: addLogging, addMetrics
        }

        this.#createServiceProvider = ()=> {
            return new ServiceProvider(this.services);
        };
    }

    /**
     * Inicializa el builder con la configuración proporcionada.
     * @param {HostApplicationBuilderSettings} settings
     */
    #initialize(settings){
        // HostApplicationBuilderSettings sobreescribe todas las otras configuraciones.
        const options = {};

        if(settings && settings.applicationName){
            options[HostDefaults.applicationKey] = settings.applicationName;
        }
        if(settings && settings.environmentName){
            options[HostDefaults.environmentKey] = settings.environmentName;
        }
        if(settings && settings.contentRootPath){
            options[HostDefaults.contentRootKey] = settings.contentRootPath;
        }

        if(Object.keys(options).length > 0) {
            SourceConfigurationBuilderExtensions.addInMemoryCollection(this.#configuration, options);
        }

        const { hostingEnvironment, physicalFileProvider } = HostBuilder.createHostingEnvironment(this.#configuration);

        const hostBuilderContext = new HostBuilderContext({
            properties: new Map(),
            hostEnvironment: hostingEnvironment,
            configuration: this.#configuration,
        });

        HostBuilder.populateServiceCollection(
            this.services,
            hostBuilderContext,
            hostingEnvironment,
            physicalFileProvider,
            this.configuration,
            ()=> this.#appServices
        );

        return {
            hostBuilderContext: hostBuilderContext,
            environment: hostingEnvironment,
            logging: null,
            metrics: null
        };
    }
    

    /**
     * Construye y devuelve una instancia de Host.
     * @returns {Promise<Host>}
     */
    async build() {
        if(this.#hostBuild){
            throw new Error('HostApplicationBuilder: operación invalida. El hosta ya ha sido llamado.')
        }

        this.#hostBuild = true;

        this.#appServices = this.#createServiceProvider();

        // Prevenir futuras modificaciones
        this.#serviceCollection.makeReadOnly();


    }

    /**
     * Acceso a HostEnvironment
     * @returns {HostEnvironment}
     */
    get environment() {
        return this.#environment;
    }

    get configuration(){
        return this.#configuration;
    }

    /**
     * Acceso a la colección de servicios
     * @returns {ServiceCollection}
     */
    get services() {
        return this.#serviceCollection;
    }
}

export default HostApplicationBuilder;
