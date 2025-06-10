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
        const {
            children,
            basePath = "",
            location: currentLocationPath,
            stateData,
            query,
        } = this.props;

        // 1. Normaliza y convierte los hijos a array para procesar
        const childElements = React.Children.toArray(children).filter(React.isValidElement);

        // 2. Busca el match y arma la pila de wrappers
        const match = this.matchWrappers(
            childElements,
            currentLocationPath,
            basePath,
            []
        );

        if (!match) {
            // Si no hay match, puedes personalizar el componente NotFound
            return h({ type: "div", props: {}, children: ["404 - Página no encontrada"] });
        }

        // 3. Extrae wrappers y outlet final
        const { wrappers, outlet, outletProps } = match;

        // 4. Provee el outlet final vía contexto
        const outletValue = { outlet };

        // 5. Renderiza la pila de wrappers, terminando en el Outlet
        return this.renderWrappers(
            wrappers,
            h({
                type: OutletContext.Provider,
                props: { value: outletValue },
                children: [
                    h({ type: Outlet, props: outletProps || {} })
                ]
            })
        );
    }

    /**
     * Recursivamente busca coincidencias, construye la pila de wrappers y el outlet final.
     * Devuelve { wrappers, outlet, outletProps } o null si no hay match.
     */
    matchWrappers(children, currentLocationPath, basePath, wrappers = []) {
        for (const child of children) {
            if (!React.isValidElement(child)) continue;

            const { type, props } = child;

            // WRAPPERS: Authorize, AllowAnonymous, Layout, etc.
            if (type === Authorize || type === AllowAnonymous /* || type === Layout */) {
                // Agrega wrapper y sigue recursivo
                const res = this.matchWrappers(
                    React.Children.toArray(props.children),
                    currentLocationPath,
                    basePath,
                    wrappers.concat({ type, props })
                );
                if (res) return res;
            }

            // CONTROLLER: actualiza basePath, sigue recursivo
            else if (type === Controller) {
                const ctrlBasePath = basePath + (props.path || "");
                const res = this.matchWrappers(
                    React.Children.toArray(props.children),
                    currentLocationPath,
                    ctrlBasePath,
                    wrappers.concat({ type, props })
                );
                if (res) return res;
            }

            // ROUTE: intenta hacer match final
            else if (type === Route) {
                const routePath = basePath + (props.path || "");

                // matchPath debe ser tu función para matching con params (impleméntala según tus reglas)
                const params = matchPath(routePath, currentLocationPath);
                if (params) {
                    return {
                        wrappers,
                        outlet,
                        outletProps: {
                            params,
                            location: currentLocationPath,
                            fromQuery: this.props.query,
                            fromPopstate: this.props.stateData
                        }
                    };
                }
            }
        }
        return null;
    }

    /**
     * Renderiza la pila de wrappers recursivamente anidados usando h.
     */
    renderWrappers(wrappers, content) {
        if (!wrappers || wrappers.length === 0) return content;
        const [head, ...tail] = wrappers;
        return h({
            type: head.type,
            props: head.props,
            children: [this.renderWrappers(tail, content)]
        });
    }
}

export default Routes;
