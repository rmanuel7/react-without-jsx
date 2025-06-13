/**
 * Implementación de la clase de contexto de solicitud para el lado del cliente.
 * 
 * **Inmutable**: Una vez creada, sus propiedades no pueden ser modificadas.
 * Encapsula la información de la solicitud HTTP actual, modelada para ser consistente
 * con las propiedades clave de `HttpRequest` de .NET Core, y expone sus propiedades
 * a través de getters.
 */
class RequestContextValue {
    /**
     * El método HTTP.
     * @type {string}
     */
    #method;
    /**
     * El esquema URI.
     * @type {string}
     */
    #scheme;
    /**
     * Si la solicitud es HTTPS.
     * @type {boolean}
     */
    #isHttps;
    /**
     * El host de la solicitud.
     * @type {HostString | string | object}
     */
    #host;
    /**
     * La ruta base de la aplicación.
     * @type {PathString | string}
     */
    #pathBase;
    /**
     * La ruta de la solicitud.
     * @type {PathString | string}
     */
    #path;
    /**
     * La cadena de consulta completa.
     * @type {QueryString | string}
     */
    #queryString;
    /**
     * Los parámetros de la cadena de consulta analizados.
     * @type {IQueryCollection}
     */
    #query;
    /**
     * El protocolo HTTP.
     * @type {string}
     */
    #protocol;
    /**
     * Los encabezados de la solicitud.
     * @type {IHeaderDictionary}
     */
    #headers;
    /**
     * Las cookies de la solicitud.
     * @type {IRequestCookieCollection}
     */
    #cookies;
    /**
     * Longitud del contenido.
     * @type {number | null}
     */
    #contentLength;
    /**
     * Tipo de contenido.
     * @type {string | null}
     */
    #contentType;
    /**
     * Si es un tipo de contenido de formulario.
     * @type {boolean}
     */
    #hasFormContentType;
    /**
     * Datos del formulario.
     * @type {IFormCollection | null}
     */
    #form;
    /**
     * Valores extraídos de la ruta.
     * @type {RouteValueDictionary}
     */
    #routeValues;

