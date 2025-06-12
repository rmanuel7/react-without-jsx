/**
 * Define la estructura del estado interno del componente de autenticación.
 * 
 * Este estado gestiona la información sobre el proceso de validación de la sesión,
 * el ticket de autenticación actual, el usuario autenticado y las opciones de configuración.
 *
 * @typedef {object} AuthenticationState
 * @property {boolean} isValidating - Indica si el componente está actualmente en proceso de
 * validar o cargar la sesión de autenticación (ej. al inicio de la aplicación).
 * @property {AuthenticationTicket} ticket - El objeto `AuthenticationTicket` actual,
 * que encapsula la identidad del usuario y las propiedades de la sesión.
 * @property {ClaimsPrincipal} user - El objeto `ClaimsPrincipal`
 * que representa la identidad del usuario actualmente autenticado (o el usuario "visitante").
 * Es un atajo a `ticket.principal`.
 * @property {AuthOptions} options - Un objeto `AuthOptions` que contiene
 * las configuraciones y parámetros para el comportamiento de la autenticación.
 */


import { createReactElement as h } from '../Shared/ReactFunctions.js';
import withRouter from '../Router/withRouter.js';
import Result from '../Common/Result.js';

import AuthContext from './AuthContext.js';
import AuthenticationTicket from './AuthenticationTicket.js';
import AuthOptions from './AuthOptions.js';
import ClaimsPrincipal from './ClaimsPrincipal.js';
import visitorTicket from './visitorTicket.js';
import SessionValidation from './SessionValidation.js';


/**
 * Cuando un usuario se autentica con su nombre de usuario y contraseña, se le emite un token que contiene un ticket de autenticación.
 * Este token se puede utilizar para autenticación y autorización. Se almacena como una cookie que se envía con cada solicitud del cliente.
 * La generación y validación de esta cookie se realiza mediante el middleware de autenticación de cookies. 
 * El middleware serializa un principal de usuario en una cookie cifrada. En solicitudes posteriores, el middleware valida la cookie,
 * recrea el principal y lo asigna a la propiedad AuthContext.User.
 * 
 * @class 
 * @classdesc Componente de autenticación que proporciona funcionalidad relacionada con la autenticación.
 * Proveedores soportados:
 * - Autenticación Web OpenID Connect
 * - Autenticación JWT Bearer
 * - Autenticación por Certificado
 * - Autenticación de Windows
 * - Autenticación WS-Federation
 * - Autenticación Social
 * - Autenticación con Cookies
 * - Autenticación con Formularios
 */
class Authentication extends React.Component {
    // =========================================================================
    //                            MOUNTING SECTION
    // =========================================================================

    /**
     * Método de clase, crea una istancia del componente {@link App}.
     * 
     * - Es llamado cuando una instancia del componente esta ciendo creada e insertada en el DOM.
     * - En este método se inicializa el estado y se enlazan los metodos a la instancia del componente.
     * @constructor
     * @description Este método hace parte del ciclo de vida de React.
     * @param {AuthenticationProps} props - Las propiedades que se pasan al componente.
     */
    constructor(props) {
        super(props);
        console.info('[Authentication] constructor.');

        if (!this.props.provider) {
            console.error("No se especificó un proveedor de autenticación");
            throw new Error("Se requiere un proveedor de autenticación");
        }

        /** @type {AuthenticationState} - Configuración del estado del componente Authentication. */
        this.state = {
            isValidating: true,
            ticket: visitorTicket,
            user: visitorTicket.principal,
            options: new AuthOptions(props.options),
        };

        this.login = this.login.bind(this);
        this.validate = this.validate.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
        this.isNearExpiry = this.isNearExpiry.bind(this);
    }

    /**
     * @method render
     * Metodo de renderizado de React.
     * 
     * @description Crea elementos React para renderizar un nodo del DOM.
     * @description Renderiza el componente `AuthContext.Provider` para envolver a sus hijos
     * y proporcionar el estado de autenticación y las funciones de inicio y cierre de sesión a los componentes descendientes.
     * Muestra un indicador de "Validando sesión..." mientras se verifica el estado de autenticación inicial.
     * @returns {React.ReactNode} El elemento React a renderizar.
     */
    render() {
        console.log('[Authentication] render');
        const { children } = this.props;
        const { isValidating } = this.state;
        const contextValue = {
            ...this.state,
            onLogin: this.login,
            onValidate: this.validate,
            onRefresh: this.refresh,
            onLogout: this.logout,
            onExpiry: this.isNearExpiry
        };

        // Mientras se valida la sesión, muestra un mensaje de carga.
        if (isValidating) {
            return h({ type: SessionValidation });
        }

        // Renderizar el componente
        return h({
            type: AuthContext.Provider,
            props: {
                value: contextValue,
            },
            children: [
                children
            ]
        });
    }

