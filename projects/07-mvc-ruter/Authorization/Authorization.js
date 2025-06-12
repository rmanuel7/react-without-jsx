import { createReactElement as h } from '../Shared/ReactFunctions.js';
import withAuthz from './withAuthz.js';
import Outlet from '../Router/Outlet.js';
import Unauthorized from './Unauthorized.js';
import Forbidden from './Forbidden.js';

/**
 * @typedef {object} AuthorizationConfig
 * @property {string} [roles] - Una cadena de roles separados por comas que el usuario debe tener.
 * @property {string} [policy] - El nombre de una política de autorización a aplicar.
 * @property {Array<object>} [claims] - Un array de objetos claim que el usuario debe poseer.
 */

/**
 * @typedef {object} AuthorizationProps
 * @property {ClaimsPrincipal} user - El objeto Principal del usuario actual, que contiene la identidad y los claims.
 * @property {object} authz - Objeto de configuración de autorización para la ruta o componente.
 * @property {'authorize'|'allowAnonymous'} authz.type - El tipo de regla de autorización a aplicar.
 * @property {AuthorizationConfig} [authz.config] - Configuración detallada para la autorización (roles, políticas, claims).
 * @property {React.ReactNode} children - Los elementos hijos que se renderizarán si la autorización es exitosa.
 */

/**
 * @class Authorization
 * @augments {React.Component<AuthorizationProps>}
 * @description Un componente de enrutamiento y seguridad que controla el acceso a rutas o componentes
 * basándose en el estado de autenticación y las reglas de autorización (roles, políticas, claims).
 *
 * Si el usuario no está autenticado o autorizado, renderiza componentes específicos de error
 * (Forbidden o Unauthorized); de lo contrario, renderiza sus hijos.
 */
class Authorization extends React.Component {
    /**
     * @private
     * @type {object}
     * @description Propiedades esperadas para el componente Authorization.
     * @see {AuthorizationProps}
     */
    props; // Solo para JSDoc, no se declara realmente en el código.

    /**
     * Renderiza los componentes hijos si el usuario está autenticado y autorizado,
     * o un componente de error (Forbidden, Unauthorized) si no cumple los requisitos.
     *
     * @returns {React.ReactElement|null} El componente `Outlet` (que renderiza los `children`)
     * si el usuario está autorizado, o un componente de error si no lo está.
     */
    render() {
        // Desestructuramos las props para facilitar el acceso
        const { user, authz, children } = this.props;

        // Utilizamos la propiedad 'type' del objeto 'authz' para determinar la lógica de autorización.
        switch (authz.type) {
            case 'authorize':
                // Si el tipo es 'authorize', procedemos a verificar la autenticación y los permisos.
                switch (true) {
                    // Caso 1: El usuario no está autenticado.
                    // Si no está autenticado, se devuelve un Forbidden (acceso denegado).
                    case (!user.identity.isAuthenticated):
                        return h({ type: Forbidden }); // O un componente de redirección a login/forbidden
                    
                    // Caso 2: El usuario está autenticado pero no autorizado según la configuración.
                    // Se llama a 'isAuthorized' para verificar roles, políticas, y claims.
                    case (!this.isAuthorized(user, authz?.config || {})):
                        return h({ type: Unauthorized }); // O un componente de redirección a unauthorized/access denied

                    // Caso 3: El usuario está autenticado y autorizado.
                    // Se permite el acceso y se renderizan los componentes hijos.
                    default:
                        // Outlet se usa aquí para renderizar los 'children' que se pasaron al componente Authorization.
                        // Si estás usando React Router, sería el componente <Outlet /> de React Router.
                        // Si no, simplemente renderiza los `children` directamente: return children;
                        return h({ type: Outlet });
                }

            // Si el tipo de authz no es 'authorize' (ej. 'allowAnonymous' o si authz.type no está definido),
            // se asume que no se requiere autorización explícita y se renderizan los hijos directamente.
            // [NOTA] Para 'allowAnonymous', la lógica de enrutamiento padre debería manejar esto,
            // y este 'default' aquí es un fallback o para casos donde no hay reglas de autorización.
            default:
                return h({ type: Outlet }); // Renderiza los hijos por defecto
        }
    }

    /**
     * Determina si un usuario está autorizado basándose en la configuración de roles, políticas y claims.
     * @param {ClaimsPrincipal} user - El objeto Principal del usuario actual.
     * @param {AuthorizationConfig} config - El objeto de configuración de autorización.
     * @returns {boolean} `true` si el usuario está autorizado; de lo contrario, `false`.
     */
    isAuthorized(user = {}, config = {}) {
        const { roles, policy, claims } = config;

        // Verificación de Roles:
        // Si 'roles' está definido en la configuración, verifica si el usuario tiene AL MENOS UNO de los roles requeridos.
        // Asume que 'user.roles' es un array de roles o que ClaimsPrincipal tiene un método 'isInRole'.
        // Aquí usamos la implementación de ClaimsPrincipal.isInRole que creamos antes.
        if (roles && !roles.split(',').some(role => user.isInRole(role.trim()))) {
             return false;
        }

        // TODO: Implementar lógica para Políticas:
        // if (policy) {
        //     // Aquí iría la lógica para evaluar una política de autorización nombrada.
        //     // Por ejemplo: return this.evaluatePolicy(user, policy);
        // }

        // TODO: Implementar lógica para Claims específicos:
        // if (claims && claims.length > 0) {
        //     // Aquí iría la lógica para verificar si el usuario tiene claims específicos
        //     // Por ejemplo: return claims.every(c => user.hasClaim(c.type, c.value));
        // }

        // Si ninguna de las comprobaciones de autorización falló, el usuario está autorizado.
        return true;
    }
}

export default withAuthz(Authorization);
