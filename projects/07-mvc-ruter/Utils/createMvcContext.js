/**
 * Un objeto de contexto consolidado que proporciona información esencial
 * de la aplicación a componentes o funciones (ej. vistas, controladores).
 *
 * @typedef {object} MvcContext
 * @property {object} req - El objeto de solicitud del router, conteniendo información sobre la ruta actual, parámetros, ubicación, etc.
 * @property {object} res - Un objeto de respuesta, extensible para manejar redirecciones, códigos de estado HTTP, etc.
 * @property {ClaimsPrincipal} user - El objeto `ClaimsPrincipal` del usuario autenticado actualmente, o `null` si no hay usuario autenticado.
 * @property {object} [action] - Un objeto opcional que describe la acción actual que se está ejecutando. Se incluye solo si se proporciona.
 * @property {object} [extra] - Un objeto opcional que puede contener cualquier dato adicional que necesite ser inyectado en el contexto.
 */

import AuthenticationTicket from '../Authentication/AuthenticationTicket.js';
import ClaimsPrincipal from '../Authentication/ClaimsPrincipal.js';
import RequestContextValue from '../Router/RequestContextValue.js';
import Location from '../Router/Location.js';

/**
 * Crea y consolida un objeto de contexto MVC (Modelo-Vista-Controlador) a partir
 * de varias fuentes de información de la aplicación.
 *
 * Este contexto está diseñado para ser inyectado en componentes de vista,
 * funciones de controlador, o cualquier otra parte de la aplicación que requiera
 * acceso a información global sobre la solicitud, el usuario y el estado de la aplicación.
 *
 * @param {object} params - Los parámetros de entrada para construir el contexto.
 * @param {{req: RequestContextValue, location: Location}} params.router - El objeto del router, generalmente conteniendo `location`, `params`, `query`, etc.
 * @param {{user: ClaimsPrincipal, ticket: AuthenticationTicket}} [params.auth] - El objeto de autenticación, que debe contener la propiedad `user` (un {@link ClaimsPrincipal}).
 * @param {object} [params.action] - Un objeto opcional que describe la acción actual.
 * @param {object} [params.extra] - Un objeto opcional con propiedades adicionales a incluir directamente en el contexto resultante.
 *
 * @returns {MvcContext} Un objeto `MvcContext` consolidado.
 */
function createMvcContext({ router, request, auth, action, extra }) {
    return {
        /**
         * Gestionar la navegación del historial del navegador en una SPA.
         * @type {Location}
         */
        client: router.location,
        /**
         * El objeto de solicitud del router.
         * @type {RequestContextValue}
         */
        req: request,
        /**
         * Un objeto de respuesta extensible.
         * @type {object}
         */
        res: {}, // extensible para redirect, status, etc.
        /**
         * El usuario autenticado (ClaimsPrincipal).
         * @type {ClaimsPrincipal}
         */
        user: auth.user, // Acceso seguro a user
        /**
         * Objeto que describe la acción actual (si está presente).
         * @type {object | undefined}
         */
        ...(action && { action }), // solo si es relevante, usa la sintaxis de propagación condicional
        /**
         * Propiedades adicionales inyectadas en el contexto.
         * @type {object | undefined}
         */
        ...extra // Propiedades adicionales
    };
}

export default createMvcContext;
