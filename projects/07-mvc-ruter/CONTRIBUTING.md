# Convenciones y Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto!

## Estilo de Código

- **React sin JSX:** Todo el código de React debe escribirse usando ES6 clases y sin JSX.
- **ReactFunctions.js:** Utiliza siempre las funciones de `ReactFunctions.js` como wrapper para crear componentes y elementos. Es obligatorio emplear parámetros nombrados.

### Ejemplo

```js
// Correcto
import { createReactElement as h } from './Shared/ReactFunctions.js';

const MyComponent = class extends React.Component {
    render() {
        return h({
            type: 'div',
            props: {},
            children: [
                h({
                    type: 'h1',
                    props: { style: { color: 'blue' } },
                    children: ['Título']
                })
            ]
        });
    }
};
```

- **Prohibido usar JSX:** No se permite utilizar sintaxis JSX bajo ninguna circunstancia.

```js
// Incorrecto
const MyComponent = () => (
    <div>
        <h1>Título</h1>
    </div>
);
```

### Nomenclatura

- Usa PascalCase para nombres de clases y componentes.
- Usa camelCase para variables y funciones.

### Estructura de Componentes

- Los componentes deben ser clases derivadas de `React.Component`.
- Los archivos de componentes deben coincidir con el nombre del componente.
- Agrupa componentes relacionados en carpetas.

### Otras Reglas

- Sigue la estructura y convenciones de este archivo para cualquier nuevo archivo o carpeta.
- Documenta cualquier función o clase pública.
- Añade ejemplos de uso siempre que sea posible.

---

Si tienes dudas, consulta con los mantenedores antes de hacer un PR.
