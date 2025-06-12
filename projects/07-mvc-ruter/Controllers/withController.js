import { MVCROUTER_CONTROLLER_TYPE } from '../Shared/MvcSymbols.js';
import { createReactElement as h } from '../Shared/ReactFunctions.js';
import { cloneReactElement as o } from '../Shared/ReactFunctions.js';
import AuthContext from '../Authentication/AuthContext.js';
import RouterContext from '../Router/RouterContext.js';
import ActionContext from './ActionContext.js';
import OutletContext from '../Router/OutletContext.js';

/**
 * `withController` es un Componente de Alto Orden (HOC) que envuelve una clase de controlador lógico
 * y maneja su instanciación y ejecución dentro del ciclo de vida de React/Preact.
 *
 * Este HOC se suscribe a varios contextos (Auth, Router, Action, Outlet) para recolectar
 * toda la información necesaria y construir un contexto de ejecución (`ctx`) que se pasa
 * al constructor del controlador. Luego, ejecuta el método de acción del controlador
 * y renderiza el resultado dentro del layout apropiado.
 *
 * @param {Class<ControllerClass>} ControllerClass - La clase del controlador lógico (ej. `AdminController`, `AccountController`).
 * Esta clase debe tener un constructor que acepte el contexto de ejecución (`ctx`) y métodos
 * que correspondan a las acciones de la ruta (e.g., `Index`, `Dashboard`, `Login`).
 * @returns {Class<React.Component>} Un nuevo componente React/Preact que maneja la lógica
 * del controlador y la renderización de la vista.
 */
function withController(ControllerClass) {
    // Retorna una nueva clase de componente React/Preact.
    // Esta clase será lo que se renderice en el árbol de componentes de tu aplicación.
    return class Controller extends React.Component {
        /**
         * Propiedad estática para identificar este componente como un tipo de controlador
         * dentro del sistema de enrutamiento (ej. para props.element en Route).
         * @returns {Symbol} Un símbolo único que representa el tipo de componente de controlador.
         */
        static get __typeof() {
            return MVCROUTER_CONTROLLER_TYPE;
        }

        /**
         * El método `render` del componente envuelto. Aquí es donde se recolectan los datos
         * de los contextos y se ejecuta la lógica del controlador.
         * @returns {React.Element} El elemento React/Preact resultante de la ejecución del controlador
         * envuelto en su layout.
         */
        render() {
            // Se suscribe a AuthContext para obtener la información de autenticación del usuario.
            return h({
                type: AuthContext.Consumer,
                children: [auth =>
                    // Se suscribe a RouterContext para obtener la información global del router.
                    h({
                        type: RouterContext.Consumer,
                        children: [router =>
                            // Se suscribe a ActionContext para obtener los detalles de la acción actual.
                            h({
                                type: ActionContext.Consumer,
                                children: [actionCtx => {
                                    // Desestructura el controlador y la acción del contexto de la acción.
                                    // 'controller' aquí podría ser la clase del controlador o un objeto que la contenga.
                                    // 'action' es el nombre del método a ejecutar (e.g., "Dashboard").
                                    const { controller: ControllerType, action } = actionCtx || {};

                                    let outlet = null; // Variable para almacenar el resultado de la acción del controlador.

                                    // Verifica que tanto el controlador como la acción estén definidos.
                                    if (ControllerType && action) {
                                        // 1. Componer el objeto de contexto (ctx) estilo ASP.NET Core
                                        // Este objeto será el único argumento pasado al constructor del controlador
                                        // y potencialmente a los métodos de acción si el controlador lo necesita.
                                        const ctx = {
                                            req: router,              // Información de la solicitud del router (URL, etc.)
                                            res: {},                  // Objeto de respuesta (puede ser extendido para redirecciones, etc.)
                                            user: auth.user,          // Información del usuario autenticado
                                            action: action,           // El objeto de la acción con sus props (e.g., { path: "dashboard", action: "Dashboard" })
                                            fromRoute: action.fromRoute,  // Parámetros de la ruta extraídos (ej. { id: 123 })
                                            fromQuery: router.fromQuery,  // Parámetros de la query string (ej. { page: 1 })
                                            fromPopstate: router.stateData // Datos del historial de navegación
                                        };

                                        // 2. Instanciar el controlador lógico
                                        // Se crea una nueva instancia de la clase de controlador proporcionada.
                                        const ctrlInstance = new ControllerClass(ctx);

                                        // 3. Ejecutar la acción del controlador
                                        // El nombre del método de la acción se obtiene de 'action.props.action' o por defecto "Index".
                                        const actionMethodName = action.props.action || "Index";
                                        const actionMethod = ctrlInstance[actionMethodName]; // Obtiene la referencia al método.

                                        // Verifica que el método de acción exista y sea una función.
                                        if (typeof actionMethod === "function") {
                                            
                                            // Corregido: La lógica original parece querer pasar el `element` y la `config`
                                            // para que 'o' lo utilice. Esto sugiere que 'o' es más que un simple 'h'.
                                            outlet = o({
                                                element: action.element, // El componente de la página final (e.g., HomePage)
                                                // La configuración contiene la instancia del controlador y el método de acción
                                                // para que 'o' pueda invocar la acción si es necesario, o simplemente
                                                // pasar estos a componentes más abajo en el árbol si es una "vista compuesta".
                                                config: {
                                                    ctrlInstance,
                                                    // Se pasa una función que permite invocar el método de acción con un bind de datos
                                                    // Esto es útil si el elemento final necesita desencadenar la acción del controlador.
                                                    actionMethod: (...dataBind) => actionMethod.call(ctrlInstance, ...dataBind)
                                                }
                                            });
                                        } else {
                                            console.error(`Error: Acción '${actionMethodName}' no encontrada o no es una función en el controlador '${ControllerType.name}'.`);
                                            // Fallback: Si la acción no existe, podrías renderizar un componente de error.
                                            outlet = h('div', {}, `Error: Acción '${actionMethodName}' no encontrada.`);
                                        }
                                    } else {
                                        // Si no hay controlador o acción válidos en el contexto.
                                        console.warn("withController: Contexto de acción incompleto (controller o action no definidos).");
                                        // Podrías renderizar un fallback, como un componente de página no encontrada,
                                        // o dejar que el pipeline superior maneje el caso.
                                    }

                                    // 4. Pasar el 'outlet' al siguiente nivel a través de OutletContext.Provider
                                    // Este Consumer/Provider anidado es el punto donde el layout se obtiene
                                    // y el 'outlet' (el resultado de la acción del controlador) se pasa al layout.
                                    return h({
                                        type: OutletContext.Consumer,
                                        children: [({ outlet: layout }) => // Obtiene el layout del contexto superior
                                            h({
                                                type: OutletContext.Provider, // Provee el 'outlet' resultante a los hijos
                                                props: { value: { outlet } },
                                                children: [
                                                    // Renderiza el layout si existe, o el 'outlet' directamente.
                                                    // La lógica 'o({ element: layout ? layout : outlet })' significa:
                                                    // Si hay un layout, renderízalo (y asume que consumirá el 'outlet'
                                                    // de OutletContext.Provider). Si no hay layout, renderiza el 'outlet' directamente.
                                                    o({ element: layout ? layout : outlet })
                                                ]
                                            })
                                        ]
                                    });
                                }]
                            })
                        ]
                    })
                ]
            });
        }
    };
}

export default withController;
