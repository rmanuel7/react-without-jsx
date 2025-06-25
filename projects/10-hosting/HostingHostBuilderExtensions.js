import { ConfigurationManager } from "@spajscore/configuration";
import { SourceConfigurationBuilderExtensions as Utils } from "@spajscore/configuration";

/**
 * HostingHostBuilderExtensions
 * ============================
 * 
 * Métodos estáticos para extender la funcionalidad de
 * HostingHostBuilder, siguiendo la convención SPA JS Core.
 * 
 * @example
 * import HostingHostBuilderExtensions from './HostingHostBuilderExtensions.js';
 * HostingHostBuilderExtensions.setDefaultContentRoot(hostConfigBuilder);
 */
class HostingHostBuilderExtensions {
    /**
     * Establece la raíz del contenido por defecto.
     * @param {ConfigurationManager} hostConfigBuilder 
     */
    static setDefaultContentRoot(hostConfigBuilder)
    {
        if (!hostConfigBuilder || !(hostConfigBuilder instanceof ConfigurationManager)) {
            throw new Error('setDefaultContentRoot: hostConfigBuilder debe ser una instancia de ConfigurationManager');
        }
        // Establece el directorio de trabajo actual como raíz del contenido
        Utils.addInMemoryCollection(hostConfigBuilder, {
            "contentRoot": './'
        });
        return hostConfigBuilder;
    }
}

export default HostingHostBuilderExtensions;
