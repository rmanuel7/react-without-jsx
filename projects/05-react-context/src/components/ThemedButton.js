/* eslint-disable no-undef */
import { ThemeContext } from '../contexts/ThemeContext.js';

export default class ThemedButton extends React.Component {

    static contextType = ThemeContext;

    render() {
        return React.createElement(
            'div',
            { className: 'd-flex flex-row gap-3 border border-secondary m-4 p-4' },
            React.createElement('button', { className: `btn ${this.props.theme}` }, 'props-button'),
            React.createElement(
                ThemeContext.Consumer,
                {},
                ({ theme, toggleTheme }) => React.createElement(
                    'button',
                    { className: `btn ${theme}`, onClick: toggleTheme },
                    'theme-context'
                )
            )
        );
    }

}
