import React from "react";
import Routes from "./Routes";
import Controller from "./Controller";
import Route from "./Route";
import RouterContext from "./RouterContext";
import matchRoute from "./matchRoute";

// Recursivo: aplana el árbol declarativo a una lista [{ path, controller, action }]
function parseRoutes(node, parentPath = "", parentController = null) {
    if (!node) return [];

    let routes = [];

    // <Routes>
    if (node.type && node.type.name === "Routes" && node.props && node.props.children) {
        const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
        children.forEach(child => {
            routes = routes.concat(parseRoutes(child, parentPath, parentController));
        });
        return routes;
    }

    // <Controller>
    if (node.type && node.type.name === "Controller" && node.props) {
        const { path = "", controller, children } = node.props;
        // parentPath puede terminar en /, path puede empezar con /
        let basePath = parentPath + (path ? (path.startsWith("/") ? path : (parentPath.endsWith("/") ? "" : "/") + path) : "");
        const childrenArray = Array.isArray(children) ? children : [children];
        childrenArray.forEach(child => {
            routes = routes.concat(parseRoutes(child, basePath, controller));
        });
        return routes;
    }

    // <Route>
    if (node.type && node.type.name === "Route" && node.props) {
        const { path = "", action } = node.props;
        let routePath = parentPath + (typeof path === "string" && path.length > 0
            ? (path.startsWith("/") ? path : (parentPath.endsWith("/") ? "" : "/") + path)
            : ""
        );
        // Asegura que routePath no termine con doble slash
        if (routePath.length > 1 && routePath.endsWith("/")) {
            routePath = routePath.slice(0, -1);
        }
        routes.push({
            path: routePath || "/",
            controller: parentController,
            action
        });
        return routes;
    }
    return [];
}

class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPath: window.location.pathname
        };
        this.navigate = this.navigate.bind(this);
        this.handlePopState = this.handlePopState.bind(this);
    }

    componentDidMount() {
        window.addEventListener("popstate", this.handlePopState);
    }

    componentWillUnmount() {
        window.removeEventListener("popstate", this.handlePopState);
    }

    handlePopState() {
        this.setState({ currentPath: window.location.pathname });
    }

    navigate(to) {
        if (to !== this.state.currentPath) {
            window.history.pushState({}, '', to);
            this.setState({ currentPath: to });
        }
    }

    render() {
        // 1. Parsear el árbol declarativo una sola vez sería óptimo,
        // pero aquí lo hacemos cada render para simplicidad.
        const tree = this.props.children;
        const routes = parseRoutes(tree);

        // 2. Buscar la ruta que matchea la url actual
        const { route, params } = matchRoute(routes, this.state.currentPath);

        // 3. Proveer el contexto y renderizar la acción del controlador
        if (route && route.controller && route.action) {
            const controllerInstance = new route.controller();
            const context = {
                params,
                location: { pathname: this.state.currentPath },
                navigate: this.navigate
            };
            let view = null;
            if (typeof controllerInstance[route.action] === "function") {
                view = controllerInstance[route.action](context);
            } else {
                view = React.createElement("div", null, "404 - Acción no encontrada");
            }
            return React.createElement(
                RouterContext.Provider,
                { value: { location: { pathname: this.state.currentPath }, params, navigate: this.navigate } },
                view
            );
        }
        // 4. No match: renderizar 404
        return React.createElement(
            RouterContext.Provider,
            { value: { location: { pathname: this.state.currentPath }, params: {}, navigate: this.navigate } },
            React.createElement("div", null, "404 - Página no encontrada")
        );
    }
}
export default Router;
