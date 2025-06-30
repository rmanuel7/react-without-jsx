import ServiceLifetime from './ServiceLifetime.js';

/**
 * ServiceMetadata
 * ===============
 *
 * Representa la metadata de un servicio para su registro en el contenedor DI.
 * 
 * Contiene:
 * - Qué interfaces proporciona (`provides`)
 * - Qué dependencias requiere (`inject`)
 * - Cuál es su ciclo de vida (`lifetime`)
 * 
 * @example
 * class Host {
 *     static get __typeof() {
 *         return Symbol.for('softlib.Host');
 *     }
 * 
 *     static get __metadata() {
 *         return {
 *             provides: [Host.__typeof],
 *             inject: {
 *                 services: ServiceProvider,
 *                 hostEnvironment: HostEnvironment,
 *                 defaultProvider: FileProvider,
 *                 applicationLifetime: ApplicationLifetime,
 *                 logger: Logger,
 *                 hostLifetime: HostLifetime,
 *                 options: SpaHostOptions
 *             },
 *             lifetime: ServiceLifetime.singleton
 *         };
 *     }
 * 
 *     constructor({ services, hostEnvironment, defaultProvider, applicationLifetime, logger, hostLifetime, options }) {
 *         // ...
 *     }
 * }
 */
class ServiceMetadata {
    /** @type {symbol[]} */
    #provides;
    /** @type {Object<string, Function>} */
    #inject;
    /** @type {symbol} */
    #lifetime;

    /**
     * @param {object} options
     * @param {symbol[]} options.provides - Tipos que implementa/proporciona.
     * @param {Object<string, Function>} [options.inject] - Dependencias por nombre → tipo.
     * @param {symbol} [options.lifetime] - Ciclo de vida del servicio (por defecto scoped).
     */
    constructor({ provides, inject = {}, lifetime = ServiceLifetime.scoped }) {
        if (!Array.isArray(provides) || provides.some(p => typeof p !== 'symbol')) {
            throw new Error('ServiceMetadata: "provides" debe ser un arreglo de Symbols.');
        }

        if (typeof inject !== 'object' || inject === null) {
            throw new Error('ServiceMetadata: "inject" debe ser un objeto (nombre → Clase).');
        }

        for (const [key, value] of Object.entries(inject)) {
            if (typeof value !== 'function') {
                throw new Error(`ServiceMetadata: inject["${key}"] debe ser una Clase.`);
            }
            // Validación adicional:
            if (typeof value.__typeof === 'undefined') {
                throw new Error(`ServiceMetadata: inject["${key}"] no define static get __typeof().`);
            }
        }

        if (!ServiceLifetime.values.includes(lifetime)) {
            throw new Error('ServiceMetadata: "lifetime" debe ser un valor válido de ServiceLifetime.');
        }

        this.#provides = provides;
        this.#inject = inject;
        this.#lifetime = lifetime;
    }

    /** 
     * Interfaces o tipos que implementa/proporciona.
     * 
     * @returns {symbol[]}
     */
    get provides() {
        return this.#provides;
    }

    /** 
     * Dependencias por nombre → tipo.
     * 
     * @returns {Object<string, Function>}
     */
    get inject() {
        return this.#inject;
    }

    /** 
     * Ciclo de vida del servicio (por defecto scoped).
     * 
     * @returns {symbol} 
     */
    get lifetime() {
        return this.#lifetime;
    }

    /**
     * Crea metadata desde una clase que define un getter estático `__metadata`.
     * 
     * @param {Function} ClassDef - Clase que define `__metadata`.
     * @returns {ServiceMetadata}
     */
    static from(ClassDef) {
        if (!ClassDef.__metadata) {
            throw new Error(`${ClassDef.name} no define "__metadata".`);
        }
        const meta = ClassDef.__metadata;
        if (!meta.provides) throw new Error(`${ClassDef.name}.__metadata debe definir "provides".`);
        // inject y lifetime pueden ser opcionales (por convención).
        return new ServiceMetadata(meta);
    }
}

export default ServiceMetadata;
