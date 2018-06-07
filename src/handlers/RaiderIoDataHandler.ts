import {HandlerInput, RequestHandler} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {HandlerService} from "../services/HandlerService";
import {isNullOrUndefined} from "util";
import {DatabaseService} from "../models/DatabaseService";

/**
 * @param {string} text The text to clean up.
 * @returns {string} The cleaned and formatted text.
 */
export const cleanupText = (text: string) => {
    text = text.replace(",", "").replace(".", "").replace(" ", "").toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * @type {string} The name of the intent.
 */
const INTENT_NAME = "RaiderIoDataIntent";

export class RaiderIoDataHandler implements RequestHandler {
    /**
     * The handlerService we're using to get the correct handler.
     */
    private handlerService: HandlerService;

    /**
     * The databaseService to use to look up data.
     */
    private databaseService: DatabaseService;

    /**
     * @param {HandlerService} handlerService The handlerService we're using to get the correct handler.
     */
    constructor(handlerService: HandlerService, databaseService: DatabaseService) {
        this.handlerService = handlerService;
        this.databaseService = databaseService;
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

        const characterSlotValues: string[] = RaiderIoDataHandler.getSlotValuesIfValid(slots.Character);
        const realmSlotValues: string[] = RaiderIoDataHandler.getSlotValuesIfValid(slots.Realm);
        const regionSlotValues: string[] = RaiderIoDataHandler.getSlotValuesIfValid(slots.Region);
        const requestTypeSlotValues: string[] = RaiderIoDataHandler.getSlotValuesIfValid(slots.RequestType);
        const useRequestSlotValues: string[] = RaiderIoDataHandler.getSlotValuesIfValid(slots.UseRequest);

        let character: string = (characterSlotValues ? characterSlotValues.shift() : undefined) || sessionAttributes.Character || undefined;
        let realm: string = (realmSlotValues ? realmSlotValues.shift() : undefined) || sessionAttributes.Realm || undefined;
        let region = (regionSlotValues ? regionSlotValues.shift() : undefined) || sessionAttributes.Region || undefined;
        let requestType: string = (requestTypeSlotValues ? requestTypeSlotValues.shift() : undefined) || sessionAttributes.RequestType || undefined;
        let lookedUpData = sessionAttributes.LookedUpData || { queried: false};
        let useRequest = (useRequestSlotValues ? useRequestSlotValues.shift() : undefined) || sessionAttributes.UseRequest || undefined;
        let futureIntent: string = sessionAttributes.FutureIntent || undefined;

        //If character just came in.
        if(slots.Character.value) {
            character = cleanupText(character);
        }

        //If the realm just came in.
        if(slots.Realm.value) {
            realm = cleanupText(realm);
        }

        sessionAttributes.Character = character;
        sessionAttributes.Realm = realm;
        sessionAttributes.Region = region;
        sessionAttributes.Intent = INTENT_NAME;
        sessionAttributes.UseRequest = useRequest;
        sessionAttributes.LookedUpData = lookedUpData;

        //If we don't have a request type.
        if(!requestType && !futureIntent) {
            return handlerInput.responseBuilder
                .speak("What would you like me to look up" + (character ? " for " + character : realm ? " character " : "") + (realm ? "on " + realm + "?" : ""))
                .reprompt("Please answer with: the name is x")
                .getResponse();
        }

        //If we do have a request type we're gonna link it to a future intent. If no such intent exists, then we ask the question again.
        if(requestType && !futureIntent) {
            const potentialFutureIntent: string = this.handlerService.getIntentNameForAlias(requestType);
            if(!isNullOrUndefined(potentialFutureIntent)) {
                futureIntent = potentialFutureIntent;
                sessionAttributes.FutureIntent = potentialFutureIntent;
            } else {
                return handlerInput.responseBuilder
                    .speak("I am not able to look up " + requestType + ". I am able to look up the following: " + this.handlerService.getAllHandlers().map(handler => handler.defaultAlias).join("...") + " Which one of those would you like me too look up?")
                    .reprompt("Please tell me what you'd like me to look up.")
                    .getResponse();
            }
        }

        //If we don't have a character.
        if(isNullOrUndefined(character)) {
            return handlerInput.responseBuilder
                .speak("What is the name of the character?")
                .reprompt("Please answer with: the name is x")
                .getResponse();
        }

        //If we asked to use the data we gathered
        if(lookedUpData.result && useRequest) {
            sessionAttributes.Realm = realm = lookedUpData.result.realm;
            sessionAttributes.Region = region = lookedUpData.result.region;
        }

        let promise: Promise<any>;
        //If we have a character we'll check the database to see if we have previous data.
        if(!lookedUpData.queried && (isNullOrUndefined(realm) || isNullOrUndefined(region))) {
            promise = this.databaseService.getCharacterDataForCharacter(character)
                .then((characterData) => {
                    //we set the lookup data to not query again.
                    sessionAttributes.LookedUpData = lookedUpData = {
                        queried: true,
                        requested: false,
                        result: characterData
                    };
                })
                .catch(error => console.log(error));

        } else {
            //Otherwise we'll instantly resolve.
            promise = Promise.resolve();
        }

        return promise.then(() => {
            //If we have character data that is valid.
            if(lookedUpData && lookedUpData.result) {
                if(lookedUpData.result.automaticUse) {
                    sessionAttributes.Realm = realm = lookedUpData.result.realm;
                    sessionAttributes.Region = region = lookedUpData.result.region;
                    useRequest = true;
                } else if(lookedUpData && !lookedUpData.requested && lookedUpData.result && lookedUpData.result.realm && lookedUpData.result.region) {
                    const foundCharacterOutput: string = "I found " + character + " on " + lookedUpData.result.realm + " in the " + lookedUpData.result.region + " region, would you like me to use this character?";
                    sessionAttributes.LookedUpData.requested = true;
                    return handlerInput.responseBuilder
                        .speak(foundCharacterOutput)
                        .reprompt(foundCharacterOutput)
                        .getResponse();
                }
            }

            //If we don't have a realm.
            if(isNullOrUndefined(realm)) {
                const realmPrompt: string = "What realm is " + character + " on?";
                return handlerInput.responseBuilder
                    .speak(realmPrompt)
                    .reprompt(realmPrompt)
                    .getResponse();
            }

            //If we don't have a region.
            if(isNullOrUndefined(region)) {
                const regionPrompt: string = "What region is " + character + " on?";
                return handlerInput.responseBuilder
                    .speak(regionPrompt)
                    .reprompt(regionPrompt)
                    .getResponse();
            }

            let promise: Promise<void>;
            //If we're using the data then we don't have to update it.
            if(useRequest) {
                promise = Promise.resolve();
            } else {
                //If it is the first time then we'll put in the character.
                promise = this.databaseService.insertCharacterData({
                    character: character,
                    region: region,
                    realm: realm,
                    automaticUse: false
                });
            }

            return promise.then(() => {
                //If we get this far it's time to pass on the intent.
                sessionAttributes.Intent = futureIntent;
                delete sessionAttributes.FutureIntent;
                delete sessionAttributes.RequestType;
                delete sessionAttributes.LookUpData;
                delete sessionAttributes.UseRequest;
                return this.handlerService.getHandlerForIntent(futureIntent).handle(handlerInput);
            });
        });
    }

    static getSlotValuesIfValid(slot: any): string[] {
        if(!slot)
            return undefined;
        if(!slot.resolutions) {
            if(slot.value)
                return [slot.value];
            return undefined;
        }
        const resolutions = slot.resolutions;
        return resolutions.resolutionsPerAuthority
            .filter(request => request.status.code === "ER_SUCCESS_MATCH")
            .map(request => request.values.map(values => values.value.name).shift());
    }
}