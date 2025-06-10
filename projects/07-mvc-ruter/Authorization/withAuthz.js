import AuthzContext from './AuthzContext.js';
import AuthContext from '../Authentication/AuthContext.js';
import withAuth from '../Authentication/withAuth.js';
import { createReactElement as h} from '../Shared/ReactFunctions.js';

function withAuthz(Component) {
    return class extends React.Component {
        render() {
            return h({
                type: AuthContext.Consumer,
                props: {},
                children: [auth =>
                    h({
                        type: AuthzContext.Consumer,
                        props: {},
                        children: [authz =>
                            h({
                                type: Component,
                                props: {
                                    ...this.props,
                                    authz,
                                    user: auth.user
                                }
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withAuthz;
