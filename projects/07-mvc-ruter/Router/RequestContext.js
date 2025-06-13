/**
 * Un contexto de React que contiene el objeto de solicitud.
 * 
 * Este contexto debe ser utilizado por un `RequestContext.Provider` en la parte superior
 * de tu árbol de componentes para hacer la información de la solicitud disponible
 * a toda la aplicación.
 * 
 * @type {React.Context<object>}
 */
const RequestContext = React.createContext(null);

export default RequestContext;
