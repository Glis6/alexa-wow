import {NamedRequestHandler} from "./NamedRequestHandler";

export interface HandlerPair {
    /**
     * The actual RequestHandler.
     */
    requestHandler: NamedRequestHandler;

    /**
     * The default alias for the handler.
     */
    defaultAlias: string;

    /**
     * A list of aliases for the handler.
     */
    alias: string[];
}