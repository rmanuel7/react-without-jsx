# [react-without-jsx](https://es.legacy.reactjs.org/docs/add-react-to-a-website.html)
> [!NOTE]
> JSX is optional and not required to use React



```javascript
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Add React in One Minute</title>
  </head>
  <body>

    <h2>Add React in One Minute</h2>
    <p>This page demonstrates using React with no build tooling.</p>
    <p>React is loaded as a script tag.</p>

    <!-- We will put our React component inside this div. -->
    <div id="like_button_container"></div>

    <!-- Load React. -->
    <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

    <!-- Load our React component. -->
    <script src="like_button.js"></script>

  </body>
</html>
```

---

> [!NOTE]
> Antes de desplegar tu sitio web a producción, debes ser consciente que no compactar tu JavaScript puede disminuir de forma considerable la carga de tu página.

Si ya has compactado los scripts de tu aplicación, tu sitio estará listo para producción si aseguras que el HTML desplegado carga las versiones de React finalizadas en production.min.js:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```
