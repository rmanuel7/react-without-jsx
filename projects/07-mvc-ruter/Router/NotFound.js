import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * @class NotFound
 * @augments {React.Component}
 * @description Un componente de página que se renderiza cuando la URL solicitada no coincide
 * con ninguna ruta definida en la aplicación (error 404 - Página no encontrada).
 *
 * Muestra un mensaje amigable al usuario y proporciona un enlace para regresar a la página de inicio.
 * Utiliza clases de Bootstrap (o un framework CSS similar) para el diseño.
 */
class NotFound extends React.Component {
    /**
     * El método `render` del componente `NotFound`.
     * Construye y renderiza la interfaz de usuario para la página "No encontrada".
     *
     * @returns {React.ReactElement} Un elemento React que representa la página de error 404.
     */
    render() {
        return h(
            {
                type: 'div',
                props: { className: 'd-flex flex-column justify-content-center align-items-center vh-100 bg-light' },
                children: [
                    h({
                        type: 'div',
                        props: { className: 'text-center' },
                        children: [
                            h({
                                type: 'i',
                                props: { className: 'bi bi-exclamation-triangle display-1 text-danger' },
                                children: []
                            }),
                            h({
                                type: 'h1',
                                props: { className: 'mt-4' },
                                children: ['Página no encontrada']
                            }),
                            h({
                                type: 'p',
                                props: { className: 'lead' },
                                children: ['No pudimos encontrar la página que buscabas.']
                            }),
                            h({
                                type: Link,
                                props: { className: 'btn btn-primary mt-3', to: '/' },
                                children: ['Volver al inicio']
                            }),
                        ]
                    })
                ]
            }
        );
    }
}

export default NotFound;
