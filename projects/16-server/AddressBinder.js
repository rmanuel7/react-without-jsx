// Adaptación fiel de AddressBinder.cs (solo para SPA)

import ListenOptions from './ListenOptions.js';
import PopStateEndPoint from './PopStateEndPoint.js';

class AddressBinder {
    /**
     * Orquesta el bindeo de múltiples ListenOptions y/o direcciones.
     * @param {ListenOptions[]} listenOptions
     * @param {AddressBindContext} context
     * @param {(options: ListenOptions) => ListenOptions} [useFeature] - Middleware global (opcional)
     * @returns {Promise<void>}
     */
    static async bindAsync(listenOptions, context, useFeature = x => x) {
        // Elige estrategia
        const strategy = this.#createStrategy(
            listenOptions,
            context.addresses ?? [],
            context.preferAddresses ?? false,
            useFeature
        );

        // Limpia opciones y addresses previos
        context.optionsInUse = [];
        context.addresses = [];

        await strategy.bindAsync(context);
    }

    static #createStrategy(listenOptions, addresses, preferAddresses, useFeature) {
        const hasListenOptions = listenOptions.length > 0;
        const hasAddresses = addresses.length > 0;

        if (preferAddresses && hasAddresses) {
            if (hasListenOptions) {
                return new OverrideWithAddressesStrategy(addresses, useFeature);
            }
            return new AddressesStrategy(addresses, useFeature);
        } else if (hasListenOptions) {
            if (hasAddresses) {
                return new OverrideWithEndpointsStrategy(listenOptions, addresses);
            }
            return new EndpointsStrategy(listenOptions);
        } else if (hasAddresses) {
            return new AddressesStrategy(addresses, useFeature);
        } else {
            return new DefaultAddressStrategy();
        }
    }
}

// ==== Estrategias =====

class EndpointsStrategy {
    constructor(endpoints) { this._endpoints = endpoints; }
    async bindAsync(context) {
        for (const endpoint of this._endpoints) {
            await endpoint.bindAsync(context);
        }
    }
}

class AddressesStrategy {
    constructor(addresses, useFeature) {
        this._addresses = addresses;
        this._useFeature = useFeature;
    }
    async bindAsync(context) {
        for (const address of this._addresses) {
            // Parsear string a EndPoint (por ejemplo, "spa://popstate/basePath")
            const options = AddressBinder.parseAddress(address);
            this._useFeature(options);
            await options.bindAsync(context);
        }
    }
}

class OverrideWithAddressesStrategy extends AddressesStrategy {
    async bindAsync(context) {
        // Log (opcional)
        return super.bindAsync(context);
    }
}

class OverrideWithEndpointsStrategy extends EndpointsStrategy {
    constructor(endpoints, addresses) {
        super(endpoints);
        this._originalAddresses = addresses;
    }
    async bindAsync(context) {
        // Log (opcional)
        return super.bindAsync(context);
    }
}

class DefaultAddressStrategy {
    async bindAsync(context) {
        const options = AddressBinder.parseAddress('spa://popstate/');
        await options.bindAsync(context);
        context.addresses.push('spa://popstate/');
    }
}

// ==== Utils =====

AddressBinder.parseAddress = function(address) {
    // Ejemplo: "spa://popstate/basePath"
    if (address.startsWith('spa://popstate')) {
        const basePath = address.slice('spa://popstate'.length) || '/';
        return new ListenOptions({
            endPoint: new PopStateEndPoint(basePath)
        });
    }
    // Otros tipos de endpoint...
    throw new Error(`AddressBinder: tipo de address no soportado: ${address}`);
};

export default AddressBinder;
