import {RaiderIoScoreRequest} from "./raiderio/score/RaiderIoScoreRequest";
import {RaiderIoScoreResponse} from "./raiderio/score/RaiderIoScoreResponse";
import {RaiderIoRankRequest} from "./raiderio/rank/RaiderIoRankRequest";
import {RaiderIoRankResponse} from "./raiderio/rank/RaiderIoRankResponse";
import {RaiderIoBestDungeonsRequest} from "./raiderio/dungeons/RaiderIoBestDungeonsRequest";
import {RaiderIoBestDungeonsResponse} from "./raiderio/dungeons/RaiderIoBestDungeonsResponse";

export interface MythicPlusService {
    getScore(request: RaiderIoScoreRequest): Promise<RaiderIoScoreResponse>;

    getRank(request: RaiderIoRankRequest): Promise<RaiderIoRankResponse>;

    getBestDungeons(request: RaiderIoBestDungeonsRequest): Promise<RaiderIoBestDungeonsResponse>;
}