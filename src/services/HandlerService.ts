import {HandlerPair} from "../models/HandlerPair";
import {RequestHandler} from "ask-sdk-core";

export class HandlerService {
    /**
     * All handlers that we have registered.
     */
    private readonly handlers: HandlerPair[] = [];

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
     * Registers the handlers.
     */
    registerHandlers(handlers: HandlerPair[]): HandlerService {
        this.handlers.push(...handlers);
        return this;
    }

    /**
     * @param {string} alias The alias to search for.
     * @returns {RequestHandler} The handler found for the alias or the default handler.
     */
    getIntentNameForAlias(alias: string): string {
        const foundHandler: HandlerPair = this.handlers.filter(handlerPair => {
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
        const foundHandler: HandlerPair = this.handlers.filter(handlerPair => handlerPair.requestHandler.getIntentName().toLowerCase() == intent.toLowerCase()).shift();
        if(foundHandler)
            return foundHandler.requestHandler;
        return this.defaultHandler;
    }

    /**
     * Gets all handler pairs.
     */
    getAllHandlers(): HandlerPair[] {
        return this.handlers;
    }
}