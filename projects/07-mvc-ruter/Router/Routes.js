/**
 * @typedef {Object} RoutesProps - Propiedades del componente
 * @property {object} ctx - La propagación de los valores del contexto
 * @property {Location} ctx.location - Gestionar la navegación del historial del navegador en una SPA.
 * @property {RequestContextValue} ctx.req - Información de la solicitud HTTP actual.
 */


import { MVCROUTER_ROUTES_TYPE } from '../Shared/MvcSymbols.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';
import { cloneReactElement as o } from '../Shared/ReactFunctions.js';
import withRouter from './withRouter.js';
import Authorization from '../Authorization/Authorization.js';
import AuthzContext from '../Authorization/AuthzContext.js';
import ActionContext from '../Controllers/ActionContext.js';
import NotFound from './NotFound.js';
import OutletContext from './OutletContext.js';
import matchRoute from './matchRoute.js';
import RequestContext from './RequestContext.js';
import RequestContextValue from './RequestContextValue.js';


/**
 * Componente Routes: Contenedor para la definición de rutas anidadas.
 * 
 * Renderiza el primer <Route> que coincida con la ubicación actual.
 * Hace matching recursivo, construye la pila de wrappers y renderiza el outlet final usando contextos.
 */
class Routes extends React.Component {

    /** @type {RoutesProps} */
    props; // Para que el IDE reconozca las props

    /**
    * Propiedad estática para identificar este componente como un tipo de rutas
    * dentro del sistema de enrutamiento (ej. para props.element en Route).
    * @returns {Symbol} Un símbolo único que representa el tipo de componente de rutas.
    */
    static get __typeof() {
        return MVCROUTER_ROUTES_TYPE;
    }

    render() {
        const { children, ctx } = this.props;

        const contextValues = matchRoute(
            React.Children.toArray(children),
            ctx.req.path,
            "",
            {}
        );

        if (!contextValues) {
            return h({ type: NotFound });
        }

        // Armado del pipeline de contextos y wrappers
        // 1. Layout (definición, no ejecuta aún)
        const layout = contextValues.layout
            ? o({
                element: contextValues.layout.element,
                config: contextValues.layout.props
            })
            : null;

        // 2. Action pipeline: OutletContext + ActionContext + ActionResult
        const action = h({
            type: OutletContext.Provider,
            props: { value: { outlet: layout } },
            children: [
                h({
                    type: ActionContext.Provider,
                    props: { value: contextValues.routeMatch || {} },
                    children: [
                        o({ element: contextValues.routeMatch.controller.element || contextValues.routeMatch.action.element })
                    ]
                })
            ]
        });

        // 3. Authorization pipeline
        let element = action;
        if (contextValues.authorization) {
            // 4. `Authorization` wrapper que decide si deja pasar, y provee el siguiente `Outlet` (la `action`).
            // `Authorization` consume `AuthzContext` para la decisión.
            // `Authorization` consume `OutletContext` para obtener la `action` que debe renderizar.
            element = h({
                type: OutletContext.Provider, // Provee el `actionElement` al `Authorization`
                props: { value: { outlet: element } },
                children: [
                    h({
                        type: AuthzContext.Provider, // Provee los datos de autorización
                        props: { value: contextValues.authorization || {} },
                        children: [
                            h({ type: Authorization }) // `Authorization` es el primer componente en el pipeline
                        ]
                    })
                ]
            });
        }

        // 4. Request pipeline (Paso del pipeline donde se actualiza el contexto)
        return h({
            type: RequestContext.Provider,
            props: {
                // A esta nueva instancia, le asigna los 'routeValues' que acaban de ser
                // determinados por el enrutador (contextValues.routeMatch.action.fromRoute).
                value: RequestContextValue.with(ctx.req, {
                    routeValues: contextValues.routeMatch.action.fromRoute
                })
            },
            children: [
                element
            ]
        });
    }
}

export default withRouter(Routes);
