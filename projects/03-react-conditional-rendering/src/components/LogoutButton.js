/* eslint-disable no-undef */

export default class LogoutButton extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return React.createElement(
      'button',
      { onClick: this.props.onClick },
      'Logout'
    );
  }
}
