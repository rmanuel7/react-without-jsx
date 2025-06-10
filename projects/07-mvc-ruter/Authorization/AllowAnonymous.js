import { AuthzContext } from "./AuthzContext";
import Outlet from "./Outlet";

class AllowAnonymous extends React.Component {
    render() {
        return h({
            type: AuthzContext.Provider,
            props: {
                value: { type: 'allowAnonymous' }
            },
            children: [
                h({ type: Outlet })
            ]
        });
    }
}

export default AllowAnonymous;
