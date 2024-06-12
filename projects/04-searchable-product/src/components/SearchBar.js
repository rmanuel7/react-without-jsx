/* eslint-disable no-undef */
export default class SearchBar extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { filterText: '', inStockOnly: false };

    this.handleFiltertextChange = this.handleFiltertextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleFiltertextChange(e) {
    this.props.onFiltertextChange(e.target.value);
  }

  handleInStockOnlyChange(e) {
    this.props.onInStockOnlyChange(e.target.checked)
  }

  render() {
    return React.createElement(
      'form',
      { className: 'border border-secondary px-3 pt-2' },
      React.createElement('input', { type: 'text', placeholder: 'iPhone', onInput: this.handleFiltertextChange }),
      React.createElement(
        'p',
        {},
        React.createElement('input', { type: 'checkbox', onInput: this.handleInStockOnlyChange }),
        ' ',
        'Only show products in stock'
      )
    )
  }
}
