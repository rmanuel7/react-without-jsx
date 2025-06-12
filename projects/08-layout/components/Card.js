import { createReactElement as h } from '../Shared/ReactFunctions.js';

/**
 * @typedef {object} CardClassNames
 * @property {string} [header] - Clases CSS adicionales para el elemento `card-header`.
 * @property {string} [toolbar] - Clases CSS adicionales para el elemento `card-header` cuando se usa como barra de herramientas.
 * @property {string} [body] - Clases CSS adicionales para el elemento `card-body`.
 * @property {string} [title] - Clases CSS adicionales para el elemento `card-title`.
 * @property {string} [text] - Clases CSS adicionales para el elemento `card-text`.
 * @property {string} [footer] - Clases CSS adicionales para el elemento `card-footer`.
 */

/**
 * @typedef {object} CardProps
 * @property {React.ReactNode} [header] - Contenido para la sección del encabezado de la tarjeta (`card-header`).
 * @property {React.ReactNode} [toolbar] - Contenido para la sección de la barra de herramientas de la tarjeta (`card-header`).
 * Si `header` y `toolbar` están presentes, se renderizarán ambos encabezados.
 * @property {React.ReactNode} [title] - Contenido para el título de la tarjeta (`card-title`), renderizado dentro del `card-body`.
 * @property {React.ReactNode} [text] - Contenido de texto para la tarjeta (`card-text`), renderizado dentro del `card-body`.
 * @property {React.ReactNode} [children] - Contenido principal de la tarjeta, renderizado dentro del `card-body`
 * después del título y el texto.
 * @property {React.ReactNode} [footer] - Contenido para la sección del pie de página de la tarjeta (`card-footer`).
 * @property {string} [className=''] - Clases CSS adicionales para el elemento `div` principal de la tarjeta (`card`).
 * @property {CardClassNames} [classNames={}] - Un objeto que contiene clases CSS adicionales para sub-elementos específicos de la tarjeta.
 */

/**
 * @class Card
 * @augments {React.Component<CardProps>}
 * @description Un componente versátil para construir interfaces tipo "tarjeta"
 * con secciones opcionales de encabezado, cuerpo y pie de página.
 * Permite una fácil personalización a través de props para el contenido y clases CSS.
 *
 * Utiliza una estructura basada en Bootstrap (o un framework similar) con clases
 * como `card`, `card-header`, `card-body`, `card-title`, `card-text`, `card-footer`.
 */
class Card extends React.Component {
    /**
     * @private
     * @type {CardProps}
     * @description Las propiedades del componente Card.
     * @see {CardProps}
     */
    props; // Esta línea es solo para el JSDoc, no se declara en el código real.

    /**
     * El método `render` del componente `Card`.
     * Se encarga de construir la estructura de la tarjeta utilizando las props proporcionadas.
     * Combina las clases base con las clases personalizadas para cada sección.
     *
     * @returns {React.ReactElement} Un elemento React que representa la estructura completa de la tarjeta.
     */
    render() {
        console.log('[Card] render');

        const {
            header,
            toolbar,
            title,
            text,
            children,
            footer,
            className = '',
            classNames = {},
            ...restProps // Captura cualquier otra prop para pasarlas al div principal
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
            type: 'div',
            props: { className: combineClasses('card h-100', className) },
            children: [
                // Header (card-header): Se renderiza si la prop `header` está presente.
                header && h({
                    type: 'div',
                    props: { className: combineClasses('card-header', classNames.header) },
                    children: [header]
                }),
                // Toolbar (card-header): Se renderiza si la prop `toolbar` está presente.
                // Comparte la misma clase base `card-header` con `header`.
                toolbar && h({
                    type: 'div',
                    props: { className: combineClasses('card-header', classNames.toolbar) },
                    children: [toolbar]
                }),
                // Body (card-body): Contenedor principal para el contenido de la tarjeta.
                h({
                    type: 'div',
                    props: { className: combineClasses('card-body', classNames.body) },
                    children: [
                        // Title (card-title): Se renderiza si la prop `title` está presente.
                        title && h({
                            type: 'h5', // El título de la tarjeta suele ser un h5
                            props: { className: combineClasses('card-title', classNames.title) },
                            children: [title]
                        }),

                        // Text (card-text): Se renderiza si la prop `text` está presente.
                        text && h({
                            type: 'p',
                            props: { className: combineClasses('card-text', classNames.text) },
                            children: [text]
                        }),

                        // Content (children): Los hijos del componente `Card` se renderizan aquí.
                        // `React.Children.toArray` asegura que incluso si `children` es un único elemento,
                        // se maneje como un array.
                        ...React.Children.toArray(children)
                    ].filter(Boolean) // `.filter(Boolean)` elimina cualquier elemento nulo o falso del array de hijos.
                }),
                // Footer (card-footer): Se renderiza si la prop `footer` está presente.
                footer && h({
                    type: 'div',
                    props: { className: combineClasses('card-footer text-body-secondary', classNames.footer) },
                    children: [footer]
                })
            ].filter(Boolean) // `.filter(Boolean)` aquí también, para limpiar el array de secciones de la tarjeta.
        });
    }
}

export default Card;
