import AuthzContext from './AuthzContext.js';
import AuthContext from '../Authentication/AuthContext.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * Higher-Order Component (HOC) que inyecta los contextos de autenticación y autorización
 * (`AuthContext` y `AuthzContext`) en las props del componente envuelto.
 *
 * Este HOC es útil para componentes que necesitan acceder tanto a la información
 * de autenticación del usuario (`user`) como a las configuraciones de autorización (`authz`)
 * proporcionadas por los respectivos contextos.
 *
 * @param {React.ComponentType} Component - El componente de React a envolver.
 * @returns {React.ComponentType} Un nuevo componente de React (`AuthzConsumer`)
 * que proporciona los contextos de autenticación y autorización al `Component` envuelto.
 */
function withAuthz(Component) {
    /**
     * @class AuthzConsumer
     * @augments {React.Component}
     * @description Componente envoltorio que consume el `AuthContext` y el `AuthzContext`
     * anidados, pasando sus valores (`user` y `authz` respectivamente) como props
     * al `Component` envuelto.
     * @private
     */
    return class AuthzConsumer extends React.Component {
        /**
         * Renderiza el componente envuelto, inyectando los valores de `AuthContext`
         * y `AuthzContext`.
         *
         * @returns {React.ReactElement} El componente `Component` renderizado
         * con las props existentes, la prop `authz` (del AuthzContext) y la prop `user`
         * (del AuthContext).
         */
        render() {
            return h({
                type: AuthContext.Consumer,
                props: {},
                children: [auth =>
                    h({
                        type: AuthzContext.Consumer,
                        props: {},
                        children: [authz =>
                            h({
                                type: Component,
                                props: {
                                    ...this.props, // Pasa todas las props originales al componente
                                    authz, // Inyecta el objeto completo del AuthzContext
                                    user: auth.user // Asumimos que 'auth' tiene una propiedad 'principal' que es tu ClaimsPrincipal
                                }
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withAuthz;
