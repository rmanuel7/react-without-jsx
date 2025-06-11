import {
 MVCROUTER_ROUTE_TYPE,
 MVCROUTER_ROUTES_TYPE,
 MVCROUTER_CONTROLLER_TYPE,
 MVCROUTER_AUTHORIZE_TYPE,
 MVCROUTER_ALLOWANONYMOUS_TYPE
} from './MvcSymbols.js';

export function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    const __typeof = object.__typeof;
    switch (__typeof) {
      case MVCROUTER_ROUTE_TYPE:
      case MVCROUTER_ROUTES_TYPE:
      case MVCROUTER_CONTROLLER_TYPE:
      case MVCROUTER_AUTHORIZE_TYPE:
      case MVCROUTER_ALLOWANONYMOUS_TYPE:
        return __typeof;
    }
  }

  return undefined;
}

export function isRoute(object) {
  return typeOf(object) === MVCROUTER_ROUTE_TYPE;
}

export function isRoutes(object) {
  return typeOf(object) === MVCROUTER_ROUTES_TYPE;
}

export function isController(object) {
  return typeOf(object) === MVCROUTER_CONTROLLER_TYPE;
}

export function isAuthorize(object) {
  return typeOf(object) === MVCROUTER_AUTHORIZE_TYPE;
}

export function isAllowAnonymous(object) {
  return typeOf(object) === MVCROUTER_ALLOWANONYMOUS_TYPE;
}
