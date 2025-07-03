/**
 * EndPoint (SPA Core)
 * ===================
 * Inspirado en System.Net.EndPoint de .NET
 * 
 * Clase base abstracta para identificar un "destino" de conexión/navegación en SPA.
 * Sus derivados pueden ser PopStateEndPoint, HashChangeEndPoint, etc.
 */
class EndPoint {
    /**
     * Devuelve la familia de dirección a la que pertenece este EndPoint.
     * (Ejemplo: 'PopState', 'HashChange', etc.)
     * En la clase base lanza por defecto (debe ser implementado).
     * @returns {string}
     */
    get addressFamily() {
        throw new Error('EndPoint: addressFamily must be implemented by subclasses.');
    }

    /**
     * Serializa la información del EndPoint a un objeto simple.
     * En la clase base lanza por defecto (debe ser implementado).
     * @returns {object}
     */
    serialize() {
        throw new Error('EndPoint: serialize() must be implemented by subclasses.');
    }

    /**
     * Crea una instancia de EndPoint desde un objeto serializado.
     * En la clase base lanza por defecto (debe ser implementado).
     * @param {object} data
     * @returns {EndPoint}
     */
    static create(data) {
        throw new Error('EndPoint: create() must be implemented by subclasses.');
    }

    /**
     * Comparación estructural.
     * Por defecto compara referencia.
     * Las subclases deberían redefinir según su semántica.
     * @param {any} other
     * @returns {boolean}
     */
    equals(other) {
        return this === other;
    }

    /**
     * Representación string estándar para logging.
     * Las subclases deben redefinir para mayor detalle.
     * @returns {string}
     */
    toString() {
        return '[EndPoint]';
    }
}

export default EndPoint;
