/* eslint-disable no-undef */
export default class StepperButton extends React.Component {

    constructor(props) {
        super(props);
        //! Enlazar los metodos
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    handleBack() {
        this.props.onBack();
    }

    handleNext() {
        //! this.props.onNext();
    }

    btnDisabled(state) {
        return state ? 'btn btn-primary' : 'btn btn-secondary disabled';
    }

    render() {
        return React.createElement(
            'div', { className: 'd-flex justify-content-between mt-4' },
            React.createElement(
                'button', {
                    type: 'button',
                    name: 'btn-back',
                    className: this.btnDisabled(this.props.isFirstStep),
                    onClick: this.handleBack
                },
                'Anterior'
            ),
            React.createElement(
                'button', {
                    type: 'submit',
                    name: 'btn-next',
                    className: this.btnDisabled(!this.props.isLastStep && this.props.completed)
                },
                this.props.isLastStep ? 'Procesando...' : 'Siguiente'
            )
        )
    }
}
