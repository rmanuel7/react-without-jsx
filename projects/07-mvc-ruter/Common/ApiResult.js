import Result from './Result.js';
import ResultError from './ResultError.js';

/**
 * @class ApiResult
 * @description Clase de utilidad estática que proporciona métodos para crear
 * respuestas API estandarizadas usando el patrón `Result<T>`.
 * Cada método corresponde a un estado HTTP común o un tipo de error específico.
 */
class ApiResult {
    /**
     * Crea un `Result` exitoso con un valor.
     * @template T
     * @param {T} value - El valor a devolver.
     * @returns {Result<T>} Un `Result` exitoso.
     */
    static ok(value) {
        return Result.success(value);
    }

    /**
     * Crea un `Result` exitoso con un valor, específicamente para una creación (201 Created).
     * @template T
     * @param {T} value - El valor a devolver.
     * @returns {Result<T>} Un `Result` exitoso.
     */
    static created(value) {
        return Result.success(value);
    }

    /**
     * Crea un `Result` exitoso sin contenido (204 No Content).
     * El valor por defecto de `T` se usa para la consistencia del tipo.
     * @template T
     * @returns {Result<T>} Un `Result` exitoso sin valor explícito.
     */
    static noContent() {
        // En JS, 'default(T)' no existe. Retornamos success con undefined,
        // o si prefieres, con null para mayor intencionalidad en este caso.
        return Result.success(undefined);
    }

    /**
     * Crea un `Result` de falla para una solicitud incorrecta (400 Bad Request).
     * @template T
     * @param {string} message - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Bad Request.
     */
    static badRequest(message, errorDetails = null) {
        return Result.failure(new ResultError(400, 'BadRequest', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para una solicitud no autorizada (401 Unauthorized).
     * @template T
     * @param {string} [message="No autorizado. Se requiere autenticación."] - El mensaje de error.
     * @returns {Result<T>} Un `Result` fallido con el error Unauthorized.
     */
    static unauthorized(message = "No autorizado. Se requiere autenticación.") {
        return Result.failure(new ResultError(401, 'Unauthorized', message));
    }

    /**
     * Crea un `Result` de falla para una solicitud prohibida (403 Forbidden).
     * @template T
     * @param {string} [message="Acceso prohibido. No tiene permisos para este recurso."] - El mensaje de error.
     * @returns {Result<T>} Un `Result` fallido con el error Forbidden.
     */
    static forbidden(message = "Acceso prohibido. No tiene permisos para este recurso.") {
        return Result.failure(new ResultError(403, 'Forbidden', message));
    }

    /**
     * Crea un `Result` de falla para un recurso no encontrado (404 Not Found).
     * @template T
     * @param {string} [message="El servidor no pudo encontrar el recurso solicitado."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Not Found.
     */
    static notFound(message = "El servidor no pudo encontrar el recurso solicitado.", errorDetails = null) {
        return Result.failure(new ResultError(404, 'NotFound', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para un conflicto de recurso (409 Conflict).
     * @template T
     * @param {string} [message="La solicitud no pudo ser completada debido a un conflicto con el estado actual del recurso."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Conflict.
     */
    static conflict(message = "La solicitud no pudo ser completada debido a un conflicto con el estado actual del recurso.", errorDetails = null) {
        return Result.failure(new ResultError(409, 'Conflict', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para un error interno del servidor (500 Internal Server Error).
     * @template T
     * @param {string} [message="Error interno del servidor"] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Internal Server Error.
     */
    static internalError(message = "Error interno del servidor", errorDetails = null) {
        return Result.failure(new ResultError(500, 'InternalError', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para un servicio no disponible (503 Service Unavailable).
     * @template T
     * @param {string} [message="El servidor no está listo para manejar la solicitud."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Service Unavailable.
     */
    static serviceUnavailable(message = "El servidor no está listo para manejar la solicitud.", errorDetails = null) {
        return Result.failure(new ResultError(503, 'ServiceUnavailable', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para un error de conexión con un servidor externo (503 Service Unavailable).
     * @template T
     * @param {string} [message="Error de conexión con el servidor externo."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Connection Error.
     */
    static connectionError(message = "Error de conexión con el servidor externo.", errorDetails = null) {
        return Result.failure(new ResultError(503, 'ConnectionError', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para un tiempo de espera agotado (408 Request Timeout).
     * @template T
     * @param {string} [message="La solicitud excedió el tiempo de espera."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Timeout.
     */
    static timeout(message = "La solicitud excedió el tiempo de espera.", errorDetails = null) {
        return Result.failure(new ResultError(408, 'Timeout', errorDetails ?? message));
    }

    /**
     * Crea un `Result` de falla para una solicitud cancelada (499 Client Closed Request).
     * Nota: 499 no es un código HTTP estándar, pero es comúnmente usado para cancelaciones del cliente.
     * @template T
     * @param {string} [message="La solicitud fue cancelada."] - El mensaje de error.
     * @param {object} [errorDetails=null] - Detalles adicionales del error.
     * @returns {Result<T>} Un `Result` fallido con el error Canceled.
     */
    static canceled(message = "La solicitud fue cancelada.", errorDetails = null) {
        return Result.failure(new ResultError(499, 'Canceled', errorDetails ?? message));
    }
}

export default ApiResult;
