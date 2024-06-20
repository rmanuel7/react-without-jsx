/**
 * Custom Hook ES6 Class
 * @param {ReactElement[]} steps
 * @returns
 */

import StepperButton from './StepperButton';
import StepperContent from './StepperContent';
import StepperWrapper from './StepperWrapper';

/* eslint-disable no-undef */
export default class Stepper extends React.Component {
    //!
    constructor(props) {
        super(props);
        //! Primero se enlazan los metodos
        this.next = this.next.bind(this);
        this.back = this.back.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEnableNext = this.handleEnableNext.bind(this);
        //! Segundo se establecen los Hooks
        this.state = {
            curStepIndex: 0,
            form: document.createElement('form'),
            completed: false
        };
    }

    next() {
        this.setState(prevStete => ({
            curStepIndex: prevStete.curStepIndex >= (this.props.steps.length - 1)
                ? prevStete.curStepIndex
                : prevStete.curStepIndex + 1
        }));

        this.handleEnableNext(false);
    }

    back() {
        this.setState(prevStete => ({
            curStepIndex: prevStete.curStepIndex <= 0
                ? prevStete.curStepIndex
                : prevStete.curStepIndex - 1
        }));
    }

    handleSubmit(e) {
        const isLastStep = this.state.curStepIndex === (this.props.steps.length - 1);

        const fm = this.state.form;

        [...e.target].forEach((input, key) => {
            if (!fm.elements[input.name]) {
                fm.appendChild(input.cloneNode(true));
            }
        });

        this.setState({
            form: fm
        });

        if (!isLastStep) return this.next();
        alert('Finish...');
    }

    handleEnableNext(isCompleted) {
        //!
        this.setState({
            completed: isCompleted
        });
    }

    render() {
        //!
        const CURRENT_STEP = this.props.steps[this.state.curStepIndex];
        const isFirstStep = this.state.curStepIndex !== 0;
        const isLastStep = this.state.curStepIndex === (this.props.steps.length - 1);

        return React.createElement(
            StepperWrapper, {},
            React.createElement(StepperContent, { onSubmit: this.handleSubmit, current: this.state.curStepIndex + 1, length: this.props.steps.length },
                React.createElement(CURRENT_STEP, { data: this.state.form, onEnableNext: this.handleEnableNext }, []),
                React.createElement(StepperButton, { completed: this.state.completed, isFirstStep, isLastStep, onBack: this.back }, [])
            )
        );
    }
}
