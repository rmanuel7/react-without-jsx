import FormWrapper from './FormWrapper';
import { listMethods } from '../const/list-methods';

/* eslint-disable no-undef */
export default class MetodoForm extends React.Component {

    constructor(props) {
        super(props);
        //! Enlazar los metodos
        this.handleClick = this.handleClick.bind(this);
        this.props.onEnableNext(false);
    }

    handleClick(e) {
        this.props.onEnableNext(e.target.checked);
    }

    render() {
        return React.createElement(
            FormWrapper,
            { title: 'Metodos' },
            React.createElement(
                'ul', { className: 'list-group text-start mt-4' },
                listMethods.map((m) => React.createElement(
                    'li', { key: btoa(m.id), className: 'list-group-item' },
                    React.createElement(
                        'input', {
                            className: 'form-check-input me-1',
                            type: 'radio',
                            name: m.name,
                            value: m.value,
                            id: m.id,
                            required: true,
                            onInput: this.handleClick
                        }),
                    React.createElement(
                        'label', {
                            className: 'form-check-label',
                            htmlFor: m.id
                        },
                        m.value)
                ))
            )
        )
    }
}
