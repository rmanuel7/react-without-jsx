import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * Componente `Unauthorized` que muestra un mensaje de acceso no autorizado (Error 401).
 * 
 * Este componente presenta un diseño centrado con un ícono de advertencia, 
 * un mensaje informativo y un botón para regresar a la página de inicio.
 * 
 * @class
 * @extends {React.Component}
 */
class Unauthorized extends React.Component {
    /**
     * @method render
     * Método de renderizado de React
     * 
     * @description 
     * Crea elementos React para renderizar un nodo en el DOM.
     * Renderiza el contenido de la página de acceso no autorizado.
     * 
     * @returns {React.Element} - Elemento React con el mensaje de error y botón de retorno.
     */
    render() {
        return h({
            type: 'div',
            props: {
                className: 'd-flex flex-column align-items-center justify-content-center vh-100 text-center'
            },
            children: [
                // Ícono de advertencia
                h({
                    type: 'i',
                    props: { className: 'bi bi-exclamation-triangle display-1 text-warning' },
                    children: []
                }),

                // Título con mensaje de error
                h({
                    type: 'h1',
                    props: { className: 'mt-3' },
                    children: ['401 - No Autorizado']
                }),

                // Mensaje adicional
                h({
                    type: 'p',
                    props: { className: 'text-muted' },
                    children: ['No tienes los permisos necesarios para acceder a esta página.']
                }),

                // Botón para regresar a la página principal
                h({
                    type: Link,
                    props: { to: '/', className: 'btn btn-primary mt-3' },
                    children: [
                        h({
                            type: 'i',
                            props: { className: 'bi bi-arrow-left me-2' },
                            children: []
                        }),
                        'Volver al inicio'
                    ]
                })
            ]
        });
    }
}

export default Unauthorized;
