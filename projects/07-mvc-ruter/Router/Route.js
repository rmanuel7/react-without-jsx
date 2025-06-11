import { MVCROUTER_ROUTE_TYPE } from "../Shared/MvcSymbols.js";

/**
 * Componente Route:
 * Marcador declarativo para describir una ruta
 */
class Route extends React.Component {
    static __typeof = MVCROUTER_ROUTE_TYPE;
    render() {
        // No renderiza nada (estructura declarativa solamente)
        return null;
    }
}

export default Route;
