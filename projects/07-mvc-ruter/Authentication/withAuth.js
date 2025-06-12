import AuthContext from './AuthContext.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * @typedef {object} AuthContextProps
 * @property {object} auth - El objeto de autenticación proporcionado por AuthContext.
 * Contiene propiedades como isAuthenticated, identity, claims, etc.
 */

/**
 * Un componente de orden superior (HOC) que inyecta el contexto de autenticación
 * en los props del componente envuelto.
 *
 * Este HOC es útil para proporcionar acceso al estado de autenticación (auth)
 * a cualquier componente que lo necesite, sin la necesidad de pasar los props
 * manualmente a través de múltiples niveles del árbol de componentes.
 *
 * @param {React.ComponentType<any>} Component - El componente React que se va a envolver.
 * Este componente recibirá un prop `auth` que contendrá el valor del `AuthContext`.
 * @returns {React.ComponentType<React.ComponentProps<typeof Component> & AuthContextProps>}
 * Un nuevo componente que renderiza el `Component` original con el prop `auth` inyectado.
 */
function withAuth(Component) {
    /**
     * @class AuthConsumer
     * @augments {React.Component}
     * @description Un componente intermedio que consume el AuthContext y pasa el valor
     * de autenticación al componente envuelto.
     */
    return class AuthConsumer extends React.Component {
        /**
         * Renderiza el componente envuelto, inyectando el valor del AuthContext como un prop 'auth'.
         * @returns {React.ReactElement} El componente envuelto con el prop 'auth'.
         */
        render() {
            return h({
                type: AuthContext.Consumer,
                props: { },
                children: [
                    auth => h({
                        type: Component,
                        props: {
                            ...this.props, // Pasa todos los props originales al componente envuelto
                            auth: auth    // Inyecta el objeto 'auth' del contexto
                        }
                    })
                ]
            });
        }
    };
}

export default withAuth;
