import {HandlerInput} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {HandlerService} from "../services/HandlerService";
import {isNullOrUndefined} from "util";
import {DatabaseService} from "../models/DatabaseService";
import { getSlotValuesIfValid} from "../util/Util";
import {INTENT_NAME as CHARACTER_INTENT_NAME} from "./basic/CharacterNameHandler";
import {INTENT_NAME as REALM_INTENT_NAME} from "./basic/RealmNameHandler";
import {INTENT_NAME as REGION_INTENT_NAME} from "./basic/RegionNameHandler";
import {INTENT_NAME as LOOKUP_CHARACTER_INTENT_NAME} from "./basic/LookupCharacterHandler";
import {NamedRequestHandler} from "../models/NamedRequestHandler";

/**
 * @type {string} The name of the intent.
 */
const INTENT_NAME = "RaiderIoDataIntent";

export class RaiderIoDataHandler extends NamedRequestHandler {
    /**
     * @param {HandlerService} handlerService The handlerService we're using to get the correct handler.
     * @param databaseService The databaseService to use to look up data.
     */
    constructor(private handlerService: HandlerService, private databaseService: DatabaseService) {
        super(INTENT_NAME);
    }

    /**
     * {@inheritDoc
     */
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
        if(handlerInput.requestEnvelope.request.type !== 'IntentRequest')
            return false;
        if(handlerInput.attributesManager.getSessionAttributes().Intent) {
            return handlerInput.attributesManager.getSessionAttributes().Intent == INTENT_NAME
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

        //As absolute first thing we'll check if the request is even valid. We'll do this by checking if we accept the requested data.
        const requestTypeSlotValues: string[] = getSlotValuesIfValid(slots.RequestType);
        let requestType: string = (requestTypeSlotValues ? requestTypeSlotValues.shift() : undefined) || sessionAttributes.RequestType || undefined;
        let futureIntent: string = sessionAttributes.FutureIntent || undefined;

        if(!futureIntent) {
            const potentialFutureIntent: string = this.handlerService.getIntentNameForAlias(requestType);
            if(!isNullOrUndefined(potentialFutureIntent)) {
                sessionAttributes.FutureIntent = futureIntent = potentialFutureIntent;
            } else {
                return handlerInput.responseBuilder
                    .speak("I am not able to look up " + requestType + ". I am able to look up the following: " + this.handlerService.getAllHandlerPairs().map(handler => handler.defaultAlias).join("...") + " Which one of those would you like me too look up?")
                    .reprompt("Please tell me what you'd like me to look up.")
                    .getResponse();
            }
        }

        //We'll create or get the callback stack now.
        const callbackStackString: string = sessionAttributes.CallbackStack || "";
        let callbackStack: string[] = callbackStackString.split(",");
        if(isNullOrUndefined(callbackStack)) {
            sessionAttributes.CallbackStack = "";
            callbackStack = [];
        }

        //Next we'll check if we have a character.
        const character: string = sessionAttributes.Character || undefined;
        if(isNullOrUndefined(character)) {
            callbackStack.push(INTENT_NAME);
            sessionAttributes.CallbackStack = callbackStack.join(",");
            return this.handlerService.getHandlerForIntent(CHARACTER_INTENT_NAME).handle(handlerInput);
        }

        //We'll try to look up the character to see if it exists.
        let lookedUpCharacter: boolean = sessionAttributes.LookedUpCharacter || false;
        if(!lookedUpCharacter) {
            callbackStack.push(INTENT_NAME);
            sessionAttributes.CallbackStack = callbackStack.join(",");
            return this.handlerService.getHandlerForIntent(LOOKUP_CHARACTER_INTENT_NAME).handle(handlerInput);
        }

        //Next we'll check if we have a realm.
        const realm: string = sessionAttributes.Realm || undefined;
        if(isNullOrUndefined(realm)) {
            callbackStack.push(INTENT_NAME);
            sessionAttributes.CallbackStack = callbackStack.join(",");
            return this.handlerService.getHandlerForIntent(REALM_INTENT_NAME).handle(handlerInput);
        }

        //Next we'll check if we have a realm.
        const region = sessionAttributes.Region || undefined;
        if(isNullOrUndefined(region)) {
            callbackStack.push(INTENT_NAME);
            sessionAttributes.CallbackStack = callbackStack.join(",");
            return this.handlerService.getHandlerForIntent(REGION_INTENT_NAME).handle(handlerInput);
        }

        //If all data is filled in then we'll insert the character in the database or update it before we continue.
        let promise: Promise<void>;
        if(sessionAttributes.SaveCharacter && (sessionAttributes.SaveCharacter as boolean)) {
            promise = this.databaseService.insertCharacterData({
                    character: character,
                    region: region,
                    realm: realm,
                    automaticUse: false
                });
        } else {
            promise = Promise.resolve();
        }

        //After that we'll complete the intent and move on.
        return promise.then(() => {
            //If we get this far it's time to pass on the intent.
            sessionAttributes.Intent = futureIntent;
            delete sessionAttributes.CallbackStack;
            delete sessionAttributes.RequestType;
            delete sessionAttributes.FutureIntent;
            delete sessionAttributes.Intent;
            return this.handlerService.getHandlerForIntent(futureIntent).handle(handlerInput);
        });
    }
}