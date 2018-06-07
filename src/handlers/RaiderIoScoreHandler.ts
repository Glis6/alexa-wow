import {MythicPlusService} from "../models/MythicPlusService";
import {HandlerInput} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {all, dps, healer, tank} from "../models/raiderio/score/ScoreType";
import {SlotValue} from "alexa-sdk";
import {BasicRaiderIoHandler} from "./BasicRaiderIoHandler";
import {isNullOrUndefined} from "util";
import {RaiderIoDataHandler} from "./RaiderIoDataHandler";

export class RaiderIoScoreHandler extends BasicRaiderIoHandler {
    /**
     * The scoreService that handles getting the score.
     */
    private scoreService: MythicPlusService;

    /**
     * @param {MythicPlusService} scoreService The scoreService that handles getting the score.
     */
    constructor(scoreService: MythicPlusService) {
        super('RaiderIoScoreIntent');
        this.scoreService = scoreService;
    }

    /**
     * {@inheritDoc
     */
    handleRaiderIo(handlerInput: HandlerInput, slots: Record<string, SlotValue>, sessionAttributes, character: string, realm: string, region: string): Promise<Response> | Response {
        const scoreTypeSlotValue = RaiderIoDataHandler.getSlotValuesIfValid(slots.ScoreType);

        const scoreType = sessionAttributes.ScoreType || {
            value: scoreTypeSlotValue ? scoreTypeSlotValue.shift() : undefined,
            custom: !!scoreTypeSlotValue
        };

        if(!scoreType || isNullOrUndefined(scoreType.value)) {
            const scoreTypesList: string = [all, dps, healer, tank].join("...");
            return handlerInput.responseBuilder
                .speak("What role would you like to look up the score for?")
                .reprompt("Please answer with one of the following: " + scoreTypesList)
                .getResponse();
        }

        return this.scoreService.getScore({
            region: region,
            realm: realm,
            character: character,
            scoreType: scoreType
        }).then(result => {
            if (!result.score) {
                return handlerInput.responseBuilder
                    .speak(result.request.character + " on " + result.request.realm + " doesn't seem to have a" + (result.request.scoreType.custom ? (" " + result.request.scoreType.value) : "") + " score.")
                    .getResponse();
            }
            return handlerInput.responseBuilder
                .speak(result.request.character + " on " + result.request.realm + " has a raider dot io score " + (result.request.scoreType.custom ? ("for " + result.request.scoreType.value + " ") : "") + " of " + result.score + ".")
                .withStandardCard("Raider.io " + (result.request.scoreType.custom ? result.request.scoreType.value + " " : "") + "score for " + result.request.character, result.request.character + " on " + result.request.realm + " has a Raider.io score " + (result.request.scoreType.custom ? ("for " + result.request.scoreType.value + " ") : "") + "of " + result.score + ".", result.image)
                .getResponse();
        }).catch(error => handlerInput.responseBuilder
            .speak(error)
            .getResponse());
    }
}