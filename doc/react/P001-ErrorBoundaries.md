# [Introducing Error Boundaries](https://legacy.reactjs.org/docs/error-boundaries.html)

> [!NOTE]
> React 16 introduces a new **concept** of an “error boundary”.

Error boundaries are **React components** that **catch JavaScript errors** anywhere in their child **component tree**, log those errors, **and display a fallback UI** instead of the component tree that crashed. 

Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

A class component becomes an error boundary if it defines either (or both) of the lifecycle methods static `getDerivedStateFromError()` or `componentDidCatch()`.

> [!IMPORTANT]
> - Use `static` `getDerivedStateFromError()` to render a fallback UI after an error has been thrown.
> - Use `componentDidCatch()` to log error information.

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

Then you can use it as a regular component:

```html
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