    /**
     * @param {object} [options={}] - Opciones para inicializar el RequestContextValue.
     * @param {string} [options.method='GET'] - El método HTTP.
     * @param {string} [options.scheme='https'] - El esquema URI.
     * @param {boolean} [options.isHttps=true] - Si la solicitud es HTTPS.
     * @param {HostString | string | object} [options.host={hostName: window.location.hostname, port: window.location.port ? parseInt(window.location.port) : undefined}] - El host de la solicitud.
     * @param {PathString | string} [options.pathBase=''] - La ruta base de la aplicación.
     * @param {PathString | string} [options.path=''] - La ruta de la solicitud.
     * @param {QueryString | string} [options.queryString=''] - La cadena de consulta completa.
     * @param {IQueryCollection} [options.query={}] - Los parámetros de la cadena de consulta analizados.
     * @param {string} [options.protocol='HTTP/1.1'] - El protocolo HTTP.
     * @param {IHeaderDictionary} [options.headers={}] - Los encabezados de la solicitud.
     * @param {IRequestCookieCollection} [options.cookies={}] - Las cookies de la solicitud.
     * @param {number | null} [options.contentLength=null] - Longitud del contenido.
     * @param {string | null} [options.contentType=null] - Tipo de contenido.
     * @param {boolean} [options.hasFormContentType=false] - Si es un tipo de contenido de formulario.
     * @param {IFormCollection | null} [options.form=null] - Datos del formulario.
     * @param {RouteValueDictionary} [options.routeValues={}] - Valores extraídos de la ruta.
     */
    constructor(options = {}) {
        this.#method = options.method || 'GET';
        this.#scheme = options.scheme || (window.location.protocol === 'https:' ? 'https' : 'http');
        this.#isHttps = options.isHttps !== undefined ? options.isHttps : (this.#scheme === 'https');

        let hostValue = options.host || {
            hostName: window.location.hostname,
            port: window.location.port ? parseInt(window.location.port, 10) : undefined
        };
        if (typeof hostValue === 'string') {
            const [hostName, port] = hostValue.split(':');
            hostValue = { hostName, port: port ? parseInt(port, 10) : undefined };
        }
        this.#host = hostValue;

        this.#pathBase = options.pathBase || '';
        this.#path = options.path || '';
        this.#queryString = options.queryString || '';
        this.#query = options.query || {};

        this.#protocol = options.protocol || 'HTTP/1.1';
        this.#headers = options.headers || {};
        this.#cookies = options.cookies || this.#parseCookies(document.cookie);

        this.#contentLength = options.contentLength !== undefined ? options.contentLength : null;
        this.#contentType = options.contentType || null;
        this.#hasFormContentType = options.hasFormContentType === true;
        this.#form = options.form || null;

        this.#routeValues = options.routeValues || {};

        // Congelar el objeto para asegurar la inmutabilidad
        Object.freeze(this.#query);
        Object.freeze(this.#headers);
        Object.freeze(this.#cookies);
        if (this.#form) Object.freeze(this.#form);
        Object.freeze(this.#routeValues);
        Object.freeze(this); // Congelar la instancia completa al final
    }

    /**
     * Obtiene el método HTTP de la solicitud (ej. 'GET', 'POST').
     * @returns {string} Método HTTP de la solicitud
     */
    get method() {
        return this.#method;
    }

    /** 
     * Obtiene el esquema URI (ej. 'http', 'https').
     * @returns {string} Esquema URI (ej. 'http', 'https').
     */
    get scheme() {
        return this.#scheme;
    }

    /** 
     * Indica si la solicitud está usando HTTPS.
     * @returns {boolean} `true` si la solicitud está usando HTTPS, `false` en caso contrario. 
     */
    get isHttps() {
        return this.#isHttps;
    }

    /** 
     * Obtiene el host de la solicitud. 
     * @returns {HostString} El host de la solicitud.
     */
    get host() {
        return this.#host;
    }

    /** 
     * Obtiene la ruta base de la aplicación.
     * @returns {PathString} La ruta base de la aplicación.
     */
    get pathBase() {
        return this.#pathBase;
    }

    /**
     * Obtiene la ruta de la solicitud después de `PathBase`.
     * @returns {PathString} La ruta de la solicitud después de `PathBase`.
     */
    get path() {
        return this.#path;
    }

    /**
     * Obtiene la cadena de consulta completa.
     * @returns {QueryString} La cadena de consulta completa.
     */
    get queryString() {
        return this.#queryString;
    }

    /**
     * Obtiene los parámetros de la cadena de consulta analizados.
     * @returns {IQueryCollection} Los parámetros de la cadena de consulta analizados.
     */
    get query() {
        return this.#query;
    }

    /**
     * Obtiene el protocolo HTTP de la solicitud (ej. 'HTTP/1.1').
     * @returns {string} El protocolo HTTP de la solicitud (ej. 'HTTP/1.1').
     */
    get protocol() {
        return this.#protocol;
    }

    /**
     * Obtiene los encabezados de la solicitud.
     * @returns {IHeaderDictionary} Los encabezados de la solicitud.
     */
    get headers() {
        return this.#headers;
    }

    /**
     * Obtiene las cookies de la solicitud.
     * @returns {IRequestCookieCollection} Las cookies de la solicitud.
     */
    get cookies() {
        return this.#cookies;
    }

    /**
     * Obtiene la longitud del contenido de la solicitud en bytes.
     * @returns {number | null} La longitud del contenido de la solicitud en bytes.
     */
    get contentLength() {
        return this.#contentLength;
    }

    /**
     * Obtiene el tipo de contenido de la solicitud.
     * @returns {string | null} El tipo de contenido de la solicitud.
     */
    get contentType() {
        return this.#contentType;
    }

    /**
     * Indica si la solicitud tiene un tipo de contenido de formulario.
     * @returns {boolean} `true` si la solicitud tiene un tipo de contenido de formulario.
     */
    get hasFormContentType() {
        return this.#hasFormContentType;
    }

    /**
     * Obtiene los datos del formulario.
     * @returns {IFormCollection | null} Los datos del formulario, si `HasFormContentType` es `true`.
     */
    get form() {
        return this.#form;
    }

    /**
     * Obtiene los valores extraídos de la definición de la ruta.
     * @returns {RouteValueDictionary} Los valores extraídos de la definición de la ruta.
     */
    get routeValues() {
        return this.#routeValues;
    }

    /**
     * Método auxiliar privado para parsear las cookies de `document.cookie`.
     * @private
     * @param {string} cookieString - La cadena `document.cookie`.
     * @returns {IRequestCookieCollection} Un objeto con las cookies.
     */
    #parseCookies(cookieString) {
        const cookies = {};
        cookieString.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length > 1) {
                const name = decodeURIComponent(parts[0].trim());
                const value = decodeURIComponent(parts.slice(1).join('='));
                cookies[name] = value;
            }
        });
        return cookies;
    }

    /**
     * Crea una instancia de RequestContextValue a partir de una URL dada, simulando
     * una solicitud HTTP.
     * @static
     * @param {string} urlString - La URL de la cual extraer la información de la solicitud.
     * @param {object} [additionalOptions={}] - Opciones adicionales para el RequestContextValue.
     * @returns {RequestContextValue} Una nueva instancia de RequestContextValue.
     */
    static fromUrl(urlString, additionalOptions = {}) {
        const url = new URL(urlString, window.location.origin);

        const queryCollection = {};
        url.searchParams.forEach((value, key) => {
            if (queryCollection[key]) {
                if (Array.isArray(queryCollection[key])) {
                    queryCollection[key].push(value);
                } else {
                    queryCollection[key] = [queryCollection[key], value];
                }
            } else {
                queryCollection[key] = value;
            }
        });

        const headers = {
            'User-Agent': navigator.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Referer': document.referrer,
        };
        const cookies = RequestContextValue.prototype.#parseCookies(document.cookie); // Acceso al método privado estáticamente

        return new RequestContextValue({
            method: 'GET',
            scheme: url.protocol.replace(':', ''),
            isHttps: url.protocol === 'https:',
            host: { hostName: url.hostname, port: url.port ? parseInt(url.port, 10) : undefined },
            pathBase: '',
            path: url.pathname,
            queryString: url.search,
            query: queryCollection,
            protocol: 'HTTP/1.1',
            headers: headers,
            cookies: cookies,
            routeValues: {},
            ...additionalOptions
        });
    }

    /**
     * Crea una instancia de RequestContextValue a partir del estado actual del navegador (`window.location`).
     * @static
     * @param {object} [additionalOptions={}] - Opciones adicionales para el RequestContextValue.
     * @returns {RequestContextValue} Una nueva instancia de RequestContextValue.
     */
    static fromWindowLocation(additionalOptions = {}) {
        return RequestContextValue.fromUrl(window.location.href, {
            ...additionalOptions,
            routeValues: additionalOptions.routeValues || {}
        });
    }

    /**
     * Crea una nueva instancia de RequestContextValue a partir de una instancia existente,
     * permitiendo sobrescribir propiedades específicas.
     *
     * Este método es útil para crear una versión modificada del contexto de solicitud
     * sin mutar la instancia original (debido a la inmutabilidad de la clase).
     *
     * @static
     * @param {RequestContextValue} baseContext - La instancia de RequestContextValue base de la cual clonar.
     * @param {object} changes - Un objeto que contiene las propiedades que se desean sobrescribir.
     * @param {string} [changes.method] - Nuevo método HTTP.
     * @param {string} [changes.scheme] - Nuevo esquema URI.
     * @param {boolean} [changes.isHttps] - Nuevo valor para HTTPS.
     * @param {HostString | string | object} [changes.host] - Nuevo host.
     * @param {PathString | string} [changes.pathBase] - Nueva ruta base.
     * @param {PathString | string} [changes.path] - Nueva ruta.
     * @param {QueryString | string} [changes.queryString] - Nueva cadena de consulta.
     * @param {IQueryCollection} [changes.query] - Nuevos parámetros de consulta.
     * @param {string} [changes.protocol] - Nuevo protocolo.
     * @param {IHeaderDictionary} [changes.headers] - Nuevos encabezados.
     * @param {IRequestCookieCollection} [changes.cookies] - Nuevas cookies.
     * @param {number | null} [changes.contentLength] - Nueva longitud del contenido.
     * @param {string | null} [changes.contentType] - Nuevo tipo de contenido.
     * @param {boolean} [changes.hasFormContentType] - Nuevo valor para tipo de formulario.
     * @param {IFormCollection | null} [changes.form] - Nuevos datos del formulario.
     * @param {RouteValueDictionary} [changes.routeValues] - Nuevos valores de ruta.
     * @returns {RequestContextValue} Una nueva instancia de RequestContextValue con las propiedades actualizadas.
     */
    static with(baseContext, changes) {
        if (!(baseContext instanceof RequestContextValue)) {
            throw new Error('El primer argumento de RequestContextValue.with debe ser una instancia de RequestContextValue.');
        }

        // Combinar todas las propiedades de la instancia base
        const currentOptions = {
            method: baseContext.method,
            scheme: baseContext.scheme,
            isHttps: baseContext.isHttps,
            host: baseContext.host,
            pathBase: baseContext.pathBase,
            path: baseContext.path,
            queryString: baseContext.queryString,
            query: baseContext.query,
            protocol: baseContext.protocol,
            headers: baseContext.headers,
            cookies: baseContext.cookies,
            contentLength: baseContext.contentLength,
            contentType: baseContext.contentType,
            hasFormContentType: baseContext.hasFormContentType,
            form: baseContext.form,
            routeValues: baseContext.routeValues,
        };

        // Sobrescribir con los cambios proporcionados
        const newOptions = { ...currentOptions, ...changes };

        // Crear una nueva instancia con las opciones combinadas
        return new RequestContextValue(newOptions);
    }
}

export default RequestContextValue;
