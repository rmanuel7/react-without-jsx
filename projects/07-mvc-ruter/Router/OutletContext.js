/**
 * Contexto global utilizado para compartir el contenido del "outlet"
 * entre rutas anidadas y sus componentes layout.
 *
 * Este contexto permite que un componente `<Outlet />` en un layout
 * renderice la siguiente vista anidada correspondiente a la ruta actual.
 *
 * Es especialmente útil para diseños jerárquicos donde un componente padre
 * necesita renderizar rutas hijas dentro de una región específica de la vista.
 *
 * @type {React.Context<object>}
 *
 * @example
 * // En el layout principal
 * function Layout() {
 *   return (
 *     <OutletContext.Consumer>
 *       {({ outlet }) => (
 *         <main>
 *           <Header />
 *           {outlet}
 *           <Footer />
 *         </main>
 *       )}
 *     </OutletContext.Consumer>
 *   );
 * }
 */
const OutletContext = React.createContext({});

export default OutletContext;
