/* eslint-disable no-undef */

export default class StepperWrapper extends React.Component {
    render() {
        return React.createElement(
            'div', { className: 'container text-center my-4' },
            React.createElement(
                'div', { className: 'row justify-content-md-center' },
                React.createElement('div', { className: 'col-2' }, ''),
                React.createElement(
                    'div', { className: 'col-md-auto position-relative border border-secondary rounded w-50 p-4' },
                    this.props.children
                ),
                React.createElement('div', { className: 'col-2' }, '')
            )
        );
    }
}
