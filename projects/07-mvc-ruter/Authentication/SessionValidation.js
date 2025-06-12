import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * Componente `SessionValidation` que muestra un mensaje de validación de sesión en curso.
 * 
 * Este componente presenta una pantalla centrada con un indicador de carga 
 * y un mensaje informativo para mejorar la experiencia del usuario.
 * 
 * @class
 * @extends {React.Component}
 */
class SessionValidation extends React.Component {
    /**
     * Renderiza el mensaje de validación de sesión con un icono de carga.
     * 
     * @returns {React.Element} - Elemento React con la indicación de sesión en validación.
     */
    render() {
        return h({
            type: 'div',
            props: { className: 'd-flex flex-column align-items-center justify-content-center vh-100 text-center' },
            children: [
                // Ícono de carga animado
                h({
                    type: 'div',
                    props: { className: 'spinner-border text-primary', role: 'status' },
                    children: [
                        h({ type: 'span', props: { className: 'visually-hidden' }, children: ['Cargando...'] })
                    ]
                }),

                // Mensaje de validación
                h({
                    type: 'p',
                    props: { className: 'mt-3 text-muted' },
                    children: ['Validando sesión, por favor espera...']
                })
            ]
        });
    }
}

export default SessionValidation;
