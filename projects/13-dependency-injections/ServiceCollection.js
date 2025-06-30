import DependencyInjectionSymbols from '../internal/DependencyInjectionSymbols.js';
import ServiceDescriptor from './ServiceDescriptor.js';

/**
 * ServiceCollection
 * ==================
 * 
 * Colección de descriptores de servicios, inspirada en ServiceCollection de .NET Core.
 * Permite registrar servicios con distintos ciclos de vida y encontrar descriptores por tipo.
 * 
 * Inicializa una nueva instancia de la colección, envuelta en un `Proxy` que soporta:
 * - Acceso por índice: `collection[0]`
 * - Asignación directa: `collection[1] = descriptor`
 * - Iteración con `for...of`
 * 
 * @example
 * import ServiceCollection from './ServiceCollection.js';
 * const services = new ServiceCollection();
 * services.addSingleton(MyService, () => new MyService());
 * const descriptor = services.find(MyService);
 */
class ServiceCollection {
    /**
     * Identificador simbólico para el tipo de colección de servicios.
     * @returns {symbol}
     */
    static get __typeof() {
        return DependencyInjectionSymbols.serviceCollection;
    }

    /** @type {boolean} Indica si la colección se puede modificar */
    #isReadOnly = false;
    /** @type {ServiceDescriptor[]} Lista interna de descriptores de servicio. */
    #descriptors = [];

    /**
     * Crea una nueva instancia de ServiceCollection.
     */
    constructor() {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Soporte para acceso por iterador for...of
                if(prop === Symbol.iterator){
                    return target[Symbol.iterator].bind(this);
                }
                // Soporte para acceso indexado por clave de configuración
                if (!isNaN(prop)) {
                    return target.get(Number(prop));
                }
                // Soporte para propiedades con getters definidos
                const proto = Object.getPrototypeOf(target);
                const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
                if (descriptor?.get) {
                    return target[prop];
                }
                // Auto-bind de funciones del prototipo
                const value = target[prop];
                if (value instanceof Function) {
                    return value.bind(target);
                }
                // Permite acceso normal a métodos/propiedades
                return Reflect.get(target, prop, receiver);
            },
            set: (target, prop, value, receiver) => {
                if (!isNaN(prop)) {
                    target.set(Number(prop), value);
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            has: (target, prop) => {
                if (!isNaN(prop)) {
                    return target.get(Number(prop)) !== undefined;
                }
                return Reflect.has(target, prop);
            },
            ownKeys: (target) => [
                ...Reflect.ownKeys(target),
                ...target.keys()
            ],
            getOwnPropertyDescriptor: (target, prop) => {
                if (!isNaN(prop)) {
                    return {
                        enumerable: true,
                        configurable: true
                    };
                }
                return Reflect.getOwnPropertyDescriptor(target, prop);
            }
        });
    }

    /**
    * Devuelve todos los descriptores registrados como una copia inmutable.
    * 
    * @returns {ServiceDescriptor[]}
    */
    get descriptors() {
        return [...this.#descriptors];
    }

    /**
     * Soporte para iterar con for...of.
     * 
     * @returns {Iterator<ServiceDescriptor>}
     */
    [Symbol.iterator]() {
        return this.#descriptors[Symbol.iterator]();
    }

    /**
     * 
     * @param {number} index 
     */
    removeAt(index) {
        this.#descriptors.splice(index, 1);
    }

    /**
     * Agrega un `ServiceDescriptor` explícito.
     * 
     * @param {ServiceDescriptor} descriptor
     */
    add(descriptor) {
        if (!(descriptor instanceof ServiceDescriptor)) {
            throw new TypeError('descriptor debe ser instancia de ServiceDescriptor');
        }
        this.#checkReadOnly();
        this.#descriptors.push(descriptor);
    }

    /**
     * Devuelve el primer descriptor registrado para el tipo dado.
     * 
     * @param {Function} serviceClass
     * @returns {ServiceDescriptor|null}
     */
    find(serviceClass) {
        if (typeof serviceClass !== 'function') {
            throw new TypeError(`ServiceScope: 'serviceClass' debe ser una Clase (Function).`);
        }
        const typeKey = serviceClass.__typeof;
        if (!typeKey) {
            throw new Error(
                `La clase ${serviceClass.name} debe definir un getter estático __typeof (ej: static get __typeof() { return Symbol.for('...'); })`
            );
        }
        return this.#descriptors.find(d =>
            d.serviceType === typeKey ||
            (Array.isArray(d.metadata?.provides) && d.metadata.provides.includes(typeKey))
        ) ?? null;
    }

    /**
     * Obtiene el descriptor en la posición indicada.
     * @param {number} index
     * @returns {ServiceDescriptor|undefined}
     */
    get(index) {
        return this.#descriptors[index];
    }

    /**
     * Reemplaza el descriptor en la posición indicada.
     * @param {number} index
     * @param {ServiceDescriptor} descriptor
     */
    set(index, descriptor) {
        if (!(descriptor instanceof ServiceDescriptor)) {
            throw new TypeError('descriptor debe ser instancia de ServiceDescriptor');
        }
        this.#checkReadOnly();
        this.#descriptors[index] = descriptor;
    }

    /**
     * Devuelve los índices válidos como claves string para `Object.keys()`.
     * @returns {string[]}
     */
    keys() {
        return this.#descriptors.map((_, i) => i.toString());
    }

    /**
     * Cierra las modificaciones para esta colección.
     */
    makeReadOnly(){
        this.#isReadOnly = true;
    }

    /**
     * 
     */
    #checkReadOnly(){
        if(this.#isReadOnly){
            throw new Error('ServiceCollection: operación invalida. La colección no se puede modificar.')
        }
    }

    /**
     * Devuelve una representación textual de la colección.
     * 
     * @returns {string}
     */
    toString() {
        return `[ServiceCollection: ${this.#descriptors.length} servicios registrados]`;
    }
}

export default ServiceCollection;
