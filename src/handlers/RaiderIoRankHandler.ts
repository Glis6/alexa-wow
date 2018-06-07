import {MythicPlusService} from "../models/MythicPlusService";
import {HandlerInput} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {SlotValue} from "alexa-sdk";
import {overall} from "../models/raiderio/rank/RankType";
import {realm as regionRank} from "../models/raiderio/rank/RankRegion";
import {BasicRaiderIoHandler} from "./BasicRaiderIoHandler";
import {isNullOrUndefined} from "util";
import {RaiderIoDataHandler} from "./RaiderIoDataHandler";

export const DEFAULT_VALUES_STRING: string = "use default values";

export const DEFAULT_VALUE_STRING: string = "use default value";

export class RaiderIoRankHandler extends BasicRaiderIoHandler {
    /**
     * The scoreService that handles getting the score.
     */
    private rankService: MythicPlusService;

    /**
     * @param {MythicPlusService} rankService The scoreService that handles getting the score.
     */
    constructor(rankService: MythicPlusService) {
        super('RaiderIoRankIntent');
        this.rankService = rankService;
    }

    /**
     * {@inheritDoc
     */
    handleRaiderIo(handlerInput: HandlerInput, slots: Record<string, SlotValue>, sessionAttributes, character: string, realm: string, region: string): Promise<Response> | Response {
        const rankTypeSlotValue = RaiderIoDataHandler.getSlotValuesIfValid(slots.RankType);
        const rankRegionSlotValue = RaiderIoDataHandler.getSlotValuesIfValid(slots.RankRegion);

        const rankType = sessionAttributes.RankType || {
            value: rankTypeSlotValue ? rankTypeSlotValue.shift() : undefined,
            custom: !!rankTypeSlotValue
        };
        const rankRegion = sessionAttributes.RankRegion || {
            value: rankRegionSlotValue ? rankRegionSlotValue.shift() : undefined,
            custom: !!rankRegionSlotValue
        };

        if(rankType && !isNullOrUndefined(rankType.value)) {
            switch(rankType.value.toLowerCase()) {
                case DEFAULT_VALUES_STRING:
                    rankRegion.value = regionRank;
                    rankRegion.custom = false;
                case DEFAULT_VALUE_STRING:
                    rankType.value = overall;
                    rankType.custom = false;
                    break;
            }
        } else {
            return handlerInput.responseBuilder
                .speak("Would you like to specify what type of rank? Or shall I just use the default value?")
                .reprompt("Please answer with '" + DEFAULT_VALUE_STRING + "', " + DEFAULT_VALUES_STRING + " or a type of rank.")
                .getResponse();
        }

        if(rankRegion && !isNullOrUndefined(rankRegion.value)) {
            rankRegion.value = regionRank;
            rankRegion.custom = false;
        } else {
            return handlerInput.responseBuilder
                .speak("Would you like to specify what scope for the ranking? Or shall I just use the default value?")
                .reprompt("Please answer with '" + DEFAULT_VALUE_STRING + "' or the scope of the ranking.")
                .getResponse();
        }

        return this.rankService.getRank({
            region: region,
            realm: realm,
            character: character,
            rankType: rankType,
            rankRegion: rankRegion
        }).then(result => {
            if (!result.rank) {
                return handlerInput.responseBuilder
                    .speak(result.request.character + " on " + result.request.realm + " doesn't seem to have a " + result.request.rankRegion.value + " rank for " + result.request.rankType.value + ".")
                    .getResponse();
            }
            return handlerInput.responseBuilder
                .speak(result.request.character + " on " + result.request.realm + " has a " + result.request.rankRegion.value + " ranking for " + result.request.rankType.value + " of " + result.rank + ".")
                .withStandardCard("Raider.io " + result.request.rankRegion.value + " " + result.request.rankType.value + " ranking for " + result.request.character, result.request.character + " on " + result.request.realm + " has a " + result.request.rankRegion.value + " ranking for " + result.request.rankType.value + " of " + result.rank + ".", result.image)
                .getResponse();
        }).catch(error => handlerInput.responseBuilder
            .speak(error)
            .getResponse());
    }
}