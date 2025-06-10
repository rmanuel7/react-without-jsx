import ActionResultContext from "./ActionResultContext";

export class ActionResult extends React.Component {
    
    render() {
        const outletInfo = this.context;
        const isAuthorized = /* tu lógica de autorización */;
        if (!isAuthorized) {
            return h({ type: "div", children: ["Acceso denegado"] });
        }
        // Si está autorizado, ejecuta el controlador/acción aquí:
        let actionResult = null;
        if (outletInfo.controller && outletInfo.action) {
            const controllerInstance = new outletInfo.controller();
            actionResult = controllerInstance[outletInfo.action](outletInfo.outletProps);
        }
        // Provee el resultado al OutletContext:
        return h({
            type: OutletContext.Provider,
            props: { value: { ...outletInfo, actionResult } },
            children: this.props.children
        });
    }
}
