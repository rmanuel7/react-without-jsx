import { createReactElement as h } from '../Shared/ReactFunctions.js';
import RouterContext from './RouterContext.js';

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
 *         const { location, fromRoute, fromQuery } = this.props;
 *         // Render basado en la ruta actual
 *     }
 * }
 *
 * export default withRouter(MiVista);
 */
function withRouter(Component) {
    /**
     * @class RouterConsumer
     * @augments {React.Component}
     * @description Componente envoltorio generado por `withRouter` que consume
     * el `RouterContext` y pasa sus valores como props al `Component` envuelto.
     * @private
     */
    return class RouterConsumer extends React.Component {
        render() {
            return h({
                type: RouterContext.Consumer,
                props: {},
                children: [router =>
                    h({
                        type: Component,
                        props: {
                            ...this.props,
                            ctx: { router },
                            location: router.location,
                            fromRoute: router.params,
                            fromQuery: router.query,
                            fromPopstate: router.stateData,
                            outlet: router.outlet
                        }
                    })
                ]
            });
        }
    };
}

export default withRouter;
