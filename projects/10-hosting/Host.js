import HostingSymbols from './HostingSymbols.js';
import HostEnvironment from './HostEnvironment.js';
import HostOptions from './HostOptions.js';
import HostApplicationLifetime from './HostApplicationLifetime.js';
import { Logger } from '@spajscore/logging';
import ConsoleLifetime from './ConsoleLifetime.js';
import { ServiceProvider } from '@spajscore/dependency-injection';
import { CancellationToken, CancellationTokenSource } from '@spajscore/threading';
import { EnumerableTemplate } from '@spajscore/collections';
import { Options } from '@spajscore/options';

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
    /** @type {HostApplicationLifetime} */ #applicationLifetime;
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
     * @param {Options<HostOptions>} deps.options
     * @param {HostApplicationLifetime} deps.applicationLifetime
     * @param {ConsoleLifetime} deps.consoleLifetime
     * @param {Logger<Host>} deps.logger
     */
    constructor({ services, environment, options, applicationLifetime, consoleLifetime, logger }) {
        if (!services || services instanceof ServiceProvider === false) {
            throw new Error('Host: operación invalida. El ServiceProvider es requerido.')
        }
        if (!environment || environment instanceof HostEnvironment === false) {
            throw new Error('Host: operación invalida. El HostEnvironment es requerido.')
        }
        if (!applicationLifetime || applicationLifetime instanceof HostApplicationLifetime === false) {
            throw new Error('Host: operación invalida. El HostApplicationLifetime es requerido.')
        }
        if (!logger || logger instanceof Logger === false) {
            throw new Error('Host: operación invalida. El Logger es requerido.')
        }
        if (!consoleLifetime || consoleLifetime instanceof ConsoleLifetime === false) {
            throw new Error('Host: operación invalida. El ConsoleLifetime es requerido.')
        }
        if (!options || options instanceof Options === false) {
            throw new Error('Host: operación invalida. El Options<HostOptions> es requerido.')
        }
        if (!options.value || options.value instanceof HostOptions === false) {
            throw new Error('Host: operación invalida. El Options<HostOptions> es requerido.')
        }
        this.#services = services;
        this.#environment = environment;
        this.#options = options.value;
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
    async startAsync(cancellationToken) {
        if (this.#hostStarting) return;
        this.#logger.info('Hosting starting');

        // Análogo a `using (var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _applicationLifetime.ApplicationStopping))`
        const internalCancellationTokenSource = CancellationTokenSource.createLinkedTokenSource(
            cancellationToken || new CancellationToken(new AbortController().signal), // Un token vacío si no hay uno entrante
            this.#applicationLifetime.applicationStopping
        );

        if (this.#options.startupTimeout !== Infinity) {
            internalCancellationTokenSource.cancelAfter(this.#options.startupTimeout);
        }

        cancellationToken = internalCancellationTokenSource.token;
        
        try {
            // ConsoleLifetime se "inicia" configurando sus listeners.
            await this.#consoleLifetime.waitForStartAsync(cancellationToken);
            // Verifica cancelación después de iniciar listeners
            cancellationToken.throwIfCancellationRequested();

            const exceptions = [];
            const EnumerableOfHosted = EnumerableTemplate.forType(HostingSymbols.makeTypeBySymbol(HostingSymbols.hostedService));
            this.#hostedServices ??= this.#services.get(EnumerableOfHosted);
            // this.#hostedLifecycleServices = GetHostLifecycles(_hostedServices);
            this.#hostStarting = true;
            const concurrent = this.#options.servicesStartConcurrently;
            const abortOnFirstException = !concurrent;

            // Call StartingAsync().
            if (this.#hostedLifecycleServices) {
                await this.#foreachService(this.#hostedLifecycleServices, cancellationToken, concurrent, abortOnFirstException, exceptions,
                    (service, token) => service.startingAsync(token)
                );
            }

            // Call StartAsync().
            await this.#foreachService(this.#hostedServices, cancellationToken, concurrent, abortOnFirstException, exceptions,
                (service, token) => service.startAsync(token)
            );

            // Call StartedAsync().
            if (this.#hostedLifecycleServices)
            {
                await this.#foreachService(this.#hostedLifecycleServices, cancellationToken, concurrent, abortOnFirstException, exceptions,
                    (service, token) => service.startedAsync(token)
                );
            }

            // Call IHostApplicationLifetime.Started
            // This catches all exceptions and does not re-throw.
            this.#applicationLifetime.notifyStarted();
        }
        catch (error) {
            this.#logger.error('Hosting failed', error)
            throw error
        }
        finally {
            this.#logger.info('Hosting started')
        }
    }

    /**
     * Detiene el host y el ciclo de vida.
     * 
     * @description
     * Order:
     * - IHostedLifecycleService.StoppingAsync
     * - IHostApplicationLifetime.ApplicationStopping
     * - IHostedService.Stop
     * - IHostedLifecycleService.StoppedAsync
     * - IHostApplicationLifetime.ApplicationStopped
     * - IHostLifetime.StopAsync
     * @param {CancellationToken} cancellationToken 
     * @returns {Promise<void>}
     */
    async stopAsync(cancellationToken) {
        if (this.#hostStopped) return;
        this.#logger.info('Host stopping');

        // Análogo a `var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken)`
        let internalCancellationTokenSource;

        if (this.#options.shutdownTimeout !== Infinity) {
            internalCancellationTokenSource = CancellationTokenSource.createLinkedTokenSource(
                cancellationToken || new CancellationToken(new AbortController().signal), // Un token vacío si no hay uno entrante
            );
            internalCancellationTokenSource.cancelAfter(this.#options.shutdownTimeout);
            cancellationToken = internalCancellationTokenSource;
        }
        else {
            cancellationToken ??= new CancellationToken(new AbortController().signal);
        }

        const exceptions = [];

        try {
            if (!this.#hostStarting) // Started?
            {
                // Call IHostApplicationLifetime.ApplicationStopping.
                // This catches all exceptions and does not re-throw.
                this.#applicationLifetime.stopApplication();
            }
            else {
                // Ensure hosted services are stopped in LIFO order
                const reversedServices = this.#hostedServices.reverse();
                const reversedLifetimeServices = this.#hostedLifecycleServices?.reverse();
                const concurrent = this.#options.servicesStopConcurrently;

                // Call StoppingAsync().
                if (reversedLifetimeServices) {
                    await this.#foreachService(reversedLifetimeServices, cancellationToken, concurrent, false, exceptions,
                        (service, token) => service.stoppingAsync(token)
                    );
                }

                // Call IHostApplicationLifetime.ApplicationStopping.
                // This catches all exceptions and does not re-throw.
                this.#applicationLifetime.stopApplication();

                // Call StopAsync().
                await this.#foreachService(reversedServices, cancellationToken, concurrent, false, exceptions,
                    (service, token) => service.stopAsync(token)
                );

                // Call StoppedAsync().
                if (reversedLifetimeServices) {
                    await this.#foreachService(reversedLifetimeServices, cancellationToken, concurrent, false, exceptions,
                        (service, token) => service.stoppedAsync(token)
                    );
                }
            }

            // Call IHostApplicationLifetime.Stopped
            // This catches all exceptions and does not re-throw.
            this.#applicationLifetime.notifyStopped();

            // This may not catch exceptions, so we do it here.
            try {
                await this.#consoleLifetime.stopAsync(cancellationToken);
            }
            catch (ex) {
                exceptions.Add(ex);
            }

            this.#hostStopped = true;
        }
        catch (error) {
            this.#logger.info('Host stopped failed');
            throw error;
        }
        finally {
            this.#logger.info('Host stopped');
        }
    }

    /**
     * Itera sobre los servicios y ejecuta un método asíncrono en cada uno,
     * manejando concurrencia y cancelación. Análogo al helper ForeachService en C#.
     * @template T
     * @param {Array<T>} services - Array de servicios a procesar.
     * @param {CancellationToken} token - El token de cancelación.
     * @param {boolean} concurrent - Si los servicios deben iniciar/detener concurrentemente.
     * @param {boolean} abortOnFirstException - Si la iteración debe abortar en la primera excepción.
     * @param {Error[]} exceptions - Lista para acumular excepciones.
     * @param {function(T, CancellationToken): Promise<void>} operation - El método a ejecutar en cada servicio.
     */
    async #foreachService(services, token, concurrent, abortOnFirstException, exceptions, operation) {
        if (!services || services.length === 0) return;
        if (token.isCancellationRequested && exceptions.length === 0) {
            throw new Error('foreachService: la operación ya fue cancelada antes de ingresar', 'AbortError');
        }

        if (concurrent) {
            /** @type {Array<Promise<void>>} */
            const tasks = services.map(async service => {
                try {
                    await operation(service, token);
                } catch (error) {
                    exceptions.push(error);
                    if (abortOnFirstException) {
                        throw error
                    }
                }
            });

            if (tasks) {
                try {
                    await Promise.all(tasks);
                }
                catch (error) {
                    exceptions.push(error);
                }
            }
        }
        else {
            for (const service of services) {
                try {
                    await operation(service, token);
                }
                catch (error) {
                    exceptions.push(error);
                    if (abortOnFirstException) {
                        return;
                    }
                }
            }
        }
    }
}

export default Host;
