import LoggingSymbols from './internal/LoggingSymbols.js';
import Logger from './Logger.js';

/**
 * LoggerTemplate
 * ==============
 * 
 * Clase generadora para `ILogger<T>` (logger tipado por clase o contrato).
 * Permite inyectar un logger específico para cada tipo T.
 *
 * @example
 * import LoggerTemplate from './LoggerTemplate.js';
 * const LoggerForFoo = LoggerTemplate.forType(FooService);
 * const logger = new LoggerForFoo(); // o inyectado por DI
 * logger.info('Mensaje para FooService');
 */
class LoggerTemplate {
    constructor() {
        throw new Error('No se debe instanciar LoggerTemplate directamente. Usa forType(T).');
    }

    /**
     * Devuelve una clase logger concreta asociada a T.
     * @param {Function} elementClass - Clase o contrato a loggear (T)
     * @returns {Function} Clase concreta inyectable como ILogger<T>
     */
    static forType(elementClass) {
        if (!elementClass || typeof elementClass !== 'function' || !elementClass.prototype) {
            throw new TypeError('forType: elementClass debe ser una clase/constructor.');
        }
        if (typeof elementClass.__typeof !== 'symbol') {
            throw new Error('forType: elementClass debe definir static get __typeof().');
        }
        
        class ILogger extends Logger {
            /**
             * Símbolo único para ILogger<T>.
             * @returns {symbol}
             */
            static get __typeof() {
                // Siempre usar forType helper y el símbolo abierto
                return LoggingSymbols.forType(elementClass, LoggingSymbols.logger);
            }

            /**
             * Metadatos de DI: inyecta el logger base, expone como ILogger<T>
             * @returns {object}
             */
            static get __metadata() {
                return {
                    parameters: [elementClass],
                    properties: {},
                    inject: {} // Puedes inyectar dependencias si tu Logger base las requiere
                };
            }

            /**
             * @param {object} deps
             * @param {string} [deps.category]
             */
            constructor(deps = {}) {
                // El category por convención es el nombre del tipo T
                super({
                    ...deps,
                    category: Symbol.keyFor(elementClass.__typeof) || elementClass.name || 'Unknown'
                });
            }
        }
        
        return ILogger;
    }
}

export default LoggerTemplate;
