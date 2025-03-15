¡Claro! Vamos a construir un middleware de autenticación en React con ES6 Clases, sin JSX y sin React Router, basado en la estructura que proporcionaste.

**Estructura del Middleware de Autenticación**

Vamos a crear un componente `AuthMiddleware` que envolverá tu `App` y manejará la lógica de autenticación y autorización.

```javascript
class AuthMiddleware extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthorized: false,
            user: null,
            loading: true // Para manejar el estado de carga inicial
        };
        this.authenticate = this.authenticate.bind(this);
        this.authorize = this.authorize.bind(this);
    }

    componentDidMount() {
        // Simulación de una llamada a la API para verificar la autenticación
        this.authenticate();
    }

    authenticate() {
        // Simulación de lógica de autenticación (reemplaza con tu lógica real)
        setTimeout(() => {
            const token = localStorage.getItem('authToken'); // Ejemplo: token en localStorage
            if (token) {
                // Simulación de obtención de datos del usuario desde el token
                const user = {
                    id: 1,
                    username: 'usuarioEjemplo',
                    policies: ['admin', 'user'] // Ejemplo de políticas
                };
                this.setState({ isAuthenticated: true, user: user, loading: false });
            } else {
                this.setState({ isAuthenticated: false, user: null, loading: false });
                // Redirigir al login (simulado)
                console.log('Redirigiendo al login...');
            }
        }, 1000); // Simulación de retardo de 1 segundo
    }

    authorize(policyName) {
        const { user } = this.state;
        if (!user || !user.policies.includes(policyName)) {
            console.log('Acceso no autorizado.');
            return false;
        }
        return true;
    }

    render() {
        const { isAuthenticated, user, loading } = this.state;

        if (loading) {
            return React.createElement('div', null, 'Cargando...'); // Mostrar un indicador de carga
        }

        if (!isAuthenticated) {
            return React.createElement('div', null, 'No autenticado. Por favor, inicia sesión.'); // Mensaje de no autenticado
        }

        // Pasar las props y los métodos de autenticación/autorización a la App
        return React.createElement(this.props.component, {
            isAuthenticated: isAuthenticated,
            user: user,
            authorize: this.authorize,
            handleError: this.props.handleError, // Pasar el handleError de App
            handleAuthentication: this.props.handleAuthentication, // Pasar el handleAuthentication de App
            handleAuthorization: this.props.handleAuthorization // Pasar el handleAuthorization de App
        });
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: {
                has: false,
                code: 0,
                fallback: null
            },
            // No necesitamos isAuthenticated, isAuthorized, user aquí, ya que vienen del middleware
        };
        this.handleError = this.handleError.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.handleAuthorization = this.handleAuthorization.bind(this);
    }

    handleError(error) {
        this.setState({
            error: { ...error }
        });
        console.error('Error capturado:', error);
    }

    handleAuthentication(user) {
        if (!user) {
            console.log('Redirigiendo al Login...');
        } else {
            console.log('Usuario autenticado:', user);
        }
    }

    handleAuthorization(user, policyName) {
        const allowedPolicies = user?.policies || [];
        if (!allowedPolicies.includes(policyName)) {
            console.log('Acceso no autorizado.');
            return false;
        }
        return true;
    }

    render() {
        // Ejemplo de uso de la autorización
        if (this.props.authorize('admin')) {
            return React.createElement('div', null, 'Contenido para administradores.');
        } else if (this.props.authorize('user')) {
            return React.createElement('div', null, 'Contenido para usuarios.');
        } else {
            return React.createElement('div', null, 'Acceso denegado.');
        }
    }
}

// Uso del middleware
const rootElement = document.getElementById('root');
ReactDOM.render(
    React.createElement(AuthMiddleware, { component: App, handleError: (error) => console.error(error), handleAuthentication: (user) => console.log(user), handleAuthorization: (user, policyName) => console.log(user, policyName) }),
    rootElement
);
```

**Explicación**

1.  **`AuthMiddleware`:**
    * Maneja el estado de autenticación (`isAuthenticated`, `user`, `loading`).
    * `authenticate()` simula la verificación de autenticación (reemplaza con tu lógica real).
    * `authorize()` verifica si el usuario tiene la política necesaria.
    * Renderiza un indicador de carga mientras se verifica la autenticación.
    * Si no está autenticado, muestra un mensaje.
    * Si está autenticado, renderiza el componente `App` y le pasa las props necesarias.
2.  **`App`:**
    * Recibe las props `isAuthenticated`, `user`, y `authorize` del `AuthMiddleware`.
    * Utiliza `this.props.authorize()` para verificar la autorización antes de renderizar el contenido.
    * Los metodos `handleError`, `handleAuthentication` y `handleAuthorization` son pasados desde el componente padre, y pueden ser usados dentro de App.
3.  **Uso:**
    * Envolvemos `App` con `AuthMiddleware` en `ReactDOM.render()`.
    * Pasamos los metodos de App a AuthMiddleware.

**Puntos Clave**

* **Simulación de Autenticación:** Reemplaza la lógica de `authenticate()` con tu implementación real (por ejemplo, llamadas a una API).
* **Autorización:** Ajusta la lógica de `authorize()` según tus necesidades.
* **Manejo de Errores:** Implementa un manejo de errores más robusto en `handleError()`.
* **Redirección:** Implementa la lógica de redirección al login en `authenticate()` cuando el usuario no está autenticado.
* **Estado de Carga:** El estado `loading` es importante para evitar mostrar contenido antes de que se complete la verificación de autenticación.

Este ejemplo proporciona una base sólida para tu middleware de autenticación. Puedes adaptarlo y expandirlo según los requisitos específicos de tu aplicación.
