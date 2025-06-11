/**
 * Normaliza la ruta, evitando errores de comparación por '/' en finales innecesarios.
 * 
 * Asegura que todas las rutas: Empiecen con '/' y no terminen con '/' (excepto '/' en sí), y que no tengan '//' duplicados
 * @param {string} path - Ruta
 * @returns {string} - Ruta normalizada
 */
function normalizePath(path) {
    if (!path) return '/';

    const startNormalized = ('/' + path);
    const duplicateNormalized = startNormalized.replace(/\/+/g, '/');
    const endNormalized = duplicateNormalized.replace(/\/$/, '');
        
    return endNormalized || '/';
}

export default normalizePath;
