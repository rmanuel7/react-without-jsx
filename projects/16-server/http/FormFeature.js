/**
 * Simula IFormFeature de ASP.NET Core.
 * Proporciona acceso a los datos de formulario parseados desde el cuerpo.
 * No depende de la colección de features.
 */
class FormFeature {
    /**
     * Identificador del feature para FeatureCollection.
     * @returns {symbol}
     */
    static get __typeof() {
        return Symbol.for('softlib.spawebcore.http.features.formfeature');
    }

    /** @type {string|null} */
    #contentType = null;
    /** @type {URLSearchParams|FormData|null} */
    #form = null;

    /**
     * @param {string|FormData|URLSearchParams|null} [formBody]
     * @param {string|null} [contentType]
     */
    constructor(formBody = null, contentType = null) {
        this.#contentType = contentType;

        if (formBody instanceof FormData) {
            this.#form = formBody;
        } else if (formBody instanceof URLSearchParams) {
            this.#form = formBody;
        } else if (typeof formBody === 'string' && this.hasFormContentType) {
            if (this.#contentType?.startsWith('application/x-www-form-urlencoded')) {
                this.#form = new URLSearchParams(formBody);
            } else if (this.#contentType?.startsWith('multipart/form-data')) {
                // No hay parseador nativo para multipart en JS puro.
                // Si necesitas parsear, deberías usar FormData y un input file o fetch con formData.
                // Aquí solo dejamos null o podrías lanzar error.
                this.#form = null;
            }
        }
    }

    /**
     * Indica si el Content-Type es un formulario reconocible.
     * @returns {boolean}
     */
    get hasFormContentType() {
        if (!this.#contentType) return false;
        return (
            this.#contentType.startsWith('application/x-www-form-urlencoded') ||
            this.#contentType.startsWith('multipart/form-data')
        );
    }

    /**
     * Datos de formulario parseados.
     * @returns {URLSearchParams|FormData|null}
     */
    get form() {
        return this.#form;
    }

    set form(value) {
        this.#form = value;
    }
}

export default FormFeature;
