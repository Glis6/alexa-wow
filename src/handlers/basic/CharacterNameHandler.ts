import {cleanupText} from "../../util/Util";
import {HandlerService} from "../../services/HandlerService";
import {ReceiveSlotDataIntent} from "../base/ReceiveSlotDataIntent";

/**
 * @type {string} The name of the intent.
 */
export const INTENT_NAME = "CharacterNameIntent";

/**
 * This handler makes sure that the character name is correctly received.
 */
export class CharacterNameHandler extends ReceiveSlotDataIntent {
    /**
     * @param {HandlerService} handlerService The handlerService to use to look up intents.
     */
    constructor(handlerService: HandlerService) {
        super(handlerService, INTENT_NAME, 'Character', (value: string) => cleanupText(value));
    }

    /**
     * {@inheritDoc}
     */
    protected getSpeak(sessionAttributes: { [p: string]: any }): string {
        return "What is the name of the character?";
    }

    /**
     * {@inheritDoc}
     */
    protected getReprompt(sessionAttributes: { [p: string]: any }): string {
        return "Please answer with: the name is x";
    }
}