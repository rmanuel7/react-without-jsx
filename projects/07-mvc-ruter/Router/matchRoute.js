import {
    isController,
    isLayout,
    isView,
    isAuthorize,
    isAllowAnonymous
} from '../Shared/IsType.js';
import normalizePath from './normalizePath.js';
import matchPath from './matchPath.js';

/**
 * Recursivamente busca coincidencias de ruta y acumula los valores para los contextos y la información del componente de página final.
 *
 * @param {Array} children - Hijos de la ruta actual (elementos React).
 * @param {string} currentLocationPath - La ruta actual de la URL.
 * @param {string} basePath - El path base acumulado para el nivel actual.
 * @param {object} currentContextValues - Objeto acumulador de los valores de contexto y page/props.
 * @returns {object|null} { contextValues, pageComponent, pageProps } si hay match, o null.
 *
 * @example
 * // Definición global de las rutas de la aplicación
 * // Esta estructura se pasa como `children` al componente `Routes` principal.
 * h({
 *     type: Routes,
 *     props: {}, // El componente Routes puede tener props como `basePath`, `location`, etc.
 *     children: [
 *
 *         // --- Bloque de Rutas para Áreas Protegidas (Administración) ---
 *         // Toda ruta anidada aquí requiere los roles "admin" o "editor"
 *         h({
 *             type: Authorize,
 *             props: {
 *                 roles: ["admin", "editor"] // Especifica los roles necesarios para estas rutas
 *                 // También podrías usar 'policy: "AdminPolicy"' o 'claims: [{ type: "Permission", value: "EditUsers" }]'
 *             },
 *             children: h({
 *                 type: Controller,
 *                 props: {
 *                     path: "/admin", // El path base para todas las rutas dentro de este controlador
 *                     controller: AdminController // Referencia al controlador asociado a este path
 *                 },
 *                 children: [
 *                     // Rutas específicas dentro del controlador de administración
 *                     h({
 *                         type: Route,
 *                         props: { path: "dashboard", action: "Dashboard" } // Ruta para el dashboard de admin
 *                     }),
 *                     h({
 *                         type: Route,
 *                         props: { path: "users", action: "Users" } // Ruta para la gestión de usuarios
 *                     }),
 *                     // ... otras rutas de /admin
 *                 ]
 *             })
 *         }),
 *
 *         // --- Bloque de Rutas para la Cuenta de Usuario ---
 *         // Requiere el rol "admin" para las rutas por defecto, con una excepción anónima.
 *         h({
 *             type: Authorize,
 *             props: {
 *                 roles: ["admin"] // Requiere el rol "admin" para las rutas dentro de este Authorize
 *             },
 *             children: h({
 *                 type: Controller,
 *                 props: {
 *                     path: "/account", // Path base para las rutas de la cuenta
 *                     controller: AccountController
 *                 },
 *                 children: [
 *                     // Ruta de login: Permite acceso anónimo, sobrescribiendo el Authorize padre
 *                     h({
 *                         type: AllowAnonymous, // Marca esta ruta como accesible sin autenticación/autorización
 *                         props: {},
 *                         children: [
 *                             h({
 *                                 type: Route,
 *                                 props: { path: "login", action: "Login" } // Ruta de login
 *                             })
 *                         ]
 *                     }),
 *                     // Ruta de logout: Protegida por el Authorize padre
 *                     h({
 *                         type: Route,
 *                         props: { path: "logout", action: "Logout" } // Ruta de logout
 *                     }),
 *                     // ... otras rutas de /account
 *                 ]
 *             })
 *         })
 *
 *         // ... más definiciones de rutas aquí
 *
 *     ]
 * });
 */
function matchRoute(children, currentLocationPath, basePath = "", currentContextValues = {}) {
    for (const child of React.Children.toArray(children)) {
        if (!React.isValidElement(child)) continue;

        const { props } = child;
        const { path = '', index, element: RouteElement, children, ...resProps } = props;
        const { type } = RouteElement;
        // --- MANEJO DE WRAPPERS/DECLARADORES DE CONTEXTO ---

        // Authorize / AllowAnonymous: Declara requisitos de autorización
        if (isAuthorize(type) || isAllowAnonymous(type)) {
            const authorizationDescriptor = {
                type: isAuthorize(type) ? 'authorize' : 'allowAnonymous',
                config: resProps
            };
            const newContextValues = { ...currentContextValues, authorization: authorizationDescriptor };

            const res = matchRoute(
                React.Children.toArray(children),
                currentLocationPath,
                basePath,
                newContextValues
            );
            if (res) return res;
        }

        // Layout (si lo usas como un wrapper de ruta explícito)
        else if (isLayout(type)) {
            const newContextValues = { ...currentContextValues, layout: { element: RouteElement, props: resProps } };

            const res = matchRoute(
                React.Children.toArray(children),
                currentLocationPath,
                basePath,
                newContextValues
            );
            if (res) return res;
        }

        // Controller: Actualiza basePath y puede proveer ControllerContext
        else if (isController(type)) {
            // Construir la ruta completa combinando la base heredada con la ruta actual.
            const newBasePath = normalizePath(
                path.startsWith('/') ? path : `${basePath}/${path}`
            );
            const controllerInfo = { element: RouteElement, props: resProps, path: newBasePath };
            const routeMatchInfo = { ...currentContextValues.routeMatch, controller: controllerInfo };

            const newContextValues = { ...currentContextValues, routeMatch: routeMatchInfo };

            const res = matchRoute(
                React.Children.toArray(children),
                currentLocationPath,
                newBasePath,
                newContextValues
            );
            if (res) return res;
        }

        // Route: Intenta hacer match final y define pageComponent y pageProps
        else if (isView(type)) {
            // Construir la ruta completa combinando la base heredada con la ruta actual.
            const routePath = normalizePath(
                path.startsWith('/') ? path : `${basePath}/${path}`
            );

            // Intentar coincidir con la URL actual.
            const params = matchPath(routePath, normalizePath(currentLocationPath));

            // Coincidencia exacta (incluye index route con path vacío)
            const isExactMatch = params && (
                normalizePath(currentLocationPath) === normalizePath(
                    routePath.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => params[key])
                )
            );

            // Si es una coincidencia exacta, devolvemos directamente
            if (isExactMatch) {
                const { routeMatch: currentRouteMatch } = currentContextValues;

                const actionInfo = {
                    path: currentLocationPath,
                    element: RouteElement,
                    props: resProps,
                    fromRoute: params,
                };

                const routeMatchInfo = { ...currentRouteMatch, action: actionInfo };

                return {
                    ...currentContextValues,
                    routeMatch: routeMatchInfo
                };
            }
        }
    }
    return null; // No match
}

export default matchRoute;
