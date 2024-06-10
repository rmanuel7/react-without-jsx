/* eslint-disable no-undef */

export default function Clock(props) {
  //!
  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement(
      'h1',
      { className: 'title' },
      'Hello, world!'
    ),
    React.createElement(
      'h2',
      { date: props.date },
      `It is ${props.date.toLocaleTimeString()}`
    )
  );
}
