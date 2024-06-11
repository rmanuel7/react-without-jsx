/* eslint-disable no-undef */
// import Greeting from './components/Greeting';

import LoginControl from './components/LoginControl';

const root = ReactDOM.createRoot(document.getElementById('app'));
//! Try changing to isLoggedIn={true}:
// root.render(
//   React.createElement(Greeting, { isLoggedIn: false }, [])
// )

//!
root.render(
  React.createElement(LoginControl, { isLoggedIn: false }, [])
)
