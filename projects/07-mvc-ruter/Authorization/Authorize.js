
class Authorize extends React.Component {
    render() {
        return h({
            type: AuthzContext.Provider,
            props: {
                value: {
                    type: 'authorize',
                    config: {
                        roles: this.props.roles || null,
                        policy: this.props.policy || null,
                        claims: this.props.claims || null,
                    }
                }
            },
            children: [
                h({ type: Outlet })
            ]
        });
    }
}

export default Authorize;
