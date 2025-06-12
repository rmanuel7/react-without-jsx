import { MVCROUTER_ROUTE_TYPE } from "../Shared/MvcSymbols.js";

/**
 * Componente Route:
 * Marcador declarativo para describir una ruta
 * @class Route
 * @augments {React.Component}
 * @description Un componente declarativo que representa una ruta individual en el sistema de enrutamiento.
 * Este componente no renderiza ningún elemento visual en el DOM; su propósito principal es
 * definir la configuración de una ruta, incluyendo su path, componente a renderizar,
 * y cualquier metadata asociada (como requisitos de autenticación o layouts).
 *
 * Su detección y procesamiento son realizados por un componente enrutador superior
 * que lee estas definiciones declarativas.
 */
class Route extends React.Component {
    /**
     * @static
     * @readonly
     * @property {Symbol} __typeof
     * @description Un identificador único para esta clase, utilizado por el sistema de enrutamiento
     * para reconocer instancias de `Route` y procesarlas adecuadamente.
     */
    static get __typeof() {
        return MVCROUTER_ROUTE_TYPE;
    }

    /**
     * El método `render` del componente `Route`.
     * Siempre devuelve `null` porque `Route` es un componente puramente declarativo
     * y no está diseñado para producir salida visual en el DOM.
     * Su función es proporcionar metadatos de enrutamiento a un componente padre.
     *
     * @returns {null}
     */
    render() {
        // No renderiza nada (estructura declarativa solamente)
        return null;
    }
}

export default Route;
