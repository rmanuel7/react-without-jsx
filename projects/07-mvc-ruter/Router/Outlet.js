// Outlet solo consume el contexto que está “más cerca”.
import React from "react";
import OutletContext  from "./OutletContext";

class Outlet extends React.Component {
    render() {
        return h({
            type: OutletContext.Consumer,
            props: {},
            children: [
                ({ outlet }) => outlet || null
            ]
        });
    }
}

export default Outlet;
