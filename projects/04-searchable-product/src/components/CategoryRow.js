/* eslint-disable no-undef */
export default class CategoryRow extends React.Component {
  //!
  render() {
    const category = this.props.category;

    return React.createElement(
      'tr',
      {},
      React.createElement(
        'th',
        { scope: 'col', colSpan: '3' },
        category
      )
    );
  }
}
