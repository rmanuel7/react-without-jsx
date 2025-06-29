import TargetFeatureCollection from './TargetFeatureCollection.js';

/**
 * FeatureReferences
 * =================
 * 
 * Maneja una colección de features con caché local y detección de cambios.
 * Simula FeatureReferences<TCache> de ASP.NET Core.
 * @template TCache
 */
class FeatureReferences {
    #collection;
    #revision;
    /** @type {TCache} */
    #cache;
    /** @type {TCache} */
    #defaultCache;

    /**
     * @param {TargetFeatureCollection} collection
     * @param {object} [defaultCache] - Objeto con claves de tipos a cachear (ej: { Authentication: undefined })
     */
    constructor(collection, defaultCache = {}) {
        if (!collection || typeof collection.revision !== 'number') {
            throw new Error('FeatureReferences: collection debe tener una propiedad "revision".');
        }

        this.#collection = collection;
        /** @type {TCache} */
        this.#cache = { ...defaultCache };
        /** @type {TCache} */
        this.#defaultCache = { ...defaultCache };
        this.#revision = collection.revision;
    }

    /**
     * Inicializa desde una colección nueva.
     * @param {TargetFeatureCollection} collection
     */
    initialize(collection) {
        this.#collection = collection;
        this.#revision = collection.revision;
        this.#cache = { ...this.#defaultCache };
    }

    /**
     * Inicializa desde una colección y una revisión conocida.
     * @param {TargetFeatureCollection} collection
     * @param {number} revision
     */
    initializeWithRevision(collection, revision) {
        this.#collection = collection;
        this.#revision = revision;
        this.#cache = { ...this.#defaultCache };
    }

    /**
     * Obtiene la colección de features actual.
     * @returns {TargetFeatureCollection}
     */
    get collection() {
        return this.#collection;
    }

    /**
     * Obtiene el número de revisión actual.
     * @returns {number}
     */
    get revision() {
        return this.#revision;
    }

    /**
     * Obtiene el último cache local (solo lectura).
     * @returns {any}
     */
    get cache() {
        return this.#cache;
    }

    /**
     * Devuelve un feature desde caché o lo obtiene/crea desde la colección.
     * @template TFeature
     * @param {TFeature | undefined} cached - referencia mutable (ej. this._feature)
     * @param {any} state - contexto que se pasa a factory
     * @param {(state: any) => TFeature} factory - creador si no existe
     * @returns {TFeature}
     */
    fetch(cached, state, factory) {
        const currentRevision = this.#collection?.revision ?? this.#contextDisposed();

        let flush = false;
        if (this.#revision !== currentRevision) {
            cached = undefined;
            flush = true;
        }

        return (
            cached ??
            this.#updateCached(cached, state, factory, currentRevision, flush)
        );
    }

    /**
     * Versión corta que pasa la colección al factory.
     * @template TFeature
     * @param {TFeature | undefined} cached
     * @param {(collection: TargetFeatureCollection) => TFeature} factory
     * @returns {TFeature}
     */
    fetchWithCollection(cached, factory) {
        return this.fetch(cached, this.#collection, factory);
    }

    /**
     * Lógica para crear, registrar y actualizar caché de un feature.
     * @private
     * @template TFeature
     * @param {TFeature | undefined} cached
     * @param {any} state
     * @param {(state: any) => TFeature} factory
     * @param {number} revision
     * @param {boolean} flush
     * @returns {TFeature}
     */
    #updateCached(cached, state, factory, revision, flush) {
        if (flush) {
            this.#cache = { ...this.#defaultCache };
        }

        cached = this.#collection.getFeature(state);
        if (!cached) {
            cached = factory(state);
            this.#collection.setFeature(cached.constructor.__typeof, cached);
            this.#revision = this.#collection.revision;
        } else if (flush) {
            this.#revision = revision;
        }

        return cached;
    }

    /**
     * Lanza error si la colección fue liberada o es inválida.
     * @private
     */
    #contextDisposed() {
        throw new Error('FeatureCollection has been disposed or is missing.');
    }
}

export default FeatureReferences;