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

const raiderIoService: RaiderIoService = new RaiderIoService();

const defaultHandler = new LaunchRequestHandler();

const handlerPairs: HandlerPair[] = [
    {
        requestHandler: new RaiderIoScoreHandler(raiderIoService),
        defaultAlias: "score",
        alias: ["scores", "raider dot io score"]
    },
    {
        requestHandler: new RaiderIoRankHandler(raiderIoService),
        defaultAlias: "rank",
        alias: ["ranking", "raider dot io rank", "ranks"]
    },
    {
        requestHandler: new RaiderIoBestDungeonsHandler(raiderIoService),
        defaultAlias: "best runs",
        alias: ["dungeon", "runs", "best runs", "best run", "best dungeon", "best dungeons"]
    }
];

const handlerService: HandlerService = new HandlerService(defaultHandler).registerHandlers(handlerPairs);

const handler = SkillBuilders.custom()
    .withSkillId("amzn1.ask.skill.78f3cc44-d3a0-459c-8baa-bca1afeb596d")
    .addRequestHandlers(defaultHandler, new RaiderIoDataHandler(handlerService, new DynamoDbService()))
    .addRequestHandlers(...handlerPairs.map(value => value.requestHandler))
    .lambda();

export default handler;