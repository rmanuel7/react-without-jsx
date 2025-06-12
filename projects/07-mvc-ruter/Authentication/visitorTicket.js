import AuthenticationProperties from './AuthenticationProperties';
import AuthenticationTicket from './AuthenticationTicket';
import ClaimsPrincipal from './ClaimsPrincipal';
import Identity from './Identity';

// Crear una identidad para el visitante
const visitorIdentity = new Identity('Anonymous', false, 'guest');

// Definir algunos claims mínimos o vacíos
const visitorClaims = [
    { type: 'role', value: 'visitor' }, // o podrías omitir roles si prefieres
    { type: 'department', value: 'public' }
];

// Crear una instancia de ClaimsPrincipal para el visitante
const visitorPrincipal = new ClaimsPrincipal(visitorIdentity, visitorClaims);

const visitorTicket = new AuthenticationTicket(visitorPrincipal, new AuthenticationProperties());

export default visitorTicket;
