/* eslint-disable no-undef */

export default class Clock extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return React.createElement(
      'div',
      { className: 'greeting' },
      [
        React.createElement(
          'h1',
          { className: 'title', key: 'h1-title' },
          'Hello, world!'
        ),
        React.createElement(
          'h2',
          { className: 'clock-time', key: 'h2-time' },
          `It is ${this.state.date.toLocaleTimeString()}`
        )
      ]
    );
  }
}
