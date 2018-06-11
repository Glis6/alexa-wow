import {HandlerInput} from "ask-sdk-core";
import {IntentRequest, SlotValue} from "alexa-sdk";
import {Response} from "ask-sdk-model";
import {getSlotValuesIfValid} from "../../util/Util";
import {isNullOrUndefined} from "util";
import {HandlerService} from "../../services/HandlerService";
import {NamedRequestHandler} from "../../models/NamedRequestHandler";

/**
 * This handler makes sure that the character name is correctly received.
 */
export abstract class ReceiveSlotDataIntent extends NamedRequestHandler {
    /**
     * @param {HandlerService} handlerService The handlerService to use to look up intents.
     * @param intentName The name of the intent.
     * @param slotName The name of the slot.
     * @param slotModifier A modifier done on the slot when data is received.
     */
    protected constructor(private handlerService: HandlerService,
                intentName: string,
                private slotName: string,
                private slotModifier: (value: string) => string = (value) => value) {
        super(intentName)
    }

    /**
     * {@inheritDoc
     */
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
        if(handlerInput.requestEnvelope.request.type !== 'IntentRequest')
            return false;
        if(handlerInput.attributesManager.getSessionAttributes().Intent) {
            return handlerInput.attributesManager.getSessionAttributes().Intent == this.intentName;
        }
        return handlerInput.requestEnvelope.request.intent.name === this.intentName;
    }

    /**
     * {@inheritDoc
     */
    handle(handlerInput: HandlerInput): Promise<Response> | Response {
        const intentRequest: IntentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const slots: Record<string, SlotValue> = intentRequest.intent.slots;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slotValues: string[] = getSlotValuesIfValid(slots[this.slotName]);
        const value: string = (slotValues ? this.slotModifier(slotValues.shift()) : undefined) || sessionAttributes[this.slotName] || undefined;

        //We'll force the intent to return here.
        sessionAttributes.Intent = this.intentName;

        //If we don't have a character.
        if(isNullOrUndefined(value)) {
            return handlerInput.responseBuilder
                .speak(this.getSpeak(sessionAttributes))
                .reprompt(this.getReprompt(sessionAttributes))
                .getResponse();
        }
        sessionAttributes[this.slotName] = value;

        delete sessionAttributes.Intent;

        const callbackStackString: string = sessionAttributes.CallbackStack || "";
        const callbackStack: string[] = callbackStackString.split(",");
        const nextIntent: string = callbackStack.length <= 0 ? undefined : callbackStack.pop();
        sessionAttributes.CallbackStack = callbackStack.join(",");
        return this.handlerService.getHandlerForIntent(nextIntent).handle(handlerInput);
    }

    /**
     * @param sessionAttributes The sessionAttributes for the session.
     * @returns {string} The message to ask for this attribute.
     */
    protected abstract getSpeak(sessionAttributes: {[p: string]: any}): string;

    /**
     * @param sessionAttributes The sessionAttributes for the session.
     * @returns {string} The reprompt when asked for more information.
     */
    protected getReprompt(sessionAttributes: {[p: string]: any}): string {
        return this.getSpeak(sessionAttributes);
    }
}