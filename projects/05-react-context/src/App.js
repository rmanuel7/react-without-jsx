/* eslint-disable no-undef */
import Toolbar from './components/Toolbar.js';
import { ThemeContext, themes } from './contexts/ThemeContext.js';

// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
export default class App extends React.Component {

    constructor(props) {

        super(props);

        this.toggleTheme = this.toggleTheme.bind(this);

        this.state = {
            theme: themes.primary,
            toggleTheme: this.toggleTheme
        };
    }

    toggleTheme() {
        this.setState(state => ({
            theme:
                state.theme === themes.primary
                    ? themes.warning
                    : themes.primary
        }));
    }

    render() {
        return React.createElement(
            ThemeContext.Provider,
            { value: this.state },
            React.createElement(Toolbar, { theme: 'btn-warning' }, [])
        );
    }
}
