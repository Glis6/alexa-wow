import {LaunchRequestHandler} from "./handlers/LaunchRequestHandler";
import {RaiderIoService} from "./services/RaiderIoService";
import {SkillBuilders} from "ask-sdk-core";
import {RaiderIoScoreHandler} from "./handlers/RaiderIoScoreHandler";
import {RaiderIoRankHandler} from "./handlers/RaiderIoRankHandler";
import {RaiderIoBestDungeonsHandler} from "./handlers/RaiderIoBestDungeonsHandler";
import {RaiderIoDataHandler} from "./handlers/RaiderIoDataHandler";
import {HandlerService} from "./services/HandlerService";
import {HandlerPair} from "./models/HandlerPair";
import {DynamoDbService} from "./services/DynamoDbService";
import {MythicPlusService} from "./models/MythicPlusService";
import {NamedRequestHandler} from "./models/NamedRequestHandler";
import {CharacterNameHandler} from "./handlers/basic/CharacterNameHandler";
import {LookupCharacterHandler} from "./handlers/basic/LookupCharacterHandler";
import {DatabaseService} from "./models/DatabaseService";
import {RealmNameHandler} from "./handlers/basic/RealmNameHandler";
import {RegionNameHandler} from "./handlers/basic/RegionNameHandler";
import {SaveLookedUpCharacterHandler} from "./handlers/basic/SaveLookedUpCharacterHandler";

/**
 * The mythicPlusService we'll we using in the application.
 */
const mythicPlusService: MythicPlusService = new RaiderIoService();

/**
 * The default handler if nothing else can handle it.
 */
const defaultHandler = new LaunchRequestHandler();

/**
 * All handler pairs registered for the application.
 */
const handlerPairs: HandlerPair[] = [
    {
        requestHandler: new RaiderIoScoreHandler(mythicPlusService),
        defaultAlias: "score",
        alias: ["scores", "raider dot io score"]
    },
    {
        requestHandler: new RaiderIoRankHandler(mythicPlusService),
        defaultAlias: "rank",
        alias: ["ranking", "raider dot io rank", "ranks"]
    },
    {
        requestHandler: new RaiderIoBestDungeonsHandler(mythicPlusService),
        defaultAlias: "best runs",
        alias: ["dungeon", "runs", "best runs", "best run", "best dungeon", "best dungeons"]
    }
];

/**
 * The handlerService that deals with all services.
 */
const handlerService: HandlerService = new HandlerService(defaultHandler).registerHandlerPairs(handlerPairs);

/**
 * The databaseService to use for the application.
 */
const databaseService: DatabaseService = new DynamoDbService();

/**
 * All handlers that we have for the application.
 */
const handlers: NamedRequestHandler[] = [
    new CharacterNameHandler(handlerService),
    new LookupCharacterHandler(handlerService, databaseService),
    new RealmNameHandler(handlerService),
    new RegionNameHandler(handlerService),
    new SaveLookedUpCharacterHandler(handlerService, databaseService),
    new RaiderIoDataHandler(handlerService, databaseService)
];

//register all handlers.
handlerService.registerHandlers(handlers);

/**
 * Creates the handlers.
 */
const handler = SkillBuilders.custom()
    .withSkillId(process.env.skill_id)
    .addRequestHandlers(defaultHandler, ...handlers)
    .addRequestHandlers(...handlerPairs.map(value => value.requestHandler))
    .lambda();

export default handler;