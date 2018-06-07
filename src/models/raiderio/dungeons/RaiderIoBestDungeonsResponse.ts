import {RaiderIoBestDungeonsRequest} from "./RaiderIoBestDungeonsRequest";
import {Dungeon} from "./Dungeons";

export interface RaiderIoBestDungeonsResponse {
    request: RaiderIoBestDungeonsRequest;
    dungeonData: DungeonData[]
}

export interface DungeonData {
    dungeon: Dungeon;
    level: number;
    upgrades: number;
}