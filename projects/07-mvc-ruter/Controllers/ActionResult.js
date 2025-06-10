import ActionResultContext from "./ActionResultContext";

export class ActionResult extends React.Component {
    
    render() {
        if (route && route.controller && route.action) {
            const controllerInstance = new route.controller();
            const context = {
                params,
                location: { pathname: this.state.currentPath },
                navigate: this.navigate
            };
            const view = controllerInstance[route.action]
                ? controllerInstance[route.action](context)
                : React.createElement('div', null, '404 - Acción no encontrada');
        
            return React.createElement(
                RouterContext.Provider,
                { value: { location: { pathname: this.state.currentPath }, params, navigate: this.navigate } },
                view
            );
        }
        
        // Provee el resultado al OutletContext:
        return h({
            type: OutletContext.Provider,
            props: { value: { ...outletInfo, actionResult } },
            children: this.props.children
        });
    }
}
