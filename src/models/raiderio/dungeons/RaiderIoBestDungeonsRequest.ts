import {BasicRaiderIoRequest} from "../BasicRaiderIoRequest";
import {Dungeon} from "./Dungeons";

export interface RaiderIoBestDungeonsRequest extends BasicRaiderIoRequest {
    dungeons: Dungeon[];
}