/**
 * HostDefaults
 * ============
 * 
 * Esta clase define las claves por defecto que se utilizan en la configuración del host.
 * Estas claves son utilizadas para establecer valores predeterminados en la configuración del host,
 * como el nombre de la aplicación, el entorno y la raíz del contenido.
 * @example
 * import { HostDefaults } from '@spajscore/hosting';
 * import { ConfigurationManager } from '@spajscore/configuration';
 * import { default as Utils } from '@spajscore/configuration-source';
 * const config = new ConfigurationManager();
 * Utils.addInMemoryCollection(config, {
 *     [HostDefaults.applicationKey]: "MiAplicacion",
 *     [HostDefaults.environmentKey]: "Desarrollo",
 *     [HostDefaults.contentRootKey]: "/ruta/al/contenido"
 * });
 */
class HostDefaults
{
    /**
     * Clave de configuración para el nombre de la aplicación.
     * @type {string}
     */
    static applicationKey = "applicationName";

    /**
     * Clave de configuración para el nombre del entorno.
     * @type {string}
     */
    static environmentKey = "environment";

    /**
     * Clave de configuración para la raíz del contenido.
     * @type {string}
     */
    static contentRootKey = "contentRoot";
}

export default HostDefaults;
