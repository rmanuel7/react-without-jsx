/* eslint-disable no-undef */

import Greeting from './Greeting';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

export default class LoginControl extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    //!
    const isLoggedIn = this.state.isLoggedIn;

    let button;

    if (isLoggedIn) {
      button = React.createElement(LogoutButton, { onClick: this.handleLogoutClick }, []);
    } else {
      button = React.createElement(LoginButton, { onClick: this.handleLoginClick }, []);
    }

    return React.createElement(
      'div',
      {},
      React.createElement(Greeting, { isLoggedIn }, []),
      button
    )
  }
}
