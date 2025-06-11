import { MVCROUTER_CONTROLLER_TYPE } from '../Shared/MvcSymbols.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';

function withController(Component) {
    return class Controller extends React.Component {
        static get __typeof() {
            return MVCROUTER_CONTROLLER_TYPE;
        }

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
                                    h({
                                        type: Component,
                                        props: {
                                            ...this.props,
                                            ctx: {
                                                req: router,
                                                view: actionCtx,
                                                user: auth.user
                                            }
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

export default withController;
