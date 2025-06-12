import AuthContext from '../Authentication/AuthContext.js';
import RouterContext from '../Router/RouterContext.js';
import { MVCROUTER_LAYOUT_TYPE } from '../Shared/MvcSymbols.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * `withLayout` es un Componente de Alto Orden (HOC) diseñado para envolver una vista
 * o un componente de página y proporcionarle datos relevantes de diferentes contextos.
 *
 * Inyecta información de autenticación (`AuthContext`) y enrutamiento (`RouterContext`)
 * en una prop consolidada `ctx` del componente envuelto, lo que es útil para la lógica
 * de layout o para que las páginas accedan a datos globales de manera estandarizada.
 *
 * @param {React.ComponentType} Component - El componente de React (vista o página) a envolver con el layout.
 * @returns {React.ComponentType} Una nueva clase de componente React (`Layout`) que
 * suscribe al componente original a los contextos necesarios y le pasa las props.
 */
function withLayout(Component) {
    /**
     * @class Layout
     * @augments {React.Component}
     * @description Componente envoltorio generado por `withLayout` que gestiona
     * la inyección de datos de `AuthContext` y `RouterContext` al componente hijo.
     */
    return class Layout extends React.Component {
        /**
         * @static
         * @readonly
         * @property {Symbol} __typeof
         * @description Un identificador único para esta clase, utilizado por el sistema de enrutamiento
         * para reconocer componentes que actúan como layouts.
         */
        static get __typeof() {
            return MVCROUTER_LAYOUT_TYPE;
        }

        /**
         * El método `render` del componente `Layout`. Se encarga de suscribirse a los
         * contextos `AuthContext` y `RouterContext` de manera anidada, y luego
         * renderiza el `Component` original pasándole las props adecuadas,
         * incluyendo el objeto `ctx` consolidado.
         *
         * @returns {React.ReactElement} El elemento React resultante, que es el `Component`
         * envuelto con las props inyectadas por el layout.
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
                                     * @type {LayoutContextProps}
                                     * @description Objeto de contexto inyectado que contiene información
                                     * de la solicitud del router, una respuesta (extensible) y el usuario autenticado.
                                     */
                                    ctx: {
                                        req: router, // La información de la solicitud del router.
                                        res: {},     // Un objeto de respuesta, actualmente vacío pero extensible.
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

export default withLayout;
