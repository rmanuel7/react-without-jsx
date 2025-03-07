# React.Component

> [!IMPORTANT]
> This page contains a detailed API reference for the React component class definition. It assumes you’re familiar with fundamental React concepts, such as `Components and Props`, as well as `State and Lifecycle`. If you’re not, read them first.

## Overview
React lets you define components as `classes` or `functions`. Components defined as classes currently provide more features which are described in detail on this page. To define a React component class, you need to extend `React.Component`:

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

The only method you must define in a `React.Component` subclass is called `render()`. All the other methods described on this page are optional.

## The Component Lifecycle
Each component has several “lifecycle methods” that you can override to run code at particular times in the process. You can use this [lifecycle diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) as a cheat sheet. In the list below, commonly used lifecycle methods are marked as bold. The rest of them exist for relatively rare use cases.

### Mounting
These methods are called in the following order when an instance of a component is being created and inserted into the DOM:

- **`constructor()`**
- `static getDerivedStateFromProps()`
- **`render()`**
- **`componentDidMount()`**

### Updating
An update can be caused by changes to props or state. These methods are called in the following order when a component is being re-rendered:

- `static getDerivedStateFromProps()`
- `shouldComponentUpdate()`
- **`render()`**
- `getSnapshotBeforeUpdate()`
- **`componentDidUpdate()`**

### Unmounting
This method is called when a component is being removed from the DOM:

- **`componentWillUnmount()`**


### Other APIs
Each component also provides some other APIs:

- `setState()`
- `forceUpdate()`

### Class Properties

- `defaultProps`
- `displayName`

### Instance Properties

- `props`
- `state`

