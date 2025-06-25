import { ConfigurationManager } from '@spajscore/configuration';

/**
 * HostApplicationBuilderSettings
 * =============================
 * Opciones para el comportamiento de HostApplicationBuilder.
 * Inspirado en Microsoft.Extensions.Hosting.HostApplicationBuilderSettings.
 *
 * Todas las propiedades son privadas, y se exponen mediante getter/setter explícitos
 * (siguiendo el modelo mutable de .NET Core).
 *
 * @example
 * import HostApplicationBuilderSettings from './HostApplicationBuilderSettings.js';
 * const settings = new HostApplicationBuilderSettings();
 * settings.disableDefaults = true;
 * settings.environmentName = 'Development';
 * settings.applicationName = 'MyApp';
 * settings.contentRootPath = '/app';
 */
class HostApplicationBuilderSettings {
    #disableDefaults;
    #args;
    /** @type {ConfigurationManager} */
    #configuration;
    #environmentName;
    #applicationName;
    #contentRootPath;

    /**
     * Crea una nueva configuración de builder.
     * Todas las propiedades son opcionales y mutables.
     * @param {object} [options]
     * @param {boolean} [options.disableDefaults]
     * @param {string[]} [options.args]
     * @param {ConfigurationManager} [options.configuration] - ConfigurationManager compatible.
     * @param {string} [options.environmentName]
     * @param {string} [options.applicationName]
     * @param {string} [options.contentRootPath]
     */
    constructor({
        disableDefaults = false,
        args = undefined,
        configuration = undefined,
        environmentName = undefined,
        applicationName = undefined,
        contentRootPath = undefined
    } = {}) {
        this.#disableDefaults = !!disableDefaults;
        this.#args = args;
        this.#configuration = configuration;
        this.#environmentName = environmentName;
        this.#applicationName = applicationName;
        this.#contentRootPath = contentRootPath;
    }

    /**
     * Obtiene o establece si se desactivan los valores predeterminados.
     * @returns {boolean}
     */
    get disableDefaults() {
        return this.#disableDefaults;
    }
    set disableDefaults(value) {
        this.#disableDefaults = !!value;
    }

    /**
     * Obtiene o establece los argumentos de la aplicación.
     * @returns {string[]|undefined}
     */
    get args() {
        return this.#args;
    }
    set args(value) {
        this.#args = Array.isArray(value) ? value : undefined;
    }
    
    /**
     * Obtiene o establece el ConfigurationManager.
     * @returns {ConfigurationManager}
     */
    get configuration() {
        return this.#configuration;
    }
    set configuration(value) {
        this.#configuration = value;
    }

    /**
     * Obtiene o establece el nombre del entorno.
     * @returns {string}
     */
    get environmentName() {
        return this.#environmentName;
    }
    set environmentName(value) {
        this.#environmentName = value;
    }

    /**
     * Obtiene o establece el nombre de la aplicación.
     * @returns {string}
     */
    get applicationName() {
        return this.#applicationName;
    }
    set applicationName(value) {
        this.#applicationName = value;
    }

    /**
     * Obtiene o establece la ruta raíz del contenido.
     * @returns {string}
     */
    get contentRootPath() {
        return this.#contentRootPath;
    }
    set contentRootPath(value) {
        this.#contentRootPath = value;
    }
}

export default HostApplicationBuilderSettings;
