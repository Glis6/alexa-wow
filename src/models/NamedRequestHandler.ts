import {HandlerInput, RequestHandler} from "ask-sdk-core";
import {Response} from "ask-sdk-model";

export abstract class NamedRequestHandler implements RequestHandler {
    /**
     * The name of the intent to handle.
     */
    protected intentName: string;

    /**
     * The name of the intent to handle.
     */
    protected constructor(intentName: string) {
        this.intentName = intentName;
    }

    /**
     * {@inheritDoc
     */
    abstract canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean;

    /**
     * {@inheritDoc
     */
    abstract handle(handlerInput: HandlerInput): Promise<Response> | Response;

    /**
     * @returns {string} The name of the intent to handle.
     */
    getIntentName(): string {
        return this.intentName;
    }
}