import { MVCROUTER_ROUTES_TYPE } from "../Shared/MvcSymbols.js";
import { createReactElement as h } from '../Shared/ReactFunction.js';
import OutletContext from "./OutletContext.js";
import Outlet from "./Outlet.js";
// Importa tus wrappers y componentes de rutas
import Authorize from "../Authorization/Authorize.js";
import AllowAnonymous from "../Authorization/AllowAnonymous.js";
import Controller from "../Controllers/Controller.js";
import Route from "./Route.js";

/**
 * Componente Routes:
 * Hace matching recursivo, construye la pila de wrappers y renderiza el outlet final usando contextos.
 */
class Routes extends React.Component {
    static __typeof = MVCROUTER_ROUTES_TYPE;
    
    render() {
        const { children, location } = this.props;

        const contextValues = matchRoute(
            React.Children.toArray(children),
            location,
            "",
            {}
        );

        if (!contextValues) {
            return h({ type: NotFound });
        }

        // Armado del pipeline de contextos y wrappers
        // 1. Layout (definición, no ejecuta aún)
        const layout = contextValues.layout
          ? h({
                type: contextValues.layout.type,
                props: contextValues.layout.props
            })
          : null;

        // 2. Action pipeline: OutletContext + ActionContext + ActionResult
        const action = h({
            type: OutletContext.Provider,
            props: { value: { layout } },
            children: [
                h({
                    type: ActionContext.Provider,
                    props: { value: contextValues.routeMatch || {} },
                    children: [
                        h({ type: ActionResult })
                    ]
                })
            ]
        });

        // 3. Authorization pipeline
        let element = action;
        if (contextValues.authorization) {
            element = h({
                type: AuthzContext.Provider,
                props: { value: contextValues.authorization || {} },
                children: [
                    h({
                        type: Authorization,
                        props: contextValues.authorization.config || {},
                        children: element
                    })
                ]
            });
        }

        return element;
    }
}

export default Routes;
