/**
 * Determina si dos valores son primitivos, del mismo tipo y si son iguales.
 *
 * @param {any} val1 - Primer valor.
 * @param {any} val2 - Segundo valor.
 * @returns {{
 *   isPrimitive1: boolean,
 *   isPrimitive2: boolean,
 *   sameType: boolean,
 *   sameValue: boolean,
 *   result: boolean
 * }}
 */
function primitiveCompare(val1, val2) {
    const isPrimitive = val =>
        val === null || (typeof val !== 'object' && typeof val !== 'function');

    const isPrimitive1 = isPrimitive(val1);
    const isPrimitive2 = isPrimitive(val2);
    const sameType = typeof val1 === typeof val2;
    const sameValue = Object.is(val1, val2);

    return {
        isPrimitive1,
        isPrimitive2,
        sameType,
        sameValue,
        result: isPrimitive1 && isPrimitive2 && sameType && sameValue
    };
}

export const primitiveCompare;
