# Infrastructure

## Paso 1
Implementar:
 - `EndPoint.js`
 - `ListenOptions.js`

Las clases EndPoint y ListenOptions son excelentes puntos de partida y muestran un buen entendimiento del patrón.

---

## Paso 2
Es lógico definir primero las implementaciones concretas de las fábricas de transporte y los listeners específicos de nuestra SPA. Esto nos permitirá ver cómo el EndPoint y las ListenOptions se utilizan en la práctica.

```js
// HistoryListenerFactory
window.addEventListener("popstate", (event) => {
  console.log(
    `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
  );
});
```

```js
// AddressBarListenerFactory
window.addEventListener("hashchange", (event) => {
  console.log(`Hash changed to ${event.newURL}`);
});
```

```js
// CustomEventListenerFactory
const catFound = new CustomEvent("animalfound", {
  detail: {
    name: "cat",
  },
});

// add an appropriate event listener
element.addEventListener("animalfound", (e) => console.log(e.detail.name));

// dispatch the events
element.dispatchEvent(catFound);
```

En .NET Core, los "transports" no se nombran por el protocolo HTTP (`Http1Transport`, `Http2Transport`), sino por el **mecanismo de conexión subyacente** (sockets, named pipes, QUIC).

Aplicando esa lógica a nuestro contexto de SPA:

* El `popstate` y los eventos del `history API` representan el **mecanismo de navegación del historial del navegador**.
* El `hashchange` representa el **mecanismo de la barra de direcciones (fragmento de URL)**.
* `CustomEvent` representaría un **mecanismo de evento personalizado o interno de la aplicación**.

Por lo tanto, es mucho más fiel y coherente con el diseño de Kestrel crear fábricas y listeners basados en el **mecanismo de detección del cambio de URL o evento interno**, no en un evento específico como `PopState`.

Esto significa que, en lugar de `PopStateListenerFactory`, tendríamos algo como:

1.  **`HistoryNavigationListenerFactory`**: Para manejar `popstate`, `pushState`, `replaceState` (a través del `PopStateEvent` que se dispara).
2.  **`AddressBarHashListenerFactory`**: Para manejar `hashchange`.
3.  **`CustomEventListenerFactory`**: Para eventos personalizados dentro de la SPA que actúen como "conexiones".

Tu ejemplo de `addEventListener` es la clave para la implementación de estos listeners.

---

# Paso 3: Implementación de TransportManager
Esta clase será responsable de vincular EndPoints a los ConnectionListenerFactorys apropiados y de mantener un registro de los ConnectionListeners activos, permitiendo su detención controlada.

---

# Paso 4: Implementación de AddressBindContext
Esta clase servirá como un contenedor de datos para el contexto de la operación de vinculación de direcciones, utilizado por el AddressBinder (que definiremos más adelante).

# Paso 5: Implementación de la Interfaz Strategy
Esta clase define la interfaz para cualquier estrategia de vinculación de direcciones.

Esta Strategy será un componente clave en el proceso de vinculación de direcciones, muy probablemente utilizada o implementada por el `AddressBinder` que discutimos anteriormente.
