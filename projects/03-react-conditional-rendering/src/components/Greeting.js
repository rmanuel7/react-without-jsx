/* eslint-disable no-undef */
import UserGreeting from './UserGreeting';
import GuestGreeting from './GuestGreeting';

export default class Greeting extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;

    if (isLoggedIn) {
      return React.createElement(UserGreeting, {}, []);
    }

    return React.createElement(GuestGreeting, {}, []);
  }
}
