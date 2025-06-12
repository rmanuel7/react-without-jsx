/**
 * Contexto para acceder a los datos y funciones relacionadas con la autorización y autenticación global.
 *
 * @type {React.Context<AuthContextValue>}
 * @description
 * Permite a los componentes acceder y modificar el estado de autenticación y autorización de manera global.
 * Este contexto debe ser provisto por un `AuthzContext.Provider` en un nivel superior del árbol de componentes.
 * @remark Todos los consumidores que sean descendientes del `AuthzContext.Provider`
 * volverán a renderizar cada vez que cambie el `value` del contexto.
 */
const AuthzContext = React.createContext(null);

export default AuthzContext;
