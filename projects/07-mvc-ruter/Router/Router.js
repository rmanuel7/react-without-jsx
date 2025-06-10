import React from "react";
import parseRoutes from "./parseRoutes";
import matchRoute from "./matchRoute"; // tu función de match, soportando params si quieres

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPath: window.location.pathname };
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

  render() {
    const tree = this.props.children;
    const routes = parseRoutes(tree);
    const { route, params } = matchRoute(routes, this.state.currentPath);
    const user = this.props.user || null; // contexto de usuario

    if (!route) {
      return React.createElement("div", null, "404 - Página no encontrada");
    }

    // 1. AllowAnonymous: omite auth
    if (route.allowAnonymous) {
      return this.renderController(route, params, user);
    }

    // 2. RequireAuth: evalúa lógica de autorización si aplica
    if (route.requireAuth) {
      const isAuthorized = this.props.authorizeCheck
        ? this.props.authorizeCheck(route.authData, { params, user })
        : false;
      if (!isAuthorized) {
        return React.createElement("div", null, "Acceso denegado.");
      }
    }

    // 3. Sin restricciones, o autorizado
    return this.renderController(route, params, user);
  }

  renderController(route, params, user) {
    const { controller, action } = route;
    const controllerInstance = controller ? new controller() : null;
    if (controllerInstance && typeof controllerInstance[action] === "function") {
      // Puedes pasar navigate, location, user, etc.
      return controllerInstance[action]({ params, user });
    }
    return React.createElement("div", null, "404 Acción no encontrada");
  }
}
export default Router;
