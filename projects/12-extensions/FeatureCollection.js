import HttpSymbols from './HttpSymbols.js';

/**
 * FeatureCollection
 * =================
 * 
 * Colección de features indexada por tipo (constructor).
 * Inspirada en Microsoft.AspNetCore.Http.Features.IFeatureCollection.
 *
 * Acceso indexado: features[SomeFeatureClass] = instancia;
 * 
 * @template T
 * 
 * @example
 * import FeatureCollection from './FeatureCollection.js';
 * const features = new FeatureCollection();
 * features[MyFeature] = instancia;
 * const x = features[MyFeature];
 */
class FeatureCollection {
    static get __typeof() {
        return HttpSymbols.featureCollection;
    }

    static get __metadata() {
        return {
            provides: [],
            inject: {}
        };
    }

    /** @type {Map<T, T>} */
    #features = new Map();

    /** @type {boolean} */
    #isReadOnly = false;

    /** @type {number} */
    #localRevision = 0;

    /** @type {FeatureCollection | null} */
    #defaults = null;

    /**
     * @constructor
     * @param {object} deps
     * @param {FeatureCollection | null} [deps.defaults]
     */
    constructor({ defaults = null }) {
        this.#defaults = defaults;

        // Proxy para acceso indexado por tipo (constructor)
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Permite features[SomeClass]
                if (typeof prop === 'function' && target.#features.has(prop)) {
                    return target.#features.get(prop);
                }
                // Métodos/props propios
                if (prop in target) return Reflect.get(target, prop, receiver);
                return undefined;
            },
            set: (target, prop, value, receiver) => {
                if (target.#isReadOnly)
                    throw new Error('FeatureCollection es solo lectura');
                if (typeof prop === 'function') {
                    target.set(prop, value);
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            has: (target, prop) => {
                if (typeof prop === 'function') return target.#features.has(prop);
                return prop in target;
            },
            ownKeys: (target) => {
                // Tipos registrados + propiedades propias
                return [
                    ...Reflect.ownKeys(target),
                    ...Array.from(target.#features.keys())
                ];
            },
            getOwnPropertyDescriptor: (target, prop) => {
                if (typeof prop === 'function' && target.#features.has(prop)) {
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
     * Indica si la colección es solo lectura.
     * @returns {boolean}
     */
    get isReadOnly() {
        return this.#isReadOnly;
    }

    /**
     * Número de revisiones acumuladas (local + heredadas).
     * @returns {number}
     */
    get revision() {
        const inherited = this.#defaults?.revision || 0;
        return this.#localRevision + inherited;
    }

    /**
     * Obtiene el feature de un tipo dado.
     * 
     * @description
     * Busca primero en #features, luego en los heredados (defaults).
     * Lanza error si la key es null/undefined (fiel a .NET Core).
     * @template TFeature
     * @param {TFeature} key
     * @returns {TFeature|undefined}
     * @throws {Error} Si la clave es null o undefined.
     */
    get(featureType) {
        if (featureType == null) {
            throw new Error('FeatureCollection: featureType no pueder ser null o undefined.');
        }
        if (typeof featureType.__typeof !== 'symbol') {
            throw new Error('FeatureCollection: featureType debe definir static get __typeof().');
        }

        const __typeof = featureType.__typeof;
        if (this.#features.has(__typeof)) {
            return this.#features.get(__typeof);
        }
        return this.#defaults ? this.#defaults[__typeof] : undefined;
    }

    /**
     * Asigna un feature a un tipo dado.
     * 
     * @description
     * Si value es null o undefined, elimina el feature local si existe.
     * Si la colección es solo lectura, lanza error.
     * Siempre incrementa la revisión si hay modificación, como en .NET Core.
     * No retorna valor (más fiel al indexador de .NET Core).
     * @template TFeature
     * @param {TFeature} featureType
     * @param {TFeature} instance
     * @throws {Error} Si la clave es null o undefined o si la colección es solo lectura.
     */
    set(featureType, instance) {
        if (featureType == null) {
            throw new Error('FeatureCollection: featureType no pueder ser null o undefined.');
        }
        if (typeof featureType.__typeof !== 'symbol') {
            throw new Error('FeatureCollection: featureType debe definir static get __typeof().');
        }

        const __typeof = featureType.__typeof;
        if (instance == null) {
            if (this.#features.has(__typeof)) {
                this.#features.delete(__typeof);
                this.#localRevision++;
            }
            return;
        }

        this.#features.set(__typeof, instance);
        this.#localRevision++;
    }

    /**
     * Obtiene un feature (alias semántico).
     * Equivalente a Get<TFeature>() en .NET.
     * @template TFeature
     * @param {TFeature} featureType - Tipo del feature.
     * @returns {TFeature | undefined}
     */
    getFeature(featureType) {
        return this.get(featureType);
    }

    /**
     * Establece un feature (alias semántico).
     * Equivalente a Set<TFeature>() en .NET.
     * @template TFeature
     * @param {TFeature} featureType - Tipo del feature.
     * @param {TFeature} instance - Instancia a asociar.
     */
    setFeature(featureType, instance) {
        return this.set(featureType, instance);
    }

    /**
     * Verifica si existe un feature local o heredado para la clave.
     * @template TFeature
     * @param {TFeature} featureType
     * @returns {boolean}
     */
    has(featureType) {
        if (featureType == null) {
            throw new Error('FeatureCollection: featureType no puede ser null o undefined.');
        }
        return this.#features.keys().some(key => key.__typeof === featureType.__typeof ) 
            || (this.#defaults?.keys().some(key => key.__typeof === featureType.__typeof) ?? false);
    }

    /**
     * Iterador para [for...of]: entries de [tipo, instancia].
     * 
     * @description
     * Iterador: recorre features locales (#features) y heredados (defaults) sin duplicar claves.
     * Los features locales sobrescriben a los heredados.
     * @returns {IterableIterator<[Function, T]>}
     */
    *[Symbol.iterator]() {
        const yielded = new Set();

        for (const [key, value] of this.#features.entries()) {
            yield [key, value];
            yielded.add(key);
        }

        if (this.#defaults) {
            for (const [key, value] of this.#defaults) {
                if (!yielded.has(key)) {
                    yield [key, value];
                }
            }
        }
    }
}

export default FeatureCollection;