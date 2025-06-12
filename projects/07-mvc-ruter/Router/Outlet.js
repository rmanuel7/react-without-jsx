import { createReactElement as h } from '../Shared/ReactFunctions.js';
import OutletContext from './OutletContext.js';

/**
 * Componente Outlet: Marcador de posición para las rutas anidadas.
 *
 * Este componente se utiliza dentro de un layout para indicar
 * dónde debe renderizarse la vista hija correspondiente a la ruta actual.
 * 
 * El valor del outlet es proporcionado por el contexto `OutletContext`,
 * que es llenado dinámicamente por el componente <Routes />.
 *
 * @example
 * // En un layout
 * class MainLayout extends React.Component {
 *   render() {
 *     return h({
 *       type: Outlet,
 *     });
 *   }
 * }
 */
class Outlet extends React.Component {
    render() {
        return h({
            type: OutletContext.Consumer,
            props: {},
            children: [
                ({ outlet }) => outlet || null
            ]
        });
    }
}

export default Outlet;
