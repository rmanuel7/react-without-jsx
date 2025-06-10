// Outlet solo consume el contexto que está “más cerca”.
import React from "react";
import OutletContext  from "./OutletContext";

class Outlet extends React.Component {
    render() {
        return React.createElement(OutletContext.Consumer, {}, outletContext => {
            return outletContext && outletContext.outlet ? outletContext.outlet : null;
        });
    }
}

export default Outlet;
