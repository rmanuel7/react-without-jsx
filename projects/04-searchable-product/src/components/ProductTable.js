/* eslint-disable no-undef */

import CategoryRow from './CategoryRow';
import ProductRow from './ProductRow';

export default class ProductTable extends React.Component {
  //!
  render() {
    //!
    const rows = [];
    let lastCategory = null;
    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    this.props.products.forEach((p, x) => {
      //!
      if (p.name.indexOf(filterText) === -1) { return; }
      if (inStockOnly && !p.stocked) { return; }

      if (p.category !== lastCategory) {
        rows.push(React.createElement(CategoryRow, { key: p.category, category: p.category }, []));
      }

      rows.push(React.createElement(ProductRow, { key: p.name, product: p, index: x + 1 }, []));
      lastCategory = p.category;
    });

    return React.createElement(
      'table',
      { className: 'table' },
      React.createElement('thead', {}, React.createElement(
        'tr',
        {},
        React.createElement('th', { scope: 'col' }, '#'),
        React.createElement('th', { scope: 'col' }, 'name'),
        React.createElement('th', { scope: 'col' }, 'price')
      )),
      React.createElement('tbody', {}, rows)
    );
  }
}
