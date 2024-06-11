# Conditional Rendering

- [x] Add an empty <div> tag to mark the spot where you want to display something with React.
  - [x] Gave this <div> a unique id HTML attribute.

- [x] Add three <script> tags to the HTML page right before the closing </body> tag:
  - [x] The first two tags load React.
  - [x] The third one will load your component code.

- [x] Create a React Component
  - [x] Use an ES6 class to define a component:
    - [x] Extend React.Component
    - [x] Define the method render().
    - [?] Add a class constructor that assigns the initial this.state:
    - [x] Use this.props in the render() body.

- [x] Rendering Elements
  - [x] ReactDOM.createRoot( DOM Element )
       .render( React.createElement( class/function, {}, [] ) )

- [x] Renders a different greeting depending on the value of isLoggedIn prop.
  - [x] Greeting
    - [x] UserGreeting ( representing Login )
    - [x] GuestGreeting ( representing Logout )

- [x] Create a stateful component called LoginControl
  - [x] Create two new components representing Logout and Login buttons:
    - [x] LoginButton
    - [x] LogoutButton
  - [x] Pass a function as the event handler.
    - [x] It will render either <LoginButton /> or <LogoutButton /> depending on its current state.
    - [x] Bind this.handleClick and pass it
