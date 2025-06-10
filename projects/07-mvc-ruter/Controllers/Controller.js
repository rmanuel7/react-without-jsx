class Controller {
  /**
   * Esta función se llama desde la acción para devolver el Outlet.
   * El contexto se inyectará por el dispatcher (Routes).
   */
  View() {
    // El Outlet renderiza la vista real; los datos/contexto se pasan por OutletContext
    return h({ type: Outlet });
  }
}
export default Controller;
