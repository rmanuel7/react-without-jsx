function matchPath(routes, pathname) {
    // Quita trailing slashes para uniformidad
    const cleanPath = pathname.replace(/\/+$/, '') || '/';

    for (let route of routes) {
        // Soporte exacto
        if (route.path === cleanPath) {
            return { route, params: {} };
        }
        // Soporte básico para parámetros tipo /home/about/:id
        // route.path: "/home/about/:id"
        // pathname:   "/home/about/42"
        const routeParts = route.path.split('/');
        const pathParts = cleanPath.split('/');
        if (routeParts.length === pathParts.length) {
            let params = {};
            let match = true;
            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    const paramName = routeParts[i].slice(1);
                    params[paramName] = pathParts[i];
                } else if (routeParts[i] !== pathParts[i]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return { route, params };
            }
        }
    }
    // No match found
    return { route: null, params: {} };
}

export default matchPath;
