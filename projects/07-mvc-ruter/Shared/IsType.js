import {
    MVCROUTER_ROUTE_TYPE,
    MVCROUTER_ROUTES_TYPE,
    MVCROUTER_CONTROLLER_TYPE,
    MVCROUTER_LAYOUT_TYPE,
    MVCROUTER_VIEW_TYPE,
    MVCROUTER_AUTHORIZE_TYPE,
    MVCROUTER_ALLOWANONYMOUS_TYPE
} from './MvcSymbols.js';

export function typeOf(object) {
    //if (typeof object === 'object' && object !== null) {
        const __typeof = object.__typeof;
        switch (__typeof) {
            case MVCROUTER_ROUTE_TYPE:
            case MVCROUTER_ROUTES_TYPE:
            case MVCROUTER_CONTROLLER_TYPE:
            case MVCROUTER_LAYOUT_TYPE:
            case MVCROUTER_VIEW_TYPE:
            case MVCROUTER_AUTHORIZE_TYPE:
            case MVCROUTER_ALLOWANONYMOUS_TYPE:
                return __typeof;
        }
    //}

    return undefined;
}

/**
 * Validar si el objeto es de tipo Route
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente Route, 'false' en caso contrario.
 */
export function isRoute(object) {
    return typeOf(object) === MVCROUTER_ROUTE_TYPE;
}

/**
 * Validar si el objeto es de tipo Routes
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente Routes, 'false' en caso contrario.
 */
export function isRoutes(object) {
    return typeOf(object) === MVCROUTER_ROUTES_TYPE;
}

/**
 * Validar si el objeto es de tipo Controller
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente Controller, 'false' en caso contrario.
 */
export function isController(object) {
    return typeOf(object) === MVCROUTER_CONTROLLER_TYPE;
}

/**
 * Validar si el objeto es de tipo Layout
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente Layout, 'false' en caso contrario.
 */
export function isLayout(object) {
    return typeOf(object) === MVCROUTER_LAYOUT_TYPE;
}

/**
 * Validar si el objeto es de tipo View
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente View, 'false' en caso contrario.
 */
export function isView(object) {
    return typeOf(object) === MVCROUTER_VIEW_TYPE;
}

/**
 * Validar si el objeto es de tipo Authorize
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente Authorize, 'false' en caso contrario.
 */
export function isAuthorize(object) {
    return typeOf(object) === MVCROUTER_AUTHORIZE_TYPE;
}

/**
 * Validar si el objeto es de tipo AllowAnonymous
 * 
 * @param {object} object
 * @returns {boolean} 'true' si es un componente AllowAnonymous, 'false' en caso contrario.
 */
export function isAllowAnonymous(object) {
    return typeOf(object) === MVCROUTER_ALLOWANONYMOUS_TYPE;
}
