# Building a searchable product data table using React.

- [x] Add an empty <div> tag to mark the spot where you want to display something with React.
  - [x] Gave this <div> a unique id HTML attribute.

- [x] Add three <script> tags to the HTML page right before the closing </body> tag
  - [x] The first two tags load React. 
  - [x] The third one will load your component code.

- [x] Use an ES6 class to define the components
  - [x] Extends React.Component
  - [x] Add a class constructor that assigns the initial this.state
  - [x] Pass props to the base constructor
  - [x] Add a method to it called render()

- [x] Building a searchable product data table using React.
  - [x] Separate your UI into components, where each component matches one piece of your data model
  - [x] Arrange them into a hierarchy
    - [x] <FilterableProduct />
      - [x] <SearchBar />
      - [x] <ProductTable />
        - [x] <CategoryRow />
        - [x] <ProductRow />

- [x] Make your UI interactive
  - [x] Add state in <FilterableProduct />
  - [x] Instance property this.state to constructor to reflect the initial state of the application
  - [x] Pass filterText and inStockOnly to <ProductTable /> and <SearchBar /> as a prop
  - [x] Use these props to filter the rows in <ProductTable /> and set the values of the form fields in <SearchBar />.