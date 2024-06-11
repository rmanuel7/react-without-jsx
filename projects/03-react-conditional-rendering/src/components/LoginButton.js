/* eslint-disable no-undef */

export default class LoginButton extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { };
  }

  //!
  render() {
    return React.createElement(
      'button',
      { onClick: this.props.onClick },
      'Login'
    );
  }
}
