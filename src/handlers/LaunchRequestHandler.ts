import {HandlerInput, RequestHandler} from "ask-sdk-core";
import {Response} from "ask-sdk-model";

export class LaunchRequestHandler implements RequestHandler {
    canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
        return handlerInput.requestEnvelope.request.type == "LaunchRequest";
    }

    handle(handlerInput: HandlerInput): Promise<Response> | Response {
        const speechText = 'Welcome to Glis\' WoW tools.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
}