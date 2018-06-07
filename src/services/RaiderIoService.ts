import {
    mythicPlusAllBestRuns, mythicPlusBestRuns, mythicPlusRanks,
    mythicPlusScores
} from "../models/raiderio/CharacterFields";
import {RaiderIoScoreRequest} from "../models/raiderio/score/RaiderIoScoreRequest";
import {RaiderIoScoreResponse} from "../models/raiderio/score/RaiderIoScoreResponse";
import {MythicPlusService} from "../models/MythicPlusService";
import {RaiderIoRankRequest} from "../models/raiderio/rank/RaiderIoRankRequest";
import {RaiderIoRankResponse} from "../models/raiderio/rank/RaiderIoRankResponse";
import {RaiderIoBestDungeonsRequest} from "../models/raiderio/dungeons/RaiderIoBestDungeonsRequest";
import {RaiderIoBestDungeonsResponse} from "../models/raiderio/dungeons/RaiderIoBestDungeonsResponse";
const req = require("request");

/**
 * The base URL to load the API.
 */
const api_base: string = "https://raider.io/api/v1/";

/**
 * The base URL to load characters.
 */
const characters: string = api_base + "characters/profile?";

/**
 * A comma as used in the web.
 */
const web_comma: string = "%2C";

/**
 * Generates a character query for the given data.
 *
 * @param {string} region The region the player is in.
 * @param {string} realm The realm that is being played on.
 * @param {string} character The character that we want information for.
 * @returns {string} The url to attempt the request.
 */
const characterQuery: (region: string, realm: string, character: string) => string = (region: string, realm: string, character: string) => characters + "region=" + region + "&realm=" + realm + "&name=" + character;

/**
 * Generates a query addon to load specified fields.
 *
 * @param {string[]} fields The fields to load.
 * @returns {string} The addon generated.
 */
const includedFieldsQuery: (fields: string[]) => string = (fields: string[]) => {
    if (fields.length < 0)
        return "";
    return "&fields=" + fields.join(web_comma);
};

/**
 * A service that loads data from raider.io.
 */
export class RaiderIoService implements MythicPlusService {
    /**
     * {@inheritDoc}
     */
    getScore(request: RaiderIoScoreRequest): Promise<RaiderIoScoreResponse> {
        return new Promise((resolve, reject) => {
            const region = request.region.toLowerCase();
            const realm = request.realm.toLowerCase();
            const character = request.character.toLowerCase();
            const scoreType = request.scoreType.value.toLowerCase();
             this.getCharacterQuery(region, realm, character, [mythicPlusScores], (err, res, body) => {
                if(err || !body) {
                    return reject("Something went wrong getting score for " + character + " on " + realm + ".");
                }
                const finalObject: RaiderIoScoreResponse = {
                    request: request,
                    image: undefined,
                    score: undefined
                };
                if(body) {
                    if(body[mythicPlusScores] && body[mythicPlusScores][scoreType]) {
                        finalObject.score = body[mythicPlusScores][scoreType];
                    }
                    if(body.thumbnail_url) {
                        finalObject.image = body.thumbnail_url;
                    }
                }
                resolve(finalObject);
            });
        });
    }

    /**
     * {@inheritDoc}
     */
    getRank(request: RaiderIoRankRequest): Promise<RaiderIoRankResponse> {
        return new Promise((resolve, reject) => {
            const region = request.region.toLowerCase();
            const realm = request.realm.toLowerCase();
            const character = request.character.toLowerCase();
            const rankType = request.rankType.value.toLowerCase();
            const rankRegion = request.rankRegion.value.toLowerCase();
            this.getCharacterQuery(region, realm, character, [mythicPlusRanks], (err, res, body) => {
                if(err || !body) {
                    return reject("Something went wrong getting rank for " + character + " on " + realm + ".");
                }
                const finalObject: RaiderIoRankResponse = {
                    request: request,
                    image: undefined,
                    rank: undefined
                };
                if(body) {
                    if(body[mythicPlusRanks] && body[mythicPlusRanks][rankType] && body[mythicPlusRanks][rankType][rankRegion]) {
                        finalObject.rank = body[mythicPlusRanks][rankType][rankRegion];
                    }
                    if(body.thumbnail_url) {
                        finalObject.image = body.thumbnail_url;
                    }
                }
                resolve(finalObject);
            });
        });
    }

    getBestDungeons(request: RaiderIoBestDungeonsRequest): Promise<RaiderIoBestDungeonsResponse> {
        return new Promise((resolve, reject) => {
            const region = request.region.toLowerCase();
            const realm = request.realm.toLowerCase();
            const character = request.character.toLowerCase();
            const dungeons = request.dungeons;
            const dungeonsAsShort = dungeons.map(dungeon => dungeon.shortName);
            this.getCharacterQuery(region, realm, character, [mythicPlusAllBestRuns], (err, res, body) => {
                if(err || !body) {
                    return reject("Something went wrong getting dungeons for " + character + " on " + realm + ".");
                }
                const finalObject: RaiderIoBestDungeonsResponse = {
                    request: request,
                    dungeonData: []
                };
                if(body) {
                    if(body[mythicPlusBestRuns]) {
                        finalObject.dungeonData = body[mythicPlusBestRuns].filter(dungeon => dungeonsAsShort.indexOf(dungeon.short_name) >= 0).map(dungeonData => {
                            return {
                                dungeon: dungeons.filter(dungeon => dungeon.shortName.toLowerCase() == dungeonData.short_name.toLowerCase()).shift(),
                                level: dungeonData.mythic_level,
                                upgrades: dungeonData.num_keystone_upgrades
                            };
                        })
                    }
                }
                resolve(finalObject);
            });
        });
    }

    /**
     * @param {string} region The region the character is on.
     * @param {string} realm The realm the character is on.
     * @param {string} character The character we're looking for.
     * @param {string[]} includedFields The included fields.
     * @param callback The callback to execute with the resulting data.
     */
    private getCharacterQuery(region: string, realm: string, character: string, includedFields: string[], callback: any) {
        req(characterQuery(region, realm, character) + includedFieldsQuery(includedFields), { json: true }, (err, res, body) => callback(err, res, body));
    }
}