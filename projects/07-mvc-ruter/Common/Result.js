import ResultError from './ResultError.js';

/**
 * @class Result
 * @template T
 * @description Clase que representa el resultado de una operación,
 * que puede ser un éxito con un valor o una falla con un error.
 */
class Result {
    /**
     * @private
     * @type {T|undefined}
     * @description El valor en caso de éxito. Es `undefined` en caso de falla.
     */
    #value;

    /**
     * @private
     * @type {ResultError|undefined}
     * @description El objeto de error en caso de falla. Es `undefined` en caso de éxito.
     */
    #error;

    /**
     * @private
     * @type {boolean}
     * @description Indica si el resultado es un éxito.
     */
    #isSuccess;

    /**
     * Constructor privado para forzar el uso de los métodos estáticos `success` y `failure`.
     * @param {T|undefined} value - El valor del resultado si es exitoso.
     * @param {ResultError|undefined} error - El error del resultado si es fallido.
     * @param {boolean} isSuccess - Indica si el resultado es exitoso.
     */
    constructor(value, error, isSuccess) {
        if (isSuccess && error) {
            throw new Error("Un resultado exitoso no puede tener un error.");
        }
        if (!isSuccess && value !== undefined) {
            throw new Error("Un resultado fallido no puede tener un valor.");
        }

        this.#value = value;
        this.#error = error;
        this.#isSuccess = isSuccess;
    }

    /**
     * Crea una instancia de `Result` que representa un éxito.
     * @template T
     * @param {T} value - El valor que se devuelve en caso de éxito.
     * @returns {Result<T>} Una nueva instancia de `Result` en estado de éxito.
     */
    static success(value) {
        return new Result(value, undefined, true);
    }

    /**
     * Crea una instancia de `Result` que representa una falla.
     * @template T
     * @param {ResultError} error - El objeto `ResultError` que describe la falla.
     * @returns {Result<T>} Una nueva instancia de `Result` en estado de falla.
     */
    static failure(error) {
        return new Result(undefined, error, false);
    }

    /**
     * Ejecuta una función según el estado del resultado.
     * 
     * @param {function(any): any} onSuccess - Función a ejecutar si el resultado es exitoso.
     * @param {function(ResultError): any} onFailure - Función a ejecutar si el resultado es fallido.
     * @returns {any} - Retorno de la función ejecutada.
     */
    switch(onSuccess, onFailure) {
        return this.#isSuccess
            ? onSuccess(this.#value)
            : onFailure(this.#error);
    }
    
    async switchAsync(onSuccess, onFailure) {
        return this.#isSuccess
            ? await onSuccess(this.#value)
            : await onFailure(this.#error);
    }
    
    /**
     * Método encadena una llamada a un función.
     * 
     * @param {Function} func - Función a encadenar.
     * @returns {Result}
     */
    select(func) {
        return this.#isSuccess
            ? func(this.#value)
            : this;
    }
    
    /**
     *  Método encadena una llamada a un función.
     * 
     * @param {Function} func - Función a encadenar.
     * @returns {Promise<Result>}
     */
    async selectAsync(func) {
        return this.#isSuccess
            ? func(this.#value)
            : this;
    }
    
    /**
     * Método permite encadenar operaciones que pueden fallar, 
     * permitiendo que el flujo de errores se propague automáticamente.
     * 
     * @param {Function} selector - Función que recibe el valor exitoso actual y retorna un nuevo resultado.
     *                              Si el resultado actual es un error, esta función no se ejecuta.
     * @param {Function} resultSelector - Función que combina el valor exitoso original 
     *                                    y el valor exitoso intermedio para producir el valor final 
     * @returns {Result} - Un nuevo resultado que representa el exito o fallo.
     */
    selectMany(selector, resultSelector) {
        if (this.#isSuccess) {
            const intermediateResult = selector(this.#value);
    
            return intermediateResult.switch(
                // Si el resultado intermedio es exitoso, aplica el resultSelector
                (middleValue) => Result.success(resultSelector(this.#value, middleValue)),
                // Si el resultado intermedio falla, propaga su error
                (error) => Result.failure(error)
            );
        } else {
            // Si el Result original falla, propaga su propio error
            return this;
        }
    }
}

export default Result;
