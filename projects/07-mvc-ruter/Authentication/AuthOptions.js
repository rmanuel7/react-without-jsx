/**
 * @typedef {object} AuthOptionsConfig
 * @property {string} loginPath - La ruta para la página de inicio de sesión.
 * @property {string} accessDeniedPath - La ruta para la página de acceso denegado.
 * @property {string} logoutPath - La ruta para la página de cierre de sesión.
 * @property {string} validatePath - La ruta para la validación de token.
 * @property {string} refreshPath - La ruta para la actualización de token.
 */

/**
 * @type {AuthOptionsConfig}
 * @description Configuración predeterminada para las opciones de autenticación.
 */
const defaultAuthOptions = {
    loginPath: '/Account/Login',
    accessDeniedPath: '/Account/Unauthorize',
    logoutPath: '/Account/Logout',
    validatePath: '/Account/Validate',
    refreshPath: '/Account/Refresh',
};

/**
 * @class AuthOptions
 * @description Representa las opciones de configuración para la autenticación.
 * Proporciona acceso de solo lectura a las rutas de autenticación.
 */
class AuthOptions {
    /**
     * @private
     * @type {string}
     * @description Ruta para la página de inicio de sesión.
     */
    #loginPath;

    /**
     * @private
     * @type {string}
     * @description Ruta para la página de acceso denegado.
     */
    #accessDeniedPath;

    /**
     * @private
     * @type {string}
     * @description Ruta para la página de cierre de sesión.
     */
    #logoutPath;

    /**
     * @private
     * @type {string}
     * @description Ruta para la validación de token.
     */
    #validatePath;

    /**
     * @private
     * @type {string}
     * @description Ruta para la actualización de token.
     */
    #refreshPath;

    /**
     * Crea una instancia de AuthOptions.
     * @param {AuthOptionsConfig} [options=defaultAuthOptions] - Las opciones de autenticación.
     */
    constructor(options = defaultAuthOptions) {
        this.#loginPath = options.loginPath;
        this.#accessDeniedPath = options.accessDeniedPath;
        this.#logoutPath = options.logoutPath;
        this.#validatePath = options.validatePath;
        this.#refreshPath = options.refreshPath;
    }

    /**
     * Obtiene la ruta para la página de inicio de sesión.
     * @returns {string} La ruta de inicio de sesión.
     */
    get loginPath() {
        return this.#loginPath;
    }

    /**
     * Obtiene la ruta para la página de acceso denegado.
     * @returns {string} La ruta de acceso denegado.
     */
    get accessDeniedPath() {
        return this.#accessDeniedPath;
    }

    /**
     * Obtiene la ruta para la página de cierre de sesión.
     * @returns {string} La ruta de cierre de sesión.
     */
    get logoutPath() {
        return this.#logoutPath;
    }

    /**
     * Obtiene la ruta para la validación de token.
     * @returns {string} La ruta de validación de token.
     */
    get validatePath() {
        return this.#validatePath;
    }

    /**
     * Obtiene la ruta para la actualización de token.
     * @returns {string} La ruta de actualización de token.
     */
    get refreshPath() {
        return this.#refreshPath;
    }
}

export default AuthOptions;
