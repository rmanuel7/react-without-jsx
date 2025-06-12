import AuthContext from '../Authentication/AuthContext.js';
import RouterContext from '../Router/RouterContext.js';
import { MVCROUTER_VIEW_TYPE } from '../Shared/MvcSymbols.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * `withView` es un Higher-Order Component (HOC) diseñado para envolver una vista
 * o un componente de página y proporcionarle datos relevantes de diferentes contextos.
 *
 * Inyecta información de autenticación (`AuthContext`) y de enrutamiento (`RouterContext`)
 * en una prop consolidada `ctx` del componente envuelto. Esto es particularmente útil
 * para la lógica específica de la vista que necesita acceso al estado de autenticación global
 * y a los detalles del router.
 *
 * @param {React.ComponentType} Component - El componente de React (vista o página) a envolver por el HOC.
 * @returns {React.ComponentType} Una nueva clase de componente React (`View`) que
 * suscribe el componente original a los contextos necesarios y le pasa las props relevantes.
 */
function withView(Component) {
    /**
     * @class View
     * @augments {React.Component}
     * @description Un componente envoltorio generado por `withView` que gestiona
     * la inyección de datos de `AuthContext` y `RouterContext` en el componente hijo.
     */
    return class View extends React.Component {
        /**
         * @static
         * @readonly
         * @property {Symbol} __typeof
         * @description Un identificador único para esta clase, utilizado por el sistema de enrutamiento
         * para reconocer componentes que actúan como vistas.
         */
        static get __typeof() {
            return MVCROUTER_VIEW_TYPE;
        }

        /**
         * El método `render` del componente `View`. Es responsable de suscribirse
         * a los contextos `AuthContext` y `RouterContext` de manera anidada, y luego
         * renderizar el `Component` original pasándole las props apropiadas,
         * incluyendo el objeto `ctx` consolidado.
         *
         * @returns {React.ReactElement} El elemento React resultante, que es el `Component` envuelto
         * con las props inyectadas desde el HOC de la vista.
         */
        render() {
            // Se suscribe a AuthContext para obtener la información de autenticación del usuario.
            return h({
                type: AuthContext.Consumer,
                children: [auth =>
                    // Se suscribe a RouterContext para obtener la información global del router.
                    h({
                        type: RouterContext.Consumer,
                        children: [router =>
                            h({
                                type: Component,
                                props: {
                                    ...this.props, // Pasa todas las props originales al componente envuelto
                                    /**
                                     * @type {ViewContextProps}
                                     * @description Objeto de contexto inyectado que contiene información
                                     * de la solicitud del router, una respuesta (extensible) y el usuario autenticado.
                                     */
                                    ctx: {
                                        req: router,    // La información de la solicitud del router.
                                        res: {},        // Un objeto de respuesta, actualmente vacío pero extensible.
                                        user: auth.user // La información del usuario autenticado (ClaimsPrincipal).
                                    }
                                }
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withView;
