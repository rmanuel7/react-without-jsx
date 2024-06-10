/* eslint-disable no-undef */
//! import Welcome from './components/functions/Welcome';
import Clock from './components/functions/Clock';
//! import Clock from './components/classes/Clock';

const domContainer = document.querySelector('#app');

const root = ReactDOM.createRoot(domContainer);

//! This function is a valid React component
// root.render(Welcome({ name: 'World!' }));

setInterval(
  () => root.render(
    React.createElement(Clock, { date: new Date() }, [])
  ),
  1000
);

//! A React component defined as a class
// root.render(
//   React.createElement(Clock, {}, [])
// )
