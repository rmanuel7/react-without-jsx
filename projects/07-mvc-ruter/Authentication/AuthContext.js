/**
 * Contexto para acceder a los datos de autenticación.
 *
 * @type {React.Context<AuthContextValue>}
 * @param {AuthContextValue} value - Objeto que contiene el estado y funciones relacionadas con la autenticación.
 * @description
 * Permite a los componentes acceder y modificar el estado de autenticación de manera global.
 * @remark Todos los consumidores que sean descendientes del `AuthContext.Provider`
 * volverán a renderizar cada vez que cambie el `value` del contexto.
 */
const AuthContext = React.createContext(null);

export default AuthContext;
