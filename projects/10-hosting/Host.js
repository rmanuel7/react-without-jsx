import HostingSymbols from './HostingSymbols.js';
import HostEnvironment from './HostEnvironment.js';
import HostOptions from './HostOptions.js';
import HostApplicationLifetime from './HostApplicationLifetime.js';
import { Logger } from '@spajscore/logging';
import ConsoleLifetime from './ConsoleLifetime.js';
import { ServiceProvider } from '@spajscore/dependency-injection';
import { CancellationToken, CancellationTokenSource } from '@spajscore/threading';
import { EnumerableTemplate } from '@spajscore/collections';

/**
 * Host
 * ====
 * Punto de entrada principal para la orquestación del ciclo de vida de la aplicación.
 * Inspirado en Microsoft.Extensions.Hosting.Host de .NET Core.
 *
 * @example
 * import Host from './Host.js';
 * const host = new Host({
 *   environment,
 *   options,
 *   applicationLifetime,
 *   loggerFactory
 * });
 * await host.start();
 * // ... hacer lógica de la app ...
 * await host.stop();
 */
class Host {
    /**
     * Identificador simbólico para DI (contrato IHost).
     * @returns {symbol}
     */
    static get __typeof() {
        return HostingSymbols.host;
    }

    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            parameters: [],
            properties: {},
            inject: {
                services: ServiceProvider,
                environment: HostEnvironment,
                options: HostOptions,
                applicationLifetime: HostApplicationLifetime,
                consoleLifetime: ConsoleLifetime,
                logger: HostingSymbols.makeTypeBySymbol(HostingSymbols.forTypeBySymbol(this.__typeof, Logger.__typeof))
            }
        };
    }

    /** @type {Logger<Host>} */           #logger;
    /** @type {ConsoleLifetime} */        #consoleLifetime;
    /** @type {HostApplicationLifetime} */#applicationLifetime;
    /** @type {HostOptions} */            #options;
    /** @type {HostEnvironment} */        #environment;
    /** @type {ServiceProvider} */        #services;

    /** @type {Array<HostedService>|null} */ #hostedServices;
    /** @type {Array<HostedLifecycleService>|null} */ #hostedLifecycleServices;
    /** @type {boolean} */                #hostStarting;
    /** @type {boolean} */                #hostStopped;

    /**
     * @param {object} deps
     * @param {ServiceProvider} deps.services
     * @param {HostEnvironment} deps.environment
     * @param {HostOptions} deps.options
     * @param {HostApplicationLifetime} deps.applicationLifetime
     * @param {ConsoleLifetime} deps.consoleLifetime
     * @param {Logger<Host>} deps.logger
     */
    constructor({ services, environment, options, applicationLifetime, consoleLifetime, logger }) {
        if (!services || services instanceof ServiceProvider === false) {
            throw new Error('HostBuilder: operación invalida. El ServiceProvider es requerido.')
        }
        if (!applicationLifetime || applicationLifetime instanceof HostApplicationLifetime === false) {
            throw new Error('HostBuilder: operación invalida. El HostApplicationLifetime es requerido.')
        }
        if (!consoleLifetime || consoleLifetime instanceof ConsoleLifetime === false) {
            throw new Error('HostBuilder: operación invalida. El ConsoleLifetime es requerido.')
        }
        if (!logger || logger instanceof Logger === false) {
            throw new Error('HostBuilder: operación invalida. El Logger es requerido.')
        }
        this.#services = services;
        this.#environment = environment;
        this.#options = options;
        this.#applicationLifetime = applicationLifetime;
        this.#consoleLifetime = consoleLifetime;
        this.#logger = logger;
        this.#hostStarting = false;
    }

    /**
     * Devuelve el entorno de ejecución.
     * @returns {ServiceProvider}
     */
    get services() {
        return this.#services;
    }

    /**
     * Inicia el host y el ciclo de vida.
     * @descriptions
     * Order:
     * - IHostLifetime.WaitForStartAsync
     * - Services.GetService{IStartupValidator}().Validate()
     * - IHostedLifecycleService.StartingAsync
     * - IHostedService.Start
     * - IHostedLifecycleService.StartedAsync
     * - IHostApplicationLifetime.ApplicationStarted
     * @param {CancellationToken} cancellationToken 
     * @returns {Promise<void>}
     */
    async start(cancellationToken) {
        this.#logger.info('Hosting starting...');

        // Análogo a `using (var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _applicationLifetime.ApplicationStopping))`
        const internalCancellationTokenSource = CancellationTokenSource.createLinkedTokenSource(
            cancellationToken || new CancellationToken(new AbortController().signal), // Un token vacío si no hay uno entrante
            this.#applicationLifetime.applicationStopping
        );


        if (this.#options.startupTimeout !== Infinity) {
            internalCancellationTokenSource.cancelAfter(this.#options.startupTimeout);
        }

        cancellationToken = internalCancellationTokenSource.token;

        const exceptions = [];
        let hostStarting = false;

        try {
            // ConsoleLifetime se "inicia" configurando sus listeners.
            await this.#consoleLifetime.waitForStartAsync(cancellationToken);
            // Verifica cancelación después de iniciar listeners
            cancellationToken.throwIfCancellationRequested();

            const concurrent = this.#options.servicesStartConcurrently;
            const abortOnFirstException = !concurrent;
            const EnumerableOfHosted = EnumerableTemplate.forType(HostingSymbols.makeTypeBySymbol(HostingSymbols.hostedService));
            this.#hostedServices ??= this.#services.get(EnumerableOfHosted);
            // this.#hostedLifecycleServices = GetHostLifecycles(_hostedServices);

            hostStarting = true;

            for (const svc of this.#hostedServices) {
                if (concurrent) {
                    svc.start(cancellationToken);
                }
                else {
                    await svc.start(cancellationToken);
                }
            }

            // Call IHostApplicationLifetime.Started
            // This catches all exceptions and does not re-throw.
            this.#applicationLifetime.notifyStarted();

            this.#logger.info('Hosting started')
        }
        catch (error) {
            this.#logger.error('Hosting failed', error)
            throw error
        }
        finally {
            this.#hostStarting = false;
        }
    }

    /**
     * Detiene el host y el ciclo de vida.
     * @returns {Promise<void>}
     */
    async stop() {
        if (!this.#hostStarting) return;
        this.#logger.info('Host stopping...');
        // Aquí puedes agregar lógica de limpieza si es necesario
        this.#consoleLifetime.stop();
        this.#applicationLifetime.stop();
        // Aquí puedes agregar lógica de espera o limpieza si es necesario
        this.#hostStarting = false;
        this.#logger.info('Host stopped.');
    }
}

export default Host;
