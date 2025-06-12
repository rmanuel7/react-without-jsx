/**
 * Contexto para manejar la información de la acción global en la aplicación.
 *
 * @type {React.Context<ActionContextValue>}
 * @description
 * Este contexto permite a los componentes acceder y modificar el estado de la acción actual
 * de manera global. Es útil para flujos donde múltiples componentes necesitan reaccionar o
 * interactuar con una acción en curso (por ejemplo, el envío de un formulario, una operación de guardado).
 * @remark Todos los consumidores que sean descendientes del `ActionContext.Provider`
 * volverán a renderizar cada vez que cambie el `value` del contexto.
*/
const ActionContext = React.createContext(null);

export default ActionContext;
