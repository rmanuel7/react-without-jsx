import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * @typedef {Object} NavbarProps
 * @property {string | React.ReactNode} [brand] - Contenido para la marca principal (texto o nodo).
 * @property {React.ReactNode | React.ReactNode[]} [children] - Contenido principal de la barra (botones, textos, etc).
 * @property {React.ReactNode | React.ReactNode[]} [text] - Texto alineado al centro/derecha.
 * @property {React.ReactNode | React.ReactNode[]} [actions] - Botones o elementos alineados al lado derecho.
 */

/**
 * Componente Navbar de Bootstrap con soporte para `brand`, `text` y `actions`.
 * Estructura semántica basada en `h()` sin JSX.
 *
 * @extends React.Component<NavbarProps>
 */
class Navbar extends React.Component {
    render() {
        const {
            brand,
            togglerOptions = {},
            children,
            text,
            actions,
            className,
            classNames = {}
        } = this.props;

        /**
         * Función auxiliar para combinar clases CSS base con clases personalizadas.
         * Elimina espacios extra y asegura un formato correcto.
         * @private
         * @param {string} baseClasses - Las clases CSS predeterminadas para un elemento.
         * @param {string} [customClasses] - Clases CSS adicionales proporcionadas por el usuario.
         * @returns {string} La cadena de clases CSS combinadas y limpias.
         */
        const combineClasses = (baseClasses, customClasses) => {
            return `${baseClasses} ${customClasses || ''}`.trim();
        };

        return h({
            type: 'nav',
            props: { className: combineClasses('navbar', className) },
            children: [
                h({
                    type: 'div',
                    props: { className: 'container-fluid' },
                    children: [
                        h({
                            type: 'div', props: { className: 'd-flex gap-3' },
                            children: [
                                // Navbar toggler (opcional, puedes parametrizarlo después)
                                h({
                                    type: 'button',
                                    props: {
                                        className: combineClasses('navbar-toggler', classNames.toggler),
                                        type: 'button',
                                        ...togglerOptions
                                    },
                                    children: [
                                        h({
                                            type: 'span',
                                            props: { className: 'navbar-toggler-icon' }
                                        })
                                    ]
                                }),

                                // Brand
                                brand && h({
                                    type: 'a',
                                    props: { className: combineClasses('navbar-brand', classNames.brand), href: '#' },
                                    children: [brand]
                                }),
                            ]
                        }),

                        // Text (como un título centrado, si lo deseas)
                        text && h({
                            type: 'span',
                            props: { className: combineClasses('navbar-text', classNames.text) },
                            children: [text]
                        }),

                        // Children adicionales (menús, enlaces, etc.)
                        children,

                        // Botones o acciones (parte derecha)
                        actions && h({
                            type: 'div',
                            props: { className: 'd-flex' },
                            children: Array.isArray(actions) ? actions : [actions]
                        })
                    ].filter(Boolean)
                })
            ]
        });
    }
}

export default Navbar;
