# Implement a Steppers using a collection of related components:

- [x] Add an empty <div> tag to mark the spot where you want to display something with React
  - [x] Gave this <div> a unique id HTML attribute

- [x] Add three <script> tags to the HTML page right before the closing </body> tag:
  - [x] The first two tags load React.
  - [x] The third one will load your component code.

- [x] Use an ES6 class to define a component
  - [?] Add a class constructor that assigns the initial this.state
  - [x] Add a method to it called render()

- [x] Render a React element
  - [x] Pass the empty <div> to ReactDOM.createRoot()
  - [x] Pass the React element to root.render()

- [] Implement a Steppers using a collection of related components:
  - [x] <Stepper />: the container for the steps.
    - [?] <StepHeader />: 
      - [?] <StepIcon />: optional icon for a Step.
      - [?] <StepLabel />: a label for a Step.
      - [?] <StepConnector />: optional customized connector between Steps.
    - [x] <StepContent />: optional content for a Step.
      - [] <Step />: an individual step in the sequence.
    - [x] <StepButton />: optional button for a Step.

- [x] The Stepper can be controlled by passing the current step index (zero-based)
    as the activeStep prop.

- [?] Steppers may display a transient feedback message after a step is saved.

- [?] Must set completed={false} to signify that the active step index has gone

- [] <App />
  - [] <Stepper props: { steps: [ component: ES6 class ] } />
    - [] <StepContent />
      - [] <Step />
        - [] <component props: { data: HTMLFormElement , completed: bool, onCompleted: function } />
    - [] <StepButton props: { hasNext: bool, hasPrevious: bool, onNext: function, onPrevious: function } />
