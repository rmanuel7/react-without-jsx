/* eslint-disable no-undef */
export default class FormWrapper extends React.Component {
    render() {
        return React.createElement(
            'div', {
                className: 'x-wrapper overflow-auto',
                style: { maxHeight: '70vh' }
            },
            React.createElement('style', {}, '.x-wrapper::-webkit-scrollbar {display: none;}'),
            React.createElement(
                'h2',
                { className: 'text-center text-muted mt-4' },
                this.props.title
            ),
            this.props.children
        )
    }
}
