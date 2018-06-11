import {NamedRequestHandler} from "../../models/NamedRequestHandler";
import {HandlerInput} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {isNullOrUndefined} from "util";

export abstract class BasicRaiderIoHandler extends NamedRequestHandler {
    /**
     * {@inheritDoc
     */
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
        if(handlerInput.requestEnvelope.request.type !== 'IntentRequest')
            return false;
        if(handlerInput.attributesManager.getSessionAttributes().Intent) {
            return handlerInput.attributesManager.getSessionAttributes().Intent == this.getIntentName();
        }
        return handlerInput.requestEnvelope.request.intent.name === this.getIntentName();
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

        let character: string = sessionAttributes.Character || undefined;
        let realm: string = sessionAttributes.Realm || undefined;
        let region = sessionAttributes.Region || "eu";

        if(isNullOrUndefined(character) || isNullOrUndefined(realm) || isNullOrUndefined(region)) {
            return handlerInput.responseBuilder
                .speak("Something went wrong, please try again.")
                .getResponse();
        }
        return this.handleRaiderIo(handlerInput, slots, sessionAttributes, character, realm, region);
    }

    /**
     * @param {HandlerInput} handlerInput The input given by the handler.
     * @param {Record<string, SlotValue>} slots The slots given by this request.
     * @param sessionAttributes The sessionAttributes for the current session.
     * @param {string} character The character we're looking for.
     * @param {string} realm The realm the character is on.
     * @param {string} region The region the character is in.
     * @returns {Promise<Response> | Response} The response from the intent.
     */
    abstract handleRaiderIo(handlerInput: HandlerInput, slots: Record<string, SlotValue>, sessionAttributes, character: string, realm: string, region: string): Promise<Response> | Response;
}