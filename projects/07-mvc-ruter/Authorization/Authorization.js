import withAuthz from './withAuthz.js';
import Outlet from '../Router/Outlet.js';
import AccessDenied from './AccessDenied.js';
import { createReactElement as h } from '../Wrappers/ReactFunctions.js';

const Authorization = withAuthz(
    class extends React.Component {
        render() {
            const { user, authz, children } = this.props;

            if (this.isAuthorized(user, authz.config)) {
                return h({ type: Outlet });
            }

            return h({ type: AccessDenied });
        }

        isAuthorized(user, config) {
            const { roles, policy, claims } = config;

            if (!user.isAuthenticated) return false;

            if (roles && !roles.split(',').some(role => user.roles.includes(role.trim()))) {
                return false;
            }

            // Implementa aquí lógica para policy y claims si lo necesitas

            return true;
        }
    }
);

export default Authorization;
