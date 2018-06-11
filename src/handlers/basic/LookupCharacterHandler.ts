import {getSlotValuesIfValid} from "../../util/Util";
import {HandlerService} from "../../services/HandlerService";
import {HandlerInput} from "ask-sdk-core";
import {isNullOrUndefined} from "util";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {Response} from "ask-sdk-model";
import {DatabaseService} from "../../models/DatabaseService";
import {INTENT_NAME as SAVE_LOOKED_UP_CHARACTER_INTENT_NAME} from "./SaveLookedUpCharacterHandler";
import {NamedRequestHandler} from "../../models/NamedRequestHandler";

/**
 * @type {string} The name of the intent.
 */
export const INTENT_NAME = "LookupCharacterIntent";

/**
 * This handler makes sure that the character name is correctly received.
 */
export class LookupCharacterHandler extends NamedRequestHandler {
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

        //The promise that we'll follow up.
        let promise: Promise<void>;

        //First we'll check if we've already looked up the character.
        let lookedUpCharacter = sessionAttributes.LookedUpCharacter || {
            lookedUp: false,
            character: undefined
        };
        if (!lookedUpCharacter.lookedUp) {
            //Then we'll get the character.
            const character: string = sessionAttributes.Character || undefined;
            promise = this.databaseService.getCharacterDataForCharacter(character)
                .then((characterData) => {
                    sessionAttributes.LookedUpCharacter = lookedUpCharacter = {
                        lookedUp: true,
                        character: characterData
                    };
                })
                .catch(() => {
                    sessionAttributes.LookedUpCharacter = lookedUpCharacter = {
                        lookedUp: true,
                        character: undefined
                    };
                });
        } else {
            promise = Promise.resolve();
        }

        //We'll load our callback stack here, we will need it later.
        const callbackStackString: string = sessionAttributes.CallbackStack || "";
        const callbackStack: string[] = callbackStackString.split(",");

        //We'll quickly check if we have to insert the character data later.
        return promise.then(() => {
            if(lookedUpCharacter && lookedUpCharacter.lookedUp) {
                sessionAttributes.SaveCharacter = isNullOrUndefined(lookedUpCharacter.character);
            }
        }).then(() => {
            //If we found a character then we'll check things.
            if (lookedUpCharacter.character && lookedUpCharacter.character.character && lookedUpCharacter.character.realm && lookedUpCharacter.character.region) {
                //If the character isn't automatic use we'll ask if we can use it now.
                if (lookedUpCharacter.character.automaticUse) {
                    sessionAttributes.UseRequest = true;
                } else {
                    const foundCharacterOutput: string = "I found " + lookedUpCharacter.character.character + " on " + lookedUpCharacter.character.realm + " in the " + lookedUpCharacter.character.region + " region, would you like me to use this character?";
                    return handlerInput.responseBuilder
                        .speak(foundCharacterOutput)
                        .reprompt(foundCharacterOutput)
                        .getResponse();
                }
                //If we asked to use the character then we'll check our results.
                const slotValues: string[] = getSlotValuesIfValid(slots.UseRequest);
                const useRequest = (slotValues ? slotValues.shift() : undefined) || sessionAttributes.UseRequest || undefined;
                if (!isNullOrUndefined(useRequest)) {
                    const response: boolean = useRequest as boolean;
                    //If we asked to use the character and we can then we'll set the data for this character.
                    if (response) {
                        sessionAttributes.Character = lookedUpCharacter.character.character;
                        sessionAttributes.Realm = lookedUpCharacter.character.realm;
                        sessionAttributes.Region = lookedUpCharacter.character.region;

                        //If we use the character we'll ask if we want it as default character.
                        if(!sessionAttributes.AskedSaveLookupCharacter && !lookedUpCharacter.character.automaticUse) {
                            callbackStack.push(INTENT_NAME);
                            sessionAttributes.CallbackStack = callbackStack.join(",");
                            return this.handlerService.getHandlerForIntent(SAVE_LOOKED_UP_CHARACTER_INTENT_NAME).handle(handlerInput);
                        }
                    }
                }
            }

            //We'll delete the properties we used.
            delete sessionAttributes.LookupCharacter;
            delete sessionAttributes.UseRequest;
            delete sessionAttributes.Intent;

            //And we'll put in one to not try this block again.
            sessionAttributes.LookedUpCharacter = true;

            const nextIntent: string = callbackStack.length <= 0 ? undefined : callbackStack.pop();
            sessionAttributes.CallbackStack = callbackStack.join(",");
            return this.handlerService.getHandlerForIntent(nextIntent).handle(handlerInput);
        });
    }
}