    /**
     * @method componentDidMount
     * Metodos del ciclo de vida de React
     * 
     * @description Se ejecuta después de que el componente se haya montado en el DOM.
     * 
     * @returns {void}
     */
    componentDidMount() {
        console.log('[Authentication] componentDidMount');
        this.validate();
    }

    /**
     * @method componentDidUpdate
     * Metodos del ciclo de vida de React
     * 
     * @description Se ejecuta después de que el componente se haya actualizado.
     * 
     * @returns {void}
     */
    componentDidUpdate() {
        console.log('[Authentication] componentDidUpdate');
    }

    /**
     * @method componentWillUnmount
     * Metodos del ciclo de vida de React
     * 
     * @description Se ejecuta justo antes de que el componente se desmonte y se elimine del DOM.
     * 
     * @returns {void}
     */
    componentWillUnmount() {
        console.log('[Authentication] componentWillUnmount');
    }

    /**
     * @method shouldComponentUpdate
     * Metodos del ciclo de vida de React
     * 
     * @description
     * Se ejecuta justo antes de que el componente se haya actualizado.
     * Determina si el componente debe actualizarse en función del estado de validación.
     * 
     * @param {Object} nextProps - Las próximas propiedades del componente.
     * @param {AuthenticationState} nextState - El próximo estado del componente.
     * @returns {boolean} - `true` si el componente debe actualizarse, `false` en caso contrario.
     */
    shouldComponentUpdate(nextProps, nextState) {
        console.log('[Authentication] shouldComponentUpdate.');
        // Comprueba si ha cambiado el estado de validación
        const shouldUpdate = this.state.user.identity.isAuthenticated !== nextState.user.identity.isAuthenticated;
        const isValidating = this.state.isValidating !== nextState.isValidating;
        const isExpeiry    = this.state.ticket.hasExpired() !== nextState.ticket.hasExpired();
        if (shouldUpdate || isValidating || isExpeiry) {
            console.log({ shouldUpdate, isValidating, isExpeiry });
        };
        return shouldUpdate || isValidating || isExpeiry;
    }

    /**
     * @method login
     * Inicia sesión utilizando las credenciales proporcionadas.
     * 
     * @description Inicia sesión enviando las credenciales proporcionadas al servidor a través del `authProvider`.
     * @param {LoginCredentials} credentials - Credenciales de autenticación del usuario.
     * @returns {Promise<Result>} - Retorna `true` si la autenticación fue exitosa, `false` en caso contrario.
     */
    async login(credentials) {
        console.log('[Authentication] login');
        // Extrae el proveedor de autenticación de las propiedades del componente.
        const { provider: authProvider } = this.props;
        // Extrae opciones de autenticación desde el estado del componente.
        const { options } = this.state;

        // Intenta realizar el login con el proveedor de autenticación.
        const result = await authProvider.login(options.loginPath, credentials);

        return result.switch(
            (value) => { // onSuccess
                if (!(value.data instanceof AuthenticationTicket)) {
                    throw new Error("Principal must be initialized with an instance of AuthenticationTicket.");
                }
                const ticket = value.data;

                // Actualiza el estado para reflejar una autenticación exitosa.
                this.setState({
                    ticket: ticket,
                    user: ticket.principal,
                    isValidating: false
                });
                console.log('[Authentication] autenticación exitosa');
                return Result.success(true);
            },
            (error) => { // onFailure
                // Manejo de errores: actualiza el estado y muestra un mensaje en la consola.
                this.setState({
                    ticket: visitorTicket,
                    user: visitorTicket.principal,
                    isValidating: false,
                });
                console.error("[Authentication] Error en el login:", error);
                // Posiblemente mostrar un mensaje de error al usuario
                return Result.failure(error);
            }
        );
    }

    /**
     * @method validate
     * Valida el estado de la sesión.
     * 
     * @description Realiza una validación del estado de la sesión utilizando el `authProvider`.
     * Este método puede ser llamado por componentes que requieren autorización.
     * @returns {Promise<boolean>} Una promesa que resuelve a `true` si la sesión es válida, `false` en caso contrario.
     */
    async validate() {
        console.log('[Authentication] validate');
        // Extrae el proveedor de autenticación de las propiedades del componente.
        const { provider: authProvider } = this.props;
        // Extrae opciones de autenticación desde el estado del componente.
        const { options } = this.state;

        // Intenta realizar la validación del estado de la sesión con el proveedor de autenticación.
        const result = await authProvider.validate(options.validatePath);

        return result.switch(
            (value) => { // onSuccess
                if (!(value.data instanceof AuthenticationTicket)) {
                    throw new Error("Principal must be initialized with an instance of AuthenticationTicket.");
                }
                const ticket = value.data;

                // Actualiza el estado para reflejar una validación exitosa.
                this.setState({
                    ticket: ticket,
                    user: ticket.principal,
                    isValidating: false,
                });
                console.log('[Authentication] validación exitosa');
                return true;
            },
            (error) => { // onFailure
                // Manejo de errores: actualiza el estado y muestra un mensaje en la consola.
                this.setState({
                    ticket: visitorTicket,
                    user: visitorTicket.principal,
                    isValidating: false,
                });
                console.error("[Authentication] Error en la validación:", error);
                return false;
            }
        );
    }

