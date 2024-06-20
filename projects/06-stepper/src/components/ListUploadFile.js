/* eslint-disable no-undef */
export default class ListUploadFile extends React.Component {

    constructor(props) {
        super(props);
        //! Binding of methods
        this.handleInput = this.handleInput.bind(this);
        //! Set Hooks
        this.state = {};
    }

    handleInput(e) {
        this.props.onEnableNext(e.target.files.length > 0);
    }

    render() {
        const inputs = [...this.props.data];
        const idx = inputs.findIndex(x => x.type === 'file');
        const FILES = inputs ? inputs[idx].files : [];

        return React.createElement(
            'div', { className: 'overflow-auto mt-3', style: { height: '55vh' } },
            React.createElement('style', {}, '.overflow-auto.mt-3::-webkit-scrollbar {display: none;}'),
            React.createElement(
                'table', { className: 'table caption-top text-start' },
                React.createElement(
                    'caption', {}, 'List of files'),
                React.createElement(
                    'thead', {},
                    React.createElement(
                        'tr', {},
                        React.createElement('th', { scope: 'col' }, '#'),
                        React.createElement('th', { scope: 'col' }, 'file.name'),
                        React.createElement('th', { scope: 'col' }, 'lastModifiedDate'),
                        React.createElement('th', { scope: 'col' }, '')
                    )
                ),
                React.createElement(
                    'tbody', {},
                    [...FILES].map((fi, key) => React.createElement(
                        'tr', { key: btoa(fi.name) },
                        React.createElement('th', { scope: 'row' }, key + 1),
                        React.createElement('td', {}, fi.name),
                        React.createElement('td', {}, fi.lastModifiedDate.toLocaleString()),
                        React.createElement('td', {},
                            React.createElement(
                                'div', { className: 'spinner-grow spinner-grow-sm', role: 'status' },
                                React.createElement('span', { className: 'visually-hidden' }, 'Loading...')
                            )
                        )
                    ))
                )
            ),
            React.createElement('progress', { className: 'w-100 mt-2', value: 0 }, [])
        )
    }
}
