import {HandlerPair} from "../models/HandlerPair";
import {RequestHandler} from "ask-sdk-core";
import {isNullOrUndefined} from "util";
import {NamedRequestHandler} from "../models/NamedRequestHandler";

export class HandlerService {
    /**
     * All handlerPairs that we have registered.
     */
    private readonly handlerPairs: HandlerPair[] = [];

    /**
     * All request handlers that we have registered.
     */
    private readonly requestHandlers: NamedRequestHandler[] = [];

    /**
     * The default handler used if nothing fits the description.
     */
    private readonly defaultHandler: RequestHandler;

    /**
     * @param {RequestHandler} defaultHandler The default handler used if nothing fits the description.
     */
    constructor(defaultHandler: RequestHandler) {
        this.defaultHandler = defaultHandler;
    }

    /**
     * Registers the request handlers.
     */
    registerHandlerPairs(handlers: HandlerPair[]): HandlerService {
        this.handlerPairs.push(...handlers);
        this.requestHandlers.push(...handlers.map(handler => handler.requestHandler));
        return this;
    }

    /**
     * Registers the request handlers.
     */
    registerHandlers(handlers: NamedRequestHandler[]): HandlerService {
        this.requestHandlers.push(...handlers);
        return this;
    }

    /**
     * @param {string} alias The alias to search for.
     * @returns {RequestHandler} The handler found for the alias or the default handler.
     */
    getIntentNameForAlias(alias: string): string {
        const foundHandler: HandlerPair = this.handlerPairs.filter(handlerPair => {
            const aliasMatch: boolean = handlerPair.alias.find(handlerAlias => alias.toLowerCase().includes(handlerAlias.toLowerCase())) != undefined;
            if(aliasMatch)
                return aliasMatch;
            return alias.toLowerCase().includes(handlerPair.defaultAlias.toLowerCase());
        }).shift();
        if(foundHandler) {
            return foundHandler.requestHandler.getIntentName();
        }
        return undefined;
    }

    /**
     * @param {string} intent The intent to search for.
     * @returns {RequestHandler} The handler found that fits the intent name.
     */
    getHandlerForIntent(intent: string): RequestHandler {
        if(isNullOrUndefined(intent))
            return this.defaultHandler;
        const foundHandler: NamedRequestHandler = this.requestHandlers.filter(handlers => handlers.getIntentName().toLowerCase() == intent.toLowerCase()).shift();
        if(foundHandler)
            return foundHandler;
        return this.defaultHandler;
    }

    /**
     * Gets all handler pairs.
     */
    getAllHandlerPairs(): HandlerPair[] {
        return this.handlerPairs;
    }
}