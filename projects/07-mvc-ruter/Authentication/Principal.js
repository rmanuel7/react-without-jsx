/**
 * @class Principal
 * @description Representa al poseedor de una identidad, típicamente un usuario autenticado.
 * Encapsula la información de la identidad y proporciona un punto central para acceder a ella.
 */
class Principal {
    /**
     * @private
     * @type {Identity}
     * @description La identidad asociada a este Principal.
     */
    #identity;

    /**
     * Crea una instancia de Principal.
     * @param {Identity} identity - La identidad asociada a este principal.
     */
    constructor(identity) {
        if (!(identity instanceof Identity)) {
            throw new Error("Principal must be initialized with an instance of Identity.");
        }
        this.#identity = identity;
        // Los roles se manejarán en la clase descendiente ApplicationUser,
        // pero Principal define el método.
    }

    /**
     * @returns {Identity} La identidad del principal.
     */
    get identity() {
        return this.#identity;
    }

    /**
     * Verifica si el principal está en un rol específico.
     * Este método debe ser sobrescrito por clases derivadas (como ApplicationUser).
     * @param {string} role - El nombre del rol a verificar.
     * @returns {boolean} True si el principal está en el rol; de lo contrario, false.
     */
    isInRole(role) {
        // En una implementación básica de Principal, no podemos saber los roles.
        // Esto es un placeholder para que ApplicationUser lo implemente.
        console.warn("IsInRole method not implemented for generic Principal. Implement in ApplicationUser.");
        return false;
    }
}

export default Principal;
