/* eslint-disable no-undef */
export default class StepperContent extends React.Component {

    constructor(props) {
        super(props);
        //! Enlazar metodos
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(e);
    }

    render() {
        return React.createElement(
            'form', { onSubmit: this.handleSubmit },
            React.createElement(
                'div', { className: 'position-absolute top-0 end-0 p-2' },
                `${this.props.current} / ${this.props.length}`
            ),
            this.props.children
        )
    }
}
