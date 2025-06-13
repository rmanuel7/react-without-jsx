import { createReactElement as h } from './ReactFunctions.js';
import createMvcContext from '../Utils/createMvcContext.js';
import RequestContext from '../Router/RequestContext.js';
import RouterContext from '../Router/RouterContext.js';

/**
 * High Order Component (HOC) que inyecta el contexto del Router
 * como propiedades al componente que se envuelve.
 *
 * Esto permite que cualquier componente basado en clases pueda acceder
 * a la información del router sin depender de contextType ni Consumer explícito.
 *
 * Además de inyectar `ctx.router`, este HOC propaga directamente propiedades útiles como:
 * - `location`: la ruta actual
 * - `fromRoute`: los parámetros extraídos del path (ej: /users/:id)
 * - `fromQuery`: los parámetros del query string (ej: ?q=value)
 * - `fromPopstate`: los datos del historial pushState/popState
 * - `outlet`: elemento anidado renderizable, útil para layouts
 *
 * @param {React.ComponentType} Component - El componente al que se le inyectará el contexto del router.
 * @returns {React.ComponentType} Un nuevo componente que pasa props de enrutamiento al original.
 *
 * @example
 * class MiVista extends React.Component {
 *     render() {
 *         const { ctx } = this.props;
 *         // Render basado en la ruta actual
 *     }
 * }
 *
 * export default withRouter(MiVista);
 */
function withRouter(Component) {
    return class RouterConsumer extends React.Component {
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
                            h({
                                type: Component,
                                props: {
                                    ...this.props, // Pasa todas las props originales al componente envuelto
                                    // Consolida los contextos en la prop `ctx`
                                    // Asegúrate de que createMvcContext reciba los argumentos correctos.
                                    ctx: createMvcContext({
                                        router: routerCtxValue, // Pasar el objeto completo del RouterContextValue
                                        requst: requestCtxValue, // Pasar la instancia completa de RequestContextValue
                                    }),
                                }
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withRouter;
