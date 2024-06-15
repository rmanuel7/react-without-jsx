# Pass data through the component tree without having to pass props down manually at every leve

- [x] Add an empty <div> tag to mark the spot where you want to display something with React.
  - [x] Gave this <div> a unique id HTML attribute.

- [x] Add three <script> tags to the HTML page right before the closing </body> tag
  - [x] The first two tags load React.
  - [x] The third one will load your component code.

-[x] Create components with ES6 class
  - [x] Extends React.Component.
  - [x] Add a method to it called render().
    - [x] Return <React.elements /> describing what should appear on the screen

- [x] Rendering <React.Element /> into the DOM
  - [x] First pass the DOM element to ReactDOM.createRoot(<div>)
  - [x] Then pass the React element to root.render( React.createElement(<App />) )

- [x] Povides a way to share values between components
     without having to explicitly pass a prop through every level of the tree
  - [x] Create a context for the current theme (with "btn-primary" class bootstrap as the default).
  - [x] Pass a function down through the context to allow consumers to update the context