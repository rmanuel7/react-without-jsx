import LoggingSymbols from './internal/LoggingSymbols';

/**
 * Logger
 * ======
 * 
 * Servicio de logging genérico inspirado en ILogger<T> de .NET Core.
 *
 * Permite registrar mensajes en distintos niveles y categorías para diagnóstico y monitoreo.
 *
 * @example
 * import Logger from './Logger.js';
 * const logger = new Logger({ category: 'App' });
 * logger.info('Iniciando aplicación...');
 * logger.error('Ocurrió un error grave', { ex: new Error('Oops!') });
 */
class Logger {
    /**
     * Identificador simbólico para DI.
     * @returns {symbol}
     */
    static get __typeof() {
        return LoggingSymbols.logger;
    }

    /**
     * Metadatos para inyección de dependencias.
     * @returns {object}
     */
    static get __metadata() {
        return {
            provides: [this.__typeof],
            inject: {
                // Puede inyectar un proveedor de transporte/logging externo si aplica.
            }
        };
    }

    /** @type {string} */ #category;

    /**
     * Crea un logger asociado a una categoría o contexto.
     * @param {object} deps
     * @param {string} [deps.category] - Nombre de la categoría o contexto del logger.
     */
    constructor({ category = 'General' } = {}) {
        this.#category = category;
    }

    /**
     * Obtiene la categoría del logger.
     * @returns {string}
     */
    get category() {
        return this.#category;
    }

    /**
     * Registra un mensaje de información.
     * @param {string} message
     * @param {object} [meta]
     */
    info(message, meta = {}) {
        this.#write('INFO', message, meta);
    }

    /**
     * Registra un mensaje de advertencia.
     * @param {string} message
     * @param {object} [meta]
     */
    warn(message, meta = {}) {
        this.#write('WARN', message, meta);
    }

    /**
     * Registra un mensaje de error.
     * @param {string} message
     * @param {object} [meta]
     */
    error(message, meta = {}) {
        this.#write('ERROR', message, meta);
    }

    /**
     * Registra un mensaje de depuración.
     * @param {string} message
     * @param {object} [meta]
     */
    debug(message, meta = {}) {
        this.#write('DEBUG', message, meta);
    }

    /**
     * Método interno para escribir el log formateado.
     * @param {string} level
     * @param {string} message
     * @param {object} meta
     * @private
     */
    #write(level, message, meta) {
        const prefix = `[${level}] [${this.#category}]`;
        if (Object.keys(meta).length > 0) {
            // eslint-disable-next-line no-console
            console.log(prefix, message, meta);
        } else {
            // eslint-disable-next-line no-console
            console.log(prefix, message);
        }
    }
}

export default Logger;
