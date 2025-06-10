import React from "react";

import React from "react";
import { OutletContext } from "./OutletContext";
import Outlet from "./Outlet";
// Importa tus wrappers y componentes de rutas
import { Authorize } from "./Authorize";
import { AllowAnonymous } from "./AllowAnonymous";
import Controller from "./Controller";
import Route from "./Route";

/**
 * Componente Routes:
 * Hace matching recursivo, construye la pila de wrappers y renderiza el outlet final usando contextos.
 */
class Routes extends React.Component {
    render() {
        const { children, location } = this.props;

        const contextValues = matchRouteAndBuildContexts(
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
