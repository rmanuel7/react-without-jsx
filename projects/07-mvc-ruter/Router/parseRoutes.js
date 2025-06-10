function parseRoutes(node, parent = {}) {
  if (!node) return [];

  let routes = [];

  // AllowAnonymous wrapper
  if (node.type && node.type.name === "AllowAnonymous") {
    const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
    children.forEach(child => {
      routes = routes.concat(parseRoutes(child, { ...parent, allowAnonymous: true, requireAuth: false, authData: null }));
    });
    return routes;
  }

  // Authorize wrapper
  if (node.type && node.type.name === "Authorize") {
    const authData = node.props;
    const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
    children.forEach(child => {
      routes = routes.concat(parseRoutes(child, { ...parent, requireAuth: true, allowAnonymous: false, authData }));
    });
    return routes;
  }

  // Controller
  if (node.type && node.type.name === "Controller") {
    const { path = "", controller, children } = node.props;
    const basePath = (parent.path || "") + (path ? (path.startsWith("/") ? path : "/" + path) : "");
    const childrenArr = Array.isArray(children) ? children : [children];
    childrenArr.forEach(child => {
      routes = routes.concat(parseRoutes(child, { ...parent, path: basePath, controller }));
    });
    return routes;
  }

  // Route
  if (node.type && node.type.name === "Route") {
    const { path = "", action } = node.props;
    let routePath = (parent.path || "") + (path ? (path.startsWith("/") ? path : "/" + path) : "");
    // Clean trailing slash except root
    if (routePath.length > 1 && routePath.endsWith("/")) {
      routePath = routePath.slice(0, -1);
    }
    routes.push({
      path: routePath || "/",
      controller: parent.controller,
      action,
      requireAuth: !!parent.requireAuth,
      allowAnonymous: !!parent.allowAnonymous,
      authData: parent.authData || null
    });
    return routes;
  }

  // Routes (root)
  if (node.type && node.type.name === "Routes") {
    const children = Array.isArray(node.props.children) ? node.props.children : [node.props.children];
    children.forEach(child => {
      routes = routes.concat(parseRoutes(child, parent));
    });
    return routes;
  }

  return [];
}
export default parseRoutes;
