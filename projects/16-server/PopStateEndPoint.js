import EndPoint from './EndPoint.js';

/**
 * PopStateEndPoint (SPA Core)
 * ===========================
 * Inspirado en System.Net.IPEndPoint de .NET
 * 
 * Representa un endpoint basado en el evento 'popstate' del navegador.
 * Permite identificar y comparar endpoints de tipo PopState.
 */
class PopStateEndPoint extends EndPoint {
    /**
     * @param {string} [basePath='/'] - Ruta base que delimita el alcance del endpoint.
     */
    constructor(basePath = '/') {
        super();
        this._basePath = basePath;
    }

    /**
     * Devuelve la familia de endpoint.
     * @returns {string}
     */
    get addressFamily() {
        return 'PopState';
    }

    /**
     * Obtiene la ruta base asociada a este endpoint.
     * @returns {string}
     */
    get basePath() {
        return this._basePath;
    }

    /**
     * Serializa la información del endpoint a un objeto simple.
     * @returns {{ type: string, basePath: string }}
     */
    serialize() {
        return {
            type: 'PopState',
            basePath: this._basePath
        };
    }

    /**
     * Crea una instancia de PopStateEndPoint desde un objeto serializado.
     * @param {{ basePath: string }} data
     * @returns {PopStateEndPoint}
     */
    static create(data) {
        return new PopStateEndPoint(data.basePath || '/');
    }

    /**
     * Compara este endpoint con otro para igualdad estructural.
     * @param {any} other
     * @returns {boolean}
     */
    equals(other) {
        return other instanceof PopStateEndPoint && other.basePath === this._basePath;
    }

    /**
     * Representación string estándar para logging.
     * @returns {string}
     */
    toString() {
        return `popstate://${this._basePath}`;
    }
}

export default PopStateEndPoint;
