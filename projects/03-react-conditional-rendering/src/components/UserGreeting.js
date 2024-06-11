/* eslint-disable no-undef */

export default class UserGreeting extends React.Component {
  //!
  render() {
    return React.createElement(
      'h1',
      { className: 'greeting' },
      'Welcome back!'
    )
  }
}
