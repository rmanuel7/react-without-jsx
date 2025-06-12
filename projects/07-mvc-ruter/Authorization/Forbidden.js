import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * Componente `Forbidden` que muestra un mensaje de acceso denegado (Error 403).
 * 
 * Este componente presenta un diseño centrado con un ícono de bloqueo, 
 * un mensaje informativo y un botón para regresar a la página de inicio.
 * 
 * @class
 * @extends {React.Component}
 */
class Forbidden extends React.Component {
    /**
     * @method render
     * Método de renderizado de React
     * 
     * @description 
     * Crea elementos React para renderizar un nodo en el DOM.
     * Renderiza el contenido de la página de acceso denegado.
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
                // Ícono de escudo con candado
                h({
                    type: 'i',
                    props: { className: 'bi bi-shield-lock display-1 text-danger' },
                    children: []
                }),

                // Título con mensaje de error
                h({
                    type: 'h1',
                    props: { className: 'mt-3' },
                    children: ['403 - Acceso Denegado']
                }),

                // Mensaje adicional
                h({
                    type: 'p',
                    props: { className: 'text-muted' },
                    children: ['No tienes permiso para acceder a esta página.']
                }),

                // Botón para regresar a la página principal
                h({
                    type: Link,
                    props: { to: '', className: 'btn btn-primary mt-3' },
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

export default Forbidden;
