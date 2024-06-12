/* eslint-disable no-undef */
import SearchBar from './SearchBar'
import ProductTable from './ProductTable'

export default class FilterableProduct extends React.Component {
  //!
  constructor(props) {
    super(props);
    this.state = { filterText: '', inStockOnly: false };

    this.handleFiltertextChange = this.handleFiltertextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleFiltertextChange(filterText) {
    this.setState({ filterText })
  }

  handleInStockOnlyChange(inStockOnly) {
    this.setState({ inStockOnly })
  }

  render() {
    return React.createElement(
      React.Fragment,
      {},
      React.createElement(
        SearchBar,
        {
          filterText: this.state.filterText,
          inStockOnly: this.state.inStockOnly,
          onFiltertextChange: this.handleFiltertextChange,
          onInStockOnlyChange: this.handleInStockOnlyChange
        },
        []
      ),
      React.createElement(
        ProductTable,
        {
          products: this.props.products,
          filterText: this.state.filterText,
          inStockOnly: this.state.inStockOnly
        },
        []
      )
    )
  }
}
