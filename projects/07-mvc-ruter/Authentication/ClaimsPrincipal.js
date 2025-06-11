/**
 * @typedef {object} Claim
 * @property {string} type - El tipo de la afirmación (ej. 'role', 'name', 'email').
 * @property {string} value - El valor de la afirmación (ej. 'admin', 'Juan Perez', 'juan@example.com').
 */

/**
 * @class ClaimsPrincipal
 * @augments Principal
 * @description Representa al poseedor de una identidad que también posee una colección de afirmaciones (claims).
 * Las afirmaciones proporcionan información adicional sobre la identidad.
 */
class ClaimsPrincipal extends Principal {
    /**
     * @private
     * @type {Claim[]}
     * @description Una colección de afirmaciones asociadas con este principal.
     */
    #claims;

    /**
     * Crea una instancia de ClaimsPrincipal.
     * @param {Identity} identity - La identidad asociada a este principal.
     * @param {Claim[]} [claims=[]] - Un array de afirmaciones asociadas con la identidad.
     */
    constructor(identity, claims = []) {
        super(identity); // Llama al constructor de la clase base (Principal)
        this.#claims = claims;
    }

    /**
     * Obtiene todas las afirmaciones asociadas con este ClaimsPrincipal.
     * @returns {Claim[]} Un array de objetos Claim.
     */
    get claims() {
        // Devolvemos una copia para evitar modificaciones externas del array original.
        return [...this.#claims];
    }

    /**
     * Busca la primera afirmación con el tipo especificado.
     * @param {string} claimType - El tipo de afirmación a buscar.
     * @returns {Claim | undefined} La primera afirmación encontrada, o `undefined` si no se encuentra ninguna.
     */
    findFirst(claimType) {
        return this.#claims.find(claim => claim.type === claimType);
    }

    /**
     * Busca todas las afirmaciones con el tipo especificado.
     * @param {string} claimType - El tipo de afirmación a buscar.
     * @returns {Claim[]} Un array de afirmaciones que coinciden con el tipo.
     */
    findAll(claimType) {
        return this.#claims.filter(claim => claim.type === claimType);
    }

    /**
     * Comprueba si este principal tiene un claim con el tipo y valor especificados.
     * @param {string} claimType - El tipo de afirmación a buscar.
     * @param {string} claimValue - El valor de la afirmación a buscar.
     * @returns {boolean} `true` si el claim existe; de lo contrario, `false`.
     */
    hasClaim(claimType, claimValue) {
        return this.#claims.some(claim => claim.type === claimType && claim.value === claimValue);
    }

    /**
     * Comprueba si este principal está en un rol específico (usando un claim de tipo 'role').
     * @param {string} roleName - El nombre del rol a verificar.
     * @returns {boolean} `true` si el principal tiene el rol; de lo contrario, `false`.
     */
    isInRole(roleName) {
        return this.hasClaim('role', roleName);
    }
}

export default ClaimsPrincipal;
