/**
 * Compara una URL con un patrón de ruta (que puede incluir parámetros dinámicos como ":id").
 * Extrae los parámetros de la URL y los devuelve.
 *
 * @param {string} pattern - El patrón de ruta, ej. "/users/:id", "/products/:category/:productId".
 * @param {string} path - La URL real a comparar, ej. "/users/123", "/products/electronics/abc".
 * @returns {object | null} - Un objeto con los parámetros extraídos si hay una coincidencia,
 * o `null` si no hay coincidencia.
 * Ej: { id: "123" } o { category: "electronics", productId: "abc" }.
 */
function matchPath(pattern, path) {
    // Escapar caracteres especiales en el patrón para la expresión regular,
    // pero mantener los dos puntos para los parámetros.
    const escapedPattern = pattern.replace(/\//g, '\\/').replace(/:([a-zA-Z0-9_]+)/g, '([^\\/]+)');

    // Crear la expresión regular. El '^' y '$' aseguran una coincidencia exacta de la ruta.
    const regex = new RegExp(`^${escapedPattern}$`);
    const match = path.match(regex);

    if (!match) {
        return null; // No hay coincidencia
    }

    // Extraer los nombres de los parámetros del patrón
    const paramNames = (pattern.match(/:([a-zA-Z0-9_]+)/g) || []).map(param => param.substring(1));

    // Mapear los valores capturados por la expresión regular a los nombres de los parámetros
    // match[0] es la coincidencia completa, los demás son los grupos de captura.
    const params = {};
    for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = match[i + 1];
    }

    return params;
}

export default matchPath;
