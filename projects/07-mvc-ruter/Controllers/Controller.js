import { MVCROUTER_CONTROLLER_TYPE } from "../Shared/MvcSymbols.js";

/** 
 * Este componente solo existe para declarar la ruta y props del controlador.
 * No renderiza nada, solo es útil para el builder de rutas.
 */
class Controller extends React.Component {
    static __typeof = MVCROUTER_CONTROLLER_TYPE;
    render() {
        return null;
    }
}

export default Controller;
