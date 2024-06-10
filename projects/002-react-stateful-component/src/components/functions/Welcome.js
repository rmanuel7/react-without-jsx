/* eslint-disable no-undef */

export default function Welcome(props) {
  //!
  return React.createElement(
    'h1',
    {
      className: 'greeting'
    },
    `Hello ${props.name}`
  )
}
