/**
 * ConfigurationSource
 * ===================
 * 
 * Interfaz base para fuentes de configuración.
 * Inspirada en Microsoft.Extensions.Configuration.IConfigurationSource.
 * 
 * Una fuente de configuración es responsable de crear y devolver un ConfigurationProvider
 * que será usado por el ConfigurationManager para acceder a los valores de configuración.
 * 
 * Ejemplos de implementaciones:
 * - MemoryConfigurationSource
 * - JsonConfigurationSource
 * - EnvConfigurationSource
 * 
 * Cada fuente debe implementar el método build(configurationBuilder), que devuelve
 * una instancia de ConfigurationProvider.
 */
class ConfigurationSource {
    /**
     * Crea y devuelve un ConfigurationProvider para esta fuente.
     * @param {object} configurationBuilder - Instancia del ConfigurationManager o builder.
     * @returns {ConfigurationProvider}
     * @abstract
     */
    build(configurationBuilder) {
        throw new Error('ConfigurationSource.build debe ser implementado por subclases');
    }
}

export default ConfigurationSource;