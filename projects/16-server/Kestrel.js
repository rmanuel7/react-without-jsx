import { FeatureCollection } from "@spajscore/extensions";
import { CancellationToken } from "@spajscore/threading";

class Kesterl {
    #application;
    #features;
    #socketConnectionListener;

    /**
     * 
     * @param {object} deps 
     * @param {FeatureCollection} deps.features
     */
    constructor({ features, socketConnectionListener }) {
        this.#features = features;
        this.#socketConnectionListener = socketConnectionListener;
    }

    get features() {
        return this.#features;
    }

    /**
     * 
     * @param {HttpApplication} application - 
     * @param {CancellationToken} cancellationToken -
     */
    async startAsync(application, cancellationToken) {
        // Como paso un connectionDelegate al SocketConnectionListener
    }

    /**
     * 
     * @param {CancellationToken} cancellationToken 
     */
    async stopAsync(cancellationToken) {

    }
}
