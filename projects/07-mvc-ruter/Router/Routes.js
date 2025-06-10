import React from "react";

class Routes extends React.Component {
    render() {
        // Solo actúa como wrapper para Route(s)
        return this.props.children || null;
    }
}

export default Routes;
