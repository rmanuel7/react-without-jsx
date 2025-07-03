/**
 * ListenOptions (SPA)
 * ===================
 * Inspirado en Microsoft.AspNetCore.Server.Kestrel.Core.ListenOptions.
 * 
 * Representa la configuración y el pipeline de middlewares para un "listener" SPA (evento de navegación).
 * Permite encadenar middlewares con .use(), construir el pipeline final con .build(), y registrar el listener con .bindAsync().
 * 
 * El handler final (por ejemplo, el HttpApplication en el mundo SPA) debe ser agregado como el ÚLTIMO middleware usando .use().
 * El método .build() NO recibe parámetros, fiel al modelo de ASP.NET Core.
 */
class ListenOptions {
    /**
     * @param {object} opts
     * @param {string} opts.eventType - Tipo de evento a escuchar (por ejemplo: 'popstate', 'hashchange').
     * @param {string} [opts.basePath] - Path base de la app (opcional).
     * @param {string[]} [opts.protocols] - Protocolos virtuales para el listener (default: ['spa']).
     * @param {boolean} [opts.enabled] - Si el listener está activo (default: true).
     */
    constructor({ eventType, basePath = '/', protocols = ['spa'], enabled = true } = {}) {
        this.eventType = eventType;
        this.basePath = basePath;
        this.protocols = protocols;
        this.enabled = enabled;

        /** @type {Array<Function>} */
        this._middlewares = [];
        /** @type {Function|null} */
        this._handler = null;
        /** @type {Function|null} */
        this._unsubscribe = null;
    }

    /**
     * Agrega un middleware al pipeline de este listener.
     * Cada middleware debe tener la forma (next) => (event) => { ... }.
     * El handler final (HttpApplication) DEBE ser el último middleware agregado.
     * @param {(next: Function) => Function} middleware 
     * @returns {ListenOptions}
     */
    use(middleware) {
        this._middlewares.push(middleware);
        return this;
    }

    /**
     * Construye el handler final (pipeline) a partir de los middlewares registrados.
     * NO recibe parámetros, igual que en ASP.NET Core.
     * El último middleware DEBE ser el handler final que ejecuta la HttpApplication.
     * @returns {Function}
     */
    build() {
        if (this._middlewares.length === 0) {
            throw new Error("ListenOptions: Debe registrar al menos un middleware (el handler final) antes de llamar a build().");
        }
        let handler = (/*event*/) => {};
        // Compose middlewares en orden inverso (último agregado es el más interno/final)
        for (let i = this._middlewares.length - 1; i >= 0; i--) {
            handler = this._middlewares[i](handler);
        }
        this._handler = handler;
        return handler;
    }

    /**
     * Registra el listener en window y lo asocia al handler construido con build().
     * Fiel a ASP.NET Core: no recibe el pipeline aquí.
     * @param {object} addressBindContext - Contexto de bindeo (opcional, para logging, direcciones, etc.)
     * @returns {Promise<Function>} Función para desuscribir el listener.
     */
    async bindAsync(addressBindContext) {
        if (!this.enabled) return () => {};
        if (!this._handler) {
            throw new Error('ListenOptions: Debe llamar a build() antes de bindAsync().');
        }
        window.addEventListener(this.eventType, this._handler);
        this._unsubscribe = () => window.removeEventListener(this.eventType, this._handler);

        if (addressBindContext?.addresses?.push) {
            addressBindContext.addresses.push(this.getDisplayName?.() ?? this.eventType);
        }

        return this._unsubscribe;
    }

    /**
     * Elimina el listener del evento.
     */
    unbind() {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
        }
    }

    /**
     * Devuelve un nombre amigable para logging o diagnóstico.
     * @returns {string}
     */
    getDisplayName() {
        return `${this.protocols?.join('+') ?? 'spa'}://${this.eventType}${this.basePath}`;
    }
}

export default ListenOptions;
