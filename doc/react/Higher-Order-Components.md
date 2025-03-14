# [Higher-Order Components](https://legacy.reactjs.org/docs/higher-order-components.html)

> [!IMPORTANT]
> A higher-order component (HOC) is an advanced technique in React for reusing component logic.

> [!NOTE]
> HOCs are not part of the React API.

> [!IMPORTANT]
> They are a pattern that emerges from React’s compositional nature.

> [!TIP]
> A Higher-order component is a function that takes a component and returns a new component.

```html
<Router>
    <ErrorBoundary errorPath >
        <Authentication loginPath accessDeniedPath logoutPath>
            <Authorization>
                <Routes>
                    <Route index=true element >
                    <Route path='Home' >
                        <Route path='About' element />
                    <Route />
                    <Route path='Account' >
                        <Route path='Login' element />
                    <Route />
                <Routes />
            <Authorization />
        <Authentication />
    <ErrorBoundary />
<Router />
```

