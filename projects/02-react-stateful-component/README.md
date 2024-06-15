# Introduces the concept of state and lifecycle in a React component

- [x] Add an empty <div> tag to mark the spot where you want to display something with React.

- [x] Add three <script> tags to the HTML page right before the closing </body> tag:
  - [x] The first two tags load React. 
  - [x] The third one will load your component code.

- [x] Create a React Component
  - [x] The simplest way to define a component is to write a JavaScript function:
    - [x] returns a React element calling React.createElement()

- [x] Rendering Elements
  - [x] ReactDOM.createRoot( DOM Element )
       .render( React.createElement( class/function, {}, [] ) )

- [x] Converting a Function to a Class
  - [x] Create an ES6 class, with the same name, that extends React.Component.
  - [x] Add a single empty method to it called render().
  - [x] Move the body of the function into the render() method.
  - [x] Replace props with this.props in the render() body.
  - [x] Replace this.props.date with this.state.date in the render() method
  - [x] Add a class constructor that assigns the initial this.state:

- [x] Adding Lifecycle Methods to a Class
  - [x] Add the componentDidMount() method runs after the component output has been rendered to the DOM.
  - [x] Add the componentWillUnmount() method runs after the component has been removed to the DOM.
  - [x] Implement a method called tick() that the Clock component will run every second.
