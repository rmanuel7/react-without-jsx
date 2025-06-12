/**
 * Contexto de React que representa el enrutador de la aplicación.
 * @type {React.Context}
 *
 * @description
 * Proporciona información sobre el estado actual del enrutamiento y funciones para realizar navegación.
 * Este contexto puede ser consumido por los componentes hijos para acceder a la ubicación actual, rutas activas
 * y métodos de navegación como `push` o `replace`.
 */
const RouterContext = React.createContext(null);

export default RouterContext;
