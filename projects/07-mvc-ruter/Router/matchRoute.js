// Adaptación de tu función matchRouteAndBuildContexts
function matchRoute(children, currentLocationPath, basePath = "", currentContextValues = {}) {
    for (const child of React.Children.toArray(children)) {
        if (!React.isValidElement(child)) continue;

        const { type, props } = child;

        if (type === Authorization) {
            const authorizationDescriptor = {
                type: 'authorize',
                config: props
            };
            const newContextValues = { ...currentContextValues, authorization: authorizationDescriptor };

            const res = matchRoute(
                React.Children.toArray(props.children),
                currentLocationPath,
                basePath,
                newContextValues
            );
            if (res) return res;
        }
        else if (type === Layout) {
            const layoutComponent = props.layoutComponent || Layout;
            const newContextValues = { ...currentContextValues, layout: { type: layoutComponent, props } };

            const res = matchRoute(
                React.Children.toArray(props.children),
                currentLocationPath,
                basePath,
                newContextValues
            );
            if (res) return res;
        }
        else if (type.name === "Controller") {
            const ctrlPath = props.path || "";
            const newBasePath = basePath + ctrlPath;
            const controllerInfo = { type, props, path: newBasePath };
            const routeMatchInfo = { ...currentContextValues.routeMatch, controller: controllerInfo };

            const newContextValues = { ...currentContextValues, routeMatch: routeMatchInfo };

            const res = matchRoute(
                React.Children.toArray(props.children),
                currentLocationPath,
                newBasePath,
                newContextValues
            );
            if (res) return res;
        }
        else if (type.name === "Route") {
            const routePath = basePath + (props.path || "");
            const params = matchPath(routePath, currentLocationPath);

            if (params) {
                const { routeMatch: currentRouteMatch } = currentContextValues;

                const actionInfo = {
                    path: currentLocationPath,
                    name: type.name,
                    props: props,
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
