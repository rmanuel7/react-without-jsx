import { MVCROUTER_AUTHORIZE_TYPE } from "../Shared/MvcSymbols.js";

/**
 * @class Authorize
 * @augments {React.Component}
 * @description Un componente marcador utilizado para indicar que una ruta o componente
 * requiere autenticación.
 *
 * Este componente no renderiza nada visible (`null`) y su propósito principal
 * es ser un indicador en el árbol de componentes o en la configuración de rutas
 * para que el sistema de autenticación lo reconozca y aplique restricciones de acceso.
 */
class Authorize extends React.Component {
    /**
     * @static
     * @readonly
     * @property {Symbol} __typeof
     * @description Un identificador único para esta clase, utilizado por el sistema de enrutamiento
     * o autenticación para reconocer instancias de `Authorize`.
     */
    static get __typeof() {
        return MVCROUTER_AUTHORIZE_TYPE;
    }

    /**
     * Renderiza el componente. Siempre devuelve `null`, ya que es un componente marcador
     * y no está destinado a renderizar elementos visuales en el DOM.
     * @returns {null}
     */
    render() {
        return null;
    }
}

export default Authorize;
