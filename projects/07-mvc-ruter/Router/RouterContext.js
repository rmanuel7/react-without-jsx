import React from "react";

const RouterContext = React.createContext({
    location: { pathname: "/" },
    params: {},
    navigate: () => {},
    // Puedes agregar más si lo necesitas
});

export default RouterContext;
