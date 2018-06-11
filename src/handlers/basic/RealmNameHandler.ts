import {cleanupText} from "../../util/Util";
import {HandlerService} from "../../services/HandlerService";
import {ReceiveSlotDataIntent} from "../base/ReceiveSlotDataIntent";

/**
 * @type {string} The name of the intent.
 */
export const INTENT_NAME = "RealmNameIntent";

/**
 * This handler makes sure that the character name is correctly received.
 */
export class RealmNameHandler extends ReceiveSlotDataIntent {
    /**
     * @param {HandlerService} handlerService The handlerService to use to look up intents.
     */
    constructor(handlerService: HandlerService) {
        super(handlerService, INTENT_NAME, 'Realm', (value: string) => cleanupText(value));
    }

    /**
     * {@inheritDoc}
     */
    protected getSpeak(sessionAttributes: { [p: string]: any }): string {
        const characterName: string = sessionAttributes.Character || undefined;
        if(characterName) {
            return `What realm is ${characterName} on?`
        }
        return "What realm is the character on?";
    }
}