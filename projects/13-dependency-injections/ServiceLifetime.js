import DependencyInjectionSymbols from '../internal/DependencyInjectionSymbols.js';

/**
 * ServiceLifetime
 * ===============
 *
 * Enumera los ciclos de vida posibles para servicios registrados en el contenedor DI,
 * equivalente a Microsoft.Extensions.DependencyInjection.ServiceLifetime en .NET Core.
 */
class ServiceLifetime {
    /**
     * Un solo singleton global para toda la app.
     * @returns {symbol}
     */
    static get singleton() {
        return DependencyInjectionSymbols.lifetimeSingleton;
    }
    /**
     * Nueva instancia por cada 'scope' (en backend normalmente por request).
     * @returns {symbol}
     */
    static get scoped() {
        return DependencyInjectionSymbols.lifetimeScoped;
    }
    /**
     * Nueva instancia cada vez que se solicita el servicio.
     * @returns {symbol}
     */
    static get transient() {
        return DependencyInjectionSymbols.lifetimeTransient;
    }

    /**
     * Devuelve todos los valores posibles de ServiceLifetime.
     * @returns {symbol[]}
     */
    static get values() {
        return [this.singleton, this.scoped, this.transient];
    }
}

export default ServiceLifetime;