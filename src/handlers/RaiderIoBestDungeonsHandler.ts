import {MythicPlusService} from "../models/MythicPlusService";
import {HandlerInput} from "ask-sdk-core";
import {Response} from "ask-sdk-model";
import {SlotValue} from "alexa-sdk";
import {Dungeon, textToDungeon} from "../models/raiderio/dungeons/Dungeons";
import {BasicRaiderIoHandler} from "./BasicRaiderIoHandler";
import {RaiderIoDataHandler} from "./RaiderIoDataHandler";

export class RaiderIoBestDungeonsHandler extends BasicRaiderIoHandler {
    /**
     * The dungeonService that handles getting the score.
     */
    private dungeonService: MythicPlusService;

    /**
     * @param {MythicPlusService} dungeonService The dungeonService that handles getting the dungeon data.
     */
    constructor(dungeonService: MythicPlusService) {
        super('RaiderIoBestDungeonIntent');
        this.dungeonService = dungeonService;
    }

    /**
     * {@inheritDoc
     */
    handleRaiderIo(handlerInput: HandlerInput, slots: Record<string, SlotValue>, sessionAttributes, character: string, realm: string, region: string): Promise<Response> | Response {
        let dungeons: Dungeon[];

        const dungeonSlotValue = RaiderIoDataHandler.getSlotValuesIfValid(slots.Dungeons);

        if(dungeonSlotValue) {
            dungeons = textToDungeon(dungeonSlotValue);
        } else {
            dungeons = sessionAttributes.Dungeons || undefined
        }

        if(!dungeons) {
            return handlerInput.responseBuilder
                .speak("What dungeons would you like to check?")
                .reprompt("What dungeons would you like to check?")
                .getResponse();
        }

        return this.dungeonService.getBestDungeons({
            region: region,
            realm: realm,
            character: character,
            dungeons: dungeons
        }).then(result => {
            if (result.dungeonData.length <= 0) {
                return handlerInput.responseBuilder
                    .speak(result.request.character + " on " + result.request.realm + " doesn't seem to have any ranked dungeon runs.")
                    .getResponse();
            }
            const translatedDungeonRuns: string = result.dungeonData.map(dungeon => (dungeon.upgrades == 0 ? "failed" : dungeon.upgrades + " chested") + " " + dungeon.dungeon.commonName + " on +" + dungeon.level).join("... ");
            return handlerInput.responseBuilder
                .speak(result.request.character + " on " + result.request.realm + " has the following ranked dungeon runs: " + translatedDungeonRuns)
                .getResponse();
        }).catch(error => handlerInput.responseBuilder
            .speak(error)
            .getResponse());
    }
}