import ActionContext from "./ActionContext.js";
import AuthContext from "../Authentication/AuthContext.js";
import RouterContext from "../Router/RouterContext.js";
import OutletContext from "../Router/OutletContext.js";
import { createReactElement as h } from "../Shared/ReactFunctions.js";
import { cloneReactElement as o } from "../Shared/ReactFunctions.js";

class ActionResult extends React.Component {
    render() {
        return h({
            type: AuthContext.Consumer,
            children: [auth =>
                h({
                    type: RouterContext.Consumer,
                    children: [router =>
                        h({
                            type: ActionContext.Consumer,
                            children: [actionCtx =>
                                const { controller, action } = actionCtx || {};
                                if (!controller || !action) return null;

                                // Instanciar el controller lógico y ejecutar la acción
                                const ControllerClass = controller.type;
                                const ctrlInstance = new ControllerClass(controller.props);

                                const actionMethodName = action.props.action || "index";
                                const actionMethod = ctrlInstance[actionMethodName];
                                if (typeof actionMethod !== "function") return null;

                                // Componer el contexto estilo ASP.NET Core
                                const ctx = {
                                    req: router,
                                    res: outletCtx,
                                    user: auth?.user,
                                    ...action.props,      // extras de la ruta
                                    fromRoute: action.fromRoute,
                                    fromQuery: router.fromQuery,
                                    fromPopstate: router.stateData
                                };

                                const result = actionMethod.call(ctrlInstance, ctx);
                                
                                return h({
                                    type: OutletContext.Consumer,
                                    children: [({ outlet: layout }) =>
                                        h({
                                            type: OutletContext.Provider,
                                            props: { value: { result } },
                                            children: [
                                                o({ element: layout ? layout: result })
                                            ]
                                        })
                                    ]
                                })
                            }]
                        })
                    ]
                })
            ]
        });
    }
}

export default ActionResult;
