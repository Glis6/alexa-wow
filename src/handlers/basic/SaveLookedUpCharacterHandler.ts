import {getSlotValuesIfValid} from "../../util/Util";
import {HandlerService} from "../../services/HandlerService";
import {HandlerInput} from "ask-sdk-core";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {Response} from "ask-sdk-model";
import {DatabaseService} from "../../models/DatabaseService";
import {NamedRequestHandler} from "../../models/NamedRequestHandler";

/**
 * @type {string} The name of the intent.
 */
export const INTENT_NAME = "SaveLookedUpCharacterIntent";

/**
 * This handler makes sure that the character name is correctly received.
 */
export class SaveLookedUpCharacterHandler extends NamedRequestHandler {
    /**
     * @param {HandlerService} handlerService The handlerService to use to look up intents.
     * @param {DatabaseService} databaseService The databaseService to use to look up the character.
     */
    constructor(private handlerService: HandlerService,
                private databaseService: DatabaseService) {
        super(INTENT_NAME);
    }

    /**
     * {@inheritDoc
     */
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
        if (handlerInput.requestEnvelope.request.type !== 'IntentRequest')
            return false;
        if (handlerInput.attributesManager.getSessionAttributes().Intent) {
            return handlerInput.attributesManager.getSessionAttributes().Intent == INTENT_NAME;
        }
        return handlerInput.requestEnvelope.request.intent.name === INTENT_NAME;
    }

    /**
     * {@inheritDoc
     */
    handle(handlerInput: HandlerInput): Promise<Response> | Response {
        const intentRequest: IntentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const slots: Record<string, SlotValue> = intentRequest.intent.slots;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        //We'll force the intent to return here.
        sessionAttributes.Intent = this.intentName;

        //We'll check if we've already looked up the character.
        let lookedUpCharacter = sessionAttributes.LookedUpCharacter || undefined;
        if(lookedUpCharacter) {
            //We'll check if we got a response.
            const slotValues: string[] = getSlotValuesIfValid(slots.DefaultCharacter);
            const defaultCharacter = (slotValues ? slotValues.shift() : undefined) || sessionAttributes.DefaultCharacter || undefined;
            if(defaultCharacter) {
                const defaultCharacterBoolean: boolean = defaultCharacter as boolean;
                //If we got a positive response then we'll save the response.
                if(defaultCharacterBoolean) {
                    const data = lookedUpCharacter.character;
                    data.useDefault = true;
                    this.databaseService.insertCharacterData(data).then(() => { /* We'll do nothing with the result. */});
                }
            } else {
                return handlerInput
                    .responseBuilder
                    .speak("Would you like to use " + lookedUpCharacter.character.character + " on " + lookedUpCharacter.character.realm + " in the " + lookedUpCharacter.character.region + " region as the default character for this name?")
                    .reprompt("Please answer with either 'do use this character as default character', or 'do not use this character as default character'.")
                    .getResponse();
            }
        }

        //We'll clean up the tags that we used.
        delete sessionAttributes.DefaultCharacter;
        delete sessionAttributes.Intent;

        //We'll tag this as completed so we don't have to do it again.
        sessionAttributes.AskedSaveLookupCharacter = true;

        //After all that checking we'll go back to our previous process.
        const callbackStackString: string = sessionAttributes.CallbackStack || "";
        const callbackStack: string[] = callbackStackString.split(",");
        const nextIntent: string = callbackStack.length <= 0 ? undefined : callbackStack.pop();
        sessionAttributes.CallbackStack = callbackStack.join(",");
        return this.handlerService.getHandlerForIntent(nextIntent).handle(handlerInput);
    }
}