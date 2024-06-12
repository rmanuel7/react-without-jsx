/* eslint-disable no-undef */
export default class ProductRow extends React.Component {
  //!
  render() {
    //!
    const { product, index } = this.props;

    const name = product.stocked
      ? product.name
      : React.createElement('span', { className: 'text-danger' }, product.name)

    return React.createElement(
      'tr',
      {},
      React.createElement('td', {}, index),
      React.createElement('td', {}, name),
      React.createElement('td', {}, product.price)
    );
  }
}
