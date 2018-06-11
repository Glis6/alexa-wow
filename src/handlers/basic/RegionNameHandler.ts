import {HandlerService} from "../../services/HandlerService";
import {ReceiveSlotDataIntent} from "../base/ReceiveSlotDataIntent";

/**
 * @type {string} The name of the intent.
 */
export const INTENT_NAME = "RegionNameIntent";

/**
 * This handler makes sure that the character name is correctly received.
 */
export class RegionNameHandler extends ReceiveSlotDataIntent {
    /**
     * @param {HandlerService} handlerService The handlerService to use to look up intents.
     */
    constructor(handlerService: HandlerService) {
        super(handlerService, INTENT_NAME, 'Region');
    }

    /**
     * {@inheritDoc}
     */
    protected getSpeak(sessionAttributes: { [p: string]: any }): string {
        const characterName: string = sessionAttributes.Character || undefined;
        const realmName: string = sessionAttributes.Realm || undefined;
        if(characterName && realmName) {
            return `What region is ${characterName} on ${realmName} in?`
        } else if(characterName) {
            return `What region is ${characterName} in?`
        } else if(realmName) {
            return `What region is the character on ${realmName} in?`
        }
        return "What region is the character in?";
    }
}