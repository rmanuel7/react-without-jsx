/* eslint-disable no-undef */

import ThemedButton from './ThemedButton.js';

export default class Toolbar extends React.Component {
    // The Toolbar component must take an extra 'theme' prop
    // and pass it to the ThemedButton. This can become painful
    // if every single button in the app needs to know the theme
    // because it would have to be passed through all components.
    render() {

        // ThemedButton.contextType = this.contextType;

        return React.createElement(
            'div',
            { className: 'border border-danger' },
            React.createElement(ThemedButton, { theme: this.props.theme }, [])
        );
    }
}
