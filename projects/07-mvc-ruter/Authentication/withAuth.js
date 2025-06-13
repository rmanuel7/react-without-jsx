import { createReactElement as h } from '../Shared/ReactFunctions.js';
import createMvcContext from '../Utils/createMvcContext.js';
import RequestContext from '../Router/RequestContext.js';
import RouterContext from '../Router/RouterContext.js';
import AuthContext from './AuthContext.js';

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
            // Se suscribe a RouterContext para obtener la información global del router.
            // RouterContext.Consumer devuelve { location: LocationInstance }
            return h({
                type: RouterContext.Consumer,
                props: {},
                children: [routerCtxValue =>
                    // Se suscribe a RequestContext para obtener la información global del request.
                    // RequestContext.Consumer devuelve RequestContextValueInstance (el objeto RequestContextValue)
                    h({
                        type: RequestContext.Consumer,
                        props: {},
                        children: [requestCtxValue =>
                            // Se suscribe a AuthContext para obtener la información global del auth.
                            h({
                                type: AuthContext.Consumer,
                                props: {},
                                children: [authCtxValue =>
                                    // El componente al que se le inyectará el contexto del auth.
                                    h({
                                        type: Component,
                                        props: {
                                            ...this.props, // Pasa todos los props originales al componente envuelto
                                            // Consolida los contextos en la prop `ctx`
                                            // Asegúrate de que createMvcContext reciba los argumentos correctos.
                                            ctx: createMvcContext({
                                                router: routerCtxValue, // Pasar el objeto completo del RouterContextValue
                                                requst: requestCtxValue, // Pasar la instancia completa de RequestContextValue,
                                                auth: authCtxValue // Inyecta el objeto 'auth' del contexto
                                            }),
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withAuth;
