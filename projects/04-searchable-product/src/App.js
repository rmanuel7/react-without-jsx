/* eslint-disable no-undef */
import 'bootstrap/dist/css/bootstrap.min.css';
import FilterableProduct from './components/FilterableProduct';
import Products from './mocks/products.json';

export default class App extends React.Component {
  //!
  render() {
    return React.createElement(
      'div',
      { className: 'container text-center p-4' },
      React.createElement(
        'div',
        { className: 'row justify-content-md-center p-4' },
        React.createElement('div', { className: 'col' }, []),
        React.createElement(
          'div',
          { className: 'col-md-auto border border-primary p-4' },
          React.createElement(FilterableProduct, { products: Products }, [])
        ),
        React.createElement('div', { className: 'col' }, [])
      )
    );
  }
}
