import Controller from "./Controller";

class HomeController extends Controller {
  Index(context) {
    // Puedes preparar aquí los datos del modelo si quieres
    // Ejemplo: return this.View("Index", { mensaje: "Hola!" });
    return this.View(); // Contexto y modelo le llegarán por OutletContext
  }
  About(context) {
    return this.View();
  }
  Contact(context) {
    return this.View();
  }
}
export default HomeController;