    /**
     * @method refresh
     * Intenta renovar el token de autenticación si está próximo a expirar.
     * 
     * @description Utiliza la información de expiración del token presente en el objeto `user` del estado.
     * **Consideración importante:** Asume que `user.expiresIn` es una cadena que representa una fecha
     * en un formato reconocible por el constructor `Date()`.
     * Si la renovación es exitosa, actualiza el estado con el nuevo token y la nueva información del usuario.
     * @returns {Promise<boolean>} Una promesa que resuelve a `true` si el token se renovó exitosamente,
     * `false` en caso contrario o si no es necesario renovarlo.
     */
    async refresh() {
        console.log('[Authentication] refresh');
        // Extrae el proveedor de autenticación de las propiedades del componente.
        const { provider: authProvider } = this.props;
        // Extrae el usuario y las opciones de autenticación desde el estado del componente.
        const { options } = this.state;

        // Verificar si el token está próximo a expirar
        if (this.isNearExpiry()) {
            console.info("[Authentication] El token está próximo a expirar, intentando renovación...");
            const result = await authProvider.refresh(options.refreshPath);

            return result.switch(
                (value) => { // onSuccess
                    if (!(value.data instanceof AuthenticationTicket)) {
                        throw new Error("Principal must be initialized with an instance of AuthenticationTicket.");
                    }
                    const ticket = value.data;

                    // Actualiza el estado para reflejar que la sesión fue renovada exitosamente.
                    this.setState({
                        ticket: ticket,
                        user: ticket.principal,
                        isValidating: false
                    });
                    console.info("[Authentication] Token renovado exitosamente.");
                    return true;
                },
                (error) => { // onFailure
                    // Manejo de errores: actualiza el estado y muestra un mensaje en la consola.
                    console.error("[Authentication] Falló la renovación del token:", error);
                    this.setState({
                        ticket: visitorTicket,
                        user: visitorTicket.principal,
                        isValidating: false,
                    }, () => {
                        ctx.router.navigate(options.loginPage); // Redirigir a la página de login si falla la renovación
                    });
                    return false;
                }
            );
        } else {
            console.info("[Authentication] El token aún no requiere renovación.");
            this.setState({
                isValidating: false
            });
            return false;
        }
    }

    /**
     * @method logout
     * Cierra sesión enviando una solicitud al servidor.
     * 
     * @description Cierra la sesión enviando una solicitud al servidor a través del `authProvider`.
     * Después de cerrar la sesión (exitosamente), redirige al usuario a la ruta de inicio de sesión.
     * @returns {Promise<Result>} Una promesa que resuelve a `true` si el cierre de sesión fue exitoso,
     * `false` en caso de error.
     */
    async logout() {
        console.log(`[Authentication] logout`);
        // Extrae el proveedor de autenticación de las propiedades del componente.
        const { provider: authProvider, ctx } = this.props;
        // Extrae opciones de autenticación desde el estado del componente.
        const { options } = this.state;

        // Intenta realizar el cierre de la sesión con el proveedor de autenticación.
        const result = await authProvider.logout(options.logoutPath);

        return result.switch(
            (value) => { // onSuccess
                // Actualiza el estado para reflejar una cierre de sesión exitoso.
                this.setState({
                    ticket: visitorTicket,
                    user: visitorTicket.principal,
                    isValidating: false,
                }, () => {
                    ctx.router.navigate(options.loginPage);
                });
                console.info("[Authentication] Cierre de sesión exitoso.");
                return Result.success(true);
            },
            (error) => { // onFailure
                console.error("[Authentication] Error durante el cierre de sesión:", error);
                return Result.failure(error);
            }
        );
    }

    /**
     * Método determina el estado de expiración
     * @method
     * @name isNearExpiry
     * @returns {boolean} - Un estado que indica si el toeken esta cerca de expirar.
     */
    isNearExpiry(withLog = false) {
        return this.state.ticket.isNearExpiry();
    }
}

export default withRouter(Authentication);
