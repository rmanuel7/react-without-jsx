/**
 * The react-dom/client package provides client-specific methods used for initializing an app on the client. 
 * Most of your components should not need to use this module.
 * @example
 * import * as ReactDOM from 'react-dom/client';
 * @see {@link https://github.com/facebook/react/blob/main/packages/react-dom/src/client/ReactDOMRoot.js#L165C17-L165C27}
 */


/**
 * @typedef {object} CreateRootOptions - Representa los parámetros para crear una raíz de React con `ReactDOM.createRoot`.
 * @property {HTMLElement} container - El contenedor donde se creará la raíz de React.
 * @property {Object} [options={}] - Opciones de configuración opcionales.
 * @property {Function} [options.onRecoverableError] - Callback que se ejecuta cuando React se recupera de un error.
 * @property {string} [options.identifierPrefix] - Prefijo para los IDs generados por React mediante `React.useId`.
 */
/**
 * Función envoltura de `ReactDOM.createRoot` que mejora la legibilidad.
 * @function
 * @name createReactRoot
 * @description - Crea una raíz de React en el contenedor especificado.
 * @param {CreateRootOptions} param0 - Objeto de configuración.
 * @returns {ReactDOM.Root | null} - La raíz de React creada o `null` si el contenedor no es un elemento HTML válido.
 */
export function createReactRoot({ container, options = {} }) {
    if (!(container instanceof HTMLElement)) {
        console.error('El argumento `container` debe ser un elemento HTML válido.');
        return null;
    }
    return ReactDOM.createRoot(container, options);
}


/**
 * @typedef {object} CreatePortalOptions
 * @property {React.ReactNode} children - Los elementos React (JSX) que deseas renderizar en el portal.
 * @property {HTMLElement} containerNode - El nodo DOM donde se renderizará el portal.
 */
/**
 * Envuelve ReactDOM.createPortal para proporcionar una interfaz con parámetros nombrados
 * y facilitar su uso.
 *
 * @param {CreatePortalOptions} options - Un objeto que contiene los children y el nodo contenedor.
 * @returns {React.Portal} Un portal de React creado con los elementos y el nodo especificados.
 */
export function createReactPortal({ children, containerNode }) {
    if (!(containerNode instanceof HTMLElement)) {
        console.error('El containerNode proporcionado no es un elemento HTML válido.');
        return null; // O podrías lanzar un error, dependiendo de tu manejo de errores deseado
    }

    return ReactDOM.createPortal(children, containerNode);
}


/**
 * @typedef {object} RenderRootOptions - Representa los parámetros para renderizar un elemento en una raíz de React.
 * @property {ReactDOM.Root} root - La instancia de la raíz de React donde se renderizará el elemento.
 * @property {React.ReactElement} element - El elemento React que se va a renderizar.
 * @property {Function} [callback] - Callback opcional que se ejecuta después de que el componente se haya renderizado.
 */
/**
 * Renderiza un elemento React dentro de la raíz proporcionada.
 * @function
 * @name renderReactRoot
 * @param {RenderRootOptions} param0 - Objeto de configuración.
 * @returns {void} - React 18 `root.render()` no devuelve una instancia del componente.
 */
export function renderReactRoot({ root, element, callback }) {
    root.render(element, callback);
}


/**
 * @typedef {object} CreateElementOptions - Un objeto que representa los parámetros nombrados para crear el elemento con React.createElement.
 * @property {string|React.ComponentType} type - El tipo del elemento a crear. Puede ser un nombre de etiqueta HTML (string) como 'div' o 'span', o un componente de React (función o clase).
 * @property {object} [props] - Un objeto que contiene las propiedades (props) del elemento. Puede ser `null` o no estar presente si no hay propiedades que pasar.
 * @property {React.ReactNode[]} [children] - Un array de hijos del elemento. Pueden ser otros elementos React, cadenas, números, o arrays de estos.
 */
/**
 * Función envoltura de `React.createElement` que mejora la legibilidad.
 * @function
 * @name createReactElement
 * @description - Crea y retorna un nuevo `React.ReactElement`, del `type` proporcionado.
 * @param {CreateElementOptions} param0 - Objeto de configuración.
 * @returns {React.ReactElement | null} Un elemento de React o `null` si `children` no es un array válido.
 */
export function createReactElement({ type, props = {}, children = [] }) {
    if (children && !Array.isArray(children)) {
        // console.info('[createReactElement] El argumento `children` debe ser un array.', { children });
        children = Array.isArray(children) ? children : [children];
    }
    return React.createElement(type, props, ...children);
}


/**
 * @typedef {object} LazyElementOptions - Representa los parámetros para crear un elemento React diferido con `React.lazy` y `React.Suspense`.
 * @property {string} path - Ruta del módulo del componente que se cargará de manera diferida mediante `import()`.
 * @property {Record<string, any>} [props={}] - Un objeto con las propiedades (atributos) del elemento. Puede ser `null` o estar ausente si no hay propiedades.
 * @property {React.ReactNode[]} [children=[]] - Un array de nodos hijos que se añadirán al componente cargado de manera diferida.
 */
/**
 * Genera un elemento React que utiliza `React.Suspense` y `React.lazy`
 * para cargar un componente de forma diferida, mejorando la legibilidad y estructura del código.
 * @function
 * @name createReactLazy
 * @param {LazyElementOptions} param0 - Objeto de configuración.
 * @returns {React.ReactElement} - El elemento React creado con carga diferida.
 */
export function createReactLazy({ path, props = {}, children = [] }) {
    if (children && !Array.isArray(children)) {
        console.error('El argumento `children` debe ser un array.');
        return null; // O lanzar un error, dependiendo del manejo de errores deseado 
    }

    return createReactElement({
        type: React.Suspense,
        props: {},
        children: [
            createReactElement({
                type: React.lazy(() => import(path)),
                props: props,
                children: children
            })
        ]
    });
}


/**
 * @typedef {object} CloneElementOptions - Representa los parámetros para clonar un elemento React.
 * @property {React.ReactElement} element - El elemento React que se va a clonar.
 * @property {object} [config={}] - Un objeto con las propiedades adicionales que se fusionarán con el elemento original.
 * @property {React.ReactNode[]} [children=[]] - Un array de nodos hijos que se añadirán al elemento clonado.
 */
/**
 * Función envoltura de `React.cloneElement` para mejorar la legibilidad.
 * @function
 * @name cloneReactElement
 * @description - Clona un elemento React, aplicando nuevas propiedades y agregando nodos hijos si se proporcionan.
 * @param {CloneElementOptions} param0 - Objeto de configuración.
 * @returns {React.ReactElement} - El elemento React clonado con las modificaciones aplicadas.
 */
export function cloneReactElement({ element, config = {}, children = [] }) {
    if (children && !Array.isArray(children)) {
        console.error('El argumento `children` debe ser un array.');
        return null; // O lanzar un error, dependiendo del manejo de errores deseado 
    }
    return React.cloneElement(element, config, ...children);
}

