/* eslint-disable no-undef */
import FormWrapper from './FormWrapper';
import { fileTabs } from '../const/file-tabs';

export default class FileForm extends React.Component {

    constructor(props) {
        super(props);
        //! Se enlazan los metodos
        this.handleTab = this.handleTab.bind(this);
        this.activeTab = this.activeTab.bind(this);
        this.handleInput = this.handleInput.bind(this);
        //! Se inician los Hooks
        this.state = { index: 0 };
    }

    handleInput(e) {
        this.props.onEnableNext(e.target.files.length > 0);
    }

    handleTab(accept) {
        const index = fileTabs.findIndex(tab => tab.accept === accept);
        this.setState({ index });
    }

    activeTab(accept) {
        return fileTabs[this.state.index].accept === accept
            ? 'nav-link active'
            : 'nav-link';
    }

    render() {
        const state = fileTabs[this.state.index];

        return React.createElement(
            FormWrapper,
            { title: 'File Data' },
            React.createElement(
                'ul', { className: 'nav nav-underline mx-1' },
                fileTabs.map((tab) => React.createElement(
                    'li', { key: tab.title, className: 'nav-item' },
                    React.createElement(
                        'a', { role: 'button', className: this.activeTab(tab.accept), onClick: () => this.handleTab(tab.accept) },
                        tab.title
                    )
                ))
            ),
            React.createElement(
                'label', {
                    role: 'button',
                    className: `${state.color} d-flex flex-column align-items-center justify-content-center card card-body rounded border mt-1 w-100`,
                    'data-bs-toggle': 'tooltip',
                    'data-bs-placement': 'right',
                    'data-bs-title': 'Tooltip on right',
                    style: { height: '45vh' }
                },
                React.createElement('input', { onInput: this.handleInput, type: 'file', name: 'dbSetFile', required: true, multiple: state.multiple, accept: state.accept, className: '', style: { height: '0', width: '0' } }),
                React.createElement('i', { className: `bi ${state.icon} h1` }, []),
                React.createElement('span', {}, 'Arrastra o has click aquí para seleccionar los archivos.')
            )
        )
    }
}
