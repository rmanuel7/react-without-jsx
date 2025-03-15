# [Context](https://legacy.reactjs.org/docs/context.html)

> [!NOTE]
> Context provides a way to **pass data** through the component tree **without having to pass props down manually** at every level.

> [!NOTE]
> Context is designed to **share data** that can be considered **global** for a tree of React components, such as the current **authenticated user**, theme, or preferred language. 

> [!NOTE]
> Context is primarily used when some **data needs to be accessible by many components** at different nesting levels.

> [!CAUTION]
>  Apply it sparingly because **it makes component reuse more difficult**.

### API

- `React.createContext`
- `Context.Provider`
- `Class.contextType`
- `Context.Consumer`
- `Context.displayName`

---

## Creates a Context object

```javascript
const MyContext = React.createContext(defaultValue);
```

> [!IMPORTANT]
> Every Context object comes with a **Provider React component** that allows consuming components to subscribe to context changes.

> [!IMPORTANT]
> The Provider component accepts a **value prop** to be passed to consuming components that are descendants of this Provider.

```javascript
createReactElement({
    type: MyContext.Provider,
    props: {
        value: {/* some value */}
    },
    children: ['__APP_ERROR_BOUNDARY__']
})
```
