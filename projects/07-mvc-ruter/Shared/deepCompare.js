import primitiveCompare from './primitiveCompare.js';

/**
 * Compara dos valores (objetos, arrays o primitivos) en profundidad para determinar si son diferentes.
 * Esta función es recursiva, lo que significa que puede comparar objetos anidados y arrays.
 *
 * @param {any} val1 - El primer valor a comparar.
 * @param {any} val2 - El segundo valor a comparar.
 * @returns {boolean} - Retorna `true` si los valores son diferentes, `false` si son iguales.
 */
function deepCompare(val1, val2) {
    // Caso base 0: Si ambos son primitivos, verifica si son del mismo tipo y valor
    const primitiveCheck = primitiveCompare(val1, val2);
    if (primitiveCheck.isPrimitive1 && primitiveCheck.isPrimitive2) {
        return !primitiveCheck.result; // Diferentes si no son exactamente iguales
    }

    // Caso base 1: Si los valores son idénticos (referencia o primitivos iguales)
    if (val1 === val2) {
        return false; // Son iguales, no hay necesidad de actualizar
    }

    // Caso base 2: Si uno es null/undefined y el otro no (o ambos son null/undefined, que ya cubre val1 === val2)
    if (val1 === null || val1 === undefined || val2 === null || val2 === undefined) {
        // Si no son estrictamente iguales (cubierto por val1 === val2) y uno es null/undefined,
        // significa que uno de ellos es null/undefined y el otro es un valor diferente.
        return true; // Son diferentes, necesita actualizar
    }

    // Caso 3: Si son de tipos diferentes (excluyendo null/undefined que ya se manejó)
    if (typeof val1 !== typeof val2) {
        return true; // Son de tipos diferentes, necesita actualizar
    }

    // Caso 4: Si ambos son objetos (pero no null, ya que eso se manejó)
    if (typeof val1 === 'object') {
        const isArray1 = Array.isArray(val1);
        const isArray2 = Array.isArray(val2);

        // Si uno es array y el otro no
        if (isArray1 !== isArray2) {
            return true; // Son diferentes (uno es array, el otro no), necesita actualizar
        }

        // Si ambos son arrays
        if (isArray1) {
            if (val1.length !== val2.length) {
                return true; // Tienen diferente longitud, necesita actualizar
            }
            // Compara cada elemento del array recursivamente
            for (let i = 0; i < val1.length; i++) {
                if (deepCompare(val1[i], val2[i])) {
                    return true; // Si algún elemento es diferente, necesita actualizar
                }
            }
        }
        // Si ambos son objetos (o ambos arrays después de comparar sus elementos)
        else {
            const keys1 = Object.keys(val1);
            const keys2 = Object.keys(val2);

            if (keys1.length !== keys2.length) {
                return true; // Tienen diferente número de claves, necesita actualizar
            }

            // Compara cada propiedad del objeto recursivamente
            for (let i = 0; i < keys1.length; i++) {
                const key = keys1[i];
                // Si la clave no existe en el segundo objeto o si el valor de la clave es diferente
                if (!keys2.includes(key) || deepCompare(val1[key], val2[key])) {
                    return true; // Necesita actualizar
                }
            }
        }
    }

    // Si llegamos hasta aquí, los valores son iguales (o al menos no hay diferencias profundas detectadas)
    return false; // No hay diferencias, no necesita actualizar
}

export default deepCompare;
