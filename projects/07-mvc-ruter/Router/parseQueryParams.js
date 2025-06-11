/**
 * Parsea los parámetros de consulta (query string) de una URL.
 * Ej: "?name=John&age=30" -> { name: "John", age: "30" }
 *
 * @param {string} queryString - La cadena de consulta, incluyendo el '?'.
 * @returns {object} - Un objeto con los parámetros de consulta.
 */
function parseQueryParams(queryString) {
    const params = {};
    if (!queryString) {
        return params;
    }
    // Eliminar el '?' inicial si existe
    const cleanQueryString = queryString.startsWith('?') ? queryString.substring(1) : queryString;

    cleanQueryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            // Decodificar los componentes para manejar espacios y caracteres especiales
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    });
    return params;
};

export default parseQueryParams;
